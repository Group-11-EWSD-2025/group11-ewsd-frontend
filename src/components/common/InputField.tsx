import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  name: string;
};

export type InputFieldProps<T extends FieldValues> = {
  hookedForm: UseFormReturn<T>;
  field: InputProps;
};

export const InputField = <T extends FieldValues>({
  hookedForm,
  field,
}: InputFieldProps<T>) => {
  return (
    <FormField
      key={field.name}
      control={hookedForm.control}
      name={field.name as Path<T>}
      render={({ field: formField }) => (
        <FormItem
          className={cn(
            field.className,
            "flex flex-col gap-0.5",
            field.type === "hidden" && "hidden",
          )}
        >
          <FormLabel className="text-base">
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            {React.createElement(Input, {
              ...field,
              ...formField,
              type: field.type,
            })}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
