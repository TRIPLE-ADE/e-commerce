import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
    id: string
    name: string
    price: number
    image: string
    quantity: number
    variant?: string
}

interface CartStore {
    items: CartItem[]
    addItem: (item: CartItem) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    totalItems: () => number
    totalPrice: () => number

    // UI state
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    isSearchOpen: boolean
    setIsSearchOpen: (open: boolean) => void

    // Animation state
    flyingItem: { id: string, x: number, y: number, image: string } | null
    setFlyingItem: (item: { id: string, x: number, y: number, image: string } | null) => void
}

export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            setIsOpen: (open) => set({ isOpen: open }),
            isSearchOpen: false,
            setIsSearchOpen: (open) => set({ isSearchOpen: open }),
            flyingItem: null,
            setFlyingItem: (item) => set({ flyingItem: item }),
            addItem: (item) => {
                const items = get().items
                const existingItem = items.find((i) => i.id === item.id)
                if (existingItem) {
                    set({
                        items: items.map((i) =>
                            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
                        ),
                    })
                } else {
                    set({ items: [...items, item] })
                }
            },
            removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
            updateQuantity: (id, quantity) =>
                set({
                    items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
                }),
            clearCart: () => set({ items: [] }),
            totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
            totalPrice: () => get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
        }),
        {
            name: 'cart-storage',
        }
    )
)
