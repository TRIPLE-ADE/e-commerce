'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Search, X, Command, ArrowRight, Loader2 } from 'lucide-react'
import { useCart } from '@/store/use-cart'
import { tv } from 'tailwind-variants'
import Image from 'next/image'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { SEARCH_PRODUCTS_QUERY } from '@/sanity/lib/queries'
import { SEARCH_DEBOUNCE_MS } from '@/lib/constants'
import type { QueryParams } from 'next-sanity'
import { toast } from 'sonner'

const searchStyles = tv({
    slots: {
        overlay: 'fixed inset-0 bg-black/60 backdrop-blur-xl z-[100] flex flex-col items-center pt-[10vh] px-4',
        container: 'w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]',
        header: 'p-6 flex items-center gap-4 border-b border-white/5',
        input: 'bg-transparent border-none outline-none flex-1 text-white text-xl placeholder:text-zinc-600 font-medium',
        results: 'flex-1 overflow-y-auto p-4 custom-scrollbar',
        item: 'flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5',
        itemImage: 'w-16 h-16 rounded-xl bg-zinc-900 relative overflow-hidden flex-shrink-0',
        itemInfo: 'flex-1',
        itemName: 'text-white font-semibold flex items-center justify-between',
        itemPrice: 'text-zinc-500 font-mono text-sm',
        footer: 'p-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500 bg-zinc-900/30',
        shortcut: 'bg-zinc-800 px-1.5 py-0.5 rounded border border-white/5 text-[10px] font-mono uppercase tracking-tighter'
    }
})

export const SearchOverlay = () => {
    const isSearchOpen = useCart((state) => state.isSearchOpen)
    const setIsSearchOpen = useCart((state) => state.setIsSearchOpen)
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<Array<{ id: string; name: string; price: number; image: string }>>([])
    const [isSearching, setIsSearching] = useState(false)
    const [isPending, startTransition] = React.useTransition()
    const inputRef = useRef<HTMLInputElement>(null)
    const { overlay, container, header, input, results: resultsStyle, item: itemStyle, itemImage, itemInfo, itemName, itemPrice, footer, shortcut } = searchStyles()

    useEffect(() => {
        if (!query.trim()) {
            setResults([])
            return
        }

        const controller = new AbortController()
        setIsSearching(true)

        const timeoutId = setTimeout(async () => {
            try {
                const data = await client.fetch<Array<{ id: string; name: string; price: number; image: string }>>(
                    SEARCH_PRODUCTS_QUERY,
                    { query: `${query}*` } as unknown as QueryParams,
                    { signal: controller.signal }
                )
                startTransition(() => {
                    setResults(data)
                })
            } catch (err) {
                if (err instanceof Error && err.name === 'AbortError') return
                toast.error('Search Failed', {
                    description: 'Unable to search for products. Please try again.',
                })
            } finally {
                setIsSearching(false)
            }
        }, SEARCH_DEBOUNCE_MS)

        return () => {
            clearTimeout(timeoutId)
            controller.abort()
        }
    }, [query])

    useEffect(() => {
        const handleKeys = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setIsSearchOpen(true)
            }
            if (e.key === 'Escape') {
                setIsSearchOpen(false)
            }
        }
        window.addEventListener('keydown', handleKeys)
        return () => window.removeEventListener('keydown', handleKeys)
    }, [setIsSearchOpen])

    return (
        <AnimatePresence>
            {isSearchOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={overlay()}
                    onClick={() => setIsSearchOpen(false)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className={container()}
                        onClick={(e) => e.stopPropagation()}
                        onAnimationComplete={() => {
                            if (isSearchOpen) inputRef.current?.focus()
                        }}
                    >
                        <div className={header()}>
                            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded border border-emerald-500/20">
                                Triplex-OS
                            </div>
                            {isSearching || isPending ? <Loader2 className="animate-spin text-emerald-500" size={20} /> : <Search className="text-zinc-500" size={20} />}
                            <input
                                ref={inputRef}
                                className={input()}
                                placeholder="Search collection..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                aria-label="Search products"
                                aria-describedby="search-results-status"
                            />
                            <span id="search-results-status" className="sr-only">
                                {isPending ? 'Searching...' : results.length > 0 ? `${results.length} results found` : query ? 'No results found' : ''}
                            </span>
                            <button
                                onClick={() => setIsSearchOpen(false)}
                                className="p-2 hover:bg-white/5 rounded-full transition-colors"
                            >
                                <X size={20} className="text-zinc-500" />
                            </button>
                        </div>

                        <div 
                            className={resultsStyle({ className: isPending ? 'opacity-50 transition-opacity duration-200' : 'transition-opacity duration-200' })}
                            role="region"
                            aria-label="Search results"
                            aria-live="polite"
                            aria-busy={isPending}
                        >
                            {!query ? (
                                <div className="space-y-8 p-6">
                                    <div className="text-center space-y-4 py-8">
                                        <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto text-zinc-500 border border-white/5 border-dashed">
                                            <Command size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-medium">Global Navigation Enabled</h3>
                                            <p className="text-zinc-500 text-sm mt-1">Start typing to search products or use shortcuts.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-600 px-2">Popular Searches</p>
                                        <div className="flex flex-wrap gap-2 px-2">
                                            {['Heads-up', 'Audio', 'Wearables'].map(s => (
                                                <button
                                                    key={s}
                                                    onClick={() => setQuery(s)}
                                                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-zinc-400 hover:text-white transition-all border border-white/5"
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : results.length === 0 && !isSearching ? (
                                <div className="p-12 text-center text-zinc-500 italic">
                                    No records found matching &quot;{query}&quot;
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <p className="px-2 text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-2">Relevant Results ({results.length})</p>
                                    {results.map((p) => (
                                        <Link
                                            key={p.id}
                                            href={`/product/${p.id}`}
                                            onClick={() => setIsSearchOpen(false)}
                                            className={itemStyle()}
                                        >
                                            <div className={itemImage()}>
                                                <Image src={p.image} alt={p.name} fill className="object-cover" />
                                            </div>
                                            <div className={itemInfo()}>
                                                <div className={itemName()}>
                                                    {p.name}
                                                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-emerald-500" />
                                                </div>
                                                <div className={itemPrice()}>${p.price}</div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className={footer()}>
                            <div className="flex gap-4">
                                <span className="flex items-center gap-1.5 hover:text-zinc-300 transition-colors">
                                    <span className={shortcut()}>Esc</span>
                                    Close
                                </span>
                                <span className="flex items-center gap-1.5 hover:text-zinc-300 transition-colors">
                                    <span className={shortcut()}>↵</span>
                                    Select
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                Neural Link Active
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
