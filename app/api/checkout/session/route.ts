import { stripe } from '@/lib/stripe';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { ERROR_MESSAGES } from '@/lib/constants';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
        return NextResponse.json(
            { error: ERROR_MESSAGES.VALIDATION_ERROR, code: 'MISSING_SESSION_ID' },
            { status: 400 }
        );
    }

    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: ERROR_MESSAGES.UNAUTHORIZED, code: 'UNAUTHORIZED' },
                { status: 401 }
            );
        }

        // Fetch session with line items expanded
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['line_items', 'line_items.data.price.product'],
        });

        // Security Check 1: Ensure this session belongs to the logged-in user
        if (session.metadata?.clerkUserId !== userId) {
            return NextResponse.json(
                { error: 'Forbidden', code: 'FORBIDDEN' },
                { status: 403 }
            );
        }

        // Security Check 2: Ensure session is fully processed
        if (session.status !== 'complete') {
            return NextResponse.json({
                error: 'Session not complete',
                code: 'SESSION_INCOMPLETE',
                status: session.status
            }, { status: 400 });
        }

        return NextResponse.json({
            customerName: session.customer_details?.name,
            customerEmail: session.customer_details?.email,
            amountTotal: session.amount_total ? session.amount_total / 100 : 0,
            lineItems: session.line_items?.data.map((item: Stripe.LineItem) => ({
                id: item.id,
                name: item.description,
                quantity: item.quantity,
                amount: item.amount_total ? item.amount_total / 100 : 0,
            }))
        });
    } catch (error: unknown) {
        return NextResponse.json(
            { error: `${ERROR_MESSAGES.SERVER_ERROR}: ${error}`, code: 'SESSION_RETRIEVAL_FAILED' },
            { status: 500 }
        );
    }
}
