import { Metadata } from 'next'
import { ProductPage } from './product'
import { MOCK_PRODUCTS } from '@/data/products'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const product = MOCK_PRODUCTS.find(p => p.id === params.id)

    return {
        title: product ? `${product.name} | Triplex` : 'Product Not Found | Triplex',
        description: product?.description || 'View details for this neural hardware masterpiece.',
    }
}

export default function Product() {
    return <ProductPage />
}
