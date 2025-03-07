import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MultiSelect, MultiSelectProps } from "@/components/ui/multi-select";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";

export type CustomMultiSelectProps = MultiSelectProps & {
  label?: string;
  name: string;
  required?: boolean;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
};

export type MultiSelectFieldProps = {
  hookedForm: UseFormReturn<any>;
  field: CustomMultiSelectProps;
  className?: string;
};

export const MultiSelectField = ({
  hookedForm,
  field,
  className,
}: MultiSelectFieldProps) => {
  const { options, onValueChange, ...restFieldProps } = field;

  return (
    <FormField
      control={hookedForm.control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem className={cn("flex flex-col space-y-2", className)}>
          {field.label && (
            <FormLabel className="text-sm">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <MultiSelect
              options={field.options}
              defaultValue={formField.value}
              onValueChange={(value) => {
                formField.onChange(value);
              }}
              {...restFieldProps}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
