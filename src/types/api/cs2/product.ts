import type { PageDomain } from '../common'

export type Cs2ProductStatus = 'on_sale' | 'off_sale'

export interface Cs2Product {
  id?: number
  name: string
  price: number
  stock: number
  type: string
  rarity: string
  description?: string | null
  status: Cs2ProductStatus
  shopId?: number | null
  createTime?: string
  updateTime?: string
}

export interface Cs2ProductQueryParams extends PageDomain {
  name?: string
  type?: string
  rarity?: string
  status?: string
  shopId?: number
}
