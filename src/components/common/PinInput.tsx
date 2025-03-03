import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "../ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

export type PinFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  slotCount: number;
  className?: string;
  label?: string;
};

export type PinInputProps = {
  hookedForm: UseFormReturn<any>;
  field: PinFieldProps;
};

export const PinInput = ({ hookedForm, field }: PinInputProps) => {
  const [displayPin, setDisplayPin] = useState<string[]>(
    Array(field.slotCount).fill(""),
  );
  const [actualPin, setActualPin] = useState("");
  const [show, setShow] = useState(false);

  const displayedPin = show ? actualPin : displayPin.join("");

  return (
    <FormField
      key={field.name}
      name={field.name}
      control={hookedForm.control}
      render={({ field: formField }) => {
        return (
          <FormItem className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between">
              <FormLabel className="text-base">{field.label}</FormLabel>
              <Button
                type="submit"
                onClick={() => setShow((prev) => !prev)}
                variant="ghost"
                size="icon"
              >
                {show ? (
                  <Eye size={16} color="var(--color-primary)" />
                ) : (
                  <EyeOff size={16} color="var(--color-primary)" />
                )}
              </Button>
            </div>
            <FormControl>
              <InputOTP
                {...formField}
                maxLength={field.slotCount}
                onKeyDown={(event) => {
                  const key = event.which || event.keyCode;

                  if (key && (key <= 47 || key >= 58) && key !== 8) {
                    event.preventDefault();
                  }
                }}
                onChange={(e) => {
                  const previousIndex = e.length - 1;
                  const digits = e.split("");

                  /* Display */
                  const changedDisplayPin = digits.map(() => "•");

                  setDisplayPin(changedDisplayPin);

                  /* Actual */
                  const changedActualPin = digits
                    .map((pin, index) => {
                      return index === previousIndex ? pin : actualPin[index];
                    })
                    .join("");

                  setActualPin(changedActualPin);

                  formField.onChange(changedActualPin);
                }}
                value={displayedPin}
                className="w-full! appearance-none"
              >
                <InputOTPGroup className="gap-3">
                  {[...new Array(field.slotCount)].map((_, index) => {
                    return (
                      <InputOTPSlot
                        className={cn(
                          "rounded-[6px] !border-0 text-[21px] shadow-none outline-[2px] outline-[#09090B80] transition-colors",
                          field.className,
                          {
                            "outline-destructive":
                              hookedForm.formState.errors[field.name],
                            "text-sm font-medium": show,
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
