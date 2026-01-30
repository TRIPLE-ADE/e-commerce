/**
 * Order status values as defined in the Sanity schema
 */
export type OrderStatus = 'pending' | 'paid' | 'shipped'

/**
 * Product reference within an order
 * Represents the product data as returned from Sanity queries
 */
export interface SanityProductReference {
    name: string
    image: string
}

/**
 * Product item within an order
 * Contains quantity, variant, and product reference
 */
export interface OrderProduct {
    quantity: number
    variant: string
    product: SanityProductReference
}

/**
 * Complete order document as returned from Sanity
 * Matches the structure of USER_ORDERS_QUERY
 */
export interface SanityOrder {
    _id: string
    orderNumber: string
    orderDate: string
    status: OrderStatus
    totalPrice: number
    products: OrderProduct[]
}

/**
 * Product document as returned from Sanity queries
 * Matches the structure of PRODUCTS_QUERY, ALL_PRODUCTS_QUERY, and PRODUCT_QUERY
 */
export interface SanityProduct {
    id: string
    name: string
    slug: string
    price: number
    description?: string
    image: string
    images: string[]
    category: string
    stock: number
    variant?: string
    rating?: number
    reviews?: number
}

/**
 * Collection document as returned from Sanity queries
 * Matches the structure of COLLECTIONS_QUERY
 */
export interface SanityCollection {
    id: string
    title: string
    slug: string
    description: string
    image: string
    releaseDate?: string
    layoutType: 'grid' | 'showcase' | 'carousel'
}

/**
 * Minimal product data for search results
 * Matches the structure of SEARCH_PRODUCTS_QUERY
 */
export interface SanityProductSearchResult {
    id: string
    name: string
    price: number
    image: string
}

/**
 * Minimal product data for bulk queries
 * Matches the structure of PRODUCTS_BY_IDS_QUERY
 */
export interface SanityProductMinimal {
    id: string
    name: string
    price: number
    image: string
    stock: number
}
