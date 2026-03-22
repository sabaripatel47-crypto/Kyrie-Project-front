import type { PageDomain } from '../common'

export interface Cs2Shop {
  id?: number
  name: string
  logo?: string | null
  createTime?: string
}

export interface Cs2ShopQueryParams extends PageDomain {
  name?: string
}
