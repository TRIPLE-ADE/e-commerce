import { auth } from '@clerk/nextjs/server';
import { stripe } from '@/lib/stripe';
import { client } from '@/sanity/lib/client';
import { PRODUCTS_BY_IDS_QUERY } from '@/sanity/lib/queries';
import { NextResponse } from 'next/server';
import type { Product } from '@/types/product';
import { ERROR_MESSAGES } from '@/lib/constants';

export async function POST(req: Request) {
    try {
        const authSession = await auth();
        const { userId, sessionClaims } = authSession;

        if (!userId) {
            return NextResponse.json(
                { error: ERROR_MESSAGES.UNAUTHORIZED, code: 'UNAUTHORIZED' },
                { status: 401 }
            );
        }

        let items;
        try {
            const body = await req.json();
            items = body.items;
            
            if (!Array.isArray(items) || items.length === 0) {
                return NextResponse.json(
                    { error: ERROR_MESSAGES.CART_EMPTY, code: 'CART_EMPTY' },
                    { status: 400 }
                );
            }

            // Validate items structure
            for (const item of items) {
                if (!item.id || typeof item.quantity !== 'number' || item.quantity <= 0) {
                    return NextResponse.json(
                        { error: ERROR_MESSAGES.VALIDATION_ERROR, code: 'INVALID_ITEM' },
                        { status: 400 }
                    );
                }
            }
        } catch (error) {
            console.error('Failed to parse checkout request body:', error);
            return NextResponse.json(
                { error: ERROR_MESSAGES.VALIDATION_ERROR, code: 'INVALID_REQUEST' },
                { status: 400 }
            );
        }

        // Re-verify prices and stock from Sanity
        const productIds = items.map((item: { id: string }) => item.id);
        const sanityProducts = await client.fetch<Product[]>(PRODUCTS_BY_IDS_QUERY, { ids: productIds });

        // Validate all products exist
        const missingProducts = items.filter(
            (cartItem: { id: string }) => !sanityProducts.find(p => p.id === cartItem.id)
        );
        
        if (missingProducts.length > 0) {
            console.error('Products not found during checkout:', {
                productIds: missingProducts.map((p: { id: string }) => p.id),
                userId
            });
            return NextResponse.json(
                {
                    error: ERROR_MESSAGES.PRODUCT_NOT_FOUND,
                    code: 'PRODUCT_NOT_FOUND',
                    productIds: missingProducts.map((p: { id: string }) => p.id)
                },
                { status: 404 }
            );
        }

        // Validate stock availability
        const outOfStockItems = items.filter((cartItem: { id: string; quantity: number }) => {
            const product = sanityProducts.find(p => p.id === cartItem.id);
            return !product || product.stock < cartItem.quantity || product.stock === 0;
        });

        if (outOfStockItems.length > 0) {
            const outOfStockProducts = outOfStockItems.map((item: { id: string; quantity: number }) => {
                const product = sanityProducts.find(p => p.id === item.id);
                return {
                    id: item.id,
                    name: product?.name || 'Unknown',
                    requested: item.quantity,
                    available: product?.stock || 0
                };
            });

            return NextResponse.json(
                {
                    error: 'One or more items are out of stock or insufficient stock available',
                    code: 'OUT_OF_STOCK',
                    items: outOfStockProducts
                },
                { status: 400 }
            );
        }

        const line_items = items.map((cartItem: { id: string; quantity: number; variant?: string }) => {
            const product = sanityProducts.find(p => p.id === cartItem.id)!;

            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: product.name,
                        images: [product.image],
                        metadata: {
                            id: product.id,
                        }
                    },
                    unit_amount: Math.round(product.price * 100), // Stripe expects cents
                },
                quantity: cartItem.quantity,
            };
        });

        // Create Stripe Session
        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/shop`,
            metadata: {
                clerkUserId: userId,
                orderItems: JSON.stringify(items.map((i: { id: string; quantity: number; variant?: string }) => ({ id: i.id, q: i.quantity, v: i.variant }))),
            },
            customer_email: (sessionClaims?.email as string) || undefined,
            billing_address_collection: 'required',
            shipping_address_collection: {
                allowed_countries: ['US', 'CA', 'GB'],
            },
        });

        if (!checkoutSession.url) {
            console.error('Stripe session created but no URL returned:', { sessionId: checkoutSession.id });
            return NextResponse.json(
                { error: ERROR_MESSAGES.SERVER_ERROR, code: 'SESSION_CREATION_FAILED' },
                { status: 500 }
            );
        }

        return NextResponse.json({ url: checkoutSession.url });
    } catch (error: unknown) {
        console.error('Checkout Error:', error);
        return NextResponse.json(
            { error: ERROR_MESSAGES.SERVER_ERROR, code: 'CHECKOUT_ERROR' },
            { status: 500 }
        );
    }
}
