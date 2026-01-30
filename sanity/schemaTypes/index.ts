import { type SchemaTypeDefinition } from 'sanity'
import { productType } from './product'
import { categoryType } from './category'
import { orderType } from './order'
import { collectionType } from './collection'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [productType, categoryType, orderType, collectionType],
}
