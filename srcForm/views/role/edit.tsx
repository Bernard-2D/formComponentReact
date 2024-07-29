import { RoleData, addRole, editRole, getPermissions, getRoleDetail } from '@/api/role'
import { Tree } from '@/components/tree'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Status } from '@/consts'
import { cn } from '@/utils/css'
import { Result } from '@/utils/fetch'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
  roleName: z
    .string({
      required_error: '角色名称不能为空'
    })
    .max(200, '请输入有效的角色名称，长度不超过200个字符'),
  roleStatus: z.nativeEnum(Status),
  remark: z.string().max(250, '备注不能超过250字符').optional()
})

export default function Edit(props: { onClose: () => unknown; data?: RoleData; onSaveClose: () => void }) {
  const { data, onClose, onSaveClose } = props
  const { id, ...rest } =
    data ||
    ({
      roleStatus: Status.enable
    } as RoleData)
  const [initData, setInitData] = useState(rest)
  const [permissionIds, setPermissionIds] = useState<number[]>([])
  const [expandAll, setExpandAll] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    values: initData
  })

  const { isPending, data: permissions } = useQuery({
    queryKey: [id, 'getRoleDetail'],
    queryFn: () => {
      const promise = id ? getRoleDetail(id) : getPermissions()
      return promise.then(d => {
        if (Array.isArray(d.data)) {
          return d.data
        } else {
          setInitData({ ...initData, remark: d.data.remark })
          return d.data.permissions
        }
      })
    }
  })

  function onSave(values: z.infer<typeof formSchema>) {
    const param = values
    let promise: Promise<Result<unknown>>

    if (id) {
      promise = editRole({ ...param, id, permissionList: permissionIds })
    } else {
      promise = addRole({ ...param, permissionList: permissionIds })
    }

    promise
      .then(result => {
        if (result.success) {
          toast.success('保存成功')
          onSaveClose()
        } else {
          toast.error(result.message)
        }
      })
      .catch(d => {
        toast.error(d.message || d.msg)
      })
  }

  useEffect(() => {
    if (permissions) {
      setPermissionIds(permissions.filter(d => d.hasPermission).map(d => d.permissionId))
    }
  }, [permissions])

  return (
    !isPending && (
      <Form {...form}>
        <form className={cn('grid  grid-cols-2 gap-x-10 gap-y-5 pt-4')} onSubmit={form.handleSubmit(onSave)}>
          <FormField
            control={form.control}
            name="roleName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-current	 after:ml-0.5 after:text-destructive after:content-['*']">
                  角色名称
                </FormLabel>
                <FormControl>
                  <Input
                    className="h-9 text-sm"
                    placeholder="请输入角色名称"
                    value={field.value}
                    onChange={e => field.onChange(e.target.value || undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="roleStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-current">角色状态</FormLabel>
                <FormControl>
                  <div className="flex h-9 items-center gap-2">
                    <Switch
                      checked={field.value === Status.enable}
                      onCheckedChange={(d: boolean) => field.onChange(d ? Status.enable : Status.disable)}
                    />
                    启用
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="remark"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="text-current">备注</FormLabel>
                <FormControl>
                  <Textarea
                    className="resize-none"
                    value={field.value}
                    onChange={e => field.onChange(e.target.value || undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="permissionList"
            render={() => (
              <FormItem className="col-span-2">
                <FormLabel className="text-current">
                  菜单权限
                  <Button type="button" variant="link" onClick={() => setExpandAll(!expandAll)}>
                    展开/折叠
                  </Button>
                </FormLabel>
                <FormControl>
                  {permissions && (
                    <Tree
                      initialSlelectedItemIds={permissions.filter(d => d.hasPermission).map(d => d.permissionId + '')}
                      onSelectChange={d => setPermissionIds(d.map(dd => +dd))}
                      multiple
                      data={
                        permissions?.map(d => ({
                          ...d,
                          id: d.permissionId + '',
                          parentId: d.parentId + '',
                          name: d.permissionName
                        })) || []
                      }
                      expandAll={expandAll}
                      className="h-80 overflow-auto rounded-md border"
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {
            <div className="space-x-2.5">
              <Button type="button" variant="outline" className="h-9 text-sm" onClick={() => onClose()}>
                取消
              </Button>
              <Button type="submit" className="h-9 text-sm">
                提交
              </Button>
            </div>
          }
        </form>
      </Form>
    )
  )
}
