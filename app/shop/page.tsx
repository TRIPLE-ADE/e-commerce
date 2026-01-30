import { Metadata } from 'next'
import { cachedFetch } from '@/sanity/lib/client'
import { ALL_PRODUCTS_LIST_QUERY } from '@/sanity/lib/queries'
import { Shop } from './shop'
import type { Product } from '@/types/product'

export const metadata: Metadata = {
    title: 'The Vault | Triplex',
    description: 'Browse our complete inventory of neural enhancements and bio-mechanical gear.',
    openGraph: {
        title: 'The Vault | Triplex',
        description: 'Browse our complete inventory of neural enhancements and bio-mechanical gear.',
        type: 'website',
    },
}

export const revalidate = 60

async function ShopProductsData() {
    const products = await cachedFetch<Product[]>(ALL_PRODUCTS_LIST_QUERY)
    return <Shop products={products} />
}

export default function ShopPage() {
    return (
        <ShopProductsData />
    )
}
