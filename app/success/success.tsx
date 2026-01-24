'use client'

import React from 'react'
import { motion } from 'motion/react'
import { Header } from '@/components/header'
import { CheckCircle2, Package, ArrowRight, Download } from 'lucide-react'
import Link from 'next/link'
import confetti from 'canvas-confetti'

export const Success = () => {
    React.useEffect(() => {
        const duration = 5 * 1000
        const animationEnd = Date.now() + duration
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now()

            if (timeLeft <= 0) {
                return clearInterval(interval)
            }

            const particleCount = 50 * (timeLeft / duration)
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } })
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } })
        }, 250)

        return () => clearInterval(interval)
    }, [])

    return (
        <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
            <Header />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="max-w-2xl w-full bg-zinc-950 border border-white/5 p-12 rounded-3xl text-center space-y-8"
            >
                <div className="flex justify-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
                        className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-black"
                    >
                        <CheckCircle2 size={48} />
                    </motion.div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-black text-white italic">ORDER CONFIRMED</h1>
                    <p className="text-zinc-500 text-lg">Thank you for joining the vanguard. Your neural hardware is being synchronized and prepared for express dispatch.</p>
                </div>

                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 flex items-center justify-between text-left">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400">
                            <Package size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest">Order ID</p>
                            <p className="text-white font-mono">#TRPX-77X-99K</p>
                        </div>
                    </div>
                    <button className="text-emerald-500 font-bold flex items-center gap-2 hover:underline">
                        <Download size={18} />
                        Invoice
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/" className="flex-1 bg-white text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-400 transition-colors">
                        Continue Shopping
                        <ArrowRight size={18} />
                    </Link>
                    <button className="flex-1 bg-zinc-900 text-white py-4 rounded-xl font-bold border border-white/5 hover:bg-zinc-800 transition-colors">
                        Track Order
                    </button>
                </div>
            </motion.div>

            <p className="mt-8 text-zinc-600 text-sm italic">"The future is not something you wait for, it's something you wear."</p>
        </main>
    )
}
