import { LoginLog } from '@/api/log'
import DataTable, { Column } from '@/components/common/data-table'
import Pagination from '@/components/common/paginator'
import { Button } from '@/components/ui/button'
import { useDeleteLoginLog, useGetLoginLogs } from '@/hooks/api/log'
import useTable from '@/hooks/useTable'
import { confirm } from '@/store/confirm'
import { cn } from '@/utils/css'
import { format } from 'date-fns'
import Head from './cells/head'

export default function Log() {
  // 表头设置
  const columns: Column<LoginLog>[] = [
    { name: '日志编号', key: 'id' },
    { name: '登录账号', key: 'loginName' },
    { name: '登录地址', key: 'ip' },
    {
      name: '登录状态',
      key: 'status',
      render: (val: string) => renderStatus(val)
    },
    {
      name: '登录时间',
      key: 'createTime',
      render: (val: string) => (val ? format(val, 'yyyy-MM-dd HH:mm:ss') : '--')
    },
    {
      name: '操作',
      key: 'id',
      render: (id: string) => (
        <div onClick={() => onDelete(id)} className={'mr-1 cursor-pointer text-sm text-primary hover:opacity-80'}>
          删除
        </div>
      )
    }
  ]
  // 表格及分页数据
  const { head, table, pagination, refetch } = useTable(useGetLoginLogs)

  const deleteLoginLog = useDeleteLoginLog()

  // 删除选择行
  function deleteSelects() {
    confirm({
      message: `确认要删除登录日志，日志编号【${table.selects.map(item => item.id)}】？`,
      onOk: async close => {
        const ids = table.selects.map(item => item.id)
        await deleteLoginLog.mutateAsync(ids)
        close()
        table.setSelects([])
        refetch()
      }
    })
  }
  // 删除
  function onDelete(id: string) {
    confirm({
      message: `确认要删除登录日志，日志编号【${id}】？`,
      onOk: async close => {
        await deleteLoginLog.mutateAsync([id])
        close()
        refetch()
      }
    })
  }

  function renderStatus(val: string) {
    const status = ['成功', '失败'][Number(val)]
    const common = 'inline-block cursor-pointer rounded-sm px-1 text-sm text-primary hover:opacity-80  '
    const color = Number(val) == 0 ? `bg-success-1 text-success` : `bg-error-1 text-error`
    return <div className={cn(common, color)}>{status}</div>
  }

  return (
    <div className="flex-1 overflow-hidden p-5">
      <div className="flex h-full flex-col rounded-lg bg-background p-5 ">
        <Head head={head} />

        <div className="my-5 shrink-0  ">
          <Button size="sm" disabled={table.selects.length == 0} onClick={deleteSelects}>
            批量删除
          </Button>
        </div>
        <DataTable columns={columns} table={table} />
        <Pagination pagination={pagination} className="mt-4 pb-12" />
      </div>
    </div>
  )
}
