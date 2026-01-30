'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useCart } from '@/store/use-cart'
import { mergeCarts } from '@/lib/cart-utils'
import { toast } from 'sonner'

export const CartSync = () => {
    const { isLoaded, isSignedIn, user } = useUser()
    const { items, setItems, clearCart } = useCart()
    const [hasPulled, setHasPulled] = useState(false)

    // 1. Initial Pull & Transitions
    useEffect(() => {
        if (!isLoaded) return

        const lastUserId = localStorage.getItem('last_user_id')
        const currentUserId = user?.id || null

        const fetchCloudCart = async () => {
            try {
                const res = await fetch('/api/cart/sync')
                const data = await res.json()

                if (data.items) {
                    const isTransition = (!lastUserId || lastUserId === 'null') && currentUserId

                    if (isTransition) {
                        const currentItems = useCart.getState().items
                        const merged = mergeCarts([...currentItems], data.items)
                        setItems(merged)
                    } else {
                        setItems(data.items)
                    }
                }
            } catch {
                toast.error('Cart Sync Failed', {
                    description: 'Unable to load your saved cart. Please try refreshing the page.',
                })
            } finally {
                setHasPulled(true)
            }
        }

        if (isSignedIn && !hasPulled) {
            fetchCloudCart()
        }
        if (lastUserId && lastUserId !== 'null' && !isSignedIn) {
            setHasPulled(false)
            clearCart()
        }

        localStorage.setItem('last_user_id', currentUserId || 'null')

    }, [isLoaded, isSignedIn, user, hasPulled, setItems, clearCart])

    // 2. Periodic Push: Whenever items change and user is signed in, sync to cloud
    useEffect(() => {
        if (isLoaded && isSignedIn && hasPulled) {
            const syncId = setTimeout(async () => {
                try {
                    await fetch('/api/cart/sync', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ items })
                    })
                } catch {
                    toast.error('Cart Sync Failed', {
                        description: 'Unable to save your cart. Changes may not persist across devices.',
                    })
                }
            }, 2000)

            return () => clearTimeout(syncId)
        }
    }, [items, isLoaded, isSignedIn, hasPulled])

    return null
}
