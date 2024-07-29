import { DictData } from '@/api/dict'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { usePostDict, usePutDict } from '@/hooks/api/dict'
import { cn } from '@/utils/css'
import { zodResolver } from '@hookform/resolvers/zod'
import { RefetchOptions } from '@tanstack/react-query'
import { useSearch } from '@tanstack/react-router'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  dictLabel: z.string().min(1, { message: '字典标签不能为空' }).max(100, {
    message: '请输入有效字典标签，长度不超过100个字符'
  }),
  dictValue: z.string().min(1, { message: '字典键值不能为空' }).max(100, {
    message: '请输入有效字典键值，长度不超过100个字符'
  }),
  dictType: z.string(),
  dictSort: z.string().min(1, { message: '字典排序不能为空' }).max(10, {
    message: '字典排序不能超过10位'
  }),
  defaulted: z.string().optional(),
  dictStatus: z.string().optional(),
  remark: z
    .string()
    .max(250, {
      message: '备注超长，不能超过250字符'
    })
    .optional()
})

interface RefetchFunction<T> {
  (arg?: RefetchOptions): Promise<T>
}

export default function DetailModal({
  open,
  setOpen,
  data,
  refetch
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  refetch: RefetchFunction<unknown>
  data?: DictData
}) {
  const isEdit = Object.keys(data || {}).length !== 0
  const { dictType } = useSearch({ from: '' })

  const defaultValue: Partial<DictData> = {
    dictLabel: '',
    dictValue: '',
    dictType,
    dictSort: '',
    dictStatus: '0',
    defaulted: '1',
    remark: ''
  }

  const form = useForm({
    defaultValues: defaultValue,
    resolver: zodResolver(formSchema)
  })

  const postDict = usePostDict()
  const putDict = usePutDict()

  useEffect(() => {
    if (isEdit && open) form.reset(valueToString(data))
  }, [data, form, open])

  async function submit(files: Partial<DictData>) {
    if (isEdit) {
      await putDict.mutateAsync({ ...files, id: data?.id })
    } else {
      await postDict.mutateAsync(files)
    }
    refetch()
    cancel()
  }

  function cancel() {
    form.reset(defaultValue)
    setOpen(false)
  }
  function change(open: boolean) {
    if (open) return
    cancel()
  }

  function valueToString(obj: DictData | undefined): Partial<DictData> {
    if (!obj) return defaultValue
    Object.keys(obj).forEach(key => {
      if (obj[key] === null || obj[key] === undefined) {
        obj[key] = ''
      } else {
        obj[key] = String(obj[key])
      }
    })
    return obj
  }

  return (
    <Sheet open={open} onOpenChange={change}>
      <SheetContent className={'w-[440px] py-4'}>
        <SheetHeader>
          <SheetTitle>{isEdit ? '修改' : '添加'}字典</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form className={cn('grid  gap-x-10 gap-y-5 pt-4', 'grid-cols-1')} onSubmit={form.handleSubmit(submit)}>
            <FormField
              control={form.control}
              name="dictLabel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-current  after:ml-0.5 after:text-destructive after:content-['*']">
                    字典标签
                  </FormLabel>
                  <FormControl>
                    <Input className="h-9 text-sm" placeholder="请输入字典标签" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dictValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-current  after:ml-0.5 after:text-destructive after:content-['*']">
                    字典键值
                  </FormLabel>
                  <FormControl>
                    <Input className="h-9 text-sm" placeholder="请输入字典键值" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dictType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-current  after:ml-0.5 after:text-destructive after:content-['*']">
                    字典类型
                  </FormLabel>
                  <FormControl>
                    <Input disabled className="h-9 text-sm" placeholder="请输入字典类型" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dictSort"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-current  after:ml-0.5 after:text-destructive after:content-['*']">
                    字典排序
                  </FormLabel>
                  <FormControl>
                    <Input type="number" min={1} className="h-9 text-sm" placeholder="请输入字典排序" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="defaulted"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-current">系统默认</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex h-9 items-center space-x-2.5 text-sm"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="1" />
                        </FormControl>
                        <FormLabel className="font-normal">是</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="0" />
                        </FormControl>
                        <FormLabel className="font-normal">否</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dictStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-current">数据状态</FormLabel>
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
            <FormField
              control={form.control}
              name="remark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-current">备注：</FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" {...field} placeholder={'请输入备注'} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-x-2.5">
              <Button type="button" variant="outline" className="h-9 text-sm" onClick={cancel}>
                取消
              </Button>
              <Button type="submit" className="h-9 text-sm">
                提交
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
