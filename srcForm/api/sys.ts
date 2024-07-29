import fetch from '@/utils/fetch'
import { OrderParam, PageData, PageParam } from '.'
import { Permission } from './role'

interface Sys {
  id: number
  backgroundImageUrl: string
  permissionList: number[]
  permissions: Permission[]
  systemLogo: string
  systemName: string
  systemTitle: string
  systemType: number
  webLogo: string
  createTime: string
}

export type SysData = Omit<Sys, ''>

export type EditSys = Partial<Sys>

export function getSysList(param: PageParam & OrderParam) {
  return fetch<PageData<SysData>>('/permission/sysInfo/list', param, 'POST')
}

export function getSys(id: number) {
  return fetch<SysData>(`/permission/sysInfo/details/${id}`)
}

export function getNoLoginSys(id: number) {
  return fetch<SysData>(`/permission/sysInfo/detail/${id}`)
}

export function addSys(param: EditSys) {
  return fetch('/permission/sysInfo/add', param, 'POST')
}

export function editSys(param: EditSys) {
  return fetch('/permission/sysInfo/edit', param, 'POST')
}

export function deleteSys(ids: number[]) {
  return fetch('/permission/sysInfo/batchDelete', { ids }, 'POST')
}

export type ImageData = { imageUrl: string; showUrl: string }

export function uploadImage(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return fetch<ImageData>('/permission/sysInfo/uploadImage', formData, 'POST', {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
