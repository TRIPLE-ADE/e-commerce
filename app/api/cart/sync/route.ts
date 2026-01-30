import { auth } from '@clerk/nextjs/server'
import { redis } from '@/lib/redis'
import { NextResponse } from 'next/server'
import { CART_PREFIX, CART_TTL_SECONDS, ERROR_MESSAGES } from '@/lib/constants'

export async function GET() {
    const { userId } = await auth()

    if (!userId) {
        return NextResponse.json({ items: [] })
    }

    try {
        const items = await redis.get(`${CART_PREFIX}${userId}`)
        return NextResponse.json({ items: items || [] })
    } catch (error) {
        return NextResponse.json(
            { items: [], error: `${ERROR_MESSAGES.SERVER_ERROR}: ${error}`, code: 'REDIS_FETCH_ERROR' },
            { status: 500 }
        )
    }
}

export async function POST(req: Request) {
    const { userId } = await auth()

    if (!userId) {
        return NextResponse.json(
            { error: ERROR_MESSAGES.UNAUTHORIZED, code: 'UNAUTHORIZED' },
            { status: 401 }
        )
    }

    try {
        let items;
        try {
            const body = await req.json();
            items = body.items;
            
            if (!Array.isArray(items)) {
                return NextResponse.json(
                    { error: ERROR_MESSAGES.VALIDATION_ERROR, code: 'INVALID_ITEMS' },
                    { status: 400 }
                );
            }
        } catch (error) {
            return NextResponse.json(
                { error: `${ERROR_MESSAGES.VALIDATION_ERROR}: ${error}`, code: 'INVALID_REQUEST' },
                { status: 400 }
            );
        }

        // Save cart with TTL
        await redis.set(`${CART_PREFIX}${userId}`, items, { ex: CART_TTL_SECONDS })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json(
            { error: `${ERROR_MESSAGES.SERVER_ERROR}: ${error}`, code: 'REDIS_SYNC_ERROR' },
            { status: 500 }
        )
    }
}
