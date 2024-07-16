// import * as LabelPrimitive from '@radix-ui/react-label'
// import * as React from "react";
import { FormProps } from "./types/form";
import { Form } from "./components/formItem";
import FormComponent from "./formComponent";
// import { useForm } from "react-hook-form";

// import { cn } from '../../utils/css'

export default function FormRender(props: FormProps) {
  // const form = useForm({
  //   defaultValues: undefined,
  //   values: undefined,
  // });
  // console.log("props", props?.schema);
  return (
    <Form {...props.form}>
      {/* <form onSubmit={props.form.handleSubmit(props?.handleSubmit)}> */}
        {props?.schema?.map((item: any, index: number) => {
          return <FormComponent form={props.form} key={index} {...item} />;
        })}
      {/* </form> */}
    </Form>
  );
}
