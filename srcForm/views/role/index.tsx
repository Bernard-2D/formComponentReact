import { QueryListParam, RoleData, deleteRole, getRoleList } from '@/api/role'
import DataTable, { TableApi } from '@/components/server-table'
import ActionCell, { Action } from '@/components/server-table/column/action-cell'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ADMIN, Status } from '@/consts'
import { confirm } from '@/store/confirm'
import { ColumnDef, Row } from '@tanstack/react-table'
import { PlusIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import EditPart from './edit'
import QueryPart from './query'
import User from './user'

export default function Role() {
  const [open, setOpen] = useState(false)
  const [sheetInfo, setSheetInfo] = useState<{ type: string; data?: RoleData }>()
  const [query, setQuery] = useState<QueryListParam>({})
  const [selectRoles, setSelectRoles] = useState<RoleData[]>([])
  const tableApi = useRef<TableApi<QueryListParam>>()

  const actions: Action<RoleData>[] = [
    {
      name: '编辑',
      action: ({ row }) => {
        setSheetInfo({ type: 'edit', data: row.original })
        setOpen(true)
      }
    },
    {
      name: '删除',
      action: ({ row }) => {
        onDelete([row.original])
      }
    },
    {
      name: '分配用户',
      action: ({ row }) => {
        setSheetInfo({ type: 'addUser', data: row.original })
        setOpen(true)
      }
    }
  ]

  const columns: ColumnDef<RoleData, unknown>[] = [
    {
      accessorKey: 'id',
      header: '角色编号',
      enableSorting: false,
      size: 100
    },
    {
      accessorKey: 'roleName',
      header: '角色名称',
      enableSorting: false,
      size: 100
    },
    {
      accessorKey: 'roleStatus',
      header: '角色状态',
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
      accessorKey: 'createTime',
      header: '创建时间',
      enableSorting: true,
      size: 180
    },
    {
      accessorKey: 'action',
      cell: ActionCell,
      header: '操作',
      meta: actions,
      enableSorting: false,
      size: 140
    }
  ]

  function onDelete(roles: RoleData[]) {
    confirm({
      message: `确认要删除角色 【${roles.map(d => d.roleName)}】？`,
      onOk: close => {
        deleteRole(roles.map(d => d.id)).then(() => {
          toast.success('删除成功')
          reQuery()
          close()
        })
      }
    })
  }

  function onQuery(param: QueryListParam) {
    setQuery(param)
  }

  function reQuery(toFirstPage = false) {
    if (tableApi.current?.refresh) {
      tableApi.current.refresh(query, toFirstPage)
    }
  }

  useEffect(() => {
    reQuery(true)
  }, [query])

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="flex-1 overflow-hidden p-5">
        <div className="flex h-full flex-col  rounded-lg bg-background p-5 ">
          <QueryPart onQuery={onQuery}></QueryPart>
          <div className="my-5 shrink-0  space-x-4">
            <Button size="sm" disabled={!selectRoles.length} onClick={() => onDelete(selectRoles)}>
              批量删除
            </Button>
            <Button
              size="sm"
              className="float-right "
              onClick={() => {
                setSheetInfo({ type: 'add' })
                setOpen(true)
              }}
            >
              <PlusIcon size={18} />
              添加角色
            </Button>
          </div>
          <DataTable
            ref={tableApi}
            api={getRoleList}
            onSelectionChange={(d: RoleData[]) => setSelectRoles(d)}
            columns={columns}
            option={{ enableRowSelection: (row: Row<RoleData>) => row.original.roleName !== ADMIN }}
          />
        </div>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        {'addUser' === sheetInfo?.type ? (
          <SheetContent className="flex w-250 flex-col py-3 sm:w-250 sm:max-w-250">
            <SheetHeader>
              <SheetTitle>分配用户</SheetTitle>
            </SheetHeader>
            <User role={sheetInfo.data!} />
          </SheetContent>
        ) : (
          <SheetContent className="w-180 py-3 sm:w-180 sm:max-w-180 ">
            <SheetHeader>
              <SheetTitle>{{ add: '新增', edit: '修改' }[sheetInfo?.type + '']}角色</SheetTitle>
            </SheetHeader>
            <EditPart
              onSaveClose={() => {
                reQuery('add' === sheetInfo?.type)
                setOpen(false)
              }}
              onClose={() => setOpen(false)}
              data={sheetInfo?.data}
            />
          </SheetContent>
        )}
      </Sheet>
    </div>
  )
}
