import { PageData } from '@/api'
import { Result } from '@/utils/fetch'
import { UseQueryResult } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

type ResultType<T> = T[] | PageData<T>
export default function useTable<T>(
  useApi: (params: Record<string, unknown>) => UseQueryResult<Result<ResultType<T>>, Error>,
  defaultParam = {}
) {
  // 分页
  const [pageSize, setPageSize] = useState(10)
  const [pageIndex, setPageIndex] = useState(1)
  // 列表搜索参数
  const [param, setParam] = useState<Record<string, unknown>>({ ...defaultParam })
  // 多行选择
  const [selects, setSelects] = useState<T[]>([])
  // 列表数据
  const [rows, setRows] = useState<T[]>([])
  const [total, setTotal] = useState(0)
  const [isPageData, setPageData] = useState(true)

  const { data, isLoading, refetch } = useApi({ pageIndex, pageSize, ...param })

  useEffect(() => {
    if (!data) return
    if ('data' in data.data) {
      const pageData = data.data as unknown as PageData<T>
      setRows(pageData.data)
      setTotal(pageData.totalItems)
      setPageData(true)
    } else {
      setRows(data.data.slice(0, pageSize))
      setTotal(data.data.length)
      setPageData(false)
    }
  }, [data])

  function setParams(params: Record<string, unknown>) {
    setParam(params)
    if (pageIndex === 1) return
    setPageIndex(1)
  }

  function reset() {
    setParam(defaultParam)
    if (pageIndex === 1) return
    setPageIndex(1)
  }

  function onPageChange(page: number) {
    // 非分页手动实现数据分页
    if (!isPageData) {
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      setRows((data?.data as T[]).slice(startIndex, endIndex))
    } else {
      setPageIndex(page)
    }
    setSelects([])
  }

  return {
    head: {
      param,
      setParams,
      reset
    },
    table: {
      data: rows,
      isLoading,
      selects,
      setSelects
    },
    pagination: { pageSize, total, onPageChange, setPageSize },
    refetch
  }
}
