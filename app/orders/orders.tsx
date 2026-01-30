'use client'

import { motion } from 'motion/react'
import { tv } from 'tailwind-variants'
import { Package, Calendar } from 'lucide-react'
import Image from 'next/image'
import type { SanityOrder, OrderProduct, OrderStatus } from '@/types'

const ordersStyles = tv({
    slots: {
        container: 'max-w-4xl mx-auto px-4 py-32 space-y-12',
        header: 'space-y-2',
        title: 'text-5xl font-black text-white italic tracking-tighter uppercase',
        subtitle: 'text-zinc-500 text-lg',
        orderList: 'space-y-6',
        orderCard: 'bg-zinc-950 border border-white/5 rounded-3xl overflow-hidden hover:border-emerald-500/20 transition-all group',
        cardHeader: 'p-6 bg-zinc-900/50 flex flex-wrap items-center justify-between gap-4 border-b border-white/5',
        orderInfo: 'flex gap-6 text-sm text-zinc-400',
        statusBadge: 'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border',
        cardBody: 'p-6 space-y-4',
        productItem: 'flex items-center gap-4',
        productImage: 'w-16 h-16 rounded-xl bg-zinc-900 relative overflow-hidden flex-shrink-0',
        totalSection: 'p-6 bg-zinc-900/30 flex justify-between items-center border-t border-white/5',
        emptyState: 'text-center py-24 space-y-6 bg-zinc-950 border border-white/5 border-dashed rounded-3xl'
    }
})

const StatusBadge = ({ status }: { status: OrderStatus }) => {
    const { statusBadge } = ordersStyles()
    const config: Record<OrderStatus, string> = {
        paid: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-500',
        pending: 'border-amber-500/20 bg-amber-500/5 text-amber-500',
        shipped: 'border-blue-500/20 bg-blue-500/5 text-blue-500',
    }
    return <span className={`${statusBadge()} ${config[status] || 'border-zinc-500/20 bg-zinc-500/5 text-zinc-500'}`}>{status}</span>
}

export const OrdersPage = ({ orders = [] }: { orders: SanityOrder[] }) => {
    const { container, header, title, subtitle, orderList, orderCard, cardHeader, orderInfo, cardBody, productItem, productImage, totalSection, emptyState } = ordersStyles()

    return (
        <main className="min-h-screen bg-black">
            <div className={container()}>
                <header className={header()}>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={title()}
                    >
                        Sync History
                    </motion.h1>
                    <p className={subtitle()}>Trace your neural enhancement acquisition logs.</p>
                </header>

                <div className={orderList()}>
                    {orders.length === 0 ? (
                        <div className={emptyState()}>
                            <div className="w-20 h-20 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto text-zinc-700 border border-white/5">
                                <Package size={40} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white">No Transmissions Found</h3>
                                <p className="text-zinc-500">Your neural archive is currently clean of any purchases.</p>
                            </div>
                        </div>
                    ) : (
                        orders.map((order, i) => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={orderCard()}
                            >
                                <div className={cardHeader()}>
                                    <div className={orderInfo()}>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] uppercase font-bold text-zinc-600">Order ID</span>
                                            <span className="text-white font-mono">{order.orderNumber}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] uppercase font-bold text-zinc-600">Transmission Date</span>
                                            <div className="flex items-center gap-1.5 text-white">
                                                <Calendar size={14} className="text-zinc-500" />
                                                {new Date(order.orderDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <StatusBadge status={order.status} />
                                </div>

                                <div className={cardBody()}>
                                    {order.products?.map((item: OrderProduct, idx: number) => (
                                        <div key={idx} className={productItem()}>
                                            <div className={productImage()}>
                                                <Image src={item.product?.image} alt={item.product?.name} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-white font-medium">{item.product?.name}</h4>
                                                <p className="text-xs text-zinc-500">
                                                    Edition: <span className="text-zinc-300 font-mono">{item.variant}</span> |
                                                    Qty: <span className="text-zinc-300 font-mono">{item.quantity}</span>
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className={totalSection()}>
                                    <span className="text-zinc-500 text-sm">Amount Secured</span>
                                    <span className="text-emerald-400 font-black text-xl font-mono">${order.totalPrice.toLocaleString()}</span>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </main>
    )
}
