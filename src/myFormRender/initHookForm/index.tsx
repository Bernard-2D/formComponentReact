import React from "react";
import { useForm } from "react-hook-form";

interface IFormInputs {
  name: string;
  showAge: boolean;
  age: number;
  firstName: string;
  lastName: string;
}

export default function InitForm() {
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    // trigger,
  } = useForm<IFormInputs>();
  const watchShowAge = watch("showAge", false); // you can supply default value as second argument
  // const watchAllFields = watch(); // when pass nothing as argument, you are watching everything
  // const watchFields = watch(["showAge", "age"]); // you can also target specific fields by their names

  // Callback version of watch.  It's your responsibility to unsubscribe when done.
  React.useEffect(() => {
    const subscription = watch((value, { name, type }) =>
      console.log("watch", value, name, type)
    );
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = (data: IFormInputs) => console.log("表单的值", data);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>name</div>
        <input {...register("name", { required: true, maxLength: 50 })} />
        <input type="checkbox" {...register("showAge")} />
        {/* based on yes selection to display Age Input*/}
        {watchShowAge && (
          <>
            <div>number</div>
            <input type="number" {...register("age", { min: 50 })} />
          </>
        )}
        {/* <input {...register("firstName", { required: true })} />
        <input {...register("lastName", { required: true })} />
        <button
          type="button"
          onClick={() => {
            trigger("lastName");
          }}
        >
          Trigger
        </button> */}
        {/* <button
          type="button"
          onClick={() => {
            trigger(["firstName", "lastName"]);
          }}
        >
          Trigger Multiple
        </button>
        <button
          type="button"
          onClick={() => {
            trigger();
          }}
        >
          Trigger All
        </button> */}
        <input type="submit" />
      </form>
    </>
  );
}
