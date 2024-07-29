import { Column, ColumnDef, PaginationState, Row, RowSelectionState, flexRender } from '@tanstack/react-table'
import * as React from 'react'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import {
  Table as ReactTable,
  RowData,
  SortingState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  // getPaginationRowModel,
  // getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'

import { ActionInstance } from '@/types/react-table'
import { useState } from 'react'
import { buildActionColumn, cellRender, ellipsisRender, selectColumn } from './column'
import { DataTableColumnHeader } from './column-header'
import { DataTablePagination } from './pagination'

interface Action {
  type: string
  title: string
}

export interface TableColumn<TData, TValue> {
  key: string
  title?: string
  enableSorting?: boolean
  enableResizing?: boolean
  ellipsis?: boolean
  size?: number
  cell?: ColumnDef<TData, TValue>['cell']
  actions?: ((row: Row<TData>) => Action[]) | Action[]
}

interface DataTableProps<TData, TValue> {
  columns: TableColumn<TData, TValue>[]
  data: TData[]
  rowCount?: number
  rowAction?: ActionInstance['onActionClick']
}

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

function genarateColumns<TData, TValue>(columns: TableColumn<TData, TValue>[]) {
  const relColumns: ColumnDef<TData, TValue>[] = []

  columns.forEach(col => {
    if (col.key === 'select') {
      relColumns.push(selectColumn as ColumnDef<TData, TValue>)
    } else if (col.key === 'action') {
      relColumns.push(buildActionColumn(col) as ColumnDef<TData, TValue>)
    } else {
      relColumns.push({
        accessorKey: col.key,
        header: ({ column }) => <DataTableColumnHeader column={column} title={col.title || ''} />,
        cell: col.cell ? col.cell : col.ellipsis ? ellipsisRender(col.key) : cellRender(col.key),
        enableSorting: col.enableSorting === true,
        enableResizing: col.ellipsis ? false : col.enableResizing !== false,
        size: col.size || 150
      })
    }
  })

  return relColumns
}

const pageSizes = [10, 20, 30, 40, 50]

export default function DataTable<TData, TValue>({
  columns,
  data,
  rowAction,
  rowCount
}: DataTableProps<TData, TValue>) {
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

  const table = useReactTable({
    _features: rowAction
      ? [
          {
            createTable: <TData extends RowData>(table: ReactTable<TData>): void => {
              table.onActionClick = rowAction
            }
          }
        ]
      : [],
    data,
    columns: React.useMemo(() => {
      return genarateColumns(columns)
    }, [columns]),
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
    ...(rowCount
      ? {
          manualPagination: true, //后端分页
          rowCount: rowCount,
          onPaginationChange: setPagination
        }
      : {}),
    //update the pagination state when internal APIs mutate the pagination state
    // getPaginationRowModel: getPaginationRowModel(),
    manualSorting: true, //use pre-sorted row model instead of sorted row model
    // getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues()
  })

  React.useEffect(() => {
    setRowSelection({})
  }, [data])

  React.useEffect(() => {
    if (lastRef.current.pagination !== pagination || lastRef.current.sorting !== sorting) {
      setRowSelection({})
      lastRef.current.pagination = pagination
      lastRef.current.sorting = sorting
      rowAction && rowAction('query', { sorting: lastRef.current.sorting, pagination: lastRef.current.pagination })
    }
  }, [pagination, sorting])

  React.useEffect(() => {
    if (lastRef.current.rowSelection !== rowSelection) {
      lastRef.current.rowSelection = rowSelection
      rowAction &&
        rowAction(
          'select',
          Object.keys(rowSelection).map(d => data[+d])
        )
    }
  }, [rowSelection])

  return (
    <div className="flex h-0 flex-1 flex-col  space-y-4 ">
      <div className="min-h-0 rounded-md  bg-white">
        <Table
          style={{
            minWidth: table.getTotalSize()
          }}
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} style={{ ...getCommonPinningStyles(cell.column) }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  没有数据.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {rowCount ? <DataTablePagination table={table} pageSizes={pageSizes} /> : null}
    </div>
  )
}
