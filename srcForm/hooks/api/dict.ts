import {
  deleteDict,
  deleteDictType,
  getDictList,
  getDictTypeList,
  postDict,
  postDictType,
  putDict,
  putDictType,
  QueryListParam,
  QueryTypesParam
} from '@/api/dict'
import { Error } from '@/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useGetDictList(params: QueryTypesParam) {
  return useQuery({
    queryKey: ['getDictList', params],
    queryFn: () => getDictList(params)
  })
}
export function usePostDictType() {
  return useMutation({
    onError: (error: Error) => {
      console.error('error:', error)
      toast.error(`添加失败:${error.msg}`)
    },
    onSuccess: () => {
      toast.success('添加字典类型成功')
    },
    mutationFn: postDictType
  })
}
export function useDeleteDictType() {
  return useMutation({
    onError: (error: Error) => {
      console.error('error:', error)
      toast.error(`删除失败:${error.msg}`)
    },
    onSuccess: () => {
      toast.success('删除字典类型成功')
    },
    mutationFn: deleteDictType
  })
}
export function useGetDictTypeList(params: QueryListParam) {
  return useQuery({
    queryKey: ['getDictTypeList', params],
    queryFn: () => getDictTypeList(params)
  })
}
export function usePutDictType() {
  return useMutation({
    onError: (error: Error) => {
      console.error('error:', error)
      toast.error(`修改失败:${error.msg}`)
    },
    onSuccess: () => {
      toast.success('修改字典类型成功')
    },
    mutationFn: putDictType
  })
}

export function usePostDict() {
  return useMutation({
    onError: (error: Error) => {
      console.error('error:', error)
      toast.error(`添加失败:${error.msg}`)
    },
    onSuccess: () => {
      toast.success('添加字典类型成功')
    },
    mutationFn: postDict
  })
}
export function usePutDict() {
  return useMutation({
    onError: (error: Error) => {
      console.error('error:', error)
      toast.error(`修改失败:${error.msg}`)
    },
    onSuccess: () => {
      toast.success('修改字典类型成功')
    },
    mutationFn: putDict
  })
}
export function useDeleteDict() {
  return useMutation({
    onError: (error: Error) => {
      console.error('error:', error)
      toast.error(`删除失败:${error.msg}`)
    },
    onSuccess: () => {
      toast.success('删除字典类型成功')
    },
    mutationFn: deleteDict
  })
}
