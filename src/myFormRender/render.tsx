// import * as LabelPrimitive from '@radix-ui/react-label'
// import * as React from "react";
import { FormProps } from "./types/form";
import { Form } from "./components/formItem";
import FormComponent from "./formComponent";
import { useForm } from "react-hook-form";

// import { cn } from '../../utils/css'

export default function FormRender(props: FormProps) {
  console.log("FormRender一级的props", props);
  const { form, widgets } = props;
  const { watch } = useForm()
  const valWatch = watch('radioType')
  console.log('监听单选', valWatch);
  return (
    <Form {...form}>
      {props?.schema?.properties?.map((item: any, index: number) => {
        return (
          <FormComponent form={form} key={index} {...item} widgets={widgets} />
        );
      })}
    </Form>
  );
}
