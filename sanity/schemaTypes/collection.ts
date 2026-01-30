import { PackageIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const collectionType = defineType({
    name: 'collection',
    title: 'Collection',
    type: 'document',
    icon: PackageIcon,
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
            },
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
        }),
        defineField({
            name: 'image',
            title: 'Cover Image',
            type: 'image',
            options: {
                hotspot: true,
            }
        }),
        defineField({
            name: 'releaseDate',
            title: 'Release Date',
            type: 'datetime',
            description: 'If set, products will be "locked" until this date.'
        }),
        defineField({
            name: 'layoutType',
            title: 'Layout Style',
            type: 'string',
            options: {
                list: [
                    { title: 'Standard Grid', value: 'grid' },
                    { title: 'Showcase (Hero + List)', value: 'showcase' },
                    { title: 'Carousel', value: 'carousel' },
                ],
                layout: 'radio'
            },
            initialValue: 'grid'
        }),
        defineField({
            name: 'products',
            title: 'Products',
            type: 'array',
            of: [
                {
                    type: 'reference',
                    to: [{ type: 'product' }],
                },
            ],
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'releaseDate',
            media: 'image',
        },
    },
})
