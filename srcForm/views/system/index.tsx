import { SysData, getSysList } from '@/api/sys'
import DataTable, { TableApi } from '@/components/server-table'
import ActionCell, { Action } from '@/components/server-table/column/action-cell'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useDeleteSys } from '@/hooks/api/sys'
import { confirm } from '@/store/confirm'
import { ColumnDef } from '@tanstack/react-table'
import { PlusIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import EditPart from './edit'

export default function System() {
  const [open, setOpen] = useState(false)
  const [sheetInfo, setSheetInfo] = useState<{ type: string; data?: SysData }>()
  const [selectSyss, setSelectSyss] = useState<SysData[]>([])
  const tableApi = useRef<TableApi<object>>()
  const deleteSystem = useDeleteSys()

  const actions: Action<SysData>[] = [
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
      name: '访问',
      action: ({ row }) => {
        window.open(`${location.protocol}//${location.host}?system=${row.original.id}`, '_blank')
      }
    }
  ]

  const columns: ColumnDef<SysData, unknown>[] = [
    {
      accessorKey: 'id',
      header: '系统ID',
      enableSorting: false
    },
    {
      accessorKey: 'systemName',
      header: '系统名称',
      enableSorting: false
    },
    {
      accessorKey: 'createTime',
      header: '创建时间',
      enableSorting: true
    },
    {
      accessorKey: 'action',
      cell: ActionCell,
      header: '操作',
      meta: actions,
      enableSorting: false
    }
  ]

  function onDelete(datas: SysData[]) {
    confirm({
      message: `确认要删除系统 【${datas.map(d => d.systemName)}】？`,
      onOk: async close => {
        await deleteSystem.mutateAsync(datas.map(d => d.id))
        reQuery()
        close()
      }
    })
  }

  function reQuery(toFirstPage = false) {
    if (tableApi.current?.refresh) {
      tableApi.current.refresh({}, toFirstPage)
    }
  }

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="flex-1 overflow-hidden p-5">
        <div className="flex h-full flex-col  rounded-lg bg-background p-5 ">
          <div className="my-5 shrink-0  space-x-4">
            <Button size="sm" disabled={!selectSyss.length} onClick={() => onDelete(selectSyss)}>
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
              添加配置
            </Button>
          </div>
          <DataTable
            ref={tableApi}
            api={getSysList}
            onSelectionChange={(d: SysData[]) => setSelectSyss(d)}
            columns={columns}
          />
        </div>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="flex w-250 flex-col py-3 sm:w-250 sm:max-w-250">
          <SheetHeader>
            <SheetTitle>系统配置</SheetTitle>
          </SheetHeader>
          <EditPart
            key={+new Date()}
            onSaveClose={() => {
              reQuery('add' === sheetInfo?.type)
              setOpen(false)
            }}
            onClose={() => setOpen(false)}
            data={sheetInfo?.data}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}
