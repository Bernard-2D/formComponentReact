import { MenuData } from '@/api/menu'
import { TreeMenu } from '@/components/tree/tree-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Spinner } from '@/components/ui/spinner'
import { MenuType, SystemKey } from '@/consts'
import { useGetUserMenus } from '@/hooks/api/user'
import useSystemStore from '@/store/system'
import { clearToken } from '@/store/token'
import useUserStore from '@/store/user'
import { cn } from '@/utils/css'
import { getGoSearch } from '@/utils/url'
import { Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function MainLayout() {
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const { systemInfo } = useSystemStore()
  const { userInfo } = useUserStore()

  const [visitedRouters, setVisitedRouters] = useState<MenuData[]>([])
  const systemId = search[SystemKey]

  const { isPending, data: menuDatas } = useGetUserMenus(systemId)

  function menuClick(menu: MenuData) {
    if (!menu.routeUrl) {
      return
    }

    if (pathname === menu.routeUrl) {
      return
    }

    if (menu.permissionType != MenuType.menu) {
      return
    }

    if (!visitedRouters.find(d => d.routeUrl === menu.routeUrl)) {
      setVisitedRouters([...visitedRouters, menu])
    }
    navigate({ to: menu.routeUrl, search: getGoSearch(search) })
  }

  function menuClose(route: MenuData) {
    const newRouters = [...visitedRouters]
    const index = newRouters.findIndex(d => d.routeUrl === route.routeUrl)

    newRouters.splice(index, 1)

    setVisitedRouters(newRouters)

    if (newRouters.length === 0) {
      navigate({ to: '/', search: getGoSearch(search) })
    } else {
      navigate({ to: newRouters[index === 0 ? 0 : index - 1].routeUrl, search: getGoSearch(search) })
    }
  }

  function onLogOut() {
    clearToken()
  }

  useEffect(() => {
    if (menuDatas) {
      const menu = menuDatas.find(d => d.routeUrl === pathname)
      if (menu) {
        if (!visitedRouters.find(d => d.routeUrl === menu.routeUrl)) {
          setVisitedRouters([...visitedRouters, menu])
        }
      } else if (pathname !== '/') {
        navigate({ to: '/', search: getGoSearch(search) })
      }
    }
  }, [menuDatas])

  return (
    <div className="flex  h-full  min-w-300 flex-col ">
      <header className="flex h-14 shrink-0 bg-primary text-white">
        <div className="flex w-56 items-center  text-lg">
          <div style={{ backgroundImage: `url(${systemInfo.systemLogo})` }} className="ml-5 mr-2.5 size-7 bg-contain" />
          {systemInfo.systemName}
        </div>
        <div className="flex-1"></div>
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="mr-10 size-8 cursor-pointer text-xs text-primary">
                <AvatarFallback>{userInfo.username[0]}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-20">
              <DropdownMenuItem onClick={onLogOut}>登出</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <section className="flex h-0 flex-1">
        {isPending || !menuDatas ? (
          <div className="flex w-full items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <>
            <section className="items-start border-r bg-white ">
              <TreeMenu
                data={menuDatas}
                className=" m-5 w-44 flex-col  items-start justify-start space-x-0 space-y-2.5 text-sm"
                onMenuClick={menuClick}
                currentUrl={pathname}
                defaultUrl={pathname}
              />
            </section>
            <section className="flex flex-1 flex-col overflow-hidden">
              <div className="flex   shrink-0 items-center space-x-1 border-b border-gray-200  px-5 py-2.5">
                {visitedRouters.map(d => (
                  <div
                    key={d.routeUrl}
                    className={cn(
                      'flex h-9 shrink-0 cursor-pointer items-center rounded bg-main-2 px-4 text-sm ',
                      pathname === d.routeUrl ? 'text-base font-semibold text-minor' : 'text-minor-1'
                    )}
                  >
                    <div onClick={() => menuClick(d)}>{d.permissionName}</div>
                    <X className="ml-2 inline-block size-4" onClick={() => menuClose(d)} />
                  </div>
                ))}
              </div>
              <main className="h-0 flex-1 overflow-auto bg-minor-6">
                <Outlet />
              </main>
            </section>
          </>
        )}
      </section>
    </div>
  )
}
