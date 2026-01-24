'use client'

import React from 'react'
import { motion, useScroll, useTransform, useInView } from 'motion/react'
import { useCart } from '@/store/use-cart'
import { Product, MOCK_PRODUCTS } from '@/data/products'
import { ArrowRight, Star, ShoppingCart, Eye } from 'lucide-react'
import { tv } from 'tailwind-variants'
import confetti from 'canvas-confetti'
import Image from 'next/image'
import Link from 'next/link'

const landingStyles = tv({
    slots: {
        hero: 'relative min-h-screen flex items-center justify-center overflow-hidden bg-black',
        heroContent: 'relative z-10 text-center px-4 max-w-4xl',
        heroTitle: 'text-6xl md:text-8xl font-black tracking-tighter text-white uppercase italic leading-[0.9]',
        heroSubtitle: 'mt-8 text-xl text-zinc-400 font-medium max-w-xl mx-auto',
        productGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 max-w-7xl mx-auto py-32',
        card: 'group relative bg-zinc-950 border border-white/5 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all duration-500',
        cardImageWrapper: 'aspect-square overflow-hidden bg-zinc-900 relative block w-full',
        cardImage: 'object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100',
        cardContent: 'p-6 space-y-4',
        cardTitle: 'text-xl font-bold text-white',
        cardPrice: 'text-emerald-400 font-mono font-bold',
        cardActions: 'flex gap-2 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300',
        buttonPrimary: 'flex-1 bg-white text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-400 transition-colors',
        buttonIcon: 'p-3 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors',
    }
})

const ProductCard = ({ product, onAdd }: { product: Product, onAdd: (p: Product, e: React.MouseEvent) => void }) => {
    const { card, cardImageWrapper, cardImage, cardContent, cardTitle, cardPrice, cardActions, buttonPrimary, buttonIcon } = landingStyles()
    const ref = React.useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-10% 0px' })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={card()}
        >
            <Link href={`/product/${product.id}`} className={cardImageWrapper()}>
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className={cardImage()}
                />
            </Link>
            <div className={cardContent()}>
                <div className="flex justify-between items-start">
                    <Link href={`/product/${product.id}`} className="hover:text-emerald-400 transition-colors">
                        <h3 className={cardTitle()}>{product.name}</h3>
                    </Link>
                    <div className="flex items-center gap-1 text-xs text-zinc-500">
                        <Star size={12} fill="currentColor" className="text-emerald-500" />
                        {product.rating}
                    </div>
                </div>
                <p className={cardPrice()}>${product.price}</p>
                <div className={cardActions()}>
                    <button
                        onClick={(e) => onAdd(product, e)}
                        className={buttonPrimary()}
                        aria-label={`Add ${product.name} to bag`}
                    >
                        <ShoppingCart size={18} />
                        Add
                    </button>
                    <Link
                        href={`/product/${product.id}`}
                        className={buttonIcon()}
                        aria-label={`View ${product.name} details`}
                    >
                        <Eye size={18} />
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}

export const Home = () => {
    const { hero, heroContent, heroTitle, heroSubtitle, productGrid } = landingStyles()
    const addItem = useCart((state) => state.addItem)
    const setFlyingItem = useCart((state) => state.setFlyingItem)
    const setIsOpen = useCart((state) => state.setIsOpen)

    const { scrollYProgress } = useScroll()
    const y = useTransform(scrollYProgress, [0, 1], [0, -200])
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

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
        <div className="bg-black">
            {/* Hero Section */}
            <section className={hero()}>
                <motion.div style={{ y, opacity }} className={heroContent()}>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className={heroTitle()}
                    >
                        Experience the <br />
                        <span className="text-emerald-500">Future</span> of Wear
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className={heroSubtitle()}
                    >
                        The world's first collection of neuro-interactive hardware.
                        Meticulously engineered for the absolute elite.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="mt-12 flex justify-center gap-6"
                    >
                        <Link href="/shop" className="bg-white text-black px-8 py-4 rounded-full font-black uppercase tracking-widest hover:bg-emerald-400 transition-colors">
                            Explore Now
                        </Link>
                        <button className="text-white border border-white/20 px-8 py-4 rounded-full font-bold hover:bg-white/5 transition-colors">
                            Our Vision
                        </button>
                    </motion.div>
                </motion.div>

                {/* Background Decorative Gradient */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-square bg-emerald-500/20 blur-[160px] rounded-full pointer-events-none" />
            </section>

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
                    {MOCK_PRODUCTS.map((product) => (
                        <ProductCard key={product.id} product={product} onAdd={handleAddToCart} />
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
        </div>
    )
}
