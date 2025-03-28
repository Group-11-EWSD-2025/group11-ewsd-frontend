import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import React from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export type TextareaProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  name: string;
};

export type TextareaFieldProps<T extends FieldValues> = {
  hookedForm: UseFormReturn<T>;
  field: TextareaProps;
};

export const TextareaField = <T extends FieldValues>({
  hookedForm,
  field,
}: TextareaFieldProps<T>) => {
  return (
    <FormField
      key={field.name}
      control={hookedForm.control}
      name={field.name as Path<T>}
      render={({ field: formField }) => (
        <FormItem
          className={cn(
            field.className,
            "flex flex-col",
            field.type === "hidden" && "hidden",
          )}
        >
          <FormLabel className="text-sm">
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <Textarea
              value={formField.value}
              onChange={formField.onChange}
              placeholder={field.placeholder}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
