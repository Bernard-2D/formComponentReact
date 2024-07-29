import { OrderType } from '@/consts'
import fetch from '@/utils/fetch'
import { encrypt } from '@/utils/sm'
import type { OrderParam, PageData, PageParam } from '.'
import { MenuData } from './menu'

export interface QueryListParam {
  createTimeGt?: string
  createTimeLt?: string
  departmentIdEq?: number
  loginNameLike?: string
  phoneLike?: string
  userStatusEq?: number
}

type User = {
  id: number
  username?: string
  loginName?: string
  userStatus: number
  departmentId?: number
  departmentName?: string
  phone?: string
  remark?: string
  email?: string
  password?: string
  createTime?: string
  lastLoginTime?: string
  roleList?: number[]
  userRoleIds?: number[]
  userRoleNames?: string
}

export type Role = { id: number; roleName: string }
export type UserData = Omit<User, 'password'>

export type EditUser = Partial<User>

export function addUser(param: EditUser) {
  if (param.password) {
    param.password = encrypt(param.password)
  }
  return fetch<UserData>('/permission/sysUser/add', param, 'POST')
}

export function batchDeleteUser(userIds: number[]) {
  return fetch('/permission/sysUser/batchDelete', userIds, 'POST')
}

export function editUser(param: EditUser) {
  return fetch<UserData>('/permission/sysUser/edit', param, 'POST')
}

export function getUser(userId: number) {
  return fetch<UserData>(`/permission/sysUser/detail/${userId}`)
}

export function getUserList(param: QueryListParam & PageParam & OrderParam) {
  return fetch<PageData<UserData>>('/permission/sysUser/list', param, 'POST')
}

export function getRoleList() {
  return fetch<Role[]>('/permission/sysUser/selectRoleList')
}

export function importUser(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return fetch('/permission/sysUser/importUser', formData, 'POST', {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function downloadTemplate() {
  return fetch('/permission/sysUser/download', { orderType: OrderType.desc }, 'GET', { responseType: 'blob' })
}

export function exportUser(param: QueryListParam) {
  return fetch('/permission/sysUser/export', { ...param, orderType: OrderType.desc }, 'POST', { responseType: 'blob' })
}

export function addUserRole(param: { userId: number; roles: number[] }) {
  return fetch('/permission/sysUser/managerRoles', param, 'POST')
}

export function resetPassword({
  loginName,
  oldPassword,
  newPassword
}: {
  loginName: string
  oldPassword: string
  newPassword: string
}) {
  return fetch(
    '/permission/sysUser/resetPassword',
    {
      loginName,
      oldPassword: encrypt(oldPassword),
      newPassword: encrypt(newPassword)
    },
    'POST'
  )
}

export function login(username: string, password: string) {
  return fetch(
    '/permission/user/login',
    {
      username,
      password: encrypt(password)
    },
    'POST'
  )
}

export function getUserMenus(system = 0) {
  return fetch<MenuData[]>(`/permission/sysUser/selectMenu/${system}`)
}

export type UserInfo = Required<Pick<UserData, 'email' | 'loginName' | 'username' | 'phone'>>

export function getLoginUser() {
  return fetch<UserInfo>('/permission/sysUser/loginDetail')
}
