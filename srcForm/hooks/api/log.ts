import { QueryLogParam, QueryParam, deleteLoginLog, deleteOpLog, exportOpLog, getLoginLogs, getOpLogs } from '@/api/log'
import { Error } from '@/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useGetLoginLogs(params: QueryParam) {
  return useQuery({
    queryKey: ['getLoginLogs', params],
    queryFn: () => getLoginLogs(params)
  })
}

export function useDeleteLoginLog() {
  return useMutation({
    onError: (error: Error) => {
      console.error('error:', error)
      toast.error(`删除失败:${error.msg}`)
    },
    onSuccess: () => {
      toast.success('删除字典类型成功')
    },
    mutationFn: deleteLoginLog
  })
}

export function useGetOpLogs(params: QueryLogParam) {
  return useQuery({
    queryKey: ['getOpLogs', params],
    queryFn: () => getOpLogs(params)
  })
}

export function useDeleteOpLog() {
  return useMutation({
    onError: (error: Error) => {
      console.error('error:', error)
      toast.error(`删除失败:${error.msg}`)
    },
    onSuccess: () => {
      toast.success('删除字典类型成功')
    },
    mutationFn: deleteOpLog
  })
}

export const useExportOpLog = () => {
  return useMutation({
    onError: (error: Error) => {
      console.error('error:', error)
      toast.error(`导出失败:${error.msg}`)
    },
    onSuccess: () => {
      toast.success('导出成功')
    },
    mutationFn: exportOpLog
  })
}
