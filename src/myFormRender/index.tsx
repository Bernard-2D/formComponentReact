/* eslint-disable react-refresh/only-export-components */
import { FormProps } from "./types/form";
import DefaultFormRender from './render'
import {
  Checkbox,
  DatePicker,
  Input,
  InputNumber,
  Mentions,
  Radio,
  Rate,
  Select,
  Slider,
  Switch,
  TimePicker,
  TreeSelect,
} from "antd";
import dayjs from "dayjs";

const widgets = {
  Input: Input,
  InputNumber: InputNumber,
  Checkbox: Checkbox.Group,
  DatePicker: DatePicker,
  DateRangePicker: DatePicker.RangePicker,
  Mentions: Mentions,
  Radio: Radio.Group,
  RadioButton: Radio.Button,
  Rate: Rate,
  Select: Select.Option,
  TreeSelect: TreeSelect,
  Slider: Slider,
  Switch: Switch,
  TimePicker: TimePicker,
  TimeRangePicker: TimePicker.RangePicker,
};

export default function FormRender(props: FormProps) {
  console.log('Default一级的props', props);
  
  const { components, variables, ...rest } = props;
  return (
    <DefaultFormRender
      // options={{ props: { autoComplete: "off" } }}
      widgets={{ ...widgets, ...components }}
      variables={{ ...variables, dayjs }}
      {...rest}
    />
  );
}
