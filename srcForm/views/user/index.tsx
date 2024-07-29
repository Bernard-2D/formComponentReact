import { QueryListParam, UserData, getUserList } from '@/api/user'
import { ImportDialog } from '@/components/import-dialog'
import DataTable, { TableApi } from '@/components/server-table'
import { Tree } from '@/components/tree'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Spinner } from '@/components/ui/spinner'
import { ADMIN } from '@/consts'
import { useDeleteUser, useDownloadTemplate, useExportUser, useGetUserDeptList, useImportUser } from '@/hooks/api/user'
import { confirm } from '@/store/confirm'
import { cn } from '@/utils/css'
import { download } from '@/utils/file'
import { Row } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ListTreeIcon, PlusIcon, RefreshCwIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import getColumns from './column'
import Detail from './detail'
import EditPart from './edit'
import Password from './password'
// import QueryPart from './query'
import FormRender from '@/components/newForm'
// import { FieldValues, UseFormReturn } from 'react-hook-form'
import { Role } from './role'

export default function User() {
  const [open, setOpen] = useState(false)
  const [isExpend, setIsExpend] = useState(true)
  const [sheetInfo, setSheetInfo] = useState<{ type: string; data?: UserData }>()
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailData, setDetailData] = useState<UserData>()
  const [query, setQuery] = useState<QueryListParam>({})
  const [selectUsers, setSelectUsers] = useState<UserData[]>([])
  const [departmentId, setDepartmentId] = useState<number>()
  const tableApi = useRef<TableApi<QueryListParam>>()
  const formRef = useRef()
  const { isPending, data: deptDatas, refetch } = useGetUserDeptList()
  const deleteUser = useDeleteUser()
  const importUser = useImportUser()
  const exportUser = useExportUser()
  const downloadTemplate = useDownloadTemplate()

  const schema = {
    className: 'flex shrink-0 flex-wrap gap-2.5',
    properties: [
      {
        name: 'loginNameLike',
        type: 'input',
        props: {
          placeholder: '请输入登录账号',
          type: 'search',
          className: 'w-60'
        }
      },
      {
        name: 'phoneLike',
        type: 'input',
        props: {
          placeholder: '请输入手机号码',
          type: 'search',
          className: 'w-60'
        }
      },
      {
        name: 'createTime',
        type: 'datePicker'
      },
      {
        name: 'userStatusEq',
        type: 'Select',
        props: {
          placeholder: '登录状态',
          options: [
            {
              label: '正常',
              value: '0'
            },
            {
              label: '停用',
              value: '1'
            }
          ]
        }
      }
    ]
  }

  // const btnActions = [
  //   {
  //     text: '重置',
  //     type: 'reset',
  //     size: 'sm',
  //     variant: 'outline',
  //     fn: resetSearch
  //   },
  //   {
  //     text: '查询',
  //     type: 'submit',
  //     size: 'sm',
  //     fn: handleQuery
  //   }
  // ]

  useEffect(() => {
    if (deptDatas && !departmentId) {
      setDepartmentId(deptDatas[0].id)
    }
  }, [deptDatas])

  function rowAction(type: string, data?: UserData) {
    if (['add', 'edit', 'resetPwd', 'role'].includes(type)) {
      setSheetInfo({ type, data })
      setOpen(true)
    } else if (type === 'show') {
      setDetailData(data)
      setDetailOpen(true)
    } else if (['delete'].includes(type)) {
      confirm({
        message: `确认删除用户 【${data?.username}】？`,
        onOk: async close => {
          await deleteUser.mutateAsync([data!.id])
          reQuery()
          close()
        }
      })
    }
  }

  function onDelete(users: UserData[]) {
    confirm({
      message: `确认要删除用户【${users.map(d => d.username)}】?`,
      onOk: async close => {
        await deleteUser.mutateAsync(users.map(d => d.id))
        reQuery()
        close()
      }
    })
  }

  function handleQuery() {
    const { createTime, ...rest } = formRef.current.getFormValue()
    // console.log('查询参数', form.getValues())

    const param: QueryListParam = { ...rest }

    if (createTime) {
      if (createTime.from) {
        param.createTimeGt = format(createTime.from, 'yyyy-MM-dd')
      }

      if (createTime.to) {
        param.createTimeLt = format(createTime.to, 'yyyy-MM-dd')
      }
    }

    onQuery(param)
  }

  function onQuery(param: QueryListParam) {
    setQuery(param)
  }

  function resetSearch() {
    // HTMLFormElement.reset(form)
    formRef.current.resetForm()
    console.log('执行resetSearch')
    onQuery({})
  }

  async function onImport(file: File, close: () => void) {
    await importUser.mutateAsync(file)
    reQuery()
    close()
  }

  async function onDownloadTemplate() {
    const result = await downloadTemplate.mutateAsync()
    download(result.data as Blob, result.fileName as string)
  }

  function onExport() {
    confirm({
      message: `确定导出当前条件的用户吗 ？`,
      onOk: async close => {
        const result = await exportUser.mutateAsync({ ...query, departmentIdEq: departmentId })
        download(result.data as Blob, result.fileName as string)
        close()
      }
    })
  }

  function reQuery(toFirstPage = false) {
    if (tableApi.current?.refresh) {
      tableApi.current.refresh({ ...query, departmentIdEq: departmentId }, toFirstPage)
    }
  }

  useEffect(() => {
    reQuery(true)
  }, [query, departmentId])

  return (
    <div className={cn('flex h-full w-full overflow-hidden', isPending && 'items-center justify-center')}>
      {isPending ? (
        <Spinner />
      ) : (
        <>
          <section className="flex w-60 flex-col border-t bg-background">
            <header className="flex-shrink-0 p-5 text-sm font-semibold">
              组织架构
              <Button className=" float-right h-5 px-1" variant="ghost" onClick={() => setIsExpend(!isExpend)}>
                <ListTreeIcon size={16} color="#C1C3CC" />
              </Button>
              <Button className=" float-right mr-3 h-5 px-1" variant="ghost" onClick={() => refetch()}>
                <RefreshCwIcon size={16} color="#C1C3CC" />
              </Button>
            </header>
            <div className="w-full flex-1 flex-shrink-0 overflow-y-auto px-5 pb-5">
              {departmentId ? (
                <Tree
                  initialSlelectedItemIds={[departmentId + '']}
                  data={(deptDatas || []).map(d => ({
                    ...d,
                    id: d.id + '',
                    parentId: d.parentDepartmentId + '',
                    name: d.departmentName
                  }))}
                  dirCheck
                  expandAll={isExpend}
                  onSelectChange={itemIds => setDepartmentId(+itemIds[0])}
                />
              ) : null}
            </div>
          </section>
          <div className="flex-1 overflow-hidden p-5">
            <div className="flex h-full flex-col rounded-lg bg-background p-5 ">
              <FormRender
                schema={schema}
                ref={formRef}
                searchForm
                handleSubmitFn={handleQuery}
                closeFn={resetSearch}
                // actions={btnActions}
              />
              <div className="my-5 shrink-0  space-x-4">
                <ImportDialog
                  title="导入用户数据"
                  onOk={onImport}
                  template="用户导入模板.xls"
                  onTemplate={onDownloadTemplate}
                >
                  <Button size="sm">导入</Button>
                </ImportDialog>
                <Button size="sm" onClick={onExport}>
                  导出
                </Button>
                <Button size="sm" disabled={!selectUsers.length} onClick={() => onDelete(selectUsers)}>
                  删除
                </Button>
                <Button size="sm" className="float-right " onClick={() => rowAction('add')}>
                  <PlusIcon size={18} />
                  添加用户
                </Button>
              </div>
              {departmentId ? (
                <DataTable
                  initParam={{ departmentIdEq: departmentId }}
                  ref={tableApi}
                  api={getUserList}
                  onSelectionChange={(d: UserData[]) => setSelectUsers(d)}
                  columns={getColumns(rowAction)}
                  option={{ enableRowSelection: (row: Row<UserData>) => row.original.loginName !== ADMIN }}
                />
              ) : null}
            </div>
          </div>
          {detailData && <Detail open={detailOpen} onOpenChange={setDetailOpen} data={detailData} />}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent
              className={['add', 'edit'].includes(sheetInfo?.type + '') ? 'w-180 py-3 sm:w-180 sm:max-w-180  ' : 'py-3'}
            >
              <SheetHeader>
                <SheetTitle>
                  {
                    { add: '添加用户', edit: '修改用户', show: '查看用户', resetPwd: '修改密码', role: '分配角色' }[
                      sheetInfo?.type + ''
                    ]
                  }
                </SheetTitle>
              </SheetHeader>
              {open &&
                sheetInfo?.type &&
                (['add', 'edit'].includes(sheetInfo.type) ? (
                  <EditPart
                    onSaveClose={() => {
                      reQuery('add' === sheetInfo.type)
                      setOpen(false)
                    }}
                    onClose={() => setOpen(false)}
                    data={sheetInfo.data}
                    deptDatas={deptDatas!}
                    departmentId={departmentId!}
                  />
                ) : sheetInfo.type === 'resetPwd' ? (
                  sheetInfo.data && (
                    <Password
                      onSaveClose={() => {
                        setOpen(false)
                      }}
                      onClose={() => setOpen(false)}
                      data={sheetInfo.data}
                    />
                  )
                ) : sheetInfo.type === 'role' ? (
                  sheetInfo.data && (
                    <Role
                      onSaveClose={() => {
                        setOpen(false)
                      }}
                      onClose={() => setOpen(false)}
                      data={sheetInfo.data}
                    />
                  )
                ) : null)}
            </SheetContent>
          </Sheet>
        </>
      )}
    </div>
  )
}
