// import * as React from "react";
import { Input } from "../ui/input";
// import { Select } from "../../ui/select";
import { cn } from "../utils/css";
// import { useForm } from "react-hook-form";
import { Select, Radio, Checkbox, Switch } from "antd";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./components/formItem";
// import { getWidget } from "./mapping";

export default function FormComponent(componentProps: any) {
  // const { watch } = useForm()
  // console.log('componentProps', form);
  const { widgets, form, type, name, label, props } = componentProps;
  const { hidden, disabled } = props;
  function setFormValue(name: string, value: any) {
    // console.log(name, "输入的值", value);
    form.setValue(name, value);
    // console.log("表单的值", form.getValues());
  }
  let hiddenItem = true;
  let disabledItem = true;
  // const valWatch = watch('radioType')
  // console.log('监听单选', valWatch);
  
  if (hidden) {
    const formData = form.getValues();
    const dec = eval(hidden);
    hiddenItem = dec;
  }
  // const Widget = getWidget(type, widgets);

  // console.log('输出的Widget', Widget);

  let Component = null;
  if (type) {
    switch (type) {
      case "Input":
        console.log(name, "的props", props);
        Component = (
          <FormField
            control={form?.control}
            name={name}
            render={(field) => (
              <FormItem
                className={cn(
                  "flex w-full justify-start items-center ",
                  hiddenItem && "hidden "
                )}
              >
                <FormLabel className="w-1/6">
                  {/* after:ml-0.5 after:text-destructive after:content-['*'] */}
                  {label}：
                </FormLabel>
                <FormControl>
                  <Input
                    className="h-9 text-sm"
                    {...props}
                    onChange={(e) => setFormValue(name, e.target.value)}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
        break;
      case "Select":
        // console.log("Select的props", props);
        Component = (
          <FormItem className="flex w-full justify-start items-center">
            <FormLabel className="w-1/6">
              {/* after:ml-0.5 after:text-destructive after:content-['*'] */}
              {label}：
            </FormLabel>
            <FormControl>
              <Select {...props} onChange={(e) => setFormValue(name, e)} />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
        break;
      case "Radio":
        // console.log("Radio的props", props);
        Component = (
          <FormItem className="flex w-full justify-start items-center">
            <FormLabel className="w-1/6">
              {/* after:ml-0.5 after:text-destructive after:content-['*'] */}
              {label}：
            </FormLabel>
            <FormControl>
              <Radio.Group {...props} />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
        break;
      case "Checkbox":
        // console.log("Checkbox的props", props);
        Component = (
          <FormItem className="flex w-full justify-start items-center">
            <FormLabel className="w-1/6">
              {/* after:ml-0.5 after:text-destructive after:content-['*'] */}
              {label}：
            </FormLabel>
            <FormControl>
              <Checkbox.Group {...props} />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
        break;
      case "Switch":
        // console.log("Switch的props", props);
        Component = (
          <FormItem className="flex w-full justify-start items-center">
            <FormLabel className="w-1/6">
              {/* after:ml-0.5 after:text-destructive after:content-['*'] */}
              {label}：
            </FormLabel>
            <FormControl>
              <Switch {...props} />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
        break;
      default:
        break;
    }
  }
  return Component;
}
