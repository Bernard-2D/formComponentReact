import DatePicker from '@/components/date-picker'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'

export default function Head({
  head: { setParams, reset }
}: {
  head: {
    setParams: (params: Record<string, unknown>) => void
    reset: () => void
  }
}) {
  const form = useForm()

  // 查询
  function search() {
    const { ...rest } = form.getValues()
    const beginTime = rest?.date?.from && format(rest.date.from, 'yyyy-MM-dd')
    const endTime = rest?.date?.to && format(rest.date.to, 'yyyy-MM-dd')
    const param = {
      beginTime,
      endTime,
      dictName: rest.dictName,
      dictType: rest.dictType,
      status: rest.status || ''
    }
    setParams(param)
  }

  function resetParam() {
    form.reset()
    reset()
  }

  return (
    <div className="mb-4">
      <Form {...form}>
        <form className="align-center flex flex-wrap gap-2.5" onSubmit={form.handleSubmit(search)}>
          <FormField
            control={form.control}
            name="dictName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="search"
                    maxLength={10}
                    placeholder="请输入字典名称"
                    className="w-60"
                    value={field.value}
                    onChange={e => field.onChange(e.target.value || undefined)}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dictType"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    maxLength={10}
                    placeholder="请输入字典类型"
                    className="w-60"
                    value={field.value}
                    onChange={e => field.onChange(e.target.value || undefined)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <DatePicker className="w-60" setDate={field.onChange} date={field.value} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <Select key={+new Date()} onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-60">
                    <SelectValue placeholder="请选择字典状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">正常</SelectItem>
                    <SelectItem value="1">停用</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <div className="space-x-4">
            <Button type="submit" variant="outline" className="border-primary text-primary">
              查询
            </Button>
            <Button type="reset" variant="outline" onClick={resetParam}>
              重置
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
