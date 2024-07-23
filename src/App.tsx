import { schemaTemplate } from "./myFormRender/schema";
// import FormRender from "./myFormRender";
import NewFormRender from "./newForm";
// import { Input } from "./ui/input";
// import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
// import { Radio } from "antd";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "./ui/form";

function App() {
  const form = useForm({
    defaultValues: undefined,
  });

  function handleSubmint(values: any) {
    console.log("表单提交", values);
  }

  function valReset() {
    form.reset();
    console.log("重置表单");
  }

  const watch = {
    // '#': (changedValues:any, allValues:any) => { // '#': () => {} 等同于 onValuesChange
    //   console.log('自定义watch表单 allValues：', allValues);
    //   console.log('表单 changedValues：', changedValues);
    // },
    'username': (value: any) => {
      console.log("监听用户名", value);
    },
    'phone': (value: any) => {
      console.log("监听手机号", value);
    },
  };

  return (
    <NewFormRender
      watch={watch}
      form={form}
      schema={schemaTemplate}
      submintFunction={handleSubmint}
      closeFunction={valReset}
    />
  );
}

export default App;
