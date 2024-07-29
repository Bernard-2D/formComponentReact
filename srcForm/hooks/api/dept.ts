import { addDept, deleteDept, DeptData, editDept, getDeptList, QueryListParam } from '@/api/dept'
import { Error } from '@/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useGetDeptList(paramFn: () => QueryListParam, cb?: (data: DeptData[]) => unknown) {
  return useQuery({
    queryKey: ['getDeptList'],
    queryFn: () => {
      return getDeptList(paramFn()).then(d => {
        cb && cb(d.data)
        return d.data
      })
    }
  })
}

export function useAddDept() {
  return useMutation({
    onError: (error: Error) => {
      console.error('error:', error)
      toast.error(`新增失败:${error.msg}`)
    },
    onSuccess: () => {
      toast.success('新增部门成功')
    },
    mutationFn: addDept
  })
}

export function useEditDept() {
  return useMutation({
    onError: (error: Error) => {
      console.error('error:', error)
      toast.error(`修改失败:${error.msg}`)
    },
    onSuccess: () => {
      toast.success('修改部门成功')
    },
    mutationFn: editDept
  })
}

export function useDeleteDept() {
  return useMutation({
    onError: (error: Error) => {
      console.error('error:', error)
      toast.error(`删除失败:${error.msg}`)
    },
    onSuccess: () => {
      toast.success('删除部门成功')
    },
    mutationFn: deleteDept
  })
}
