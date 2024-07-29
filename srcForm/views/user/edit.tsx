import { DeptData } from '@/api/dept'
import { EditUser, Role, UserData } from '@/api/user'
import FormRender from '@/components/newForm'
import { Status } from '@/consts'
import { useAddUser, useEditUser, useGetRoleList, useGetUserDetail } from '@/hooks/api/user'
import { useRef } from 'react'
// import { cn } from '@/utils/css'
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
  const formRef = useRef()
  const isEdit = !!initData.id

  const zodSchema = z.object({
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

  const buildFormInitData = () => {
    const { departmentId, roleList, userRoleIds, ...rest } = initData
    const data: any = { ...rest }

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

  const schema = {
    className: 'grid gap-x-10 gap-y-5 pt-4 grid-cols-2',
    properties: {
      username: {
        label: '用户姓名',
        type: 'input',
        props: {
          placeholder: '请输入用户姓名',
          required: true
        }
      },
      departmentId: {
        label: '归属部门',
        type: 'treeSelect',
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
      phone: {
        label: '手机号码',
        type: 'input',
        props: {
          placeholder: '请输入手机号码'
        }
      },
      email: {
        label: '邮箱',
        type: 'input',
        props: {
          placeholder: '请输入邮箱'
        }
      },
      loginName: {
        label: '登录账号',
        type: 'input',
        props: {
          placeholder: '请输入登录账号',
          required: true,
          disabled: false
        }
      },
      password: {
        label: '登录密码',
        type: 'password',
        props: {
          placeholder: '请输入登录密码'
        }
      },
      roleList: {
        label: '角色',
        type: 'multiSelect',
        props: {
          placeholder: '请选择角色',
          options: roleList.map(d => ({ label: d.roleName, value: d.id + '' })),
          maxCount: 1
        }
      },
      userStatus: {
        label: '用户状态',
        type: 'switch',
        props: {
          status: Status
        }
      },
      remark: {
        label: '备注',
        type: 'textarea',
        props: {
          className: 'col-span-2'
        }
      }
    }
  }

  const btnActions = [
    {
      text: '取消',
      type: 'reset',
      size: 'sm',
      variant: 'outline',
      fn: onClose
    },
    {
      text: '提交',
      type: 'submit',
      size: 'sm',
      fn: save
    }
  ]

  const form = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues: buildFormInitData()
  })

  // console.log('form control', form.control)

  async function save() {
    const values = formRef.current.getFormValue()
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
      <FormRender
        ref={formRef}
        zodSchema={zodSchema}
        defaultValue={buildFormInitData}
        schema={schema}
        submitFunction={save}
        closeFunction={onClose}
        actions={btnActions}
      />
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
