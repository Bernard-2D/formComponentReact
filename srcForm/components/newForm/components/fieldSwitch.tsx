import { Switch } from '@/components/ui/switch'

export default function FieldSwitch(props: any) {
  const { field } = props
  return (
    <Switch
      {...props}
      checked={field.value === props?.status?.enable}
      onCheckedChange={(d: boolean) => field.onChange(d ? props?.status?.enable : props?.status?.disable)}
    />
  )
}
