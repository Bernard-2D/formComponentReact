import { Checkbox } from '@/components/ui/checkbox'

export default function FieldCheckBox(props: any) {
  const { field } = props
  return <Checkbox value={field.value} className=" border-[#CED4DA]" onCheckedChange={field.onChange} />
  // checked={}
}
