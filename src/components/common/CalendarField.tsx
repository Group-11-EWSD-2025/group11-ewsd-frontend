import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import React, { useState } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Button } from "../ui/button";

export type CalendarProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  name: string;
};

export type CalendarFieldProps<T extends FieldValues> = {
  hookedForm: UseFormReturn<T>;
  field: CalendarProps;
};

export const CalendarField = <T extends FieldValues>({
  hookedForm,
  field,
}: CalendarFieldProps<T>) => {
  const [open, setOpen] = useState(false);

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
            <Popover modal open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formField.value && "text-muted-foreground",
                  )}
                  disabled={field.disabled}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {formField.value ? (
                    format(formField.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="z-[1001] w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={formField.value ?? undefined}
                  defaultMonth={formField.value ?? undefined}
                  onSelect={(date) => {
                    if (date) {
                      formField.onChange(date);
                      setOpen(false);
                    }
                  }}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
