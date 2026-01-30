import { createClient, type QueryParams } from 'next-sanity'
import { cache } from 'react'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

// Prevents deduplicate fetches when generateMetadata and Page both call the same query
export const cachedFetch = cache(
  <T>(query: string, params: QueryParams = {}) => {
    return client.fetch<T>(query, params)
  }
)

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

