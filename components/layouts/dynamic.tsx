'use client'

import dynamic from 'next/dynamic'

const CartSidebar = dynamic(() => import("@/components/cart-sidebar").then(mod => ({ default: mod.CartSidebar })), { 
  ssr: false,
  loading: () => null
})

const SearchOverlay = dynamic(() => import("@/components/search").then(mod => ({ default: mod.SearchOverlay })), { 
  ssr: false,
  loading: () => null
})

const CartSync = dynamic(() => import("@/components/cart-sync").then(mod => ({ default: mod.CartSync })), { 
  ssr: false,
  loading: () => null
})

const FlyToCart = dynamic(() => import("@/components/fly-to-cart").then(mod => ({ default: mod.FlyToCart })), { 
  ssr: false,
  loading: () => null
})

export function DynamicImports() {
  return (
    <>
      <CartSidebar />
      <SearchOverlay />
      <CartSync />
      <FlyToCart />
    </>
  )
}
