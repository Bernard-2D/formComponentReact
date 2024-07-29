import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { CellContext, ColumnDef } from '@tanstack/react-table'
import { EllipsisIcon } from 'lucide-react'
import { TableColumn } from '.'
import { DataTableColumnHeader } from './column-header'

export const selectColumn: ColumnDef<unknown, unknown> = {
  id: 'select',
  header: ({ table }) => (
    <Checkbox
      className="border-[#CED4DA]"
      checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
      onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      className="border-[#CED4DA]"
      checked={row.getIsSelected()}
      onCheckedChange={value => row.toggleSelected(!!value)}
      aria-label="Select row"
    />
  ),
  size: 50,
  enableSorting: false
}

function actionRender<TData, TValue>(column: TableColumn<TData, TValue>) {
  const actions = column.actions

  return ({ row, table }: CellContext<TData, unknown>) => {
    const items = actions ? (typeof actions === 'function' ? actions(row) : actions) : []

    return (
      <div className="flex space-x-1.5">
        {items.slice(0, items.length > 3 ? 2 : items.length).map(item => (
          <Button
            key={item.type}
            variant="ghost"
            className="flex h-8 min-w-8 p-0 text-primary"
            onClick={() => table.onActionClick(item.type, row.original)}
          >
            {item.title}
          </Button>
        ))}
        {items.length > 3 && items.slice(2).length && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
                <EllipsisIcon className="h-4 w-4 text-[#AFB0B2]" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {items.slice(2).map(item => (
                <DropdownMenuItem key={item.type} onClick={() => table.onActionClick(item.type, row.original)}>
                  {item.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    )
  }
}

export function buildActionColumn<TData, TValue>(column: TableColumn<TData, TValue>) {
  return {
    id: 'actions',
    header: ({ column }) => <DataTableColumnHeader column={column} title="操作" />,
    cell: actionRender(column),
    size: column.size || 140
  } as ColumnDef<Record<string, unknown>>
}

export function ellipsisRender<TData, TValue>(key: string) {
  return ({ row, column }: CellContext<TData, TValue>) => {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <div className="truncate" style={{ width: `calc(${column.getSize()}px - 2rem)` }}>
              {row.getValue(key)}
            </div>
          </TooltipTrigger>
          <TooltipContent isPortal>
            <p className="max-w-56">{row.getValue(key)}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
}

export function cellRender<TData, TValue>(key: string) {
  return ({ row }: CellContext<TData, TValue>) => {
    return <div className="whitespace-nowrap">{row.getValue(key)}</div>
  }
}
