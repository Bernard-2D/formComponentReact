import React, { CSSProperties } from "react";
export type Layout = ("horizontal" | "vertical") & string;
import { SimpleForm } from "./store";

export interface ItemProps {
  label?: React.ReactNode;
  inline?: boolean;
  layout?: Layout;
  readOnly?: boolean;
  colon?: boolean;
  required?: boolean;
  showLabel?: boolean;
  labelWidth?: CSSProperties["width"];
  labelAlign?: CSSProperties["textAlign"];
  labelStyle?: CSSProperties;
  gutter?: number;
  tooltip?: string;
  error?: React.ReactNode;
  suffix?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  style?: CSSProperties;
}

interface CreateFormProps extends React.HTMLAttributes<HTMLElement> {
  tagName?: keyof React.ReactHTML;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onReset?: (e: React.FormEvent<HTMLFormElement>) => void;
}
export type ReactComponent<P> =
  | React.ComponentType<P>
  | React.ForwardRefExoticComponent<P>;
export interface RegisteredComponents<P = any> {
  [key: string]: ReactComponent<P>;
}
export type WatchHandler = <T>(newValue: T, oldValue: T) => void;
export type FormItemOptions<P = ItemProps> = Omit<P, "children"> & {
  component?:
    | React.ComponentType<any>
    | React.ForwardRefExoticComponent<any>
    | null;
};
export type CustomUnionType<P = {}> =
  | GenerateWidgetItem<P>
  | Array<GenerateWidgetItem<P>>
  | ReactComponent<unknown>
  | Function
  | ReactNode;
export type FormProps<V = any, P = ItemProps> = {
  watch?: {
    [key: string]:
      | {
          immediate?: boolean;
          handler: WatchHandler;
        }
      | WatchHandler;
  };
  options?:
    | GenerateWidgetItem<P>
    | ((item?: GenerateWidgetItem<P>) => GenerateWidgetItem<P>);
  children?: unknown;
  initialValues?: unknown;
  schema?: Array;
  components?: RegisteredComponents;
  plugins?: Record<string, unknown>;
  variables?: Record<string, unknown>;
  form?: SimpleForm<V>;
} & FormItemOptions<P> &
  CreateFormProps;
