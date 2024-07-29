import { IconSelect } from '@/components/icon-select'

export default function FieldIconSelect(props: any) {
  const { field } = props
  return <IconSelect defaultValue={field.value} onValueChange={d => field.onChange(d)} {...props} />
}
