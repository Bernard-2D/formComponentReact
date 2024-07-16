// import { useState } from "react";
import { schemaTemplate } from "./simpleForm/schema";
import FormRender from "./simpleForm/myFormRender";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
// import { FormProps } from "./simpleForm/myFormRender/render";
// import { Form } from "./simpleForm/myFormRender/components/formItem";
// import FormComponent from "./simpleForm/myFormRender/formComponent";

function App() {
  function SetFormRuler(schema: any): z.ZodType {    
    const obj = {} as any;
    schema.map((item: any) => {
      // console.log('111', item);
      if (Object.prototype.hasOwnProperty.call(item, "rules")) {
        console.log(item.name, "校验规则", item.rules);
        obj[item.name] = z.string({
          required_error: `${item.name}不能为空`
        }).max(3, '长度不能超过3')
      }
    });
    console.log('obj', obj);
    
    return z.object(obj);
  }

  const form = useForm({
    resolver: zodResolver(SetFormRuler(schemaTemplate)),
    defaultValues: undefined,
    // values: undefined,
  });

  function handleSubmint() {
    console.log("表单提交", form.getValues());
  }

  return (
    <div className="w-1/2">
      <FormRender form={form} schema={schemaTemplate} />
      {/* handleSubmit={} */}
      {/* <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          {/* className={cn("grid grid-cols-2 gap-x-10 gap-y-5 pt-4")}
          {props?.schema?.map((item: any, index: number) => {
            return <FormComponent form={form} key={index} {...item} />;
          })}
        </form>
      </Form> */}
      <div className="space-x-2.5">
        <Button
          type="button"
          className="h-9 text-sm"
          // onClick={}
        >
          取消
        </Button>
        <Button
          onClick={handleSubmint}
          variant="outline"
          className="h-9 text-sm"
        >
          提交
        </Button>
      </div>
    </div>
  );
}

export default App;
