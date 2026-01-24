'use client'

import { motion } from 'motion/react'
import { tv } from 'tailwind-variants'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const collectionStyles = tv({
    slots: {
        container: 'max-w-7xl mx-auto px-4 py-32 space-y-24',
        header: 'text-center space-y-4 max-w-2xl mx-auto',
        title: 'text-7xl font-black text-white italic tracking-tighter uppercase',
        subtitle: 'text-zinc-500 text-xl',
        grid: 'grid grid-cols-1 md:grid-cols-2 gap-8',
        card: 'group relative h-[600px] rounded-3xl overflow-hidden border border-white/5',
        cardOverlay: 'absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500',
        cardContent: 'absolute bottom-0 left-0 p-12 space-y-4 w-full',
        cardTitle: 'text-4xl font-bold text-white tracking-tight',
        cardDesc: 'text-zinc-400 text-lg max-w-md',
        cardLink: 'flex items-center gap-2 text-white font-bold group-hover:text-emerald-400 transition-colors pt-4',
        image: 'object-cover transition-transform duration-1000 group-hover:scale-110'
    }
})

import { MOCK_PRODUCTS } from '../../data/products'

const getCollections = () => {
    const categories = Array.from(new Set(MOCK_PRODUCTS.map(p => p.category)))
    return categories.map(category => {
        const product = MOCK_PRODUCTS.find(p => p.category === category)
        return {
            id: category.toLowerCase(),
            title: category,
            description: `High-performance ${category.toLowerCase()} enhancements for the modern operative.`,
            image: product?.image || ''
        }
    })
}

const COLLECTIONS = getCollections()

export const Collections = () => {
    const { container, header, title, subtitle, grid, card, cardOverlay, cardContent, cardTitle, cardDesc, cardLink, image } = collectionStyles()

    return (
        <div className={container()}>
            <header className={header()}>
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={title()}
                >
                    The Archive
                </motion.h1>
                <p className={subtitle()}>Designated themed drops from our experimental research divisions.</p>
            </header>

            <div className={grid()}>
                {COLLECTIONS.map((c, i) => (
                    <motion.div
                        key={c.id}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.8 }}
                        className={card()}
                    >
                        <Image src={c.image} alt={c.title} fill className={image()} />
                        <div className={cardOverlay()} />
                        <div className={cardContent()}>
                            <h2 className={cardTitle()}>{c.title}</h2>
                            <p className={cardDesc()}>{c.description}</p>
                            <Link href={`/shop?category=${c.title}`} className={cardLink()}>
                                Explore Collection
                                <ArrowRight size={20} />
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
