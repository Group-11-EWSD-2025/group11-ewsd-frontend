import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Select } from "@radix-ui/react-select";
import { UseFormReturn } from "react-hook-form";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  name: string;
  placeholder?: string;
  options: {
    label: string;
    value: string;
  }[];
};

export type SelectFieldProps = {
  hookedForm: UseFormReturn<any>;
  field: SelectProps;
  className?: string;
};

export const SelectField = ({
  hookedForm,
  field,
  className,
}: SelectFieldProps) => {
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
            <Select onValueChange={formField.onChange} value={formField.value}>
              <SelectTrigger className="mb-0 w-full shadow-none">
                <SelectValue placeholder={field.placeholder ?? "Select"} />
              </SelectTrigger>
              <SelectContent className="z-[9999]">
                {field.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
