import Layout from '@/layout'
import MainLayout from '@/layout/main'
import Dept from '@/views/dept'
import DevOps from '@/views/dev-ops'
import Dict from '@/views/dict'
import DictDetail from '@/views/dict/detail'
import ErrorPage from '@/views/error-page'
import Home from '@/views/home'
import Log from '@/views/log'
import OpLog from '@/views/log/oplog'
import Login from '@/views/login'
import Menu from '@/views/menu'
import Role from '@/views/role'
import NewRole from '@/views/newRole'
import System from '@/views/system'
import Test from '@/views/test'
import User from '@/views/user'
import { NotFoundRoute, createRootRoute, createRoute } from '@tanstack/react-router'

const rootRoute = createRootRoute({ component: Layout })

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'layout',
  component: MainLayout
})

const indexRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/',
  component: Home
})

const authRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: 'auth'
})

export const authRoutes = [
  {
    path: 'user',
    component: User,
    name: '用户管理',
    icon: 'UserCog'
  },
  {
    path: 'role',
    component: Role,
    name: '角色管理',
    icon: 'Network'
  },
  {
    path: 'newrole',
    component: NewRole,
    name: '自定义角色管理',
    icon:'Network'
  },
  {
    path: 'menu',
    component: Menu,
    name: '菜单管理',
    icon: 'Menu'
  },
  {
    path: 'dept',
    component: Dept,
    name: '部门管理',
    icon: 'Building'
  },

  {
    path: 'system',
    component: System,
    name: '系统管理',
    icon: 'Boxes'
  },
  {
    path: 'dict',
    component: Dict,
    name: '字典管理',
    icon: 'BookA'
  },
  {
    path: 'dict/detail',
    component: DictDetail,
    name: '字典数据',
    icon: 'NotebookTabs'
  },
  {
    path: 'log',
    component: Log,
    name: '登录日志',
    icon: 'FileClock'
  },
  {
    path: 'log/operation',
    component: OpLog,
    name: '操作日志',
    icon: 'ScrollText'
  }
].map(d =>
  createRoute({
    getParentRoute: () => authRoute,
    ...d
  })
)

const testRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'test',
  component: Test
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'login',
  component: Login
})

const devOpsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'devops',
  component: DevOps
})

const notFoundRoute = new NotFoundRoute({
  getParentRoute: () => rootRoute,
  component: ErrorPage
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  layoutRoute.addChildren([authRoute.addChildren(authRoutes)]),
  testRoute,
  devOpsRoute,
  notFoundRoute
])

export const whiteRoutes = ['/login', '/test']

export default routeTree
