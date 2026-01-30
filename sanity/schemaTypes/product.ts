import { TrolleyIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const productType = defineType({
    name: 'product',
    title: 'Product',
    type: 'document',
    icon: TrolleyIcon,
    fields: [
        defineField({
            name: 'name',
            title: 'Product Name',
            type: 'string',
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name',
            },
        }),
        defineField({
            name: 'price',
            title: 'Price',
            type: 'number',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
        }),
        defineField({
            name: 'image',
            title: 'Main Image',
            type: 'image',
            options: {
                hotspot: true,
            }
        }),
        defineField({
            name: 'images',
            title: 'Gallery Images',
            type: 'array',
            of: [{ type: 'image' }],
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'reference',
            to: { type: 'category' },
        }),
        defineField({
            name: 'stock',
            title: 'Stock Level',
            type: 'number',
            validation: (Rule) => Rule.min(0).error('Stock level must be at least 0'),
        }),
        defineField({
            name: 'variant',
            title: 'Variant Name',
            type: 'string',
        }),
    ],
})
