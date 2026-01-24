import { Metadata } from 'next'
import { Shop } from './shop'

export const metadata: Metadata = {
    title: 'The Vault | Triplex',
    description: 'Explore the full collection of neural hardware and experimental gear.',
}

export default function ShopPage() {
    return <Shop />
}
