import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import React from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export type RadioProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  name: string;
  options: {
    label: string | React.ReactNode;
    value: string;
  }[];
};

export type RadioFieldProps<T extends FieldValues> = {
  hookedForm: UseFormReturn<T>;
  field: RadioProps;
};

export const RadioField = <T extends FieldValues>({
  hookedForm,
  field,
}: RadioFieldProps<T>) => {
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
            <RadioGroup
              onValueChange={formField.onChange}
              defaultValue={formField.value}
              className="flex flex-col space-y-1"
            >
              {field.options.map((option) => (
                <FormItem
                  key={option.value}
                  className="flex items-center space-y-0 space-x-3"
                >
                  <FormControl>
                    <RadioGroupItem value={option.value} />
                  </FormControl>
                  <FormLabel className="font-normal">{option.label}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
