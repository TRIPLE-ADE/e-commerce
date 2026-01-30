'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart, Search, User, Package } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useCart } from '@/store/use-cart'
import { tv } from 'tailwind-variants'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'

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
    const totalItems = useCart((state) => state.items.reduce((acc, item) => acc + item.quantity, 0))
    const setIsOpen = useCart((state) => state.setIsOpen)
    const setIsSearchOpen = useCart((state) => state.setIsSearchOpen)
    const [isScrolled, setIsScrolled] = useState(false)
    const sentinelRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) =>
            setIsScrolled(!entry.isIntersecting),
            { threshold: 0, rootMargin: '0px' })

        const currentSentinel = sentinelRef.current
        if (currentSentinel) {
            observer.observe(currentSentinel)
        }

        return () => {
            if (currentSentinel) {
                observer.unobserve(currentSentinel)
            }
        }
    }, [])

    return (
        <>
            <div ref={sentinelRef} className="absolute top-0 left-0 right-0 h-5 pointer-events-none z-[-1]" />
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
                            aria-label="Search"
                        >
                            <Search size={22} strokeWidth={1.5} />
                        </button>

                        <div className="flex items-center">
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <button className={iconButton()} aria-label="Sign in">
                                        <User size={22} strokeWidth={1.5} />
                                    </button>
                                </SignInButton>
                            </SignedOut>
                            <SignedIn>
                                <UserButton
                                    appearance={{
                                        elements: {
                                            userButtonAvatarBox: "w-9 h-9 border border-white/10 hover:border-emerald-500/50 transition-colors"
                                        }
                                    }}
                                >
                                    <UserButton.MenuItems>
                                        <UserButton.Link
                                            label="Sync History"
                                            labelIcon={<Package size={16} />}
                                            href="/orders"
                                        />
                                    </UserButton.MenuItems>
                                </UserButton>
                            </SignedIn>
                        </div>

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
        </>
    )
}
