import DatePicker from '@/components/date-picker'

export default function FieldDatePicker(props: any) {
  const { field } = props
  return <DatePicker className="h-9 w-60 text-sm" setDate={field.onChange} date={field.value} {...props} />
}
