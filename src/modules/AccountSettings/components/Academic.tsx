import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { addMonths, format } from "date-fns";
import { Calendar } from "lucide-react";
import { useState } from "react";

const Academic = () => {
  const today = new Date();
  const [originalSubmissionDate] = useState(today);
  const [originalClosureDate] = useState(addMonths(today, 1));
  const [submissionDate, setSubmissionDate] = useState(today);
  const [closureDate, setClosureDate] = useState(addMonths(today, 1));

  const handleSubmissionDateChange = (date: Date | undefined) => {
    if (date) {
      setSubmissionDate(date);
      // Update closure date to be one month after new submission date
      setClosureDate(addMonths(date, 1));
    }
  };

  const hasDateChanges = () => {
    return (
      submissionDate.getTime() !== originalSubmissionDate.getTime() ||
      closureDate.getTime() !== originalClosureDate.getTime()
    );
  };
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-2xl font-bold">Academic Year Closure Dates</h2>
      <p className="mb-8 text-lg text-gray-500">
        Define the start and end dates for the academic year, including
        deadlines for idea submission and commenting.
      </p>

      <div className="mb-8 grid gap-8 md:grid-cols-2">
        <div>
          <label className="text-sm">Idea Submission Deadline</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="mt-1 w-full justify-start shadow-none"
              >
                <Calendar className="mr-2 h-5 w-5" />
                {format(submissionDate, "dd MMMM yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={submissionDate}
                onSelect={handleSubmissionDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="text-sm">Final Closure Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="mt-1 w-full justify-start shadow-none"
              >
                <Calendar className="mr-2 h-5 w-5" />
                {format(closureDate, "dd MMMM yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={closureDate}
                onSelect={(date) => date && setClosureDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Button
        className="bg-black text-white hover:bg-gray-800"
        disabled={!hasDateChanges()}
      >
        Save Changes
      </Button>
    </div>
  );
};

export default Academic;
