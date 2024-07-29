import { DictTypeData } from '@/api/dict'
import DataTable, { Column } from '@/components/common/data-table'
import Pagination from '@/components/common/paginator'
import { Button } from '@/components/ui/button'
import { useDeleteDictType, useGetDictList } from '@/hooks/api/dict'
import useTable from '@/hooks/useTable'
import { confirm } from '@/store/confirm'
import { cn } from '@/utils/css'
import { useNavigate } from '@tanstack/react-router'
import { format } from 'date-fns'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'
import Head from './cells/head'
import Modal from './cells/modal'

export default function Dict() {
  const navigate = useNavigate()
  // 弹窗状态
  const [open, setOpen] = useState(false)
  // 编辑数据
  const [editData, setEditData] = useState<DictTypeData>({} as DictTypeData)

  // 表头设置
  const columns: Column<DictTypeData>[] = [
    { name: '字典主键', key: 'id' },
    {
      name: '字典名称',
      key: 'dictName'
    },
    { name: '字典类型', key: 'dictType' },
    {
      name: '字典状态',
      key: 'status',
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
          <div
            onClick={() => check(item.dictType)}
            className={'mr-1 cursor-pointer text-sm text-primary hover:opacity-80'}
          >
            查看
          </div>
          <div onClick={() => edit(item)} className={'mr-1 cursor-pointer text-sm text-primary hover:opacity-80'}>
            编辑
          </div>
        </div>
      )
    }
  ]

  // 表格及分页数据
  const { head, table, pagination, refetch } = useTable(useGetDictList)

  const deleteDictType = useDeleteDictType()

  // 添加字典类型
  function addDict() {
    setEditData({} as DictTypeData)
    setOpen(true)
  }
  // 查看->跳详情页
  function check(dictType: string) {
    navigate({ to: `./detail`, search: { dictType } })
  }
  // 编辑
  function edit(item: DictTypeData) {
    setEditData(item)
    setOpen(true)
  }
  // 删除选择行
  function deleteSelects() {
    confirm({
      message: `确认要删除字典类型 【${table.selects.map(item => item.dictName)}】？`,
      onOk: async close => {
        const ids = table.selects.map(item => item.id)
        await deleteDictType.mutateAsync(ids)
        close()
        table.setSelects([])
        refetch()
      }
    })
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
        <Head head={head} />

        <div className="my-5 shrink-0  space-x-4">
          <Button size="sm" disabled={table.selects.length == 0} onClick={deleteSelects}>
            批量删除
          </Button>
          <Button size="sm" className="float-right " onClick={addDict}>
            <PlusIcon size={18} />
            添加字典类型
          </Button>
        </div>

        <DataTable columns={columns} table={table} />
        <Pagination pagination={pagination} className="mt-4 pb-12" />
      </div>

      <Modal open={open} setOpen={setOpen} data={editData} refetch={refetch} />
    </div>
  )
}
