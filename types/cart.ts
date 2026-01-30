export interface CartItem {
    id: string
    name: string
    price: number
    image: string
    quantity: number
    variant?: string
    updatedAt?: number
}

export interface FlyingItem {
    id: string
    x: number
    y: number
    image: string
}

export interface CartStore {
    items: CartItem[]
    addItem: (item: CartItem) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    setItems: (items: CartItem[]) => void

    // UI state
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    isSearchOpen: boolean
    setIsSearchOpen: (open: boolean) => void

    // Animation state
    flyingItem: FlyingItem | null
    setFlyingItem: (item: FlyingItem | null) => void
}
