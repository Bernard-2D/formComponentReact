import { LogData } from '@/api/log'
import DataTable, { Column } from '@/components/common/data-table'
import Pagination from '@/components/common/paginator'
import { Button } from '@/components/ui/button'
import { useDeleteOpLog, useExportOpLog, useGetOpLogs } from '@/hooks/api/log'
import useTable from '@/hooks/useTable'
import { confirm } from '@/store/confirm'
import { cn } from '@/utils/css'
import { download } from '@/utils/file'
import { format } from 'date-fns'
import Head from './cells/opHead'

export default function OpLog() {
  // 表头设置
  const columns: Column<LogData>[] = [
    { name: '日志编号', key: 'id' },
    { name: '系统模块', key: 'title' },
    { name: '操作类型', key: 'businessType' },
    { name: '操作人员', key: 'operator' },
    { name: '操作地址', key: 'operationIp' },
    {
      name: '操作状态',
      key: 'operationStatus',
      render: (val: string) => renderStatus(val)
    },
    {
      name: '操作时间',
      key: 'operatorTime',
      render: (val: string) => (val ? format(val, 'yyyy-MM-dd HH:mm:ss') : '--')
    },
    {
      name: '消耗时间',
      key: 'consumeTime',
      render: (val: string) => val + '毫秒'
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
  const { head, table, pagination, refetch } = useTable(useGetOpLogs)

  const deleteLog = useDeleteOpLog()
  const exportLog = useExportOpLog()

  // 删除选择行
  function deleteSelects() {
    confirm({
      message: `确认要删除操作日志，日志编号【${table.selects.map(item => item.id)}】？`,
      onOk: async close => {
        const ids = table.selects.map(item => item.id)
        await deleteLog.mutateAsync(ids)
        close()
        table.setSelects([])
        refetch()
      }
    })
  }
  // 删除
  function onDelete(id: string) {
    confirm({
      message: `确认要删除操作日志，日志编号【${id}】？`,
      onOk: async close => {
        await deleteLog.mutateAsync([id])
        close()
        refetch()
      }
    })
  }

  // 日志导出
  async function exportLogs() {
    confirm({
      message: `确定导出当前搜索条件的日志吗 ？`,
      onOk: async close => {
        const { data, fileName } = await exportLog.mutateAsync(head.param)
        download(data as Blob, fileName as string)
        close()
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

        <div className="my-5 flex shrink-0 gap-4">
          <Button size="sm" disabled={table.data.length == 0} onClick={exportLogs}>
            导出
          </Button>
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
