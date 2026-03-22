import request from '@/utils/request'
import type { AjaxResult, TableDataInfo } from '@/types'
import type { Cs2Shop, Cs2ShopQueryParams } from '@/types/api/cs2/shop'

export function listShopOptions(params?: { name?: string }): Promise<AjaxResult<Cs2Shop[]>> {
  return request({
    url: '/cs2/shop/options',
    method: 'get',
    params
  })
}

export function listShop(query: Cs2ShopQueryParams): Promise<TableDataInfo<Cs2Shop>> {
  return request({
    url: '/cs2/shop/list',
    method: 'get',
    params: query
  })
}

export function getShop(id: number): Promise<AjaxResult<Cs2Shop>> {
  return request({
    url: '/cs2/shop/' + id,
    method: 'get'
  })
}
