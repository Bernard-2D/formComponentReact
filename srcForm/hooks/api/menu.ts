import { addMenu, deleteMenu, editMenu, getMenuList, MenuData, QueryListParam } from '@/api/menu'
import { Error } from '@/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useGetMenuList(paramFn: () => QueryListParam, cb: (data: MenuData[]) => unknown) {
  return useQuery({
    queryKey: ['getMenuList'],
    queryFn: () => {
      return getMenuList(paramFn()).then(d => {
        const sortData = d.data.sort((a1, a2) => (a1.sortNumber || 0) - (a2.sortNumber || 0))
        cb && cb(sortData)
        return sortData
      })
    }
  })
}

export function useAddMenu() {
  return useMutation({
    onError: (error: Error) => {
      console.error('error:', error)
      toast.error(`新增失败:${error.msg}`)
    },
    onSuccess: () => {
      toast.success('新增菜单成功')
    },
    mutationFn: addMenu
  })
}

export function useEditMenu() {
  return useMutation({
    onError: (error: Error) => {
      console.error('error:', error)
      toast.error(`修改失败:${error.msg}`)
    },
    onSuccess: () => {
      toast.success('修改菜单成功')
    },
    mutationFn: editMenu
  })
}

export function useDeleteMenu() {
  return useMutation({
    onError: (error: Error) => {
      console.error('error:', error)
      toast.error(`删除失败:${error.msg}`)
    },
    onSuccess: () => {
      toast.success('删除菜单成功')
    },
    mutationFn: deleteMenu
  })
}
