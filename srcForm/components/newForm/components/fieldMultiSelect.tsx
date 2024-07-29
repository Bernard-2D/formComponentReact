import { MultiSelect } from '@/components/multi-select'
export default function FieldMultiSelect(props: any) {
  const { field } = props
  return <MultiSelect {...field} {...props} onValueChange={field.onChange} defaultValue={field.value} />
}
