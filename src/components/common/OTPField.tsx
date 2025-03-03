import { cn } from "@/lib/utils";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

export type OTPProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  slotCount: number;
  className?: string;
};

export type OTPFieldProps = {
  hookedForm: UseFormReturn<any>;
  field: OTPProps;
};

export const OTPField = ({ hookedForm, field }: OTPFieldProps) => {
  return (
    <FormField
      key={field.name}
      name={field.name}
      control={hookedForm.control}
      render={({ field: formField }) => {
        return (
          <FormItem>
            <FormControl>
              <InputOTP
                {...formField}
                maxLength={field.slotCount}
                className="w-full! appearance-none"
                onKeyDown={(event) => {
                  const key = event.which || event.keyCode;

                  if (key && (key <= 47 || key >= 58) && key !== 8) {
                    event.preventDefault();
                  }
                }}
              >
                <InputOTPGroup className="!w-full gap-3">
                  {[...new Array(field.slotCount)].map((_, index) => {
                    return (
                      <InputOTPSlot
                        className={cn(
                          "outline-border text-md rounded-[6px] !border-0 font-medium shadow-none outline-[2px]",
                          field.className,
                          {
                            "outline-destructive":
                              hookedForm.formState.errors[field.name],
                          },
                        )}
                        key={index}
                        index={index}
                      />
                    );
                  })}
                </InputOTPGroup>
              </InputOTP>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
