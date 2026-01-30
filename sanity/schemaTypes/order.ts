import { BlockContentIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const orderType = defineType({
    name: 'order',
    title: 'Order',
    type: 'document',
    icon: BlockContentIcon,
    fields: [
        defineField({
            name: 'orderNumber',
            title: 'Order Number',
            type: 'string',
        }),
        defineField({
            name: 'stripeId',
            title: 'Stripe Session ID',
            type: 'string',
        }),
        defineField({
            name: 'customerName',
            title: 'Customer Name',
            type: 'string',
        }),
        defineField({
            name: 'email',
            title: 'Customer Email',
            type: 'string',
        }),
        defineField({
            name: 'products',
            title: 'Products',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'product', type: 'reference', to: { type: 'product' } },
                        { name: 'quantity', type: 'number' },
                        { name: 'variant', type: 'string' },
                    ],
                },
            ],
        }),
        defineField({
            name: 'totalPrice',
            title: 'Total Price',
            type: 'number',
        }),
        defineField({
            name: 'clerkUserId',
            title: 'Clerk User ID',
            type: 'string',
        }),
        defineField({
            name: 'status',
            title: 'Order Status',
            type: 'string',
            options: {
                list: [
                    { title: 'Pending', value: 'pending' },
                    { title: 'Paid', value: 'paid' },
                    { title: 'Shipped', value: 'shipped' },
                ],
                layout: 'radio'
            }
        }),
        defineField({
            name: 'orderDate',
            title: 'Order Date',
            type: 'datetime',
        })
    ],
})
