import { getRoleList, QueryListParam, RoleData } from '@/api/role'
// , deleteRole
import DataTable, { TableApi } from '@/components/server-table'
import { Status } from '@/consts'
import { ColumnDef } from '@tanstack/react-table'
import { useEffect, useRef, useState } from 'react'
// import ActionCell, { Action } from '@/components/server-table/column/action-cell'
// import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

export default function NewRole() {
  const [query, setQuery] = useState<QueryListParam>({})
  const tableApi = useRef<TableApi<QueryListParam>>()

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
          <div>
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
    }
  ]

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
    <div>
      flex盒子
      <div>
        flex值为1
        <div>
          flex盒子
          <div>
            放置按钮
            <Button>批量删除</Button>
            <Button>添加角色</Button>
          </div>
          <DataTable ref={tableApi} api={getRoleList} columns={columns} />
        </div>
      </div>
    </div>
  )
}
