import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { FormControl, FormItem, FormLabel } from './formItem'

export default function FieldRadio(props: any) {
  const { field, options } = props
  return (
    <RadioGroup
      onValueChange={field.onChange}
      defaultValue={field.value}
      className="flex h-9 items-center space-x-2.5 text-sm"
    >
      {options?.map(([val, name]) => (
        <FormItem key={val} className="flex items-center space-x-3 space-y-0">
          <FormControl>
            <RadioGroupItem value={val + ''} />
          </FormControl>
          <FormLabel className="font-normal">{name}</FormLabel>
        </FormItem>
      ))}
    </RadioGroup>
  )
}
