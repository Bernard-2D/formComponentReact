import FieldCheckBox from '@/components/newForm/components/fieldCheckBox'
import FieldDatePicker from '@/components/newForm/components/fieldDatePicker'
import FieldIconSelect from '@/components/newForm/components/fieldIconSelect'
import FieldInput from '@/components/newForm/components/fieldInput'
import FieldMultiSelect from '@/components/newForm/components/fieldMultiSelect'
import FieldPassword from '@/components/newForm/components/fieldPassword'
import FieldRadio from '@/components/newForm/components/fieldRadio'
import FieldSelect from '@/components/newForm/components/fieldSelect'
import FieldSwitch from '@/components/newForm/components/fieldSwitch'
import FieldTextarea from '@/components/newForm/components/fieldTextarea'
import FieldTreeSelect from '@/components/newForm/components/fieldTreeSelect'

export const isFunction = (data: any) => typeof data === 'function'

export const INPUT_COMPONENTS = {
  input: FieldInput,
  password: FieldPassword,
  checkbox: FieldCheckBox,
  datePicker: FieldDatePicker,
  select: FieldSelect,
  treeSelect: FieldTreeSelect,
  iconSelect: FieldIconSelect,
  radio: FieldRadio,
  switch: FieldSwitch,
  textarea: FieldTextarea,
  // file: FieldFile,
  multiSelect: FieldMultiSelect,
  fallback: FieldInput
}
