import { SysData } from '@/api/sys'
import { PasswordInput } from '@/components/password-input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export type Props = {
  systemInfo: Pick<SysData, 'systemName' | 'systemTitle' | 'backgroundImageUrl' | 'webLogo' | 'systemLogo'>
  onLogin: (values: z.infer<typeof formSchema>) => unknown
}

const formSchema = z.object({
  username: z
    .string({
      required_error: '用户名不能为空'
    })
    .min(3, {
      message: '登陆账号不得少于3个字符'
    }),
  password: z
    .string({
      required_error: '密码不能为空'
    })
    .min(3, {
      message: '密码不得少于3个字符'
    })
})

export default function LoginPage({ systemInfo, onLogin }: Props) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: 'Aa123456',
      username: 'superAdmin'
    }
  })

  return (
    <div className="flex h-full flex-col ">
      <header className="flex h-14 items-center bg-white text-lg font-bold">
        <div style={{ backgroundImage: `url(${systemInfo.systemLogo})` }} className="ml-4 mr-2.5 h-8 w-8 bg-contain" />
        {systemInfo.systemName}
      </header>
      <main
        className="flex flex-1 items-center justify-around bg-cover"
        style={{ backgroundImage: `url(${systemInfo.backgroundImageUrl})` }}
      >
        <div className="flex flex-col items-center">
          <header className="text-7 font-bold">{systemInfo.systemName}</header>
          <div
            className="h-[550px] w-[550px] bg-cover p-2.5 text-center text-lg text-minor-1"
            style={{ backgroundImage: `url(${systemInfo.webLogo})` }}
          >
            {systemInfo.systemTitle}
          </div>
        </div>
        <Card className="w-[400px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onLogin)}>
              <CardHeader className="items-center p-10">
                <CardTitle className="flex items-center">
                  <div
                    style={{ backgroundImage: `url(${systemInfo.systemLogo})` }}
                    className="mr-2.5 h-8 w-8 bg-contain"
                  />
                  {systemInfo.systemName}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5 p-10 pt-0">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-slate-700 after:ml-0.5 after:text-red-500 after:content-['*']">
                        用户名
                      </FormLabel>
                      <FormControl>
                        <Input id="name" placeholder="请输入用户名/邮箱" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-slate-700 after:ml-0.5 after:text-red-500 after:content-['*']">
                        身份密码
                      </FormLabel>
                      <FormControl>
                        <PasswordInput id="password" placeholder="请输入密码" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex-col p-10 pt-0">
                <Button type="submit" className="w-full">
                  登录
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </main>
    </div>
  )
}
