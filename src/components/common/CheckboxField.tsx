import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label?: string | React.ReactNode;
  required?: boolean;
};

export type CheckboxFieldProps = {
  hookedForm: UseFormReturn<any>;
  field: CheckboxProps;
};

export const CheckboxField = ({ hookedForm, field }: CheckboxFieldProps) => {
  return (
    <FormField
      control={hookedForm.control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem>
          <div className="flex items-center gap-x-2">
            <Checkbox
              id={field.name}
              onCheckedChange={formField.onChange}
              checked={formField.value}
            />
            {typeof field.label === "object" ? (
              field.label
            ) : (
              <FormLabel htmlFor={field.name} className="text-sm">
                {field.label}
              </FormLabel>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
