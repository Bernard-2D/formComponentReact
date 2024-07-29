import fetch from '@/utils/fetch'
export interface QueryListParam {
  departmentNameLike?: string
  departmentStatusEq?: string
}
interface Dept {
  id: number
  departmentName: string
  departmentStatus: number
  email: string
  manager: string
  managerPhone: string
  parentDepartmentId: number
  sortNumber: number
}

export type DeptData = Omit<Dept, ''>

export type EditDept = Partial<Dept>

export function getUserDeptList() {
  return fetch<DeptData[]>('/permission/sysUser/departmentList', undefined, 'POST')
}

export function getDeptList(param: QueryListParam = {}) {
  return fetch<DeptData[]>('/permission/sysDepartment/list', param, 'POST')
}

export function addDept(param: EditDept) {
  return fetch('/permission/sysDepartment/add', param, 'POST')
}

export function editDept(param: EditDept) {
  return fetch('/permission/sysDepartment/edit', param, 'PUT')
}

export function deleteDept(id: number) {
  return fetch(`/permission/sysDepartment/${id}`, undefined, 'DELETE')
}
