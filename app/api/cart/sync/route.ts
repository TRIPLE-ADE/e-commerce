import { auth } from '@clerk/nextjs/server'
import { redis } from '@/lib/redis'
import { NextResponse } from 'next/server'
import { CART_PREFIX, CART_TTL_SECONDS, ERROR_MESSAGES } from '@/lib/constants'

export async function GET() {
    const { userId } = await auth()

    if (!userId) {
        return NextResponse.json({ items: [] })
    }

    const isRedisAvailable = Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
    if (!isRedisAvailable) {
        console.warn('Redis not available, returning empty cart');
        return NextResponse.json({ items: [] })
    }

    try {
        const items = await redis.get(`${CART_PREFIX}${userId}`)
        return NextResponse.json({ items: items || [] })
    } catch (error) {
        console.error('Redis Fetch Error:', error);
        return NextResponse.json(
            { items: [], error: 'Failed to fetch cart from cloud', code: 'REDIS_FETCH_ERROR' },
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

    const isRedisAvailable = Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
    if (!isRedisAvailable) {
        console.warn('Redis not available, cart sync skipped');
        return NextResponse.json({ success: false, message: 'Cart sync unavailable' })
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
            console.error('Failed to parse cart sync request body:', error);
            return NextResponse.json(
                { error: ERROR_MESSAGES.VALIDATION_ERROR, code: 'INVALID_REQUEST' },
                { status: 400 }
            );
        }

        // Save cart with TTL
        await redis.set(`${CART_PREFIX}${userId}`, items, { ex: CART_TTL_SECONDS })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Redis Sync Error:', error);
        return NextResponse.json(
            { error: 'Failed to sync cart to cloud', code: 'REDIS_SYNC_ERROR' },
            { status: 500 }
        )
    }
}
