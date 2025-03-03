import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import React from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export type CustomFieldProps = {
  name: string;
  render: React.ReactNode;
};

export type CustomFormFieldProps<T extends FieldValues> = {
  hookedForm: UseFormReturn<T>;
  field: CustomFieldProps;
};

export const CustomFormField = <T extends FieldValues>({
  hookedForm,
  field,
}: CustomFormFieldProps<T>) => {
  return (
    <FormField
      key={field.name}
      control={hookedForm.control}
      name={field.name as Path<T>}
      render={({ field: formField }) => (
        <FormItem>
          <FormControl>
            {React.cloneElement(field.render as React.ReactElement, {
              ...formField,
            })}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
