import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Select } from "@radix-ui/react-select";
import { UseFormReturn } from "react-hook-form";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
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

export const SelectField = ({ hookedForm, field, className }: SelectFieldProps) => {
  return (
    <FormField
      control={hookedForm.control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem className={className}>
          <FormControl>
            <Select
              onValueChange={formField.onChange}
              value={formField.value}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={field.placeholder ?? "Select"} />
              </SelectTrigger>
              <SelectContent>
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
