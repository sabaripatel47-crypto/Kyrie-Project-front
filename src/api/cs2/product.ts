import request from '@/utils/request'
import type { AjaxResult, TableDataInfo } from '@/types'
import type { Cs2Product, Cs2ProductQueryParams } from '@/types/api/cs2/product'

export function listProduct(query: Cs2ProductQueryParams): Promise<TableDataInfo<Cs2Product>> {
  return request({
    url: '/cs2/product/list',
    method: 'get',
    params: query
  })
}

export function getProduct(id: number): Promise<AjaxResult<Cs2Product>> {
  return request({
    url: '/cs2/product/' + id,
    method: 'get'
  })
}

export function addProduct(data: Cs2Product): Promise<AjaxResult> {
  return request({
    url: '/cs2/product',
    method: 'post',
    data
  })
}

export function updateProduct(data: Cs2Product): Promise<AjaxResult> {
  return request({
    url: '/cs2/product',
    method: 'put',
    data
  })
}

export function delProduct(ids: number | number[]): Promise<AjaxResult> {
  return request({
    url: '/cs2/product/' + ids,
    method: 'delete'
  })
}

export function changeProductShop(data: { id: number; shopId: number }): Promise<AjaxResult> {
  return request({
    url: '/cs2/product/changeShop',
    method: 'put',
    data
  })
}
