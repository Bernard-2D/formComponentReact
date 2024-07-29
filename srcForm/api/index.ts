export type PageParam = {
  page: number
  size: number
}

export type OrderParam = {
  orderType?: string
}

export interface PageData<T> {
  data: T[]
  index: number
  pageSize: number
  totalItems: number
  totalPages: number
}
