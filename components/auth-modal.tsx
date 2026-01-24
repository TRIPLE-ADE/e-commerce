'use client'

import { motion, AnimatePresence } from 'motion/react'
import { X, Mail, Lock, ArrowRight, Github } from 'lucide-react'
import { useAuth } from '@/store/use-auth'
import { tv } from 'tailwind-variants'

const authStyles = tv({
    slots: {
        overlay: 'fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4',
        modal: 'w-full max-w-md bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative',
        header: 'p-8 pb-0 text-center',
        title: 'text-2xl font-black text-white italic tracking-tight',
        subtitle: 'text-zinc-500 mt-2 text-sm',
        form: 'p-8 space-y-4',
        inputGroup: 'space-y-2',
        label: 'text-xs text-zinc-500 font-bold uppercase tracking-widest',
        inputWrapper: 'relative',
        input: 'w-full bg-zinc-900/50 border border-white/5 rounded-xl px-4 py-3 pl-10 text-white focus:outline-none focus:border-emerald-500/50 transition-colors',
        icon: 'absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500',
        submitBtn: 'w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 mt-4',
        divider: 'flex items-center gap-4 text-xs text-zinc-600 my-6',
        dividerLine: 'h-px flex-1 bg-white/5',
        socialBtn: 'w-full border border-white/5 rounded-xl py-3 flex items-center justify-center gap-2 text-zinc-400 hover:bg-white/5 hover:text-white transition-colors',
        footer: 'p-6 bg-zinc-900/30 text-center text-sm text-zinc-500 border-t border-white/5',
        link: 'text-emerald-500 font-bold hover:underline cursor-pointer ml-1'
    }
})

export const AuthModal = () => {
    const isAuthOpen = useAuth((state) => state.isAuthOpen)
    const setIsAuthOpen = useAuth((state) => state.setIsAuthOpen)
    const authView = useAuth((state) => state.authView)
    const setAuthView = useAuth((state) => state.setAuthView)

    const { overlay, modal, header, title, subtitle, form, inputGroup, label, inputWrapper, input, icon, submitBtn, divider, dividerLine, socialBtn, footer, link } = authStyles()

    if (!isAuthOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={overlay()}
                onClick={() => setIsAuthOpen(false)}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className={modal()}
                >
                    <button
                        onClick={() => setIsAuthOpen(false)}
                        className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className={header()}>
                        <h2 className={title()}>
                            {authView === 'login' ? 'Welcome Back' : 'Join the Vanguard'}
                        </h2>
                        <p className={subtitle()}>
                            {authView === 'login'
                                ? 'Sync your neural profile to continue.'
                                : 'Create your secure Triplex identity.'}
                        </p>
                    </div>

                    <form className={form()} onSubmit={(e) => e.preventDefault()}>
                        <div className={inputGroup()}>
                            <label className={label()}>Neural ID (Email)</label>
                            <div className={inputWrapper()}>
                                <Mail size={18} className={icon()} />
                                <input type="email" placeholder="user@triplex.os" className={input()} />
                            </div>
                        </div>

                        <div className={inputGroup()}>
                            <label className={label()}>Encryption Key (Password)</label>
                            <div className={inputWrapper()}>
                                <Lock size={18} className={icon()} />
                                <input type="password" placeholder="••••••••" className={input()} />
                            </div>
                        </div>

                        <button className={submitBtn()}>
                            {authView === 'login' ? 'Initialize Session' : 'Create Account'}
                            <ArrowRight size={18} />
                        </button>

                        <div className={divider()}>
                            <div className={dividerLine()} />
                            <span>OR AUTHENTICATE WITH</span>
                            <div className={dividerLine()} />
                        </div>

                        <button type="button" className={socialBtn()}>
                            <Github size={20} />
                            GitHub
                        </button>
                    </form>

                    <div className={footer()}>
                        {authView === 'login' ? (
                            <>
                                New to Triplex?
                                <span onClick={() => setAuthView('signup')} className={link()}>Initialize ID</span>
                            </>
                        ) : (
                            <>
                                Already initialized?
                                <span onClick={() => setAuthView('login')} className={link()}>Access Portal</span>
                            </>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
