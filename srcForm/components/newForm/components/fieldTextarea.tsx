import { Textarea } from '@/components/ui/textarea'

export default function FieldTextarea(props: any) {
  const { field } = props
  return <Textarea {...field} {...props} onChange={e => field.onChange(e || undefined)} value={field.value} />
}
