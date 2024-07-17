export declare class SimpleForm<T = unknown> {
  private formItemListeners;
  private formValueListeners;
  private formValuesListeners;
  private errorListeners;
  private initialValues?;
  private values?;
  private lastValues?;
  private formErrors;
  private fieldPropsMap;
  constructor(values?: T);
  getFieldProps(): FormFieldsProps;
  getFieldProps(path: string): FieldProps;
  bindChange<V>(path?: string, eventName?: string, val?: V): void;
  getBindProps<V>(
    path?: string,
    newValue?: V
  ): Record<string, unknown> | undefined;
  setFieldProps<V>(path: string, field?: V): void;
  getFieldValue(): T;
  getFieldValue(path: string): PathValue<T, string>;
  getLastValue(): T;
  getLastValue(path: string): PathValue<T, string>;
  setInitialValue(path: string, initialValue?: unknown): void;
  getInitialValues(path?: string): unknown;
  setFieldValue(
    path: string,
    value?: unknown,
    eventName?: FieldProps["trigger"]
  ): void;
  setFieldsValue<V>(values?: V): void;
  reset<V>(endValues?: V): void;
  getFieldError(): FormErrors;
  getFieldError(path: string): FormErrors[string];
  private setFieldError;
  private setFieldsError;
  validate(
    path?: string | string[],
    eventName?: FieldProps["trigger"]
  ): Promise<{
    error: string | boolean | undefined;
    values: T;
  }>;
}
