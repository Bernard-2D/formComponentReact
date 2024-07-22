// import * as LabelPrimitive from '@radix-ui/react-label'
// import * as React from "react";
import { FormProps } from "./types/form";
import { Form } from "./components/formItem";
import FormComponent from "./formComponent";
// import { useForm } from "react-hook-form";

// import { cn } from '../../utils/css'

export default function FormRender(props: FormProps) {
  console.log("FormRender一级的props", props);
  const { form, widgets, schema } = props;
  // const { watch } = useForm()

  // console.log('监听单选', schema);
  return (
    <Form {...form}>
      {schema?.properties?.map((item: any, index: number) => {
        return (
          <FormComponent schema={schema} form={form} key={index} {...item} widgets={widgets} />
        );
      })}
    </Form>
  );
}
