import React from "react";
import { schemaTemplate } from "./myFormRender/schema";
import FormRender from "./myFormRender";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";

function App() {
  const { watch } = useForm()
  const valWatch = watch('radioType')
  const form = useForm({
    defaultValues: undefined,
  });

  function handleSubmint() {
    console.log("表单提交", form.getValues());
  }
  React.useEffect(() => {
    const subscription = watch((value, { name, type }) => console.log('第一个watch', value, name, type));
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <div className="w-1/2">
      <FormRender form={form} schema={schemaTemplate} />
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
