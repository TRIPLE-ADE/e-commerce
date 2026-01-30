'use client'

import { motion } from 'motion/react'
import { tv } from 'tailwind-variants'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import type { Collection } from '@/types/product'

const collectionStyles = tv({
    slots: {
        container: 'max-w-7xl mx-auto px-4 py-32 space-y-24',
        header: 'text-center space-y-4 max-w-2xl mx-auto',
        title: 'text-7xl font-black text-white italic tracking-tighter uppercase',
        subtitle: 'text-zinc-500 text-xl',
        grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[600px]',
        card: 'group relative w-full h-full rounded-3xl overflow-hidden border border-white/5 bg-zinc-900',
        cardOverlay: 'absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500',
        cardContent: 'absolute bottom-0 left-0 p-12 space-y-4 w-full',
        cardTitle: 'text-4xl font-bold text-white tracking-tight',
        cardDesc: 'text-zinc-400 text-lg max-w-md',
        cardLink: 'flex items-center gap-2 text-white font-bold group-hover:text-emerald-400 transition-colors pt-4',
        image: 'object-cover transition-transform duration-1000 group-hover:scale-110'
    }
})



export const Collections = ({ collections }: { collections: Collection[] }) => {
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
                {collections.map((c, i) => {
                    // Showcase items span 2 columns (or 3 on large screens if desired, but let's stick to 2 for magazine feel)
                    const isShowcase = c.layoutType === 'showcase'
                    const spanClass = isShowcase ? 'md:col-span-2 lg:col-span-2' : ''

                    return (
                        <motion.div
                            key={c.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.8 }}
                            className={`${card()} ${spanClass}`}
                        >
                            <Image src={c.image} alt={c.title} fill className={image()} />
                            <div className={cardOverlay()} />

                            {/* Drop Date & Layout Badge */}
                            <div className="absolute top-6 right-6 flex flex-col items-end gap-2">
                                {c.releaseDate && new Date(c.releaseDate) > new Date() && (
                                    <div className="bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
                                        Dropping {new Date(c.releaseDate).toLocaleDateString()}
                                    </div>
                                )}
                                {isShowcase && (
                                    <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest text-white uppercase">
                                        Major Drop
                                    </div>
                                )}
                            </div>

                            <div className={cardContent()}>
                                <h2 className={`${cardTitle()} ${isShowcase ? 'text-6xl' : 'text-4xl'}`}>{c.title}</h2>
                                <p className={cardDesc()}>{c.description}</p>
                                <Link href={`/shop?category=${c.title}`} className={cardLink()}>
                                    Explore Collection
                                    <ArrowRight size={20} />
                                </Link>
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}
