'use client'

import { useEffect, useRef, useTransition, useState } from 'react'
import { motion } from 'motion/react'
import { CheckCircle2, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react'
import { useCart } from '@/store/use-cart'
import Link from 'next/link'
import confetti from 'canvas-confetti'
import { useSearchParams, useRouter } from 'next/navigation'
import type { CheckoutSessionData, CheckoutLineItem } from '@/types/checkout'
import { toast } from 'sonner'

export const Success = () => {
    const router = useRouter()
    const clearCart = useCart(state => state.clearCart)
    const setIsOpen = useCart((state) => state.setIsOpen)
    const searchParams = useSearchParams()
    const sessionId = searchParams.get('session_id')

    const [orderData, setOrderData] = useState<CheckoutSessionData | null>(null)
    const [isPending, startTransition] = useTransition()
    const hasProcessed = useRef(false)

    useEffect(() => {
        if (!sessionId) {
            router.replace('/shop')
            return
        }
        
        if (hasProcessed.current) return
        hasProcessed.current = true

        clearCart()
        setIsOpen(false)
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10b981', '#ffffff', '#000000']
        })

        startTransition(async () => {
            try {
                const res = await fetch(`/api/checkout/session?session_id=${sessionId}`)
                const data = await res.json()

                if (data.error && data.status === 'open') {
                    router.replace('/shop')
                    return
                }

                if (!data.error) {
                    setOrderData(data as CheckoutSessionData)
                    toast.success('Order Confirmed', {
                        description: 'Your order has been successfully processed!',
                        duration: 5000,
                    })
                } else {
                    toast.error('Order Verification Failed', {
                        description: 'Unable to verify your order. Please contact support if you were charged.',
                    })
                }
            } catch {
                toast.error('Order Verification Failed', {
                    description: 'Unable to verify your order. Please contact support if you were charged.',
                })
                router.replace('/shop')
            }
        })
    }, [sessionId, router, clearCart, setIsOpen])

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4 py-32">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl w-full text-center space-y-8 bg-zinc-950 p-8 md:p-12 rounded-3xl border border-white/5"
            >
                <div className="flex justify-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
                        className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500"
                    >
                        <CheckCircle2 size={40} />
                    </motion.div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
                        {orderData?.customerName ? `Welcome to the Vanguard, ${orderData.customerName.split(' ')[0]}` : 'Synchronization Complete'}
                    </h1>
                    <p className="text-zinc-500 text-lg leading-relaxed">
                        {orderData
                            ? `Your order of ${orderData.lineItems?.length} items has been finalized and secured.`
                            : 'Your transaction has been finalized. Your neural enhancements are being prepared for immediate deployment.'}
                    </p>
                </div>

                {isPending ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="text-emerald-500 animate-spin" size={32} />
                    </div>
                ) : orderData && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-black/50 border border-white/5 rounded-2xl p-6 text-left space-y-4"
                    >
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Order Summary</h3>
                        <div className="space-y-3">
                            {orderData.lineItems?.map((item: CheckoutLineItem) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span className="text-zinc-300">
                                        <span className="text-emerald-500 font-bold">{item.quantity}x</span> {item.name}
                                    </span>
                                    <span className="text-white font-mono">${item.amount.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                        <div className="pt-4 border-t border-white/5 flex justify-between font-bold text-white">
                            <span>Total Synchronized</span>
                            <span className="text-emerald-400 font-mono">${orderData.amountTotal.toLocaleString()}</span>
                        </div>
                    </motion.div>
                )}

                <div className="space-y-4 pt-4">
                    <Link
                        href="/shop"
                        className="w-full py-4 bg-white text-black rounded-xl font-bold hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 group"
                    >
                        <ShoppingBag size={20} />
                        Continue Shopping
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <p className="text-[10px] text-zinc-600 font-mono tracking-[0.2em] uppercase">
                        Digital Receipt Dispatching to {orderData?.customerEmail || 'Neural Proxy'}
                    </p>
                </div>
            </motion.div>
        </div>
    )
}