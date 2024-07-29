import { cn } from '@/utils/css'
import React, { memo, useEffect } from 'react'
import { useWatch } from 'react-hook-form'
import { INPUT_COMPONENTS } from '../utils'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './formItem'

const FormComponent: React.FC = memo((componentProps: any) => {
  const { form, type, name, label, props = {}, watch } = componentProps // display, column,
  const { required = false } = props

  const watchFormItem = useWatch({
    control: form.control,
    name
  })

  useEffect(() => {
    if (watch) {
      Object.keys(watch).map((key: string) => {
        if (key === name) {
          const value = watchFormItem
          if (value) {
            watch[key](value)
          }
        }
      })
    }
  }, [watchFormItem])
  const componentType = type || 'fallback'

  const InputComponent = INPUT_COMPONENTS[componentType]
  // console.log('Component', INPUT_COMPONENTS[type]);
  if (InputComponent === undefined) {
    return <></>
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(props?.className)}>
          {/* <div> */}
          {label && (
            <FormLabel className={cn(required && "after:ml-0.5 after:text-destructive after:content-['*']")}>
              {label}
            </FormLabel>
          )}
          <FormControl>
            <InputComponent
              field={field}
              // className={'h-9 text-sm'}
              // value={field.value}
              // onChange={e => field.onChange(e.target.value || undefined)}
              {...props}
            />
          </FormControl>
          {/* </div> */}
          <FormMessage />
        </FormItem>
      )}
    />
  )
})

export default FormComponent
