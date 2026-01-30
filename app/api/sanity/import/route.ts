import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '@/sanity/env'
import { MOCK_PRODUCTS, MOCK_COLLECTIONS } from '@/data/products'
import { NextResponse } from 'next/server'

const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
})


async function uploadImageToSanity(imageUrl: string) {
    try {
        const response = await fetch(imageUrl)
        if (!response.ok) throw new Error(`Failed to fetch image: ${imageUrl}`)
        const arrayBuffer = await response.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const asset = await client.assets.upload('image', buffer, {
            filename: imageUrl.split('/').pop()
        })
        return asset._id
    } catch (error) {
        console.error('Image upload failed:', error)
        return null
    }
}

/**
 * GET requests are not allowed for security reasons
 * This endpoint only accepts POST requests with authentication
 */
export async function GET() {
    return NextResponse.json(
        { 
            success: false, 
            error: 'Method not allowed. Use POST with authentication.',
            message: 'This endpoint requires POST method with SANITY_IMPORT_SECRET_KEY in Authorization header'
        },
        { status: 405 }
    )
}

/**
 * POST /api/sanity/import
 * 
 * Secured endpoint for importing/migrating data to Sanity.
 * Requires SANITY_IMPORT_SECRET_KEY in Authorization header or request body.
 * 
 * Environment Variable Required:
 *   SANITY_IMPORT_SECRET_KEY - Secret key for authentication
 * 
 * Usage:
 *   curl -X POST https://your-domain.com/api/sanity/import \
 *     -H "Authorization: Bearer YOUR_SECRET_KEY" \
 *     -H "Content-Type: application/json"
 * 
 * Alternative (with body):
 *   curl -X POST https://your-domain.com/api/sanity/import \
 *     -H "Content-Type: application/json" \
 *     -d '{"secretKey": "YOUR_SECRET_KEY"}'
 */
export async function POST(request: Request) {
    // Verify authentication
    const secretKey = process.env.SANITY_IMPORT_SECRET_KEY

    if (!secretKey) {
        return NextResponse.json(
            { success: false, error: 'Server configuration error' },
            { status: 500 }
        )
    }

    // Check Authorization header first (preferred method)
    const authHeader = request.headers.get('authorization')
    const isAuthorized = authHeader === `Bearer ${secretKey}`

    // If not authorized via header, check request body
    if (!isAuthorized) {
        try {
            const body = await request.json().catch(() => ({}))
            if (body.secretKey !== secretKey) {
                return NextResponse.json(
                    { success: false, error: 'Unauthorized: Invalid or missing secret key' },
                    { status: 401 }
                )
            }
        } catch {
            return NextResponse.json(
                { success: false, error: 'Unauthorized: Missing or invalid secret key' },
                { status: 401 }
            )
        }
    }
    try {
        // 1. Migrate Categories
        const categoryIds = new Map<string, string>()
        const categories = Array.from(new Set(MOCK_PRODUCTS.map(p => p.category)))

        for (const catTitle of categories) {
            const catSlug = catTitle.toLowerCase().replace(/\s+/g, '-')
            const existing = await client.fetch(`*[_type == "category" && slug.current == $slug][0]`, { slug: catSlug })

            if (existing) {
                categoryIds.set(catTitle, existing._id)
            } else {
                const created = await client.create({
                    _type: 'category',
                    title: catTitle,
                    slug: { _type: 'slug', current: catSlug },
                })
                categoryIds.set(catTitle, created._id)
            }
        }

        // 2. Migrate Products
        for (const product of MOCK_PRODUCTS) {
            // Check if product exists
            const existing = await client.fetch(`*[_type == "product" && slug.current == $slug][0]`, { slug: product.slug })
            if (existing) continue

            let imageId = null
            if (product.image) {
                imageId = await uploadImageToSanity(product.image)
            }

            const galleryRefs = []
            if (product.images && product.images.length > 0) {
                for (const imgUrl of product.images) {
                    const galleryAssetId = await uploadImageToSanity(imgUrl)
                    if (galleryAssetId) {
                        galleryRefs.push({
                            _key: galleryAssetId, // Random key or asset ID
                            _type: 'image',
                            asset: {
                                _type: 'reference',
                                _ref: galleryAssetId,
                            }
                        })
                    }
                }
            }

            const catId = categoryIds.get(product.category)

            await client.create({
                _type: 'product',
                name: product.name,
                slug: { _type: 'slug', current: product.slug },
                price: product.price,
                description: product.description,
                image: imageId ? {
                    _type: 'image',
                    asset: {
                        _type: 'reference',
                        _ref: imageId,
                    }
                } : undefined,
                category: catId ? {
                    _type: 'reference',
                    _ref: catId
                } : undefined,
                images: galleryRefs,
                stock: product.stock,
            })
        }

        // 3. Migrate Collections
        for (const collection of MOCK_COLLECTIONS) {
            const existing = await client.fetch(`*[_type == "collection" && slug.current == $slug][0]`, { slug: collection.slug })
            if (existing) continue

            let imageId = null
            if (collection.image) {
                imageId = await uploadImageToSanity(collection.image)
            }

            await client.create({
                _type: 'collection',
                title: collection.title,
                slug: { _type: 'slug', current: collection.slug },
                description: collection.description,
                image: imageId ? {
                    _type: 'image',
                    asset: {
                        _type: 'reference',
                        _ref: imageId,
                    }
                } : undefined,
                layoutType: collection.layoutType,
                releaseDate: collection.releaseDate
            })
        }

        return NextResponse.json({ success: true, message: 'Migration completed successfully' })
    } catch (error) {
        console.error('Migration failed:', error)
        return NextResponse.json({ success: false, error: 'Migration failed' }, { status: 500 })
    }
}
