import { Metadata } from 'next'
import { Success } from './success'

export const metadata: Metadata = {
    title: 'Order Confirmed | Triplex',
    description: 'Your neural hardware is being synchronized and prepared for express dispatch.',
}

export default function SuccessPage() {
    return <Success />
}
