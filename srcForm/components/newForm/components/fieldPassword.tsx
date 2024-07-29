import { PasswordInput } from '@/components/password-input'

export default function FieldPassword(props: any) {
  const { field } = props
  return <PasswordInput {...field} {...props} onChange={e => field.onChange(e || undefined)} value={field.value} />
}
