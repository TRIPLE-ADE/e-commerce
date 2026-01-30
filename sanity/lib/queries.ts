import { defineQuery } from 'next-sanity'

export const PRODUCTS_LIST_QUERY = defineQuery(`
  *[_type == "product"][0...8] {
    "id": _id,
    name,
    "slug": slug.current,
    price,
    "image": image.asset->url,
    "category": category->title,
    stock,
    variant,
    "rating": 5.0,
    "reviews": 12
  }
`)

export const ALL_PRODUCTS_LIST_QUERY = defineQuery(`
  *[_type == "product"] {
    "id": _id,
    name,
    "slug": slug.current,
    price,
    "image": image.asset->url,
    "category": category->title,
    stock,
    variant,
    "rating": 5.0,
    "reviews": 12
  }
`)

export const PRODUCT_QUERY = defineQuery(`
  *[_type == "product" && _id == $id][0] {
    "id": _id,
    name,
    "slug": slug.current,
    price,
    description,
    "image": image.asset->url,
    "images": images[].asset->url,
    "category": category->title,
    stock,
    variant,
    "rating": 5.0, // Placeholder
    "reviews": 42 // Placeholder
  }
`)

export const COLLECTIONS_QUERY = defineQuery(`
  *[_type == "collection"] {
    "id": _id,
    title,
    "slug": slug.current,
    description,
    "image": image.asset->url,
    releaseDate,
    layoutType
  }
`)

export const PRODUCTS_BY_IDS_QUERY = defineQuery(`
  *[_type == "product" && _id in $ids] {
    "id": _id,
    name,
    price,
    "image": image.asset->url,
    stock
  }
`)

export const SEARCH_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" && (name match $query || description match $query)][0...5] {
    "id": _id,
    name,
    price,
    "image": image.asset->url
  }
`)

export const USER_ORDERS_QUERY = defineQuery(`
  *[_type == "order" && clerkUserId == $userId] | order(orderDate desc) {
    _id,
    orderNumber,
    orderDate,
    status,
    totalPrice,
    products[] {
      quantity,
      variant,
      product-> {
        name,
        "image": image.asset->url
      }
    }
  }
`)
