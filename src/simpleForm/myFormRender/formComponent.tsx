// import * as React from "react";
// import { Input } from "../../ui/input";
// import { Select } from "../../ui/select";
// import { cn } from '../../utils/css'
import { Select, Input, Radio, Checkbox, Switch } from "antd";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./components/formItem";

export default function FormComponent(componentProps: any) {
  // console.log('componentProps', componentProps.form);

  function setFormValue(name: string, value: any) {
    console.log(name, "输入的值", value);
    componentProps.form.setValue(name, value);
    console.log("表单的值", componentProps.form.getValues());
  }

  let Component = null;
  if (componentProps.type) {
    switch (componentProps.type) {
      case "Input":
        console.log(componentProps?.name, "的props", componentProps.form.control);
        Component = (
          <FormField
            control={componentProps.form?.control}
            name={componentProps?.name}
            render={(field) => (
              <FormItem className="flex w-full justify-start items-center">
                <FormLabel className="w-1/6 font-bold">
                  {/* after:ml-0.5 after:text-destructive after:content-['*'] */}
                  {componentProps.label}：
                </FormLabel>
                <FormControl>
                  <Input
                    className="h-9 text-sm"
                    {...componentProps.props}
                    onChange={(e) =>
                      setFormValue(componentProps.name, e.target.value)
                    }
                    { ...field }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
        break;
      case "Select":
        // console.log("Select的props", componentProps.props);
        Component = (
          <FormItem className="flex w-full justify-start items-center">
            <FormLabel className="w-1/6 font-bold">
              {/* after:ml-0.5 after:text-destructive after:content-['*'] */}
              {componentProps.label}：
            </FormLabel>
            <FormControl>
              <Select
                {...componentProps.props}
                onChange={(e) => setFormValue(componentProps.name, e)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
        break;
      case "Radio":
        // console.log("Radio的props", componentProps.props);
        Component = (
          <FormItem className="flex w-full justify-start items-center">
            <FormLabel className="w-1/6 font-bold">
              {/* after:ml-0.5 after:text-destructive after:content-['*'] */}
              {componentProps.label}：
            </FormLabel>
            <FormControl>
              <Radio.Group {...componentProps.props} />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
        break;
      case "Checkbox":
        // console.log("Checkbox的props", componentProps.props);
        Component = (
          <FormItem className="flex w-full justify-start items-center">
            <FormLabel className="w-1/6 font-bold">
              {/* after:ml-0.5 after:text-destructive after:content-['*'] */}
              {componentProps.label}：
            </FormLabel>
            <FormControl>
              <Checkbox.Group {...componentProps.props} />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
        break;
      case "Switch":
        // console.log("Switch的props", componentProps.props);
        Component = (
          <FormItem className="flex w-full justify-start items-center">
            <FormLabel className="w-1/6 font-bold">
              {/* after:ml-0.5 after:text-destructive after:content-['*'] */}
              {componentProps.label}：
            </FormLabel>
            <FormControl>
              <Switch {...componentProps.props} />
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
