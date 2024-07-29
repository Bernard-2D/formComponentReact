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
      operationIp: rest.operationIp,
      title: rest.title,
      operator: rest.operator,
      operationStatus: rest.operationStatus || '',
      businessType: rest.businessType || '',
      beginTime,
      endTime
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
            name="operationIp"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="search"
                    maxLength={15}
                    placeholder="请输入操作地址"
                    className="w-60 "
                    value={field.value}
                    onChange={e => field.onChange(e.target.value || undefined)}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    maxLength={10}
                    placeholder="请输入系统模块"
                    className="w-60 "
                    value={field.value}
                    onChange={e => field.onChange(e.target.value || undefined)}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="operator"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="search"
                    maxLength={10}
                    placeholder="请输入操作人员"
                    className="w-60 "
                    value={field.value}
                    onChange={e => field.onChange(e.target.value || undefined)}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="businessType"
            render={({ field }) => (
              <FormItem>
                <Select key={+new Date()} onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-60 ">
                    <SelectValue placeholder="请选择操作类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="新增">新增</SelectItem>
                    <SelectItem value="修改">修改</SelectItem>
                    <SelectItem value="删除">删除</SelectItem>
                    <SelectItem value="查询">查询</SelectItem>
                    <SelectItem value="导入">导入</SelectItem>
                    <SelectItem value="导出">导出</SelectItem>
                    <SelectItem value="下载">下载</SelectItem>
                    <SelectItem value="其他">其他</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="operationStatus"
            render={({ field }) => (
              <FormItem>
                <Select key={+new Date()} onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-60 ">
                    <SelectValue placeholder="请选择操作状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">成功</SelectItem>
                    <SelectItem value="1">失败</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <DatePicker className="w-60 " setDate={field.onChange} date={field.value} />
                </FormControl>
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
