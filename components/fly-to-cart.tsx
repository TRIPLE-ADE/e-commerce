'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useCart } from '@/store/use-cart'
import Image from 'next/image'

export const FlyToCart = () => {
    const flyingItem = useCart((state) => state.flyingItem)
    const setFlyingItem = useCart((state) => state.setFlyingItem)
    const [targetPos, setTargetPos] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const updateTarget = () => {
            const cartBtn = document.getElementById('cart-button')
            if (cartBtn) {
                const rect = cartBtn.getBoundingClientRect()
                setTargetPos({
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2
                })
            }
        }

        updateTarget()
        window.addEventListener('resize', updateTarget, { passive: true })
        return () => window.removeEventListener('resize', updateTarget)
    }, [])

    return (
        <AnimatePresence>
            {flyingItem && (
                <motion.div
                    key={flyingItem.id + Date.now()}
                    initial={{
                        position: 'fixed',
                        top: flyingItem.y,
                        left: flyingItem.x,
                        width: 80,
                        height: 80,
                        opacity: 1,
                        zIndex: 9999,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '2px solid white',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                    } as any}
                    animate={{
                        top: targetPos.y - 12,
                        left: targetPos.x - 12,
                        width: 24,
                        height: 24,
                        opacity: 0,
                        scale: 0.5
                    }}
                    transition={{
                        duration: 0.8,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                    onAnimationComplete={() => setFlyingItem(null)}
                >
                    <Image
                        src={flyingItem.image}
                        fill
                        className="object-cover"
                        alt="flying product"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    )
}
