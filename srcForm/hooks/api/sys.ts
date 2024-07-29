import { getPermissions } from '@/api/role'
import { addSys, deleteSys, EditSys, editSys, getSys, uploadImage } from '@/api/sys'
import { MenuType } from '@/consts'
import { Error } from '@/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useGetDetail(id?: number) {
  return useQuery({
    queryKey: [id, 'getSys'],
    queryFn: () => {
      const promise = id ? getSys(id) : getPermissions()
      return promise.then(d => {
        if (Array.isArray(d.data)) {
          return {
            permissions: d.data
              .filter(dd => dd.permissionType !== MenuType.button)
              .sort((a1, a2) => (a1.sortNumber || 0) - (a2.sortNumber || 0))
          } as EditSys
        } else {
          return {
            ...d.data,
            permissions: d.data.permissions
              .filter(dd => dd.permissionType !== MenuType.button)
              .sort((a1, a2) => (a1.sortNumber || 0) - (a2.sortNumber || 0))
          } as EditSys
        }
      })
    }
  })
}

export function useAddSys() {
  return useMutation({
    onError: (error: Error) => {
      console.error('error:', error)
      toast.error(`新增失败:${error.msg}`)
    },
    onSuccess: () => {
      toast.success('新增子系统成功')
    },
    mutationFn: addSys
  })
}

export function useEditSys() {
  return useMutation({
    onError: (error: Error) => {
      console.error('error:', error)
      toast.error(`修改失败:${error.msg}`)
    },
    onSuccess: () => {
      toast.success('修改子系统成功')
    },
    mutationFn: editSys
  })
}

export function useDeleteSys() {
  return useMutation({
    onError: (error: Error) => {
      console.error('error:', error)
      toast.error(`删除失败:${error.msg}`)
    },
    onSuccess: () => {
      toast.success('删除子系统成功')
    },
    mutationFn: deleteSys
  })
}

export function useUploadImage() {
  return useMutation({
    onError: (error: Error) => {
      console.error('error:', error)
      toast.error(`上传失败:${error.msg}`)
    },
    onSuccess: () => {
      // toast.success('上传图片成功')
    },
    mutationFn: uploadImage
  })
}
