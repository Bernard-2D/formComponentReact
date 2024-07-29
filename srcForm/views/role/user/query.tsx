import { QueryUserListParam } from '@/api/role'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'

export default function Query({ onQuery }: { onQuery: (param: Partial<QueryUserListParam>) => unknown }) {
  const form = useForm()

  function query() {
    const { ...rest } = form.getValues()
    const param: Partial<QueryUserListParam> = { ...rest }
    onQuery(param)
  }

  return (
    <Form {...form}>
      <form className="flex shrink-0 flex-wrap gap-2.5" onSubmit={form.handleSubmit(query)}>
        <FormField
          control={form.control}
          name="loginName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="search"
                  className="h-9 w-60 text-sm"
                  placeholder="请输入登录账号"
                  value={field.value}
                  onChange={e => field.onChange(e.target.value || undefined)}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
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

        <div className="space-x-4">
          <Button type="submit" variant="outline" size="sm" className="border-primary text-primary">
            查询
          </Button>
          <Button type="reset" variant="outline" size="sm" onClick={() => form.reset()}>
            重置
          </Button>
        </div>
      </form>
    </Form>
  )
}
