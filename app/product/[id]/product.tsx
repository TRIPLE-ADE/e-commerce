'use client'

import React from 'react'
import { motion } from 'motion/react'
import { useCart } from '@/store/use-cart'
import { MOCK_PRODUCTS } from '@/data/products'
import { ArrowLeft, Star, ShoppingCart, ShieldCheck, Truck, RotateCcw } from 'lucide-react'
import { tv } from 'tailwind-variants'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Image from 'next/image'

const productStyles = tv({
    slots: {
        container: 'max-w-7xl mx-auto px-4 py-32 flex flex-col lg:flex-row gap-16',
        imageSection: 'flex-1 space-y-4',
        imageWrapper: 'aspect-square rounded-3xl overflow-hidden bg-zinc-900 border border-white/5 relative group cursor-zoom-in',
        image: 'object-cover transition-transform duration-200',
        thumbnailGrid: 'grid grid-cols-4 gap-4',
        thumbnailBtn: 'aspect-square rounded-xl overflow-hidden border-2 transition-all relative',
        thumbnailActive: 'border-emerald-500 ring-2 ring-emerald-500/20',
        thumbnailInactive: 'border-transparent hover:border-white/20 opacity-70 hover:opacity-100',
        infoSection: 'flex-1 space-y-8',
        breadcrumb: 'flex items-center gap-2 text-zinc-500 text-sm mb-4 hover:text-white transition-colors',
        title: 'text-5xl font-black text-white tracking-tight',
        price: 'text-3xl font-mono text-emerald-400 font-bold',
        description: 'text-zinc-400 text-lg leading-relaxed',
        variantTitle: 'text-sm font-bold uppercase tracking-widest text-zinc-500',
        variantGrid: 'grid grid-cols-3 gap-3',
        variantBtn: 'py-4 rounded-xl border border-white/5 text-center font-bold transition-all hover:border-emerald-500/50',
        variantBtnActive: 'border-emerald-500 bg-emerald-500/10 text-emerald-500',
        ctaBtn: 'w-full py-5 bg-white text-black rounded-2xl font-black text-xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-3',
        featureItem: 'flex items-center gap-4 text-zinc-300 bg-zinc-900/50 p-4 rounded-2xl border border-white/5',
    }
})

export const ProductPage = () => {
    const { id } = useParams()
    const product = MOCK_PRODUCTS.find(p => p.id === id)
    const [selectedVariant, setSelectedVariant] = React.useState(product?.variant || 'Standard')
    const [activeImage, setActiveImage] = React.useState(product?.image)
    const [isZooming, setIsZooming] = React.useState(false)
    const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 })

    const addItem = useCart(state => state.addItem)
    const setFlyingItem = useCart(state => state.setFlyingItem)
    const setIsOpen = useCart(state => state.setIsOpen)

    // Ensure activeImage is set when product loads
    React.useEffect(() => {
        if (product && !activeImage) setActiveImage(product.image)
    }, [product, activeImage])

    const {
        container, imageSection, imageWrapper, image: imageStyle, thumbnailGrid, thumbnailBtn, thumbnailActive, thumbnailInactive,
        infoSection, breadcrumb, title, price, description, variantTitle, variantGrid, variantBtn,
        variantBtnActive, ctaBtn, featureItem
    } = productStyles()

    if (!product) return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white gap-4">
            <h1 className="text-2xl font-bold">Product not found</h1>
            <Link href="/shop" className="text-emerald-500 hover:underline">Return to Shop</Link>
        </div>
    )

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isZooming) return
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
        const x = ((e.clientX - left) / width) * 100
        const y = ((e.clientY - top) / height) * 100
        setMousePos({ x, y })
    }

    const handleAddToCart = (e: React.MouseEvent) => {
        setFlyingItem({
            id: product.id,
            x: e.clientX,
            y: e.clientY,
            image: product.image
        })
        addItem({ ...product, variant: selectedVariant, quantity: 1 })
        setTimeout(() => setIsOpen(true), 1200)
    }

    // Default images list if only main image exists
    const galleryImages = product.images && product.images.length > 0
        ? product.images
        : [product.image]

    return (
        <main className="bg-black min-h-screen">
            <div className={container()}>
                {/* Left: Images */}
                <div className={imageSection()}>
                    <Link href="/shop" className={breadcrumb()}>
                        <ArrowLeft size={16} />
                        Back to Collection
                    </Link>

                    {/* Main Image with Zoom */}
                    <motion.div
                        layoutId={`image-${product.id}`}
                        className={imageWrapper()}
                        onMouseEnter={() => setIsZooming(true)}
                        onMouseLeave={() => setIsZooming(false)}
                        onMouseMove={handleMouseMove}
                    >
                        <Image
                            src={activeImage || product.image}
                            alt={product.name}
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className={imageStyle()}
                            style={{
                                transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                                transform: isZooming ? 'scale(2)' : 'scale(1)',
                            }}
                        />
                    </motion.div>

                    {/* Thumbnails */}
                    <div className={thumbnailGrid()}>
                        {galleryImages.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(img)}
                                className={thumbnailBtn({
                                    className: activeImage === img ? thumbnailActive() : thumbnailInactive()
                                })}
                            >
                                <Image
                                    src={img}
                                    alt={`${product.name} view ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Info */}
                <div className={infoSection()}>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-2 text-emerald-500 mb-4">
                            <Star size={16} fill="currentColor" />
                            <span className="font-bold">{product.rating}</span>
                            <span className="text-zinc-500 font-normal">({product.reviews} reviews)</span>
                        </div>
                        <h1 className={title()}>{product.name}</h1>
                        <p className={price()}>${product.price.toLocaleString()}</p>
                    </motion.div>

                    <p className={description()}>
                        {product.description}
                    </p>

                    <div className="space-y-4">
                        <h3 className={variantTitle()}>Edition</h3>
                        <div className={variantGrid()}>
                            {['Standard', 'Pro', 'Founder'].map((v) => (
                                <button
                                    key={v}
                                    onClick={() => setSelectedVariant(v)}
                                    className={variantBtn({ className: selectedVariant === v ? variantBtnActive() : '' })}
                                    aria-pressed={selectedVariant === v}
                                >
                                    {v}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button onClick={handleAddToCart} className={ctaBtn()}>
                        <ShoppingCart size={24} />
                        Add to Bag
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={featureItem()}>
                            <Truck className="text-emerald-500" />
                            <span>Free Neural-Express Shipping</span>
                        </div>
                        <div className={featureItem()}>
                            <ShieldCheck className="text-emerald-500" />
                            <span>Lifetime Synapse Warranty</span>
                        </div>
                        <div className={featureItem()}>
                            <RotateCcw className="text-emerald-500" />
                            <span>30-Day Zero Friction Returns</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
