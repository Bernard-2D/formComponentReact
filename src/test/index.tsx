const schema = {
  type: 'object',
  displayType: 'row', // row column
  formType: 'editForm', // editForm searchForm
  column: 2, // 1 2
  properties: [
    {
      name: 'username',
      label: '用户姓名',
      type: 'Input',
      props: {
        placeholder: '请输入用户姓名',
        required: true
      }
    },
    {
      name: 'departmentId',
      label: '归属部门',
      type: 'TreeSelect',
      props: {
        placeholder: '请选择归属部门',
        defaultValue: [],
        data: deptDatas.map(d => ({
          ...d,
          id: d.id + '',
          parentId: d.parentDepartmentId + '',
          name: d.departmentName
        })),
        dirCheck: true
      }
    },
    {
      name: 'phone',
      label: '手机号码',
      type: 'Input',
      props: {
        placeholder: '请输入手机号码'
      }
    },
    {
      name: 'email',
      label: '邮箱',
      type: 'Input',
      props: {
        placeholder: '请输入邮箱'
      }
    },
    {
      name: 'loginName',
      label: '登录账号',
      type: 'Input',
      props: {
        placeholder: '请输入登录账号',
        required: true,
        disabled: false
      }
    },
    // {
    //   name: 'password',
    //   label: '登录密码',
    //   type: 'PasswordInput',
    //   props: {
    //     placeholder: '请输入登录密码',
    //
    //   }
    // },
    {
      name: 'roleList',
      label: '角色',
      type: 'MultiSelect',
      props: {
        placeholder: '请选择角色',

        options: roleList.map(d => ({ label: d.roleName, value: d.id + '' })),
        maxCount: 1
      }
    },
    {
      name: 'userStatus',
      label: '用户状态',
      type: 'Switch',
      props: {
        status: Status
      }
    },
    {
      name: 'remark',
      label: '备注',
      type: 'Textarea',
      props: {
        placeholder: '',

        span: 2
      }
    }
  ]
}

const formSchema = z.object({
  username: z
    .string({
      required_error: '用户名称不能为空'
    })
    .min(2, '请输入有效的用户名，长度为2到16个字符')
    .max(16, '请输入有效的用户名，长度为2到16个字符'),
  departmentId: z
    .string({
      required_error: '归属部门不能为空'
    })
    .optional(),
  phone: z
    .string()
    .refine(d => phoneReg.test(d), '请输入有效的11位手机号码')
    .optional(),
  email: z.string().email('格式不正确').max(50, '邮箱长度不能超过50字符').optional(),

  loginName: z
    .string({
      required_error: '登录账号不能为空'
    })
    .min(3, '请输入有效的登录账号，长度为3到16个字符')
    .max(16, '请输入有效的登录账号，长度为3到16个字符'),
  password: isEdit
    ? z.string().optional()
    : z
        .string({
          required_error: '密码不能为空'
        })
        .min(8, '请输入有效的密码，长度8-50个字符')
        .max(50, '请输入有效的密码，长度8-50个字符')
        .refine(d => passwordReg.test(d), '密码必须包含字母、数字、特殊字符'),
  roleList: z.string().array().optional(),
  userStatus: z.nativeEnum(Status), // z.nativeEnum(Status),
  remark: z.string().max(250, '备注不能超过250字符').optional()
})