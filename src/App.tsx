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
    console.log('重置表单');
  }

  // function InputWatchRadio({ control }: any) {
  //   const watchResult = useWatch({
  //     control,
  //     name: "radioValue",
  //     defaultValue: 1,
  //   });
  //   return (
  //     <div>
  //       {watchResult == 2 && (
  //         <FormField
  //           control={form.control}
  //           name="phone"
  //           render={({ field }) => (
  //             <FormItem>
  //               <FormLabel>手机号</FormLabel>
  //               <FormControl>
  //                 <Input
  //                   className="h-9 text-sm"
  //                   onChange={(e) =>
  //                     field.onChange(e.target.value || undefined)
  //                   }
  //                   value={field.value}
  //                 />
  //               </FormControl>
  //               <FormMessage />
  //             </FormItem>
  //           )}
  //         />
  //       )}
  //     </div>
  //   );
  // }

  return (
    <NewFormRender form={form} schema={schemaTemplate} submintFunction={handleSubmint} closeFunction={valReset}/>
    // <div className="w-1/2">
    //   {/* <FormRender form={form} schema={schemaTemplate} /> */}
    //   <Form {...form}>
    //     <form onSubmit={form.handleSubmit(handleSubmint)}>
    //       {/* {valWatch == 1 && ( */}
    //         <FormField
    //           control={form.control}
    //           name="username"
    //           // {...register("username")}
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>账号</FormLabel>
    //               <FormControl>
    //                 <Input
    //                   className="h-9 text-sm"
    //                   onChange={(e) =>
    //                     field.onChange(e.target.value || undefined)
    //                   }
    //                   value={field.value}
    //                 />
    //               </FormControl>
    //               <FormMessage />
    //             </FormItem>
    //           )}
    //         />
    //       {/* )} */}
    //       <FormField
    //         // {...register("radioValue")}
    //         control={form.control}
    //         name="radioValue"
    //         render={({ field }) => (
    //           <FormItem>
    //             <FormLabel>选择显示内容</FormLabel>
    //             <FormControl>
    //               <Radio.Group
    //                 onChange={(e) => {
    //                   field.onChange(e.target.value || undefined);
    //                   console.log("单选", e.target.value);
    //                 }}
    //                 value={field.value}
    //                 options={[
    //                   {
    //                     label: "账号",
    //                     value: 1,
    //                   },
    //                   {
    //                     label: "手机号",
    //                     value: 2,
    //                   },
    //                   {
    //                     label: "密码",
    //                     value: 3,
    //                   },
    //                 ]}
    //               />
    //             </FormControl>
    //             <FormMessage />
    //           </FormItem>
    //         )}
    //       />
    //       <InputWatchRadio/>
    //       <div className="col-start-1 space-x-2.5">
    //         <Button type="submit" className="h-9 text-sm">
    //           提交
    //         </Button>
    //       </div>
    //     </form>
    //   </Form>
    //   <div className="space-x-2.5">
    //     {/* <Button
    //       type="button"
    //       className="h-9 text-sm"
    //       // onClick={}
    //     >
    //       取消
    //     </Button>
    //     <Button
    //       onClick={handleSubmint}
    //       variant="outline"
    //       className="h-9 text-sm"
    //     >
    //       提交
    //     </Button> */}
    //   </div>
    // </div>
  );
}

export default App;
