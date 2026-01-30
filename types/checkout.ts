export interface CheckoutSessionData {
    customerName: string | null
    customerEmail: string | null
    amountTotal: number
    lineItems: CheckoutLineItem[]
}

export interface CheckoutLineItem {
    id: string
    name: string | null
    quantity: number | null
    amount: number
}
