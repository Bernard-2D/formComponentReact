// import * as React from "react";
// import { Input } from "../../ui/input";
// import { Select } from "../../ui/select";
import { cn } from '../../utils/css'
import { Select, Input, Radio, Checkbox, Switch } from "antd";
import {
  FormControl,
  // FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./components/formItem";

export default function FormComponent(componentProps: any) {
  let Component = null;
  if (componentProps.type) {
    switch (componentProps.type) {
      case "Input":
        console.log("Input的props", componentProps);
        Component = (
          <FormItem className={cn("flex w-full flex-col justify-start")}>
            <div style={{ display: 'flex' }}>
              <FormLabel>
                {/* after:ml-0.5 after:text-destructive after:content-['*'] */}
                {componentProps.label}
              </FormLabel>
              <FormControl>
                <Input className="h-9 text-sm" {...componentProps.props} />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        );
        break;
      case "Select":
        console.log("Select的props", componentProps.props);
        Component = (
          <FormItem className="flex w-full flex-col justify-start">
            <FormLabel>
              {/* after:ml-0.5 after:text-destructive after:content-['*'] */}
              {componentProps.label}
            </FormLabel>
            <FormControl>
              <Select {...componentProps.props} />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
        break;
      case "Radio":
        console.log("Radio的props", componentProps.props);
        Component = (
          <FormItem className="flex w-full flex-col justify-start">
            <FormLabel>
              {/* after:ml-0.5 after:text-destructive after:content-['*'] */}
              {componentProps.label}
            </FormLabel>
            <FormControl>
              <Radio.Group {...componentProps.props} />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
        break;
      case "Checkbox":
        console.log("Checkbox的props", componentProps.props);
        Component = (
          <FormItem className="flex w-full flex-col justify-start">
            <FormLabel>
              {/* after:ml-0.5 after:text-destructive after:content-['*'] */}
              {componentProps.label}
            </FormLabel>
            <FormControl>
              <Checkbox.Group {...componentProps.props} />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
        break;
      case "Switch":
        console.log("Switch的props", componentProps.props);
        Component = (
          <FormItem className="flex justify-start">
            <FormLabel>
              {/* after:ml-0.5 after:text-destructive after:content-['*'] */}
              {componentProps.label}
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
