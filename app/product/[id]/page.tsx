import { Metadata } from 'next'
import { ProductPage } from './product'
import { cachedFetch } from '@/sanity/lib/client'
import { PRODUCT_QUERY, PRODUCTS_LIST_QUERY } from '@/sanity/lib/queries'
import { notFound } from 'next/navigation'
import type { Product } from '@/types/product'

export const revalidate = 60

// Generate Static Params (SSG) for high performance
export async function generateStaticParams() {
    const products = await cachedFetch<Product[]>(PRODUCTS_LIST_QUERY)
    return products.map((product) => ({
        id: product.id,
    }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params
    const product = await cachedFetch<Product>(PRODUCT_QUERY, { id })

    if (!product) return { title: 'Product Not Found | Triplex' }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const productUrl = `${baseUrl}/product/${id}`

    return {
        title: `${product.name} | Triplex`,
        description: product.description || `Discover ${product.name} - ${product.category} from Triplex's exclusive collection.`,
        keywords: [product.name, product.category, 'wearables', 'tech'],
        openGraph: {
            type: 'website',
            url: productUrl,
            title: product.name,
            description: product.description || `Discover ${product.name} from Triplex.`,
            images: [
                {
                    url: product.image,
                    width: 1200,
                    height: 1200,
                    alt: product.name,
                },
                ...(product.images || []).slice(0, 3).map((img) => ({
                    url: img,
                    width: 1200,
                    height: 1200,
                    alt: product.name,
                })),
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description: product.description || `Discover ${product.name} from Triplex.`,
            images: [product.image],
        },
        alternates: {
            canonical: productUrl,
        },
    }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const product = await cachedFetch<Product>(PRODUCT_QUERY, { id })

    if (!product) notFound()

    return <ProductPage product={product} />
}

