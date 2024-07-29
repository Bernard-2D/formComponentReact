import { DeptData } from '@/api/dept'
import { EditUser, Role, UserData } from '@/api/user'
import { MultiSelect } from '@/components/multi-select'
import { PasswordInput } from '@/components/password-input'
import { TreeSelect } from '@/components/tree/tree-select'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
// import ZodForm, { AutoFormSubmit } from '@/components/zodForm'
import { Status } from '@/consts'
import { useAddUser, useEditUser, useGetRoleList, useGetUserDetail } from '@/hooks/api/user'
import { cn } from '@/utils/css'
import { passwordReg, phoneReg } from '@/utils/reg'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
interface Props {
  onSaveClose: () => unknown
  onClose: () => unknown
  data?: UserData
  deptDatas: DeptData[]
  departmentId: number
}

function EditForm(props: Omit<Props, 'data' | 'departmentId'> & { initData: EditUser; roleList: Role[] }) {
  const { initData, onClose, onSaveClose, deptDatas, roleList } = props
  const addUser = useAddUser()
  const editUser = useEditUser()

  const isEdit = !!initData.id

  const formSchema = z.object({
    username: z
      .string({
        required_error: '用户名称不能为空'
      })
      .min(2, '请输入有效的用户名，长度为2到16个字符')
      .max(16, '请输入有效的用户名，长度为2到16个字符'),
    loginName: z
      .string({
        required_error: '登陆账号不能为空'
      })
      .min(3, '请输入有效的登录账号，长度为3到16个字符')
      .max(16, '请输入有效的登录账号，长度为3到16个字符'),
    userStatus: z.nativeEnum(Status),
    departmentId: z.string({
      required_error: '归属部门不能为空'
    }),
    roleList: z.string().array().optional(),
    remark: z.string().max(250, '备注不能超过250字符').optional(),
    email: z.string().email('格式不正确').max(50, '邮箱长度不能超过50字符').optional(),
    phone: z
      .string()
      .refine(d => phoneReg.test(d), '请输入有效的11位手机号码')
      .optional(),
    password: isEdit
      ? z.string().optional()
      : z
          .string({
            required_error: '密码不能为空'
          })
          .min(8, '请输入有效的密码，长度8-50个字符')
          .max(50, '请输入有效的密码，长度8-50个字符')
          .refine(d => passwordReg.test(d), '密码必须包含字母、数字、特殊字符')
  })

  const buildFormInitData = () => {
    const { departmentId, roleList, userRoleIds, ...rest } = initData
    const data: Partial<z.infer<typeof formSchema>> = { ...rest }

    ;(Object.keys(data) as (keyof typeof data)[]).forEach(key => {
      if (data[key] === null || data[key] === '') {
        data[key] = undefined
      }
    })

    if (departmentId) {
      data.departmentId = departmentId + ''
    }

    if (roleList) {
      data.roleList = roleList.map(d => d + '')
    }
    if (userRoleIds) {
      data.roleList = userRoleIds.map(d => d + '')
    }

    return data
  }

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: buildFormInitData()
  })

  async function save(values: Partial<z.infer<typeof formSchema>>) {
    const { departmentId, roleList, ...rest } = values
    const user: EditUser = { ...rest }
    if (departmentId) {
      user.departmentId = +departmentId
    }
    if (roleList) {
      user.roleList = roleList.map(d => +d)
    }
    if (isEdit) {
      user.id = initData.id
      await editUser.mutateAsync(user)
    } else {
      await addUser.mutateAsync(user)
    }
    onSaveClose()
  }

  return (
    <div>
      <Form {...form}>
        <form className={cn('grid  grid-cols-2 gap-x-10 gap-y-5 pt-4')} onSubmit={form.handleSubmit(save)}>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-current	 after:ml-0.5 after:text-destructive after:content-['*']">
                  用户姓名
                </FormLabel>
                <FormControl>
                  <Input className="h-9 text-sm" placeholder="请输入用户姓名" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="departmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-current	 after:ml-0.5 after:text-destructive after:content-['*']">
                  归属部门
                </FormLabel>
                <FormControl>
                  <TreeSelect
                    defaultValue={field.value ? [field.value] : []}
                    data={deptDatas.map(d => ({
                      ...d,
                      id: d.id + '',
                      parentId: d.parentDepartmentId + '',
                      name: d.departmentName
                    }))}
                    onValueChange={v => field.onChange(v[0] || undefined)}
                    placeholder="请选择归属部门"
                    className="h-9 text-sm"
                    dirCheck
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-current">手机号码</FormLabel>
                <FormControl>
                  <Input
                    className="h-9 text-sm"
                    placeholder="请输入手机号码"
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
            name="loginName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-current	 after:ml-0.5 after:text-destructive after:content-['*']">
                  登录账号
                </FormLabel>
                <FormControl>
                  <Input disabled={isEdit} className="h-9 text-sm" placeholder="请输入登录账号" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!isEdit ? (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-current	 after:ml-0.5 after:text-destructive after:content-['*']">
                    登录密码
                  </FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="请输入登录密码" {...field}></PasswordInput>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}
          <FormField
            control={form.control}
            name="roleList"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-current">角色</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={roleList.map(d => ({ label: d.roleName, value: d.id + '' }))}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    placeholder="请选择"
                    maxCount={1}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-current">用户状态</FormLabel>
                <FormControl>
                  <div className="flex h-9 items-center gap-2">
                    <Switch
                      checked={field.value === Status.enable}
                      onCheckedChange={(d: boolean) => field.onChange(d ? Status.enable : Status.disable)}
                    />
                    启用
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="remark"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="text-current">备注：</FormLabel>
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
      {/* <ZodForm
        formSchema={formSchema}
        fieldConfig={{
          username: {
            inputProps: {
              type: 'string',
              placeholder: '请在zodForm输入姓名'
            }
          }
        }}
      /> */}
    </div>
  )
}

export default function Edit(props: Props) {
  const { data, departmentId, ...rest } = props

  const { data: roleList } = useGetRoleList()

  const { data: initData } = useGetUserDetail(
    { userStatus: Status.enable, departmentId: departmentId } as UserData,
    data?.id
  )

  return initData && roleList && <EditForm initData={initData} {...rest} roleList={roleList} />
}
