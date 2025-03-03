import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Input } from "../ui/input";

export type PasswordFieldProps = {
  name: string;
  placeholder?: string;
  label?: string;
  className?: string;
};

export type PasswordFormFieldProps<T extends FieldValues> = {
  hookedForm: UseFormReturn<T>;
  className?: string;
  field: PasswordFieldProps;
  strengthBar?: boolean;
};

export const PasswordField = <T extends FieldValues>({
  hookedForm,
  className,
  field,
}: PasswordFormFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      key={field.name}
      control={hookedForm.control}
      name={field.name as Path<T>}
      render={({ field: formField }) => {
        return (
          <FormItem className={cn(field.className, "flex flex-col")}>
            <FormLabel className="text-sm">{field.label}</FormLabel>
            <FormControl>
              <div
                className={cn(
                  "relative flex w-full items-center rounded-md border border-[#BEBEBE] pr-3 focus-within:border focus-within:border-black",
                  className,
                )}
              >
                <Input
                  {...field}
                  {...formField}
                  type={showPassword ? "text" : "password"}
                  className={cn(
                    "focus-visible:bg-transparant border-none shadow-none focus-visible:!ring-0 focus-visible:ring-offset-0 focus-visible:outline-none",
                    "[&:-webkit-autofill]:!bg-white [&:-webkit-autofill]:!shadow-[0_0_0_30px_white_inset]",
                  )}
                  onChange={(e) => {
                    formField.onChange(e);
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer"
                >
                  {formField.value &&
                    (showPassword ? (
                      <Eye size={16} className="text-[#475569]" />
                    ) : (
                      <EyeOff size={16} className="text-[#475569]" />
                    ))}
                </button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
