'use client'

import React from 'react'
import { motion } from 'motion/react'
import { useCart } from '@/store/use-cart'
import type { Product } from '@/types/product'
import { tv } from 'tailwind-variants'
import confetti from 'canvas-confetti'
import { ProductCard } from '@/components/product-card'

const landingStyles = tv({
    slots: {
        productGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 max-w-7xl mx-auto py-32',
    }
})

export function ProductGrid({ products }: { products: Product[] }) {
    const { productGrid } = landingStyles()
    const addItem = useCart((state) => state.addItem)
    const setFlyingItem = useCart((state) => state.setFlyingItem)
    const setIsOpen = useCart((state) => state.setIsOpen)

    const handleAddToCart = (product: Product, e: React.MouseEvent) => {
        setFlyingItem({
            id: product.id,
            x: e.clientX,
            y: e.clientY,
            image: product.image
        })

        addItem({ ...product, quantity: 1 })

        setTimeout(() => {
            confetti({
                particleCount: 40,
                spread: 40,
                origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
                colors: ['#10b981', '#ffffff']
            })
        }, 100)

        setTimeout(() => setIsOpen(true), 1200)
    }

    return (
        <>
            {/* Product Grid Section */}
            <section className="bg-zinc-950 relative border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 pt-32 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        <h2 className="text-4xl font-bold text-white tracking-tight">The Neural Collection</h2>
                        <p className="text-zinc-500 max-w-lg mx-auto">Limited early-access drops from our experimental labs. Delivered to your doorstep in hours, not days.</p>
                    </motion.div>
                </div>

                <div className={productGrid()}>
                    {products.map((product) => (
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            onAdd={handleAddToCart}
                            animationVariant="scroll"
                            imageSizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                    ))}
                </div>
            </section>

            {/* Footer / Final CTA */}
            <footer className="bg-black py-40 border-t border-white/5 text-center overflow-hidden relative">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative z-10"
                >
                    <h2 className="text-9xl font-black text-white/5 absolute -top-20 left-1/2 -translate-x-1/2 select-none whitespace-nowrap">TRIPLEX</h2>
                    <h3 className="text-5xl font-bold text-white mb-8">Join the Vanguard</h3>
                    <p className="text-zinc-500 mb-12 max-w-md mx-auto">Get notified about upcoming drops and exclusive experimental releases.</p>
                    <form className="flex max-w-md mx-auto gap-2 px-4" onSubmit={(e) => e.preventDefault()}>
                        <input
                            type="email"
                            placeholder="vanguard@email.com"
                            required
                            aria-label="Email address for newsletter"
                            className="flex-1 bg-zinc-900 border border-white/5 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                        />
                        <button type="submit" className="bg-white text-black px-6 rounded-xl font-bold hover:bg-emerald-400 transition-colors">Join</button>
                    </form>
                </motion.div>
            </footer>
        </>
    )
}
