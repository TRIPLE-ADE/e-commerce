'use client'

import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react'
import { useCart } from '@/store/use-cart'
import { tv } from 'tailwind-variants'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const sidebarStyles = tv({
    slots: {
        overlay: 'fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]',
        panel: 'fixed top-0 right-0 bottom-0 w-full max-w-md bg-zinc-950 border-l border-white/10 z-[70] shadow-2xl flex flex-col',
        header: 'p-6 border-b border-white/10 flex items-center justify-between',
        title: 'text-xl font-semibold text-white flex items-center gap-2',
        closeBtn: 'p-2 hover:bg-white/5 rounded-full text-zinc-400 hover:text-white transition-colors',
        content: 'flex-1 overflow-y-auto p-6 space-y-6',
        item: 'flex gap-4 group',
        itemImage: 'w-24 h-24 bg-zinc-900 rounded-lg overflow-hidden border border-white/5 relative',
        itemDetails: 'flex-1 flex flex-col',
        itemName: 'text-white font-medium group-hover:text-emerald-400 transition-colors',
        itemVariant: 'text-sm text-zinc-500 mt-1',
        itemPrice: 'text-zinc-200 font-semibold mt-auto',
        controls: 'flex items-center gap-3 bg-zinc-900 rounded-lg p-1 w-fit',
        controlBtn: 'p-1.5 hover:bg-white/10 rounded-md text-zinc-400 hover:text-white transition-colors',
        footer: 'p-6 border-t border-white/10 space-y-4',
        summaryRow: 'flex justify-between items-center text-zinc-400',
        totalRow: 'flex justify-between items-center text-lg font-bold text-white',
        checkoutBtn: 'w-full py-4 bg-white text-black rounded-xl font-bold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2',
        empty: 'flex flex-col items-center justify-center h-full text-center space-y-4',
    }
})

export const CartSidebar = () => {
    const router = useRouter()
    const {
        overlay, panel, header, title, closeBtn, content, item: itemStyle,
        itemImage, itemDetails, itemName, itemVariant, itemPrice, controls,
        controlBtn, footer, summaryRow, totalRow, checkoutBtn, empty
    } = sidebarStyles()

    const items = useCart((state) => state.items)
    const updateQuantity = useCart((state) => state.updateQuantity)
    const removeItem = useCart((state) => state.removeItem)
    const totalPrice = useCart((state) => state.totalPrice)
    const isOpen = useCart((state) => state.isOpen)
    const setIsOpen = useCart((state) => state.setIsOpen)

    const onClose = () => setIsOpen(false)

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className={overlay()}
                        aria-hidden="true"
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className={panel()}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Shopping Cart"
                    >
                        <div className={header()}>
                            <h2 className={title()}>
                                <ShoppingBag size={20} />
                                Your Cart
                            </h2>
                            <button onClick={onClose} className={closeBtn()} aria-label="Close cart">
                                <X size={24} />
                            </button>
                        </div>

                        <div className={content()}>
                            {items.length === 0 ? (
                                <div className={empty()}>
                                    <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-500">
                                        <ShoppingBag size={40} />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">Your cart is empty</h3>
                                        <p className="text-zinc-500 text-sm mt-1">Add something fancy!</p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="mt-4 text-emerald-400 font-medium hover:underline"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <motion.div
                                        layout
                                        key={item.id}
                                        className={itemStyle()}
                                    >
                                        <div className={itemImage()}>
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className={itemDetails()}>
                                            <div className="flex justify-between">
                                                <h4 className={itemName()}>{item.name}</h4>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-zinc-600 hover:text-red-400"
                                                    aria-label={`Remove ${item.name} from cart`}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            {item.variant && <span className={itemVariant()}>{item.variant}</span>}

                                            <div className="flex items-center justify-between mt-auto">
                                                <div className={controls()}>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                        className={controlBtn()}
                                                        aria-label={`Decrease quantity of ${item.name}`}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="text-xs font-bold w-4 text-center text-white" aria-label="Quantity">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className={controlBtn()}
                                                        aria-label={`Increase quantity of ${item.name}`}
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <span className={itemPrice()}>${(item.price * item.quantity).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className={footer()}>
                                <div className={summaryRow()}>
                                    <span>Subtotal</span>
                                    <span>${totalPrice().toLocaleString()}</span>
                                </div>
                                <div className={summaryRow()}>
                                    <span>Shipping</span>
                                    <span className="text-emerald-500 font-medium">Calculated at checkout</span>
                                </div>
                                <div className={totalRow()}>
                                    <span>Total</span>
                                    <span>${totalPrice().toLocaleString()}</span>
                                </div>
                                <button
                                    onClick={() => {
                                        onClose()
                                        router.push('/success')
                                    }}
                                    className={checkoutBtn()}
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
