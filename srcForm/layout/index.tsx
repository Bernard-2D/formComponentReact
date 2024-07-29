import { getNoLoginSys, getSys } from '@/api/sys'
import { getLoginUser } from '@/api/user'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Spinner } from '@/components/ui/spinner'
import { SystemKey } from '@/consts'
import { whiteRoutes } from '@/router'
import useConfirmStore from '@/store/confirm'
import useSystemStore from '@/store/system'
import useTokenStore from '@/store/token'
import useUserStore from '@/store/user'
import { cn } from '@/utils/css'
import { useQuery } from '@tanstack/react-query'
import { Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Toaster } from 'sonner'

export default function Layout() {
  const { token } = useTokenStore()
  const { systemInfo, setSystemInfo, reset } = useSystemStore()
  const { setUser, reset: resetUser } = useUserStore()
  const alertState = useConfirmStore()
  const { pathname, search } = useLocation()
  const navigate = useNavigate()
  const systemId = search[SystemKey]

  const { isPending } = useQuery({
    queryKey: ['getSysInfo', systemId, !!token],
    queryFn: () => {
      if (systemId) {
        if (token) {
          getSys(systemId).then(d => setSystemInfo(d.data))
        } else {
          getNoLoginSys(systemId).then(d => setSystemInfo(d.data))
        }
      } else {
        reset()
      }
    }
  })

  useQuery({
    queryKey: ['getLoginUser', token],
    queryFn: () => {
      if (token) {
        getLoginUser().then(d => setUser(d.data))
      } else {
        resetUser()
      }
    }
  })

  useEffect(() => {
    if (!token && !whiteRoutes.includes(pathname)) {
      navigate({ to: '/login', search })
    }
  }, [token, pathname])

  return (
    <div className={cn('h-screen w-screen overflow-auto', isPending && 'flex items-center justify-center')}>
      {isPending ? (
        <Spinner />
      ) : (
        <>
          <Outlet />
          <Helmet>
            <link rel="shortcut icon" href={systemInfo.systemLogo} />
            <title>{systemInfo.systemName}</title>
          </Helmet>
        </>
      )}
      <AlertDialog open={alertState.open}>
        <AlertDialogContent className="sm:max-w-106">
          <AlertDialogHeader>
            <AlertDialogTitle>操作确认</AlertDialogTitle>
            <AlertDialogDescription>{alertState.message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={alertState.onClose}>取消</AlertDialogCancel>
            <AlertDialogAction onClick={alertState.onOk}>确认</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Toaster position="top-center" />
    </div>
  )
}
