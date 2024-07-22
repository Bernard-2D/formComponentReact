import { Button } from "../ui/button";
import {
  Form
} from "../ui/form";
import FormComponent from "../myFormRender/formComponent";
import { cn } from "../utils/css";

type WatchProperties = {
  [path: string]:
  | {
    handler: (value: any) => void;
    immediate?: boolean;
  }
  | ((value: any) => void);
};
interface FormRenderProps {
  form: any;
  schema: any;
  watch: WatchProperties;
  submintFunction?: Function;
  closeFunction?: Function;
}

export default function NewFormRender(props: FormRenderProps) {
  const { form, schema, submintFunction, closeFunction, watch } = props;
  const { displayType, colume } = schema;
  console.log('schemaProps', displayType, colume);
  return (
    <Form {...form}>
      <form className={cn('grid grid-cols-2 gap-x-10 gap-y-5 pt-4')}  onSubmit={form.handleSubmit(submintFunction)}>
        {schema?.properties?.map((item: any, index: number) => {
          return <FormComponent display={displayType} colume={colume} watch={watch} form={form} key={index} {...item} />;
        })}
        <div className="col-start-1 space-x-2.5">
          <Button onClick={closeFunction}>取消</Button>
          <Button type="submit" className="h-9 text-sm">
            提交
          </Button>
        </div>
      </form>
    </Form>
  );

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

  // return (
  //   <div className="w-1/2">
  //     {/* <FormRender form={form} schema={schemaTemplate} /> */}
  //     <Form {...form}>
  //       <form onSubmit={form.handleSubmit(submintFunction)}>
  //         {/* {valWatch == 1 && ( */}
  //           <FormField
  //             control={form.control}
  //             name="username"
  //             // {...register("username")}
  //             render={({ field }) => (
  //               <FormItem>
  //                 <FormLabel>账号</FormLabel>
  //                 <FormControl>
  //                   <Input
  //                     className="h-9 text-sm"
  //                     onChange={(e) =>
  //                       field.onChange(e.target.value || undefined)
  //                     }
  //                     value={field.value}
  //                   />
  //                 </FormControl>
  //                 <FormMessage />
  //               </FormItem>
  //             )}
  //           />
  //         {/* )} */}
  //         <FormField
  //           // {...register("radioValue")}
  //           control={form.control}
  //           name="radioValue"
  //           render={({ field }) => (
  //             <FormItem>
  //               <FormLabel>选择显示内容</FormLabel>
  //               <FormControl>
  //                 <Radio.Group
  //                   onChange={(e) => {
  //                     field.onChange(e.target.value || undefined);
  //                   }}
  //                   value={field.value}
  //                   options={[
  //                     {
  //                       label: "账号",
  //                       value: 1,
  //                     },
  //                     {
  //                       label: "手机号",
  //                       value: 2,
  //                     },
  //                     {
  //                       label: "密码",
  //                       value: 3,
  //                     },
  //                   ]}
  //                 />
  //               </FormControl>
  //               <FormMessage />
  //             </FormItem>
  //           )}
  //         />
  //         <InputWatchRadio/>
  //         <div className="col-start-1 space-x-2.5">
  //           <Button onClick={closeFunction}>取消</Button>
  //           <Button type="submit" className="h-9 text-sm">
  //             提交
  //           </Button>
  //         </div>
  //       </form>
  //     </Form>
  //   </div>
  // );
}
