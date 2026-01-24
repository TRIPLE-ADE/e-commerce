export interface Product {
    id: string
    name: string
    price: number
    image: string
    images: string[]
    quantity: number
    category: string
    variant?: string
    description?: string
    rating?: number
    reviews?: number
}

export const MOCK_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Neural Link Headset',
        price: 299,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=800',
            'https://images.unsplash.com/photo-1599669454699-248893623440?q=80&w=800',
            'https://images.unsplash.com/photo-1524678606372-87139ee986e5?q=80&w=800'
        ],
        quantity: 1,
        category: 'Audio',
        variant: 'Obsidian Black',
        description: 'The peak of human engineering. Featuring the new X1-Neural processor, this device bridges the gap between biological thought and digital action.',
        rating: 4.9,
        reviews: 128
    },
    {
        id: '2',
        name: 'Void Pulse Watch',
        price: 189,
        image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=800',
            'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800'
        ],
        quantity: 1,
        category: 'Wearables',
        variant: 'Chrome',
        description: 'A masterpiece of precision. The Void Pulse Watch tracks temporal shifts with millisecond accuracy, encased in a liquid-metal chassis.',
        rating: 4.8,
        reviews: 95
    },
    {
        id: '3',
        name: 'Gravity Boots',
        price: 450,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800',
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800'
        ],
        quantity: 1,
        category: 'Footwear',
        variant: 'Cyber Red',
        description: 'Defy the laws of physics. Our Gravity Boots utilize localized magnetic field manipulation to provide unparalleled grip and lift.',
        rating: 4.9,
        reviews: 210
    },
    {
        id: '4',
        name: 'Holo Lens Pro',
        price: 1200,
        image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=800&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800',
            'https://images.unsplash.com/photo-1587304724806-05680c6517a6?q=80&w=800'
        ],
        quantity: 1,
        category: 'Wearables',
        variant: 'Transparent',
        description: 'Augment your reality. The Holo Lens Pro overlays high-fidelity digital constructs directly onto your neural cortex in real-time.',
        rating: 5.0,
        reviews: 42
    },
]
