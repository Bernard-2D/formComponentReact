import { PageParam } from '@/types'
import fetch from '@/utils/fetch'
import { PageData } from '.'

// -----------------------登录日志-----------------------//
export interface QueryParam extends PageParam {
  beginTime?: string
  endTime?: string
  ip?: string
  loginName?: string
  status?: string
  sortOrder?: string
  [key: string]: unknown
}
export interface LoginLog {
  id: string // id
  createTime: string // 创建时间
  loginName: string // 登录账号名
  macAddress: string // 登录地址
  ip: string // 登录ip
  remark: string // 备注
  status: string // 状态（0正常 1停用）

  [key: string]: string // 字符串索引签名
}

export function getLoginLogs(param: QueryParam) {
  return fetch<PageData<LoginLog>>('/permission/sysLoginLog/list', param)
}
export function deleteLoginLog(ids: string[]) {
  return fetch('/permission/sysLoginLog/delete', { ids }, 'DELETE')
}

// -----------------------操作日志-----------------------//
export interface QueryLogParam extends PageParam {
  beginTime?: string
  endTime?: string
  businessType?: string
  operationIp?: string
  operationStatus?: string
  operator?: string
  sortField?: string
  sortOrder?: string
  [key: string]: unknown
}
export interface LogData {
  businessType: string // 业务类型
  consumeTime: string // 消耗时间,单位毫秒
  errorCode: string // 错误码
  errorMsg: string // 错误消息
  id: string // id
  operationIp: string // 主机地址
  operationStatus: string // 操作状态（0正常 1异常）
  operationUrl: string // 请求URL
  operator: string // 操作人
  operatorTime: string // 操作时间
  remark: string // 备注
  requestParam: string // 请求参数
  requestType: string // 请求方式
  result: string // 返回参数
  title: string // 标题

  [key: string]: string // 字符串索引签名
}

export function getOpLogs(param: QueryLogParam) {
  return fetch<PageData<LogData>>('/permission/sysOperationLog/list', param)
}
export function deleteOpLog(ids: string[]) {
  return fetch('/permission/sysOperationLog/delete', { ids }, 'DELETE')
}

export function exportOpLog(params: Record<string, unknown>) {
  return fetch('/permission/sysOperationLog/export', params, 'Get', { responseType: 'blob' })
}
