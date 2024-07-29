import { DeptData, EditDept, QueryListParam } from '@/api/dept'
import { Column, TreeTable } from '@/components/tree'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Spinner } from '@/components/ui/spinner'
import { useDeleteDept, useGetDeptList } from '@/hooks/api/dept'
import { confirm } from '@/store/confirm'
import { PlusIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import EditPart from './edit'
import QueryPart from './query'

export default function Dept() {
  const [open, setOpen] = useState(false)
  const [sheetInfo, setSheetInfo] = useState<{ type: string; data?: EditDept }>()
  const queryRef = useRef<QueryListParam>({})
  const deptAllRef = useRef<DeptData[]>([])
  const [isExpend, setIsExpend] = useState(false)
  const deleteDept = useDeleteDept()
  const {
    isPending,
    data: deptDatas,
    refetch
  } = useGetDeptList(
    () => queryRef.current,
    d => {
      const param = queryRef.current
      if (!param.departmentNameLike && !param.departmentStatusEq) {
        deptAllRef.current = d
      }
    }
  )

  function getTreeDepts() {
    const param = queryRef.current

    if (!param.departmentNameLike && !param.departmentStatusEq) {
      return deptDatas
    } else {
      const allDepts = deptAllRef.current
      const deptMap: Record<number, DeptData> = allDepts.reduce((tmp, d) => ({ ...tmp, [d.id]: d }), {})
      const depts = [...(deptDatas || [])]

      const ids = depts.map(d => d.id)

      deptDatas?.forEach(dept => {
        let parent = deptMap[dept.parentDepartmentId]
        while (parent) {
          if (!ids.includes(parent.id)) {
            depts.push(parent)
            ids.push(parent.id)
          }
          parent = deptMap[parent.parentDepartmentId]
        }
      })

      return depts
    }
  }

  function onReload() {
    refetch()
  }

  function onQuery(param: QueryListParam) {
    queryRef.current = param
    onReload()
  }

  const columns: Column[] = [
    {
      key: 'name'
    },
    {
      key: 'departmentStatus',
      title: '部门状态',
      cell: row => {
        const state = (row as unknown as DeptData)['departmentStatus']
        const specialClass = {
          0: 'bg-success-1 text-success',
          1: 'bg-error-1 text-error'
        }[state]
        return (
          <div className="flex items-center space-x-2" style={{ width: 150 }}>
            <div>部门状态</div>
            <div className={' rounded-sm  p-1 text-xs ' + specialClass}>{{ 0: '正常', 1: '停用' }[state]}</div>
          </div>
        )
      },
      size: 120
    },
    {
      key: 'createTime',
      title: '创建时间',
      size: 250
    },
    {
      key: 'action',
      actions: [
        {
          action: row => {
            setSheetInfo({ type: 'edit', data: row as EditDept })
            setOpen(true)
          },
          name: '编辑'
        },
        {
          action: row => {
            setSheetInfo({ type: 'add', data: { parentDepartmentId: row.id as number } })
            setOpen(true)
          },
          name: '新增'
        },
        {
          action: row => {
            confirm({
              message: `确认删除部门 【${(row as EditDept).departmentName}】？`,
              onOk: async close => {
                await deleteDept.mutateAsync(+row.id)
                refetch()
                close()
              }
            })
          },
          name: '删除'
        }
      ],
      size: 140
    }
  ]

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="flex-1 overflow-hidden p-5">
        <div className="flex h-full flex-col rounded-lg bg-background p-5 ">
          {/* <div className="hidden"> */}
          <QueryPart onQuery={onQuery}></QueryPart>
          {/* </div> */}
          <div className="my-5 shrink-0  space-x-4">
            <Button
              size="sm"
              variant="outline"
              className="border-primary text-primary"
              onClick={() => setIsExpend(!isExpend)}
            >
              展开/折叠
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
              添加部门
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {isPending ? (
              <Spinner />
            ) : (
              <TreeTable
                expandAll={isExpend}
                data={(getTreeDepts() || []).map(d => ({
                  ...d,
                  parentId: d.parentDepartmentId,
                  name: d.departmentName
                }))}
                columns={columns}
              />
            )}
          </div>
        </div>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-106 py-3 sm:w-106 sm:max-w-106 ">
          <SheetHeader>
            <SheetTitle>{{ add: '添加', edit: '编辑' }[sheetInfo?.type + '']}部门</SheetTitle>
          </SheetHeader>
          <EditPart
            onSaveClose={() => {
              refetch()
              setOpen(false)
            }}
            deptDatas={deptAllRef.current || []}
            onClose={() => setOpen(false)}
            data={sheetInfo?.data}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}
