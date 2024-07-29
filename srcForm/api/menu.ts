import fetch from '@/utils/fetch'
export interface QueryListParam {
  permissionNameLike?: string
  showStatusEq?: string
}
interface Menu {
  id: number
  icon: string
  interfaceIdentity: string
  parentId: number
  permissionName: string
  permissionType: number
  routeUrl: string
  showStatus: number
  sortNumber: number
}

export type MenuData = Omit<Menu, ''>

export type EditMenu = Partial<Menu>

export function getMenuList(param: QueryListParam = {}) {
  return fetch<MenuData[]>('/permission/sysPermission/list', param, 'POST')
}

export function addMenu(param: EditMenu) {
  return fetch('/permission/sysPermission/add', param, 'POST')
}

export function editMenu(param: EditMenu) {
  return fetch('/permission/sysPermission/edit', param, 'POST')
}

export function deleteMenu(id: number) {
  return fetch(`/permission/sysPermission/delete/${id}`, undefined, 'DELETE')
}
