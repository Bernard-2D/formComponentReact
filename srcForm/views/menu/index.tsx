import { EditMenu, MenuData, QueryListParam } from '@/api/menu'
import { Column, TreeTable } from '@/components/tree'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Spinner } from '@/components/ui/spinner'
import { MenuType } from '@/consts'
import { useDeleteMenu, useGetMenuList } from '@/hooks/api/menu'
import { confirm } from '@/store/confirm'
import { PlusIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import EditPart from './edit'
import QueryPart from './query'

export default function Menu() {
  const [open, setOpen] = useState(false)
  const [sheetInfo, setSheetInfo] = useState<{ type: string; data?: EditMenu }>()
  const [isExpend, setIsExpend] = useState(false)
  const queryRef = useRef<QueryListParam>({})
  const menuAllRef = useRef<MenuData[]>([])
  const deleteMenu = useDeleteMenu()
  const {
    isPending,
    data: menuDatas,
    refetch
  } = useGetMenuList(
    () => queryRef.current,
    data => {
      const param = queryRef.current
      if (!param.permissionNameLike && !param.showStatusEq) {
        menuAllRef.current = data
      }
    }
  )

  function getTreeMenus() {
    const param = queryRef.current
    if (!param.permissionNameLike && !param.showStatusEq) {
      return menuDatas
    } else {
      const allMenus = menuAllRef.current
      const menuMap: Record<number, MenuData> = allMenus.reduce((tmp, d) => ({ ...tmp, [d.id]: d }), {})
      const menus = [...(menuDatas || [])]
      const ids = menus.map(d => d.id)

      menuDatas?.forEach(menu => {
        let parent = menuMap[menu.parentId]
        while (parent) {
          if (!ids.includes(parent.id)) {
            menus.push(parent)
            ids.push(parent.id)
          }
          parent = menuMap[parent.parentId]
        }
      })

      return menus
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
      key: 'permissionName',
      cell: row => {
        const name = (row as MenuData).permissionName
        const state = (row as MenuData).permissionType
        const specialClass = {
          1: 'bg-primary text-white',
          2: 'bg-success text-white',
          3: 'bg-warn text-white'
        }[state]
        return (
          <div className="flex flex-1 items-center space-x-2" style={{ width: 150 }}>
            <div>{name}</div>
            <div className={' rounded-sm  p-1 text-xs ' + specialClass}>
              {{ 1: '目录', 2: '菜单', 3: '按钮' }[state]}
            </div>
          </div>
        )
      }
    },
    {
      key: 'sortNumber',
      title: '排序',
      size: 100
    },
    {
      key: 'routeUrl',
      title: '请求地址',
      size: 250
    },
    {
      key: 'showStatus',
      title: '菜单状态',
      cell: row => {
        const state = (row as unknown as MenuData)['showStatus']
        const specialClass = {
          0: 'bg-success-1 text-success',
          1: 'bg-error-1 text-error'
        }[state]
        return (
          <div className="flex items-center space-x-2" style={{ width: 150 }}>
            <div>菜单状态</div>
            <div className={' rounded-sm  p-1 text-xs ' + specialClass}>{{ 0: '正常', 1: '停用' }[state]}</div>
          </div>
        )
      },
      size: 120
    },
    {
      key: 'interfaceIdentity',
      title: '权限标识',
      size: 250
    },
    {
      key: 'action',
      actions: [
        {
          action: row => {
            setSheetInfo({ type: 'edit', data: row as EditMenu })
            setOpen(true)
          },
          name: '编辑'
        },
        {
          action: row => {
            const menu = row as unknown as MenuData
            setSheetInfo({
              type: 'add',
              data: { parentId: (menu.permissionType == MenuType.button ? row.parentId : row.id) as number }
            })
            setOpen(true)
          },
          name: '新增'
        },
        {
          action: row => {
            confirm({
              message: `确认删除菜单 【${(row as EditMenu).permissionName}】？`,
              onOk: async close => {
                await deleteMenu.mutateAsync(+row.id)
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
          <QueryPart onQuery={onQuery}></QueryPart>
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
              添加菜单
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {isPending ? <Spinner /> : <TreeTable expandAll={isExpend} data={getTreeMenus() || []} columns={columns} />}
          </div>
        </div>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="flex w-250 flex-col py-3 sm:w-250 sm:max-w-250 ">
          <SheetHeader>
            <SheetTitle>{{ add: '添加', edit: '编辑' }[sheetInfo?.type + '']}菜单</SheetTitle>
          </SheetHeader>
          <EditPart
            onSaveClose={() => {
              refetch()
              setOpen(false)
            }}
            menuDatas={menuAllRef.current || menuDatas || []}
            onClose={() => setOpen(false)}
            data={sheetInfo?.data}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}
