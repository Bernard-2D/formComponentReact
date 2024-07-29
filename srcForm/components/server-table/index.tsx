import { OrderParam, PageData, PageParam } from '@/api'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { OrderType } from '@/consts'
import { Result } from '@/utils/fetch'
import { useQuery } from '@tanstack/react-query'
import {
  Column,
  ColumnDef,
  PaginationState,
  RowSelectionState,
  SortingState,
  TableOptions,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  useReactTable
} from '@tanstack/react-table'
import * as React from 'react'
import { useState } from 'react'
import { DataTablePagination } from '../table/pagination'
import { Spinner } from '../ui/spinner'
import DataTableColumnHeader from './column/header'
import selectColumn from './column/select-column'

function getCommonPinningStyles<TData, TValue>(column: Column<TData, TValue>, isHead = false): React.CSSProperties {
  const isPinned = column.getIsPinned()
  // const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left')
  // const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right')

  //TODO 样式不对 需要实现表格无滚动条时无固定列的样式 有滚动条时展示样式
  return {
    backgroundColor: 'inherit',
    // boxShadow: isLastLeftPinnedColumn
    //   ? '-10px 0 8px -8px #0505050f inset'
    //   : isFirstRightPinnedColumn
    //     ? '10px 0 8px -8px #0505050f inset'
    //     : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    opacity: 1,
    position: isPinned ? 'sticky' : 'relative',
    width: column.columnDef.enableResizing ? 'auto' : column.getSize(),
    minWidth: column.getSize(),
    zIndex: isPinned ? 1 : 0,
    ...(isHead ? { position: 'sticky', top: 0, zIndex: isPinned ? 3 : 2 } : {})
  }
}

const pageSizes = [10, 20, 30, 40, 50]

interface DataTableProps<TData, TValue, TParam> {
  columns: ColumnDef<TData, TValue>[]
  onSelectionChange: (data: TData[]) => void
  api: (params: TParam & PageParam & OrderParam) => Promise<Result<PageData<TData>>>
  initParam?: TParam
  option?: Partial<TableOptions<TData>>
}

export interface TableApi<TParam> {
  refresh: (param: TParam, toFirstPage?: boolean) => unknown
}

const DataTable: ForwardRefWithGenerics = React.forwardRef(function DataTable<
  TData,
  TValue,
  TParam extends Record<string, unknown>
>(
  { columns, onSelectionChange, api, initParam = {} as TParam, option = {} }: DataTableProps<TData, TValue, TParam>,
  ref: React.Ref<TableApi<TParam>>
) {
  const lastRef = React.useRef<{ rowSelection: RowSelectionState; sorting: SortingState; pagination: PaginationState }>(
    {
      rowSelection: {},
      sorting: [],
      pagination: {
        pageIndex: 0,
        pageSize: pageSizes[0]
      }
    }
  )
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(lastRef.current.rowSelection)
  const [sorting, setSorting] = useState<SortingState>(lastRef.current.sorting)
  const [pagination, setPagination] = useState<PaginationState>(lastRef.current.pagination)
  const queryParamsRef = React.useRef<TParam>(initParam)

  const {
    isPending,
    data = { data: [], rowCount: 0 },
    refetch
  } = useQuery({
    queryKey: [
      {
        api: api.name,
        sorting,
        pagination
      }
    ],
    queryFn: () =>
      api({
        ...queryParamsRef.current,
        orderType: sorting.map(d => (d.desc ? OrderType.desc : OrderType.asc)).join(',') || OrderType.desc,
        size: pagination.pageSize,
        page: pagination.pageIndex + 1
      })
        .then(d => ({ data: d.data.data, rowCount: d.data.totalItems }))
        .catch(() => ({
          data: [],
          rowCount: 0
        }))
  })

  React.useImperativeHandle(ref, () => {
    return {
      refresh(param: TParam, toFirstPage = false) {
        queryParamsRef.current = param
        if (toFirstPage && pagination.pageIndex) {
          setPagination({
            pageIndex: 0,
            pageSize: pagination.pageSize
          })
        } else {
          refetch()
        }
      }
    }
  })

  const table = useReactTable({
    data: data.data,
    columns: [
      selectColumn as ColumnDef<TData, TValue>,
      ...columns.map(
        d =>
          ({
            ...d,
            header: ({ column }) => <DataTableColumnHeader column={column} title={d.header as string} />
          }) as ColumnDef<TData, TValue>
      )
    ],
    initialState: {
      columnPinning: {
        left: ['select'],
        right: ['actions']
      }
    },
    state: {
      sorting,
      rowSelection,
      pagination
    },
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    //分页部分
    ...(data.rowCount
      ? {
          manualPagination: true, //后端分页
          rowCount: data.rowCount,
          onPaginationChange: setPagination
        }
      : {}),
    //update the pagination state when internal APIs mutate the pagination state
    // getPaginationRowModel: getPaginationRowModel(),
    manualSorting: true, //use pre-sorted row model instead of sorted row model
    // getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    meta: {
      refetch
    },
    ...option
  })

  React.useEffect(() => {
    if (pagination.pageIndex) {
      setPagination({
        pageIndex: 0,
        pageSize: pagination.pageSize
      })
    }
  }, [api])

  React.useEffect(() => {
    if (Object.keys(rowSelection).length) {
      setRowSelection({})
    }
  }, [data])

  React.useEffect(() => {
    onSelectionChange && onSelectionChange(Object.keys(rowSelection).map(d => data.data[+d]))
  }, [rowSelection])

  return (
    <div className="flex h-0 flex-1 flex-col  space-y-4 ">
      {isPending ? (
        <Spinner />
      ) : (
        <div className="min-h-0 overflow-auto  rounded-md bg-white">
          <Table
            style={{
              minWidth: table.getTotalSize()
            }}
            isEmpty={table.getRowModel().rows?.length === 0 && !isPending}
          >
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => {
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className="font-semibold text-[#292D33]"
                        style={{ ...getCommonPinningStyles(header.column, true) }}
                      >
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} style={{ ...getCommonPinningStyles(cell.column) }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {data.rowCount ? <DataTablePagination table={table} pageSizes={pageSizes} /> : null}
    </div>
  )
})

export default DataTable
