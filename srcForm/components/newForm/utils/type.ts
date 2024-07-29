export type ComponentType =
  | 'Input'
  | 'Select'
  | 'Radio'
  | 'Checkbox'
  | 'Switch'
  | 'MultiSelect'
  | 'PasswordInput'
  | 'TreeSelect'
  | 'Textarea'
  | 'DatePicker'
  | 'IconSelect'
  | string

export interface SchemaBase {
  type?: ComponentType
  name?: string
  description?: string
  className?: string
  disabled?: boolean | string
  properties?: any
}

export type Schema = Partial<SchemaBase>
