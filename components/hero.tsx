'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import Link from 'next/link'

export function Hero() {
    const { scrollYProgress } = useScroll()
    const y = useTransform(scrollYProgress, [0, 1], [0, -200])
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
            <motion.div style={{ y, opacity }} className="relative z-10 text-center px-4 max-w-4xl">
                <motion.h1
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase italic leading-[0.9]"
                >
                    Experience the <br />
                    <span className="text-emerald-500">Future</span> of Wear
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="mt-8 text-xl text-zinc-400 font-medium max-w-xl mx-auto"
                >
                    The world&apos;s first collection of neuro-interactive hardware.
                    Meticulously engineered for the absolute elite.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="mt-12 flex justify-center gap-6"
                >
                    <Link href="/shop" className="bg-white text-black px-8 py-4 rounded-full font-black uppercase tracking-widest hover:bg-emerald-400 transition-colors">
                        Explore Now
                    </Link>
                    <button className="text-white border border-white/20 px-8 py-4 rounded-full font-bold hover:bg-white/5 transition-colors">
                        Our Vision
                    </button>
                </motion.div>
            </motion.div>

            {/* Background Decorative Gradient */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-square bg-emerald-500/20 blur-[160px] rounded-full pointer-events-none" />
        </section>
    )
}
