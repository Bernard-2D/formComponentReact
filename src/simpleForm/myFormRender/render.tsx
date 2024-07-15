// import * as LabelPrimitive from '@radix-ui/react-label'
// import * as React from "react";
import { FormProps } from "./types/form";
import { useForm } from "react-hook-form";
import { Form } from "./components/formItem";
import FormComponent from "./formComponent";

// import { cn } from '../../utils/css'

export default function FormRender(props: FormProps) {
  const form = useForm({
    defaultValues: undefined,
    values: undefined,
  });
  console.log("props", props?.schema);
  return (
    <Form {...form}>
      <form>
      {/* className={cn("grid grid-cols-2 gap-x-10 gap-y-5 pt-4")} */}
        {props?.schema?.map((item: any, index: number) => {
          return <FormComponent key={index} {...item} />;
        })}
      </form>
    </Form>
  );
}
