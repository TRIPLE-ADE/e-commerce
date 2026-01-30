import { MetadataRoute } from 'next'
import { cachedFetch } from '@/sanity/lib/client'
import { PRODUCTS_LIST_QUERY, COLLECTIONS_QUERY } from '@/sanity/lib/queries'
import type { Product } from '@/types/product'
import type { Collection } from '@/types/product'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/collections`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // Product routes
  let products: Product[] = []
  try {
    products = await cachedFetch<Product[]>(PRODUCTS_LIST_QUERY)
  } catch (error) {
    console.error('Failed to fetch products for sitemap:', error)
  }

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // Collection routes
  let collections: Collection[] = []
  try {
    collections = await cachedFetch<Collection[]>(COLLECTIONS_QUERY)
  } catch (error) {
    console.error('Failed to fetch collections for sitemap:', error)
  }

  const collectionRoutes: MetadataRoute.Sitemap = collections.map((collection) => ({
    url: `${baseUrl}/collections/${collection.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...productRoutes, ...collectionRoutes]
}
