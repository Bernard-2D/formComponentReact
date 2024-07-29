import {
  QueryListParam,
  QueryUserListParam,
  RoleData,
  addRoleUser,
  deleteRoleUser,
  getNoRoleUserList,
  getRoleUserList
} from '@/api/role'
import { UserData } from '@/api/user'
import DataTable, { TableApi } from '@/components/server-table'
import ActionCell, { Action } from '@/components/server-table/column/action-cell'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Status } from '@/consts'
import { ColumnDef } from '@tanstack/react-table'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import QueryPart from './query'

export default function User({ role }: { role: RoleData }) {
  const [query, setQuery] = useState<QueryUserListParam>({ roleId: role.id })
  const [type, setType] = useState('0')
  const [selectUsers, setSelectUsers] = useState<UserData[]>([])
  const tableApi = useRef<TableApi<QueryListParam>>()

  const reQuery = useCallback(
    (toFirstPage = false) => {
      if (tableApi.current?.refresh) {
        tableApi.current.refresh(query, toFirstPage)
      }
    },
    [query]
  )

  const auth = useCallback(
    (userIds: number[]) => {
      const promise = type === '0' ? deleteRoleUser(role.id, userIds) : addRoleUser(role.id, userIds)

      promise.then(() => {
        toast(`${type === '0' ? '取消授权' : '授权'}成功`)
        reQuery()
      })
    },
    [reQuery, role.id, type]
  )

  function onQuery(param: QueryListParam) {
    setQuery({ ...param, roleId: role.id })
  }

  const columns: ColumnDef<UserData, unknown>[] = useMemo(
    () => [
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
        size: 100
      },
      {
        accessorKey: 'phone',
        header: '手机号码',
        enableSorting: false,
        size: 100
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
        accessorKey: 'createTime',
        header: '创建时间',
        enableSorting: true,
        size: 180
      },
      {
        accessorKey: 'action',
        cell: ActionCell,
        header: '操作',
        meta: [
          {
            name: type === '0' ? '取消授权' : '授权通过',
            action: ({ row }) => {
              auth([row.original.id])
            }
          }
        ] as Action<UserData>[],
        enableSorting: false,
        size: 60
      }
    ],
    [type, auth]
  )

  useEffect(() => {
    reQuery(true)
  }, [query, type])

  return (
    <div className="flex w-full flex-1 flex-col gap-4 overflow-hidden bg-background ">
      <Tabs value={type} onValueChange={setType} className="w-[400px]">
        <TabsList>
          <TabsTrigger value="0">已授权</TabsTrigger>
          <TabsTrigger value="1">未授权</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex justify-between">
        <QueryPart onQuery={onQuery}></QueryPart>
        <div className="shrink-0">
          <Button size="sm" disabled={!selectUsers.length} onClick={() => auth(selectUsers.map(d => d.id))}>
            {type === '0' ? '批量取消授权' : '批量授权'}
          </Button>
        </div>
      </div>
      <DataTable
        ref={tableApi}
        api={type === '0' ? getRoleUserList : getNoRoleUserList}
        onSelectionChange={(d: UserData[]) => setSelectUsers(d)}
        columns={columns}
        initParam={query}
      />
    </div>
  )
}
