import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
// import { cn } from '@/utils/css'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { forwardRef, useEffect, useImperativeHandle } from 'react'
import { useForm, useWatch } from 'react-hook-form'
// import { z } from 'zod'
import FormComponent from './components/formComponent'
import { Schema } from './utils/type'

type WatchProperties = {
  [path: string]:
    | {
        handler: (value: string | object) => void
        immediate?: boolean
      }
    | ((value: string | object) => void)
}

interface actionItem {
  text: string
  type?: 'submit' | 'reset' | 'button' | undefined
  size?: 'default' | 'sm' | 'lg' | 'icon' | null | undefined
  variant?: 'link' | 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | null | undefined
  fn: () => void
}
interface FormRenderProps {
  zodSchema?: any
  defaultValue?: () => void
  schema: Schema
  watch?: WatchProperties
  editForm?: boolean
  searchForm?: boolean
  handleSubmitFn?: () => void
  closeFn?: () => void
  actions?: actionItem[]
}

const FormRender: React.FC = forwardRef((props: FormRenderProps, ref) => {
  const { schema, watch, actions, zodSchema, defaultValue, editForm, searchForm, handleSubmitFn, closeFn } = props
  const { className, properties } = schema
  let formParam = {}
  if (zodSchema) {
    formParam = {
      resolver: zodResolver(zodSchema)
    }
  }
  if (defaultValue) {
    formParam = {
      ...formParam,
      defaultValues: defaultValue()
    }
  }
  const form = useForm(formParam)
  const formValue = useWatch({ control: form.control })
  useImperativeHandle(ref, () => ({
    getFormValue: () => {
      return formValue
    },
    resetForm: () => {
      form.reset()
    }
  }))
  // console.log('FormRender渲染')
  useEffect(() => {
    if (watch) {
      const keys = Object.keys(watch)
      const watchForm = keys.find((item: string) => item === '#')
      if (watchForm) {
        watch[watchForm](formValue)
      }
    }
  }, [formValue, watch])

  let submitFn = () => undefined

  if (actions) {
    const submitItem = actions.find((item: actionItem) => item.type === 'submit')
    submitFn = submitItem?.fn
  }

  if ((editForm || searchForm) && handleSubmitFn) {
    submitFn = handleSubmitFn
  }

  return (
    <Form {...form}>
      <form className={className} onSubmit={form.handleSubmit(submitFn)}>
        {Object.keys(properties)?.map((name: string, index: number) => {
          return (
            <FormComponent
              watch={watch}
              form={form}
              key={index}
              name={name}
              // formItemWidth={formItemWidth}
              {...properties[name]}
            />
          )
        })}
        <div className="col-start-1 space-x-2.5">
          {actions?.map((btn: actionItem, index: number) => {
            if (btn.type === 'submit') {
              return (
                <Button key={index} className="h-9 text-sm" size={btn?.size} type={btn?.type} variant={btn?.variant}>
                  {btn.text}
                </Button>
              )
            } else {
              return (
                <Button
                  key={index}
                  className="h-9 text-sm"
                  size={btn?.size}
                  type={btn.type}
                  variant={btn?.variant}
                  onClick={btn.fn}
                >
                  {btn.text}
                </Button>
              )
            }
          })}
          {(editForm || searchForm) && (
            <>
              <Button className="h-9 text-sm" type="reset" variant="outline" size="sm" onClick={closeFn}>
                {editForm ? '取消' : '重置'}
              </Button>
              <Button type="submit" size="sm" className="h-9 text-sm">
                {editForm ? '提交' : '查询'}
              </Button>
            </>
          )}
        </div>
      </form>
    </Form>
  )
})

export default FormRender
