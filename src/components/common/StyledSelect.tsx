import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import React from "react";

export interface StyledSelectProps {
  value: string | number;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  options: Array<{
    label: string | number;
    value: string | number;
  }>;
}

export const StyledSelect: React.FC<StyledSelectProps> = ({
  value,
  onChange,
  className,
  placeholder = "Select",
  options,
}) => {
  // Convert number to string for shadcn Select component
  const stringValue = String(value);

  // Handle conversion back for onChange
  const handleChange = (newValue: string) => {
    onChange(newValue);
  };

  return (
    <Select onValueChange={handleChange} value={stringValue}>
      <SelectTrigger
        className={cn(
          "border-border-weak h-10 bg-transparent shadow-none focus:ring-1",
          className,
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={String(option.value)}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
