import { TreeSelect } from '@/components/tree/tree-select'

export default function FieldTreeSelect(props: any) {
  const { field } = props
  return (
    <TreeSelect
      {...props}
      defaultValue={field.value ? [field.value] : []}
      onValueChange={(e: any) => field.onChange(e[0] || undefined)}
      value={field.value}
    />
  )
}
