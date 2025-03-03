import Tick from "@/assets/tick.svg?react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import {
  checkPasswordStrength,
  PasswordStrength,
} from "@/lib/utils/passwordStrength";
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
  strengthBar,
  field,
}: PasswordFormFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState<PasswordStrength>({
    score: 0,
    color: "#EF4444",
  });

  const getStrengthText = (score: number, password: string) => {
    if (!password) return "";
    if (score <= 1) return "Too weak";
    if (score <= 2) return "Weak";
    if (score <= 4) return "Medium";
    return (
      <>
        <Tick />
        Strong!
      </>
    );
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStrength = checkPasswordStrength(e.target.value);
    setStrength(newStrength);
  };

  return (
    <FormField
      key={field.name}
      control={hookedForm.control}
      name={field.name as Path<T>}
      render={({ field: formField }) => {
        const renderStrengthBars = () => {
          const bars = [];
          const totalBars = 4;
          let filledBars = 0;

          if (formField?.value) {
            if (strength.score <= 1) filledBars = 1;
            else if (strength.score <= 2) filledBars = 2;
            else if (strength.score <= 4) filledBars = 3;
            else filledBars = 4;
          }

          for (let i = 0; i < totalBars; i++) {
            bars.push(
              <div
                key={i}
                className="mx-1 h-[5px] w-full flex-1 overflow-hidden rounded-full bg-[#F1F5F9]"
              >
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: i < filledBars ? "100%" : "0%",
                    backgroundColor: strength.color,
                  }}
                />
              </div>,
            );
          }
          return bars;
        };

        return (
          <FormItem className={cn(field.className, "flex flex-col gap-0.5")}>
            <FormLabel className="text-base">{field.label}</FormLabel>
            <FormControl>
              <div className="space-y-2">
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
                      handlePasswordChange(e);
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
                {strengthBar && (
                  <div className="relative mt-2">
                    <div className="mb-2 flex gap-1">
                      {renderStrengthBars()}
                    </div>
                    <div className="flex justify-between text-sm">
                      <div
                        className="flex w-full justify-start text-xs font-normal"
                        style={{ color: strength.color }}
                      >
                        {getStrengthText(strength.score, formField.value)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
