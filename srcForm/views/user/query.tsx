import { QueryListParam } from '@/api/user'
import DatePicker from '@/components/date-picker'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'

export default function Query(props: { onQuery: (param: QueryListParam) => unknown }) {
  const form = useForm()

  function query() {
    const { createTime, ...rest } = form.getValues()
    const param: QueryListParam = { ...rest }

    if (createTime) {
      if (createTime.from) {
        param.createTimeGt = format(createTime.from, 'yyyy-MM-dd')
      }

      if (createTime.to) {
        param.createTimeLt = format(createTime.to, 'yyyy-MM-dd')
      }
    }

    props.onQuery(param)
  }

  return (
    <Form {...form}>
      <form className="flex shrink-0 flex-wrap gap-2.5" onSubmit={form.handleSubmit(query)}>
        <FormField
          control={form.control}
          name="loginNameLike"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="search"
                  className="h-9 w-60 text-sm"
                  placeholder="请输入登录账号"
                  value={field.value}
                  onChange={e => {
                    field.onChange(e.target.value || undefined)
                    console.log('触发onchange')
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneLike"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="search"
                  className="h-9 w-60 text-sm"
                  placeholder="请输入手机号码"
                  value={field.value}
                  onChange={e => field.onChange(e.target.value || undefined)}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="createTime"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DatePicker className="w-60 " setDate={field.onChange} date={field.value} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="userStatusEq"
          render={({ field }) => (
            <FormItem>
              <Select key={+new Date()} onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-9 w-60 text-sm">
                    <SelectValue placeholder="用户状态" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="0">正常</SelectItem>
                  <SelectItem value="1">停用</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <div className="space-x-4">
          <Button type="submit" variant="outline" size="sm" className="border-primary text-primary">
            查询
          </Button>
          <Button
            type="reset"
            variant="outline"
            size="sm"
            onClick={() => {
              form.reset()
              props.onQuery({})
            }}
          >
            重置
          </Button>
        </div>
      </form>
    </Form>
  )
}
