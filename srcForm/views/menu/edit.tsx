import { EditMenu, MenuData } from '@/api/menu'
import FormRender from '@/components/newForm'
import { MenuType, Status } from '@/consts'
import { useAddMenu, useEditMenu } from '@/hooks/api/menu'
// import { cn } from '@/utils/css'
// import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
// import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  parentId: z.string().optional(),
  permissionName: z
    .string({
      required_error: '菜单名称不能为空'
    })
    .max(16, '请输入有效的菜单名称，长度不超过16字符'),
  permissionType: z.string(),
  sortNumber: z.string({
    required_error: '显示排序不能为空'
  }),
  routeUrl: z
    .string()
    .max(500, '请输入有效的请求地址，长度不超过500字符')
    .optional()
    .nullable()
    .transform(value => {
      if (value == null) {
        return undefined
      }
      return value
    }),
  interfaceIdentity: z
    .string()
    .max(100, '请输入有效的权限标识，长度不超过100字符')
    .optional()
    .nullable()
    .transform(value => {
      if (value == null) {
        return undefined
      }
      return value
    }),
  icon: z.string().optional(),
  showStatus: z.string().optional()
})

export default function Edit({
  data,
  onClose,
  menuDatas,
  onSaveClose
}: {
  onSaveClose: () => void
  onClose: () => unknown
  data?: EditMenu
  menuDatas: MenuData[]
}) {
  const initSchema = {
    className: 'grid gap-x-10 gap-y-5 pt-4 grid-cols-2',
    properties: {
      parentId: {
        label: '上级菜单',
        type: 'treeSelect',
        props: {
          placeholder: '请选择上级菜单',
          data: menuDatas
            .filter(d => d.permissionType != MenuType.button)
            .map(d => ({
              ...d,
              id: d.id + '',
              parentId: d.parentId + '',
              name: d.permissionName
            })),
          className: 'col-span-2'
        }
      },
      permissionName: {
        label: '菜单名称',
        type: 'input',
        props: {
          placeholder: '请输入菜单名称',
          required: true
        }
      },
      permissionType: {
        label: '菜单类型',
        type: 'radio',
        props: {
          options: [
            [MenuType.module, '目录'],
            [MenuType.menu, '菜单'],
            [MenuType.button, '按钮']
          ]
        }
      },
      routeUrl: {
        label: '请求地址',
        type: 'input',
        props: {
          placeholder: '请输入请求地址',
          hidden: true
        }
      },
      interfaceIdentity: {
        label: '权限标识',
        type: 'input',
        props: {
          placeholder: '请输入权限标识',
          hidden: true
        }
      },
      sortNumber: {
        label: '显示排序',
        type: 'input',
        props: {
          placeholder: '请输入显示排序',
          required: true,
          type: 'number',
          min: 1
        }
      },
      icon: {
        label: '图标',
        type: 'iconSelect',
        props: {
          placeholder: '请选择图标'
        }
      },
      showStatus: {
        label: '菜单状态',
        type: 'radio',
        props: {
          options: [
            [Status.enable, '显示'],
            [Status.disable, '隐藏']
          ]
        }
      }
    }
  }
  const addMenu = useAddMenu()
  const editMenu = useEditMenu()
  const [schema, setSchema] = useState(initSchema)
  const buildFormInitData = () => {
    const { parentId, permissionType, showStatus, sortNumber, ...rest } = data || {}
    const defData: Partial<z.infer<typeof formSchema>> = { ...rest }
    if (parentId) {
      defData.parentId = parentId + ''
    }

    defData.permissionType = (permissionType != undefined ? permissionType : MenuType.module) + ''

    defData.showStatus = (showStatus != undefined ? showStatus : Status.enable) + ''

    defData.sortNumber = (sortNumber != undefined ? sortNumber : 1) + ''

    return defData
  }

  const watch = {
    '#': (value: object) => {
      console.log('表单全部值', value)
    },
    'permissionType': (value: string) => {
      if (value === '2') {
        console.log('选中菜单', value)
        setSchema({
          properties: {
            ...schema.properties,
            routeUrl: {
              label: '请求地址',
              type: 'input',
              props: {
                placeholder: '请输入请求地址',
                hidden: true,
                className: 'hidden'
              }
            }
          },
          ...initSchema
        })
      } else if (value === '3') {
        console.log('选中按钮', value)
        setSchema(initSchema)
      } else {
        console.log('选中目录', value)
      }
    }
  }

  // useEffect(() => {
  //   if (watchValue === '2') {
  //     setSchema({
  //       type: 'object',
  //       displayType: 'row', // row column
  //       formType: 'editForm', // editForm searchForm
  //       column: 2, // 1 2
  //       properties: [
  //         {
  //           name: 'parentId',
  //           label: '上级菜单',
  //           type: 'TreeSelect',
  //           props: {
  //             placeholder: '请选择上级菜单',
  //             data: menuDatas
  //               .filter(d => d.permissionType != MenuType.button)
  //               .map(d => ({
  //                 ...d,
  //                 id: d.id + '',
  //                 parentId: d.parentId + '',
  //                 name: d.permissionName
  //               })),
  //             span: 2
  //           }
  //         },
  //         {
  //           name: 'permissionName',
  //           label: '菜单名称',
  //           type: 'Input',
  //           props: {
  //             placeholder: '请输入菜单名称',
  //             required: true
  //           }
  //         },
  //         {
  //           name: 'permissionType',
  //           label: '菜单类型',
  //           type: 'Radio',
  //           props: {
  //             options: [
  //               [MenuType.module, '目录'],
  //               [MenuType.menu, '菜单'],
  //               [MenuType.button, '按钮']
  //             ]
  //           }
  //         },
  //         {
  //           name: 'routeUrl',
  //           label: '请求地址',
  //           type: 'Input',
  //           props: {
  //             placeholder: '请输入请求地址',
  //             hidden: false
  //           }
  //         },
  //         {
  //           name: 'interfaceIdentity',
  //           label: '权限标识',
  //           type: 'Input',
  //           props: {
  //             placeholder: '请输入权限标识',
  //             hidden: false
  //           }
  //         },
  //         {
  //           name: 'sortNumber',
  //           label: '显示排序',
  //           type: 'Input',
  //           props: {
  //             placeholder: '请输入显示排序',
  //             required: true,
  //             type: 'number',
  //             min: 1
  //           }
  //         },
  //         {
  //           name: 'icon',
  //           label: '图标',
  //           type: 'IconSelect',
  //           props: {
  //             placeholder: '请选择图标'
  //           }
  //         },
  //         {
  //           name: 'showStatus',
  //           label: '菜单状态',
  //           type: 'Radio',
  //           props: {
  //             options: [
  //               [Status.enable, '显示'],
  //               [Status.disable, '隐藏']
  //             ]
  //           }
  //         }
  //       ]
  //     })
  //   } else {
  //     setSchema(initSchema)
  //   }
  // }, [watchValue])

  // const permissionType = form.watch('permissionType')

  async function save(values: Partial<z.infer<typeof formSchema>>) {
    const { showStatus, permissionType, parentId = '0', routeUrl, interfaceIdentity, sortNumber, ...rest } = values

    const param: EditMenu = {
      ...rest
    }
    param.sortNumber = +sortNumber!
    param.parentId = +parentId
    param.permissionType = +permissionType!
    param.showStatus = +showStatus!

    if (routeUrl && param.permissionType === MenuType.menu) {
      param.routeUrl = routeUrl
    }

    if (interfaceIdentity && param.permissionType !== MenuType.module) {
      param.interfaceIdentity = interfaceIdentity
    }

    if (data?.id) {
      await editMenu.mutateAsync({ ...param, id: data.id })
    } else {
      await addMenu.mutateAsync(param)
    }

    onSaveClose()
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

  return (
    <FormRender
      zodSchema={formSchema}
      schema={schema}
      defaultValue={buildFormInitData}
      actions={btnActions}
      watch={watch}
    />
  )
}
