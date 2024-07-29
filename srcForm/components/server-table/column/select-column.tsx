import { Checkbox } from '@/components/ui/checkbox'
import { ColumnDef } from '@tanstack/react-table'

const selectColumn: ColumnDef<unknown, unknown> = {
  id: 'select',
  header: ({ table }) => (
    <Checkbox
      className="border-[#CED4DA]"
      checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
      onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
    />
  ),
  cell: ({ row }) =>
    row.getCanSelect() && (
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

export default selectColumn
