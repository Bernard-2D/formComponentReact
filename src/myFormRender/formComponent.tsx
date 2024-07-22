import { Input } from "../ui/input";
// import { Select } from "../../ui/select";
import { cn } from "../utils/css";
import { Select, Radio, Checkbox, Switch } from "antd";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./components/formItem";
import { useWatch } from "react-hook-form";

export default function FormComponent(componentProps: any) {
  const { form, type, name, label, props, watch, display, colume } =
    componentProps;
  let watchAll = false,
    watchCurrent = false;
  const watchFormItem = useWatch({
    control: form.control,
    name,
  });

  if (watch) {
    Object.keys(watch).map((key: any) => {
      watchAll = key === "#" ? true : false;
      watchCurrent = key === name ? true : false;
      if (watchAll) {
        const value = watchFormItem;
        const change = {
          [name]: value,
        };
        const allValue = form.getValues();
        if (value) {
          watch[key](change, allValue);
        }
      }
      if (watchCurrent) {
        const value = watchFormItem;
        if (value) {
          watch[key](value);
        }
      }
    });
  }

  let Component = null;
  if (type) {
    switch (type) {
      case "Input":
        Component = (
          <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem className={cn("")}>
                {/* <div> */}
                  <FormLabel className={cn("")}>
                    {/* after:ml-0.5 after:text-destructive after:content-['*'] */}
                    {label}：
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-9 text-sm"
                      {...field}
                      {...props}
                      onChange={(e) =>
                        field.onChange(e.target.value || undefined)
                      }
                      value={field.value}
                    />
                  </FormControl>
                {/* </div> */}
                <FormMessage />
              </FormItem>
            )}
          />
        );
        break;
      case "Select":
        Component = (
          <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem className={cn("")}>
                <FormLabel className="">
                  {/* after:ml-0.5 after:text-destructive after:content-['*'] */}
                  {label}：
                </FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    {...props}
                    onChange={(e) => field.onChange(e || undefined)}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
        break;
      case "Radio":
        Component = (
          <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem className={cn("")}>
                <FormLabel className="">
                  {/* after:ml-0.5 after:text-destructive after:content-['*'] */}
                  {label}：
                </FormLabel>
                <FormControl>
                  <Radio.Group
                    {...field}
                    {...props}
                    onChange={(e) => field.onChange(e || undefined)}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
        break;
      case "Checkbox":
        Component = (
          <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem className={cn("")}>
                <FormLabel className="">
                  {/* after:ml-0.5 after:text-destructive after:content-['*'] */}
                  {label}：
                </FormLabel>
                <FormControl>
                  <Checkbox.Group
                    {...field}
                    {...props}
                    onChange={(e) => field.onChange(e || undefined)}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
        break;
      case "Switch":
        // console.log("Switch的props", props);
        Component = (
          <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem className={cn("")}>
                <FormLabel className="">
                  {/* after:ml-0.5 after:text-destructive after:content-['*'] */}
                  {label}：
                </FormLabel>
                <FormControl>
                  <Switch
                    {...field}
                    {...props}
                    onChange={(e) => field.onChange(e || undefined)}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
        break;
      default:
        break;
    }
  }

  return Component;
}
