import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { client } from '@/sanity/lib/client'
import { USER_ORDERS_QUERY } from '@/sanity/lib/queries'
import { OrdersPage } from './orders'

export default async function Orders() {
    const { userId } = await auth()

    if (!userId) {
        redirect('/')
    }

    const orders = await client.fetch(USER_ORDERS_QUERY, { userId })

    return <OrdersPage orders={orders} />
}
