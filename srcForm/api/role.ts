import fetch from '@/utils/fetch'
import type { OrderParam, PageData, PageParam } from '.'
import { UserData } from './user'

export interface QueryListParam {
  createTimeGt?: string 
  createTimeLt?: string
  roleNameLike?: string
  orderType?: string
  roleStatusEq?: number
}

type Role = {
  id: number
  roleName: string
  roleStatus: number
  remark?: string
  createTime?: string
  permissionList?: number[]
  permissions?: Permission[]
}

export type Permission = {
  hasPermission: boolean
  parentId: number
  permissionId: number
  permissionName: string
  permissionType: number
  sortNumber: number
  systemId: number
  systemName: string
}

export type RoleData = Omit<Role, ''>

export type AddRole = Omit<Role, 'id'>

export type EditRole = Omit<Role, ''>

export function addRole(param: AddRole) {
  return fetch('/permission/sysRole/add', param, 'POST')
}

export function deleteRole(roleIds: number[]) {
  return fetch('/permission/sysRole/batchDelete', roleIds, 'POST')
}

export function editRole(param: EditRole) {
  return fetch('/permission/sysRole/edit', param, 'POST')
}

export function getRoleList(param: QueryListParam & PageParam & OrderParam) {
  return fetch<PageData<RoleData>>('/permission/sysRole/list', param, 'POST')
}

export function getRoleDetail(roleId: number) {
  return fetch<RoleData>(`/permission/sysRole/detail/${roleId}`)
}

export function getPermissions() {
  return fetch<Permission[]>('/permission/sysRole/permissionList')
}

export function addRoleUser(roleId: number, userIds: number[]) {
  return fetch('/permission/sysRole/addUserRole', { roleId, userIds }, 'POST')
}

export function deleteRoleUser(roleId: number, userIds: number[]) {
  return fetch(`/permission/sysRole/deleteUserRole`, { roleId, userIds }, 'POST')
}

export interface QueryUserListParam {
  loginName?: string
  orderType?: string
  phone?: string
  roleId?: number
}

export function getRoleUserList(param: QueryUserListParam & PageParam & OrderParam) {
  return fetch<PageData<UserData>>('/permission/sysRole/selectUser', param, 'POST')
}

export function getNoRoleUserList(param: QueryUserListParam & PageParam & OrderParam) {
  return fetch<PageData<UserData>>('/permission/sysRole/selectUserForAdd', param, 'POST')
}
