'use client'

import React, { Suspense } from 'react'
import { AnimatePresence } from 'motion/react'
import { useCart } from '@/store/use-cart'
import type { Product } from '@/types/product'
import { tv } from 'tailwind-variants'
import { ChevronDown, SlidersHorizontal } from 'lucide-react'
import { ProductGridSkeleton } from '@/components/product-skeleton'
import { ProductCard } from '@/components/product-card'

const shopStyles = tv({
    slots: {
        container: 'max-w-7xl mx-auto px-4 py-32 flex flex-col lg:flex-row gap-12',
        sidebar: 'hidden lg:block w-64 space-y-8 sticky top-32 self-start',
        sidebarSection: 'space-y-4',
        sidebarTitle: 'text-xs uppercase font-bold tracking-widest text-zinc-500',
        filterBtn: 'flex items-center justify-between w-full text-left text-zinc-400 hover:text-white transition-colors py-1',
        mainContent: 'flex-1 space-y-12',
        header: 'flex flex-col md:flex-row md:items-end justify-between gap-6',
        title: 'text-6xl font-black text-white italic tracking-tighter',
        subtitle: 'text-zinc-500 text-lg max-w-xl',
        controls: 'flex items-center gap-4',
        sortSelect: 'bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:border-emerald-500/50 transition-all appearance-none cursor-pointer pr-10 relative',
        grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
        activeFilter: 'text-emerald-500 font-bold'
    }
})

export const Shop = ({ products }: { products: Product[] }) => {
    const addItem = useCart(state => state.addItem)
    const setFlyingItem = useCart(state => state.setFlyingItem)
    const setIsOpen = useCart(state => state.setIsOpen)

    const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)
    const [sortBy, setSortBy] = React.useState('newest')
    const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 2000])

    const { container, sidebar, sidebarSection, sidebarTitle, filterBtn, mainContent, header, title, subtitle, sortSelect, grid, activeFilter } = shopStyles()

    const categories = Array.from(new Set(products.map(p => p.category)))

    const filteredAndSortedProducts = React.useMemo(() => {
        let filtered = [...products]

        if (selectedCategory) {
            filtered = filtered.filter(p => p.category === selectedCategory)
        }

        filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

        if (sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price)
        if (sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price)
        if (sortBy === 'rating') filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))

        return filtered
    }, [products, selectedCategory, sortBy, priceRange])

    const handleAddToCart = (product: Product, e: React.MouseEvent) => {
        setFlyingItem({
            id: product.id,
            x: e.clientX,
            y: e.clientY,
            image: product.image
        })
        addItem({ ...product, quantity: 1 })
        setTimeout(() => setIsOpen(true), 1200)
    }

    return (
        <div className="min-h-screen">
            <div className={container()}>
                {/* Sidebar */}
                <aside className={sidebar()}>
                    <div className={sidebarSection()}>
                        <h3 className={sidebarTitle()}>Categories</h3>
                        <div className="space-y-1">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={filterBtn({ className: !selectedCategory ? activeFilter() : '' })}
                            >
                                All Products
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={filterBtn({ className: selectedCategory === cat ? activeFilter() : '' })}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={sidebarSection()}>
                        <h3 className={sidebarTitle()}>Price Range</h3>
                        <div className="space-y-4 pt-2">
                            <input
                                type="range"
                                min="0"
                                max="2000"
                                step="50"
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                className="w-full accent-emerald-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs font-mono text-zinc-500">
                                <span>$0</span>
                                <span className="text-emerald-500 font-bold">${priceRange[1]}</span>
                            </div>
                        </div>
                    </div>
                </aside>

                <div className={mainContent()}>
                    <header className={header()}>
                        <div className="space-y-2">
                            <h1 className={title()}>THE VAULT</h1>
                            <p className={subtitle()}>Showing {filteredAndSortedProducts.length} results</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative group">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className={sortSelect()}
                                >
                                    <option value="newest">Featured</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                    <option value="rating">Top Rated</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none group-focus-within:text-emerald-500 transition-colors" />
                            </div>
                        </div>
                    </header>

                    <Suspense fallback={<ProductGridSkeleton count={3}/>}>
                        <div className={grid()}>
                            <AnimatePresence mode="popLayout">
                                {filteredAndSortedProducts.map((product) => (
                                    <ProductCard 
                                        key={product.id} 
                                        product={product} 
                                        onAdd={handleAddToCart}
                                        animationVariant="layout"
                                        imageSizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    </Suspense>

                    {filteredAndSortedProducts.length === 0 && (
                        <div className="py-32 text-center border border-white/5 rounded-3xl bg-zinc-950/50">
                            <SlidersHorizontal size={40} className="mx-auto text-zinc-700 mb-4" />
                            <h3 className="text-xl font-bold text-white">No products found</h3>
                            <p className="text-zinc-500 mt-2">Try adjusting your filters or search terms.</p>
                            <button
                                onClick={() => { setSelectedCategory(null); setPriceRange([0, 2000]); }}
                                className="mt-6 text-emerald-400 font-bold hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
