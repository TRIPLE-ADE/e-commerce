import { Suspense } from 'react'
import { Metadata } from 'next'
import { Collections } from './collections'
import { CollectionSkeleton } from '@/components/collection-skeleton'
import { cachedFetch } from '@/sanity/lib/client'
import { COLLECTIONS_QUERY } from '@/sanity/lib/queries'
import type { Collection } from '@/types/product'

export const metadata: Metadata = {
    title: 'Collections | Triplex',
    description: 'Explore our themed hardware collections curated for specific neural profiles.',
    openGraph: {
        title: 'Collections | Triplex',
        description: 'Explore our themed hardware collections curated for specific neural profiles.',
        type: 'website',
    },
}

export const revalidate = 60

async function CollectionsData() {
    const collections = await cachedFetch<Collection[]>(COLLECTIONS_QUERY)
    return <Collections collections={collections} />
}

export default function CollectionsPage() {
    return (
        <Suspense fallback={<CollectionSkeleton />}>
            <CollectionsData />
        </Suspense>
    )
}
