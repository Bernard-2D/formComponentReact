import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { CellContext } from '@tanstack/react-table'
import { EllipsisIcon } from 'lucide-react'

export interface Action<TData> {
  name: string
  action: (context: CellContext<TData, unknown>) => void
}

function ActionCell<TData>(context: CellContext<TData, unknown>) {
  const { column, row } = context
  const columnMeta = column.columnDef.meta

  const items: Action<TData>[] = columnMeta ? (typeof columnMeta === 'function' ? columnMeta(row) : columnMeta) : []

  return (
    row.getCanSelect() && (
      <div className="flex space-x-1.5">
        {items.slice(0, items.length > 3 ? 2 : items.length).map(item => (
          <Button
            key={item.name}
            variant="ghost"
            className="flex h-8 min-w-8 p-0 text-primary"
            onClick={() => item.action(context)}
          >
            {item.name}
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
                <DropdownMenuItem key={item.name} onClick={() => item.action(context)}>
                  {item.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    )
  )
}

export default ActionCell
