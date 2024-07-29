import { Table } from '@tanstack/react-table'
import { ChevronLeftIcon, ChevronRightIcon, EllipsisIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/utils/css'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  pageSizes: number[]
}

export function DataTablePagination<TData>({ table, pageSizes }: DataTablePaginationProps<TData>) {
  const curIndex = table.getState().pagination.pageIndex + 1
  const pageCount = table.getPageCount()

  const indexList = [1]

  if (curIndex > 3) {
    indexList.push(-1)
  }

  if (curIndex > 2) {
    indexList.push(curIndex - 1)
  }

  if (curIndex !== 1 && curIndex !== pageCount) {
    indexList.push(curIndex)
  }

  if (curIndex + 1 < pageCount) {
    indexList.push(curIndex + 1)
  }

  if (curIndex < pageCount - 2) {
    indexList.push(-2)
  }

  if (pageCount !== 1) {
    indexList.push(pageCount)
  }

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">共{table.getRowCount()}条数据</div>
      <div className="flex items-center space-x-5">
        <div className="flex items-center space-x-2">
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value: unknown) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[100px] ">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top" className="w-[80px]">
              {pageSizes.map(pageSize => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize} 条/页
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          {/* <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeftIcon className="h-4 w-4" />
          </Button> */}
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>

          {indexList.map((index, i) => (
            <Button
              key={indexList.length + '' + index + '' + i}
              variant="outline"
              className={cn(
                'h-8 w-8 p-0',
                curIndex === index ? 'border-none bg-primary text-white hover:bg-primary hover:text-white' : ''
              )}
              onClick={() => index > 0 && curIndex !== index && table.setPageIndex(index - 1)}
            >
              {/* <span>{table.getState().pagination.pageIndex + 1}</span> */}
              {index > 0 ? <span>{index}</span> : <EllipsisIcon className="h-4 w-4" />}
            </Button>
          ))}

          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          {/* <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRightIcon className="h-4 w-4" />
          </Button> */}
        </div>
      </div>
    </div>
  )
}
