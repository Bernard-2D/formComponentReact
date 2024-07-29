import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormControl } from './formItem'

interface selectOption {
  label: string
  value: string
}

export default function FieldSelect(props: any) {
  const { field, options } = props
  return (
    <Select key={+new Date()} onValueChange={field.onChange} value={field.value}>
      <FormControl>
        <SelectTrigger className="h-9 w-60 text-sm">
          <SelectValue placeholder={props?.placeholder} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {options?.map((item: selectOption) => {
          return (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
