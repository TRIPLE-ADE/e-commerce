export interface Product {
    _id?: string
    id: string
    name: string
    slug: string
    price: number
    image: string
    images: string[]
    quantity: number // Cart quantity
    stock: number // Inventory level
    category: string
    variant?: string
    description?: string
    rating?: number
    reviews?: number
}

/**
 * Collection interface for application use
 */
export interface Collection {
    id: string
    title: string
    slug: string
    description: string
    image: string
    products: string[] // Array of Product IDs
    releaseDate?: string // ISO date string
    layoutType: 'grid' | 'showcase' | 'carousel'
}
