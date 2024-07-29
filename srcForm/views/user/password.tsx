import { UserData } from '@/api/user'
import { PasswordInput } from '@/components/password-input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useResetPassword } from '@/hooks/api/user'

import { cn } from '@/utils/css'
import { passwordReg } from '@/utils/reg'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

interface Props {
  onSaveClose: () => unknown
  onClose: () => unknown
  data: UserData
}

function getPwdValidate(title: string) {
  return z
    .string({
      required_error: `${title}不能为空`
    })
    .min(8, '密码不得少于8个字符')
    .max(50, '密码不得超过50个字符')
    .refine(d => passwordReg.test(d), `${title}必须包含字母、数字、特殊字符`)
}

const formSchema = z.object({
  username: z.string().optional(),
  oldPassword: z.string({ required_error: '原密码不能为空' }),
  newPassword: getPwdValidate('新密码'),
  confirmPassword: getPwdValidate('确认密码')
})

export default function Password(props: Props) {
  const { onClose, onSaveClose, data } = props
  const resetPwd = useResetPassword()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  })

  async function save(values: z.infer<typeof formSchema>) {
    const { oldPassword, newPassword, confirmPassword } = values
    if (confirmPassword !== newPassword) {
      toast.error('确认密码和新密码不一致')
      return
    }

    await resetPwd.mutateAsync({
      loginName: data.loginName || '',
      oldPassword,
      newPassword
    })

    onSaveClose()
  }

  return (
    <Form {...form}>
      <form className={cn('grid  gap-y-5 pt-4')} onSubmit={form.handleSubmit(save)}>
        <FormField
          control={form.control}
          name="username"
          render={() => (
            <FormItem>
              <FormLabel className="text-current	 after:ml-0.5 after:text-destructive after:content-['*']">
                登陆账号
              </FormLabel>
              <FormControl>
                <Input className="h-9 text-sm" disabled value={data.loginName!} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-current	 after:ml-0.5 after:text-destructive after:content-['*']">
                原密码
              </FormLabel>
              <FormControl>
                <PasswordInput placeholder="请输入原密码" {...field}></PasswordInput>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-current	 after:ml-0.5 after:text-destructive after:content-['*']">
                新密码
              </FormLabel>
              <FormControl>
                <PasswordInput placeholder="请输入新密码" {...field}></PasswordInput>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-current	 after:ml-0.5 after:text-destructive after:content-['*']">
                确认密码
              </FormLabel>
              <FormControl>
                <PasswordInput placeholder="请输入确认密码" {...field}></PasswordInput>
              </FormControl>
              <FormMessage />
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
