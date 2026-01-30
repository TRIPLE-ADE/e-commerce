'use client'

import React from 'react'
import { motion, useInView } from 'motion/react'
import type { Product } from '@/types/product'
import { Star, ShoppingCart, Eye } from 'lucide-react'
import { tv } from 'tailwind-variants'
import Image from 'next/image'
import Link from 'next/link'

const productCardStyles = tv({
    slots: {
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

type ProductCardProps = {
    product: Product
    onAdd: (product: Product, e: React.MouseEvent) => void
    /**
     * Animation variant:
     * - 'scroll': Uses useInView for scroll-based animation (default)
     * - 'layout': Uses layout animation for AnimatePresence
     * - 'none': No animation
     */
    animationVariant?: 'scroll' | 'layout' | 'none'
    /**
     * Image sizes for responsive loading
     */
    imageSizes?: string
}

export function ProductCard({ 
    product, 
    onAdd, 
    animationVariant = 'scroll',
    imageSizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
}: ProductCardProps) {
    const { card, cardImageWrapper, cardImage, cardContent, cardTitle, cardPrice, cardActions, buttonPrimary, buttonIcon } = productCardStyles()
    const ref = React.useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: '-10% 0px' })

    const getAnimationProps = (): React.ComponentProps<typeof motion.div> => {
        switch (animationVariant) {
            case 'layout':
                return {
                    layout: true,
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    exit: { opacity: 0 }
                }
            case 'scroll':
                return {
                    initial: { opacity: 0, y: 50 },
                    animate: isInView ? { opacity: 1, y: 0 } : {},
                    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
                }
            case 'none':
            default:
                return {}
        }
    }

    const animationProps = getAnimationProps()

    return (
        <motion.div
            {...(animationVariant === 'scroll' ? { ref } : {})}
            {...animationProps}
            className={card()}
        >
            <Link href={`/product/${product.id}`} className={cardImageWrapper()}>
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes={imageSizes}
                    className={cardImage()}
                />
            </Link>
            <div className={cardContent()}>
                <div className="flex justify-between items-start">
                    <Link href={`/product/${product.id}`} className="hover:text-emerald-400 transition-colors text-left">
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
