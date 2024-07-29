import { UserData } from '@/api/user'
import ActionCell, { Action } from '@/components/server-table/column/action-cell'
import EllipsisCell from '@/components/server-table/column/ellipsis-cell'
import { Status } from '@/consts'
import { ColumnDef } from '@tanstack/react-table'

export default function getColumns(rowAction: (type: string, data?: UserData) => unknown) {
  const actions: Action<UserData>[] = [
    {
      name: '编辑',
      action: ({ row }) => {
        rowAction('edit', row.original)
      }
    },
    {
      name: '删除',
      action: ({ row }) => {
        rowAction('delete', row.original)
      }
    },
    {
      name: '查看详情',
      action: ({ row }) => {
        rowAction('show', row.original)
      }
    },
    {
      name: '修改密码',
      action: ({ row }) => {
        rowAction('resetPwd', row.original)
      }
    },
    {
      name: '分配角色',
      action: ({ row }) => {
        rowAction('role', row.original)
      }
    }
  ]

  const columns: ColumnDef<UserData, unknown>[] = [
    {
      accessorKey: 'id',
      header: '用户ID',
      enableSorting: false,
      size: 80
    },
    {
      accessorKey: 'loginName',
      header: '登录账号',
      enableSorting: false,
      size: 100
    },
    {
      accessorKey: 'username',
      header: '用户姓名',
      enableSorting: false,
      size: 120
    },
    {
      accessorKey: 'departmentName',
      header: '归属部门',
      enableSorting: false
    },
    {
      accessorKey: 'phone',
      header: '手机号码',
      enableSorting: false
    },
    {
      accessorKey: 'userStatus',
      header: '用户状态',
      cell: ({ getValue }) => {
        const state = getValue<Status>()
        const specialClass = {
          0: 'bg-success-1 text-success',
          1: 'bg-error-1 text-error'
        }[state]
        return (
          <div className="flex items-center">
            <span className={' rounded-sm  p-1 text-xs ' + specialClass}>{{ 0: '正常', 1: '停用' }[state]}</span>
          </div>
        )
      },
      enableSorting: false,
      size: 120
    },
    {
      accessorKey: 'remark',
      header: '备注',
      cell: EllipsisCell,
      enableSorting: false,
      size: 500
    },
    {
      accessorKey: 'createTime',
      header: '创建时间',
      enableSorting: true,
      size: 180
    },
    {
      accessorKey: 'actions',
      cell: ActionCell,
      header: '操作',
      meta: actions,
      enableSorting: false,
      size: 140
    }
  ]

  return columns
}
