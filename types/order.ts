/**
 * Order item metadata used in Stripe webhook processing
 */
export interface OrderItemMetadata {
    id: string
    q: number // quantity
    v?: string // variant
}
