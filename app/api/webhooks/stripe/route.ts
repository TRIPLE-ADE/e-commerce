import { stripe } from '@/lib/stripe'
import { writeClient } from '@/sanity/lib/client'
import { redis } from '@/lib/redis'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import type { OrderItemMetadata } from '@/types'
import { CART_PREFIX, ERROR_MESSAGES } from '@/lib/constants'

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('Stripe-Signature') as string;

    let event: Stripe.Event;

    try {
        if (!process.env.STRIPE_WEBHOOK_SECRET) {
            throw new Error('STRIPE_WEBHOOK_SECRET is missing');
        }
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return NextResponse.json(
            { error: `Webhook signature verification failed: ${message}`, code: 'INVALID_SIGNATURE' },
            { status: 400 }
        );
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        const { clerkUserId, orderItems } = session.metadata || {};
        const items: OrderItemMetadata[] = JSON.parse(orderItems || '[]');

        try {
            // Idempotency check: Check if order already exists with this stripeId
            const existingOrder = await writeClient.fetch<{ _id: string } | null>(
                `*[_type == "order" && stripeId == $stripeId][0]`,
                { stripeId: session.id }
            );

            // If order already exists, skip processing (idempotent)
            if (existingOrder) {
                return NextResponse.json({ received: true, message: 'Order already processed' });
            }

            // 1. Create Order in Sanity
            await writeClient.create({
                _type: 'order',
                orderNumber: session.id.slice(-8).toUpperCase(),
                stripeId: session.id,
                customerName: session.customer_details?.name || 'Unknown',
                email: session.customer_details?.email || 'Unknown',
                clerkUserId: clerkUserId,
                products: items.map((item: OrderItemMetadata) => ({
                    _key: item.id,
                    product: { _type: 'reference', _ref: item.id },
                    quantity: item.q,
                    variant: item.v
                })),
                totalPrice: session.amount_total ? session.amount_total / 100 : 0,
                status: 'paid',
                orderDate: new Date().toISOString(),
            });

            // 2. Decrement Stock in Sanity using transactional patches for atomicity
            const transaction = writeClient.transaction();

            items.forEach((item: OrderItemMetadata) => {
                transaction.patch(item.id, (p) => p.dec({ stock: item.q }));
            });

            await transaction.commit();

            // 3. Clear Redis Cart
            if (clerkUserId) {
                await redis.del(`${CART_PREFIX}${clerkUserId}`);
            }
        } catch (error) {
            return NextResponse.json(
                { error: `${ERROR_MESSAGES.SERVER_ERROR}: ${error}`, code: 'FULFILLMENT_FAILED' },
                { status: 500 }
            );
        }
    }

    return NextResponse.json({ received: true });
}