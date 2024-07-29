import { BASE_API } from '@/config'
import { clearToken, getToken } from '@/store/token'
import { Error } from '@/types'
import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { toast } from 'sonner'

// create an axios instance
const service = axios.create({
  baseURL: BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 90000 // request timeout
})

// whiteList 内的接口不会取消其重复请求
const whiteList = ['/sensitiveWords/check', '/accountHost/port/check']

// request interceptor
service.interceptors.request.use(
  config => {
    if (!whiteList.some(el => el === config.url)) {
      // 不在白名单内，控制取消重复请求
      config.cancelToken = new axios.CancelToken(() => {})
    }
    const token = getToken()
    config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json;charset=UTF-8'
    token ? (config.headers.Authorization = token) : (config.headers.Authorization = null)
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  async response => {
    const { data: res, config, headers } = response
    // 如果该请求的错误不需要被展示，需要在header中声明 errMsg = 'hide
    const { code } = res
    if (code) {
      switch (code) {
        case 200:
          return res
        case 403:
          clearToken()
          return Promise.reject(res)
        default:
          return Promise.reject(res)
      }
    } else if (config.responseType === 'blob') {
      const contentDisposition = headers['content-disposition'] || headers['Content-Disposition']
      const fileName = contentDisposition
        ? decodeURIComponent(contentDisposition.split('filename=')[1]?.trim().replace(/"/g, '') || '')
        : ''
      if (res.type === 'application/json' && !fileName) {
        return Promise.reject(JSON.parse('{}'))
      }
      return {
        data: res as Blob,
        fileName
      }
    }
  },
  error => {
    console.log(error.message) // for debug
    if (!axios.isCancel(error)) {
      console.log(error.message) // for debug
    }
    return Promise.reject(error)
  }
)

export type Result<T> = {
  code: number
  message: string
  data: T
  success?: boolean
  fail?: boolean
  [x: string]: unknown
}

const urlPrefixMap: Record<string, string> = {
  permission: import.meta.env.VITE_API_PERMISSION_CODE
}

function replaceUrlPrefix(url: string) {
  const urlPre = Object.entries(urlPrefixMap).find(([key]) => url.startsWith('/' + key))

  if (urlPre) {
    const [key, val] = urlPre
    return url.replace(new RegExp(`^/${key}`), val ? `/${val}` : '')
  }

  return url
}

function fetch<T>(url: string, data = {}, type = 'GET', rest: AxiosRequestConfig = {}): Promise<Result<T>> {
  const config = { method: type, url: replaceUrlPrefix(url), data, params: data }
  Object.assign(config, rest)
  if (type === 'POST' || type === 'PUT' || type === 'DELETE') {
    config.params = ''
  } else {
    config.data = ''
  }

  return new Promise((resolve, reject) => {
    service(config)
      .then(res => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolve(res as any)
      })
      .catch((err: Error | AxiosError) => {
        console.error('[fetch-error]:', err)
        if (err instanceof AxiosError) {
          toast.error(`${err.message}`)
        } else {
          toast.error(`${err.msg}`)
        }
        reject()
        return
      })
  })
}
export default fetch
