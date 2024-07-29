import { DeptData, EditDept } from '@/api/dept'
import { TreeSelect } from '@/components/tree/tree-select'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useAddDept, useEditDept } from '@/hooks/api/dept'
import { cn } from '@/utils/css'
import { phoneReg } from '@/utils/reg'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  parentDepartmentId: z.string().optional(),
  departmentName: z
    .string({
      required_error: '部门名称不能为空'
    })
    .max(100, '请输入有效的部门名称，长度不超过100字符'),
  manager: z.string().max(50, '请输入有效的负责人名称，长度不超过50字符').optional(),
  managerPhone: z
    .string()
    .refine(d => phoneReg.test(d), '请输入有效的11位手机号码')
    .optional(),
  email: z.string().max(100, '请输入有效的邮箱地址，长度不能超50字符').email('请输入有效的邮箱地址').optional(),
  departmentStatus: z.string().optional()
})

export default function Edit({
  data,
  onClose,
  deptDatas,
  onSaveClose
}: {
  onSaveClose: () => void
  onClose: () => unknown
  data?: EditDept
  deptDatas: DeptData[]
}) {
  const addDept = useAddDept()

  const editDept = useEditDept()

  const defData = {
    ...data,
    parentDepartmentId: (data?.parentDepartmentId || '') + '',
    departmentStatus: (data?.departmentStatus || '0') + ''
  }

  ;(Object.keys(defData) as (keyof typeof defData)[]).forEach(key => {
    if (defData[key] === null || defData[key] === '') {
      delete defData[key]
    }
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defData as z.infer<typeof formSchema>
  })

  async function save(values: z.infer<typeof formSchema>) {
    const { parentDepartmentId = '0', departmentStatus = '', ...rest } = values

    const param: EditDept = {
      ...rest,
      parentDepartmentId: +parentDepartmentId,
      departmentStatus: +departmentStatus
    }

    if (data?.id) {
      await editDept.mutateAsync({ ...param, id: data?.id })
    } else {
      await addDept.mutateAsync(param)
    }

    onSaveClose()
  }

  return (
    <Form {...form}>
      <form className={cn('grid  grid-cols-1 gap-x-10 gap-y-5 pt-4')} onSubmit={form.handleSubmit(save)}>
        <FormField
          control={form.control}
          name="parentDepartmentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-current">上级部门</FormLabel>
              <FormControl>
                <TreeSelect
                  defaultValue={field.value ? [field.value] : []}
                  data={deptDatas.map(d => ({
                    ...d,
                    id: d.id + '',
                    parentId: d.parentDepartmentId + '',
                    name: d.departmentName
                  }))}
                  onValueChange={v => field.onChange(v[0] || '')}
                  placeholder="请选择上级部门"
                  className="h-9 text-sm"
                  dirCheck
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="departmentName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-current	 after:ml-0.5 after:text-destructive after:content-['*']">
                部门名称
              </FormLabel>
              <FormControl>
                <Input
                  className="h-9 text-sm"
                  placeholder="请输入部门名称"
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
          name="manager"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-current">负责人</FormLabel>
              <FormControl>
                <Input
                  className="h-9 text-sm"
                  placeholder="请输入负责人"
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
          name="managerPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-current">联系电话</FormLabel>
              <FormControl>
                <Input
                  className="h-9 text-sm"
                  placeholder="请输入联系电话"
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-current">邮箱</FormLabel>
              <FormControl>
                <Input
                  className="h-9 text-sm"
                  placeholder="请输入邮箱"
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
          name="departmentStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-current">部门状态</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex h-9 items-center space-x-2.5 text-sm"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="0" />
                    </FormControl>
                    <FormLabel className="font-normal">正常</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="1" />
                    </FormControl>
                    <FormLabel className="font-normal">停用</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
        <div className="space-x-2.5">
          <Button type="button" variant="outline" className="h-9 text-sm" onClick={() => onClose()}>
            取消
          </Button>
          <Button type="submit" className="h-9 text-sm">
            提交
          </Button>
        </div>
      </form>
    </Form>
  )
}
