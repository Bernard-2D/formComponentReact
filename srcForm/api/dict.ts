import { PageParam } from '@/types'
import fetch from '@/utils/fetch'

import { PageData } from '.'
// ---------------------------------------类型列表页-----------------------------------//
export interface QueryTypesParam extends PageParam {
  beginTime?: string
  endTime?: string
  dictName?: string
  dictType?: string
  status?: string

  [key: string]: unknown
}
export interface DictTypeData {
  id: string // id
  createTime: string // 创建时间
  dictName: string // 字典名称
  dictType: string // 字典类型
  remark: string // 备注
  status: string // 状态（0正常 1停用）
  systemCode: string // 系统编码

  [key: string]: string // 字符串索引签名
}
export function getDictList(param: QueryTypesParam) {
  return fetch<PageData<DictTypeData>>('/permission/sysDictionaryType/list', param)
}

export function postDictType(data: Partial<DictTypeData>) {
  return fetch('/permission/sysDictionaryType/add', data, 'POST')
}

export function putDictType(data: Partial<DictTypeData>) {
  return fetch('/permission/sysDictionaryType/edit', data, 'PUT')
}

export function deleteDictType(ids: string[]) {
  return fetch('/permission/sysDictionaryType/delete', { ids }, 'DELETE')
}

// ---------------------------------------类型详情页-----------------------------------//
export interface QueryListParam {
  dictionaryType?: string
  [key: string]: unknown
}

export interface DictData {
  id: string // id
  createTime: string // 创建时间 (string, date-time)
  defaulted: string // 1: 默认, 0: 非默认 (integer, int32)
  dictLabel: string // 字典标签 (string)
  dictSort: string // 字典排序 (integer, int32)
  dictType: string // 字典类型 (string)
  dictValue: string // 字典键值 (string)
  dictStatus: string
  remark: string
  [key: string]: string // 字符串索引签名
}
export function getDictTypeList(params: QueryListParam) {
  return fetch<DictData[]>(`/permission/sysDictionary/dictionaryType/${params.dictionaryType}`)
}

export function postDict(data: Partial<DictData>) {
  return fetch('/permission/sysDictionary/add', data, 'POST')
}

export function putDict(data: Partial<DictData>) {
  return fetch('/permission/sysDictionary/edit', data, 'PUT')
}

export function deleteDict(ids: string[]) {
  return fetch('/permission/sysDictionary/delete', { ids }, 'DELETE')
}
