import { getUserDeptList } from '@/api/dept'
import {
  addUser,
  addUserRole,
  batchDeleteUser,
  downloadTemplate,
  editUser,
  exportUser,
  getRoleList,
  getUser,
  getUserMenus,
  importUser,
  resetPassword,
  UserData
} from '@/api/user'
import { Error } from '@/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useGetUserMenus(systemId?: string) {
  return useQuery({
    queryKey: ['getMenuList', systemId],
    queryFn: () =>
      getUserMenus(systemId ? +systemId : undefined).then(d =>
        d.data.sort((a1, a2) => (a1.sortNumber || 0) - (a2.sortNumber || 0))
      )
  })
}

export function useGetUserDeptList() {
  return useQuery({
    queryKey: ['getUserDeptList'],
    queryFn: () => getUserDeptList().then(d => d.data)
  })
}

export function useGetRoleList() {
  return useQuery({
    queryKey: ['getRoleList'],
    queryFn: () => getRoleList().then(d => d.data || [])
  })
}

export function useGetUserDetail(defUser: UserData, id?: number) {
  return useQuery({
    queryKey: ['getUser', id],
    queryFn: () => (id ? getUser(id).then(d => ({ ...d.data, id }) as UserData) : Promise.resolve(defUser))
  })
}

export function useAddUser() {
  return useMutation({
    onError: (error: Error) => {
      console.error('error:', error)
      toast.error(`新增失败:${error.msg}`)
    },
    onSuccess: () => {
      toast.success('新增用户成功')
    },
    mutationFn: addUser
  })
}

export function useEditUser() {
  return useMutation({
    onError: (error: Error) => {
      console.error('error:', error)
      toast.error(`修改失败:${error.msg}`)
    },
    onSuccess: () => {
      toast.success('修改用户成功')
    },
    mutationFn: editUser
  })
}

export function useDeleteUser() {
  return useMutation({
    onError: (error: Error) => {
      console.error('error:', error)
      toast.error(`删除失败:${error.msg}`)
    },
    onSuccess: () => {
      toast.success('删除用户成功')
    },
    mutationFn: batchDeleteUser
  })
}

export function useImportUser() {
  return useMutation({
    onError: (error: Error) => {
      console.error('error:', error)
      toast.error(`导入失败:${error.msg}`)
    },
    onSuccess: () => {
      toast.success('导入用户成功')
    },
    mutationFn: importUser
  })
}

export function useExportUser() {
  return useMutation({
    onError: (error: Error) => {
      console.error('error:', error)
      toast.error(`导出失败:${error.msg}`)
    },
    onSuccess: () => {
      toast.success('导出用户成功')
    },
    mutationFn: exportUser
  })
}

export function useResetPassword() {
  return useMutation({
    onError: (error: Error) => {
      console.error('error:', error)
      toast.error(`修改密码失败:${error.msg}`)
    },
    onSuccess: () => {
      toast.success('修改密码成功')
    },
    mutationFn: resetPassword
  })
}

export function useAddUserRole() {
  return useMutation({
    onError: (error: Error) => {
      console.error('error:', error)
      toast.error(`变更用户角色失败:${error.msg}`)
    },
    onSuccess: () => {
      toast.success('变更用户角色成功')
    },
    mutationFn: addUserRole
  })
}

export function useDownloadTemplate() {
  return useMutation({
    onError: (error: Error) => {
      console.error('error:', error)
      toast.error(`下载模板失败:${error.msg}`)
    },
    onSuccess: () => {
      toast.success('下载模板成功')
    },
    mutationFn: downloadTemplate
  })
}
