import { DictData } from '@/api/dict'
import DataTable, { Column } from '@/components/common/data-table'
import Pagination from '@/components/common/paginator'
import { Button } from '@/components/ui/button'
import { useDeleteDict, useGetDictTypeList } from '@/hooks/api/dict'
import useTable from '@/hooks/useTable'
import { confirm } from '@/store/confirm'
import { cn } from '@/utils/css'
import { useSearch } from '@tanstack/react-router'
import { format } from 'date-fns'
import { ArrowLeft, PlusIcon } from 'lucide-react'
import { useState } from 'react'
import DetailModal from './cells/detailModal'

export default function Detail() {
  const { dictType } = useSearch({ from: '' })
  // 弹窗状态
  const [open, setOpen] = useState(false)
  // 编辑数据
  const [editData, setEditData] = useState<DictData>({} as DictData)
  // 表头设置
  const columns: Column<DictData>[] = [
    { name: '字典编码', key: 'id' },
    {
      name: '字典标签',
      key: 'dictLabel'
    },
    {
      name: '字典键值',
      key: 'dictValue'
    },
    {
      name: '字典类型',
      key: 'dictType'
    },
    { name: '字典排序', key: 'dictSort' },
    {
      name: '字典状态',
      key: 'dictStatus',
      render: (val: string) => renderStatus(val)
    },
    {
      name: '创建时间',
      key: 'createTime',
      render: (val: string) => (val ? format(val, 'yyyy-MM-dd HH:mm:ss') : '--')
    },
    {
      name: '操作',
      key: 'id',
      render: (_id: string, item) => (
        <div style={{ display: 'flex' }}>
          <div onClick={() => onEdit(item)} className={'mr-1 cursor-pointer text-sm text-primary hover:opacity-80'}>
            编辑
          </div>
          <div onClick={() => onDelete(item)} className={'mr-1 cursor-pointer text-sm text-primary hover:opacity-80'}>
            删除
          </div>
        </div>
      )
    }
  ]
  // 表格及分页数据
  const { table, pagination, refetch } = useTable(useGetDictTypeList, { dictionaryType: dictType })
  const deleteDict = useDeleteDict()

  // 编辑
  function onEdit(item: DictData) {
    setEditData(item)
    setOpen(true)
  }
  // 添加字典类型
  function addDict() {
    setEditData({} as DictData)
    setOpen(true)
  }
  // 删除
  function onDelete(item: DictData) {
    confirm({
      message: `确认要删除字典数据 【${item.dictLabel}】？`,
      onOk: async close => {
        await deleteDict.mutateAsync([item.id])
        close()
        refetch()
      }
    })
  }
  // 删除选择行
  function deleteSelects() {
    confirm({
      message: `确认要删除字典类型 【${table.selects.map(item => item.dictLabel)}】？`,
      onOk: async close => {
        const ids = table.selects.map(item => item.id)
        await deleteDict.mutateAsync(ids)
        close()
        table.setSelects([])
        refetch()
      }
    })
  }

  function back() {
    window.history.go(-1)
  }

  function renderStatus(val: string) {
    const status = ['正常', '停用'][Number(val)]
    const common = 'inline-block cursor-pointer rounded-sm px-1 text-sm text-primary hover:opacity-80  '
    const color = status == '正常' ? `bg-success-1 text-success` : `bg-error-1 text-error`
    return <div className={cn(common, color)}>{status}</div>
  }
  return (
    <div className="flex-1 overflow-hidden p-5">
      <div className="flex h-full flex-col rounded-lg bg-background p-5 ">
        <div
          className="flex cursor-pointer items-center border-b border-[#EDEDED] pb-4 text-lg font-medium"
          onClick={back}
        >
          <ArrowLeft className="mr-4" /> 字典数据
        </div>
        <div className="my-5 shrink-0  space-x-4">
          <Button size="sm" disabled={table.selects.length == 0} onClick={deleteSelects}>
            批量删除
          </Button>
          <Button size="sm" className="float-right " onClick={addDict}>
            <PlusIcon size={18} />
            添加字典
          </Button>
        </div>

        <DataTable columns={columns} table={table} />
        <Pagination pagination={pagination} className="mt-4 pb-12" />
      </div>
      <DetailModal open={open} setOpen={setOpen} data={editData} refetch={refetch} />
    </div>
  )
}
