import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartStore } from '@/types/cart'


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
                const now = Date.now()
                if (existingItem) {
                    set({
                        items: items.map((i) =>
                            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity, updatedAt: now } : i
                        ),
                    })
                } else {
                    set({ items: [...items, { ...item, updatedAt: now }] })
                }
            },
            removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
            updateQuantity: (id, quantity) => {
                const now = Date.now()
                set({
                    items: get().items.map((i) => (i.id === id ? { ...i, quantity, updatedAt: now } : i)),
                })
            },
            clearCart: () => {
                set({ items: [] })
            },
            setItems: (items) => set({ items }),
        }),
        {
            name: 'cart-storage',
        }
    )
)
