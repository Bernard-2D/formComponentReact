import { DictTypeData } from '@/api/dict'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { usePostDictType, usePutDictType } from '@/hooks/api/dict'
import { cn } from '@/utils/css'
import { zodResolver } from '@hookform/resolvers/zod'
import { RefetchOptions } from '@tanstack/react-query'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  dictName: z.string().min(1, { message: '字典名称不能为空' }).max(100, {
    message: '请输入有效字典名称，长度不超过100个字符'
  }),
  dictType: z.string().min(1, { message: '字典类型不能为空' }).max(100, {
    message: '请输入有效字典类型，长度不超过100个字符'
  }),
  status: z.string().optional(),
  remark: z
    .string()
    .max(250, {
      message: '备注超长，不能超过250字符'
    })
    .optional()
})

const defaultValue: Partial<DictTypeData> = {
  dictName: '',
  dictType: '',
  remark: '',
  status: '0'
}
interface RefetchFunction<T> {
  (arg?: RefetchOptions): Promise<T>
}

export default function Modal({
  open,
  setOpen,
  data,
  refetch
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  refetch: RefetchFunction<unknown>
  data?: DictTypeData
}) {
  const isEdit = Object.keys(data || {}).length !== 0

  const form = useForm({
    defaultValues: defaultValue,
    resolver: zodResolver(formSchema)
  })

  const postDictType = usePostDictType()
  const putDictType = usePutDictType()

  useEffect(() => {
    if (isEdit && open) form.reset({ ...data, remark: data?.remark || undefined, status: String(data?.status) })
  }, [data, form, open])

  async function submit(files: Partial<DictTypeData>) {
    // console.log('files', files)

    if (isEdit) {
      await putDictType.mutateAsync({ ...files, id: data?.id })
    } else {
      await postDictType.mutateAsync(files)
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

  return (
    <Sheet open={open} onOpenChange={change}>
      <SheetContent className={'w-106 py-4'}>
        <SheetHeader>
          <SheetTitle>{isEdit ? '修改' : '添加'}字典类型</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form className={cn('grid  gap-x-10 gap-y-5 pt-4', 'grid-cols-1')} onSubmit={form.handleSubmit(submit)}>
            <FormField
              control={form.control}
              name="dictName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" text-current	 after:ml-0.5 after:text-destructive after:content-['*']">
                    字典名称
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-9 text-sm"
                      placeholder="请输入字典名称"
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
              name="dictType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-current	 after:ml-0.5 after:text-destructive after:content-['*']">
                    字典类型
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-9 text-sm"
                      placeholder="请输入字典类型"
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
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-current">字典状态</FormLabel>
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
                    <Textarea
                      className="resize-none"
                      value={field.value}
                      onChange={e => field.onChange(e.target.value || undefined)}
                      placeholder={'请输入备注'}
                    />
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
