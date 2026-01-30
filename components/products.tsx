import { Suspense } from 'react'
import { cachedFetch } from '@/sanity/lib/client'
import { PRODUCTS_LIST_QUERY } from '@/sanity/lib/queries'
import type { Product } from '@/types/product'
import { ProductGrid } from './product-grid'
import { ProductGridSkeleton } from '@/components/product-skeleton'

async function ProductsData() {
  const products = await cachedFetch<Product[]>(PRODUCTS_LIST_QUERY)
  return <ProductGrid products={products} />
}

export function Products() {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <ProductsData />
    </Suspense>
  )
}
