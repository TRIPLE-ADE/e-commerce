'use client'

import React from 'react'
import Link from 'next/link'
import { ShoppingCart, Search, User } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useCart } from '@/store/use-cart'
import { useAuth } from '@/store/use-auth'
import { tv } from 'tailwind-variants'

const headerStyles = tv({
    slots: {
        base: 'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between',
        logo: 'text-2xl font-bold tracking-tight text-white flex items-center gap-2',
        nav: 'hidden md:flex items-center gap-8',
        navLink: 'text-sm font-medium text-gray-300 hover:text-white transition-colors',
        actions: 'flex items-center gap-5',
        iconButton: 'text-gray-300 hover:text-white transition-colors relative',
        badge: 'absolute -top-1.5 -right-1.5 bg-white text-black text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center',
    }
})

export const Header = () => {
    const { base, container, logo, nav, navLink, actions, iconButton, badge } = headerStyles()
    const totalItems = useCart((state) => state.totalItems())
    const setIsOpen = useCart((state) => state.setIsOpen)
    const setIsSearchOpen = useCart((state) => state.setIsSearchOpen)
    const setIsAuthOpen = useAuth((state) => state.setIsAuthOpen)
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header className={base({ className: isScrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 h-16' : 'bg-transparent' })}>
            <div className={container({ className: isScrolled ? 'h-16' : 'h-20' })}>
                <Link href="/" className={logo()} aria-label="Triplex Home">
                    <span className="bg-white text-black px-2 py-0.5 rounded italic font-black">TRI</span>
                    PLEX
                </Link>

                <nav className={nav()}>
                    <Link href="/shop" className={navLink()}>Shop All</Link>
                    <Link href="/collections" className={navLink()}>Collections</Link>
                    <Link href="/about" className={navLink()}>Our Story</Link>
                </nav>

                <div className={actions()}>
                    <button
                        className={iconButton()}
                        onClick={() => setIsSearchOpen(true)}
                        aria-label="Search products"
                    >
                        <Search size={22} strokeWidth={1.5} />
                    </button>
                    <button
                        className={iconButton()}
                        onClick={() => setIsAuthOpen(true)}
                        aria-label="User account"
                    >
                        <User size={22} strokeWidth={1.5} />
                    </button>
                    <button
                        id="cart-button"
                        className={iconButton()}
                        onClick={() => setIsOpen(true)}
                        aria-label={`View cart with ${totalItems} items`}
                    >
                        <ShoppingCart size={22} strokeWidth={1.5} />
                        <AnimatePresence mode="popLayout">
                            {totalItems > 0 && (
                                <motion.span
                                    key={totalItems}
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.5, opacity: 0 }}
                                    className={badge()}
                                >
                                    {totalItems}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </div>
        </header>
    )
}
