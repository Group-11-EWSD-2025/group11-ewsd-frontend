import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

type Props = {
  value: DateRange;
  onChange: (date: DateRange) => void;
};

export function DateRangePicker({ value, onChange }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={"outline"}
          className={cn(
            "flex items-center gap-4 font-normal",
            !value && "text-muted-foreground",
          )}
        >
          {value?.from ? (
            value.to ? (
              <>
                {format(value.from, "LLL dd, y")} -{" "}
                {format(value.to, "LLL dd, y")}
              </>
            ) : (
              format(value.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date</span>
          )}
          <CalendarIcon className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={value?.from}
          selected={value}
          onSelect={(range) => {
            onChange(range as DateRange);
          }}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
