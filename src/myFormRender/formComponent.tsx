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
import { useWatch, useForm } from "react-hook-form";

export default function FormComponent(componentProps: any) {
  const { form, type, name, label, props, watch } = componentProps;
  let watchAll = false,
    watchCurrent = false;
  if (watch) {
    Object.keys(watch).map((key: any) => {
      watchAll = key === "#" ? true : false;
      watchCurrent = key === name ? true : false;
      console.log("监听的对象的回调方法", watch[key]);
    });
    console.log('watchAll', watchAll);
    console.log('watchCurrent', watchCurrent);
  }
  const { hidden } = props;
  // const { register } = useForm()
  // let disabledVal = false;
  // if (disabled && disabled?.target) {
  //   const value = CreateWatch(form.control, disabled?.target);
  //   disabledVal = eval(disabled.condition);
  // }

  let Component = null;
  // 监听某个表单项的方法
  function CreateWatch({ control }: any, name: string) {
    const watchResult = useWatch({
      control,
      name,
    });
    return watchResult;
  }
  if (type) {
    switch (type) {
      case "Input":
        Component = (
          <FormField
            control={form.control}
            name={name}
            // {...register(name, {required: true, min: 8})}
            render={({ field }) => (
              <FormItem className={cn("my-3")}>
                <FormLabel className={cn("my-2")}>
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
                <FormLabel className="w-36">
                  {/* after:ml-0.5 after:text-destructive after:content-['*'] */}
                  {label}：
                </FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    {...props}
                    onChange={(e) => field.onChange(e || undefined)}
                    value={field.value}
                    // disabled={disabledVal}
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
                <FormLabel className="w-36">
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
                <FormLabel className="w-36">
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
                <FormLabel className="w-36">
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

  if (hidden?.target) {
    const value = CreateWatch(form.control, hidden.target);
    Component = <div>{eval(`${hidden.condition}`) && Component}</div>;
  }

  return Component;
}
