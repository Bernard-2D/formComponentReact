import { Input } from '@/components/ui/input'

export default function FieldInput(props: any) {
  const { field } = props
  return (
    <Input
      className={'h-9 text-sm'}
      value={field.value}
      onChange={e => field.onChange(e.target.value || undefined)}
      {...props}
    />
  )
}
