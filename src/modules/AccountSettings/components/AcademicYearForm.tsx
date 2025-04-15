import CustomForm from "@/components/common/CustomForm";
import { toast } from "@/hooks/use-toast";
import { hideDialog } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { addWeeks, parseISO } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateAcademicYear } from "../api/mutateCreateAcademicYear";
import { useUpdateAcademicYear } from "../api/mutateUpdateAcademicYear";
import { AcademicYearData } from "./Academic";

const academicYearSchema = z
  .object({
    start_date: z.date({
      required_error: "Start date is required",
    }),
    end_date: z.date({
      required_error: "End date is required",
    }),
    idea_submission_deadline: z.date({
      required_error: "Idea Submission deadline is required",
    }),
    final_closure_date: z.date({
      required_error: "Final closure date is required",
    }),
  })
  .refine(
    (data) => {
      return data.end_date > data.start_date;
    },
    {
      message: "End date must be after start date",
      path: ["end_date"],
    },
  )
  .refine(
    (data) => {
      return (
        data.idea_submission_deadline >= data.start_date &&
        data.idea_submission_deadline <= data.end_date
      );
    },
    {
      message: "Idea submission deadline must be between start and end date",
      path: ["idea_submission_deadline"],
    },
  )
  .refine(
    (data) => {
      const twoWeeksInMs = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds
      return (
        data.idea_submission_deadline.getTime() - data.start_date.getTime() >=
        twoWeeksInMs
      );
    },
    {
      message:
        "Idea submission deadline must be at least 2 weeks after start date",
      path: ["idea_submission_deadline"],
    },
  )
  .refine(
    (data) => {
      return (
        data.final_closure_date >= data.start_date &&
        data.final_closure_date <= data.end_date
      );
    },
    {
      message: "Final closure date must be between start and end date",
      path: ["final_closure_date"],
    },
  )
  .refine(
    (data) => {
      const twoWeeksInMs = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds
      return (
        data.final_closure_date.getTime() -
          data.idea_submission_deadline.getTime() >=
        twoWeeksInMs
      );
    },
    {
      message:
        "Final closure date must be at least 2 weeks after idea submission deadline",
      path: ["final_closure_date"],
    },
  )
  .refine(
    (data) => {
      const oneWeekInMs = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
      return (
        data.end_date.getTime() - data.final_closure_date.getTime() >=
        oneWeekInMs
      );
    },
    {
      message: "End date must be at least 1 week after final closure date",
      path: ["end_date"],
    },
  );

export type AcademicYearFormInputs = z.infer<typeof academicYearSchema>;

function AcademicYearForm({
  academicYear,
}: {
  academicYear?: AcademicYearData;
}) {
  console.log(academicYear);

  const queryClient = useQueryClient();
  const form = useForm<AcademicYearFormInputs>({
    resolver: zodResolver(academicYearSchema),
    defaultValues: {
      start_date: academicYear?.start_date
        ? parseISO(academicYear.start_date)
        : new Date(),
      end_date: academicYear?.end_date
        ? parseISO(academicYear.end_date)
        : addWeeks(new Date(), 5),
      idea_submission_deadline: academicYear?.idea_submission_deadline
        ? parseISO(academicYear.idea_submission_deadline)
        : addWeeks(new Date(), 2),
      final_closure_date: academicYear?.final_closure_date
        ? parseISO(academicYear.final_closure_date)
        : addWeeks(new Date(), 2),
    },
  });

  const createAcademicYearMutation = useCreateAcademicYear({
    mutationConfig: {
      onSuccess: () => {
        toast({
          title: "Academic year is created successfully",
        });
        queryClient.invalidateQueries({
          queryKey: ["academic-year-list"],
        });
        hideDialog();
      },
      onError: (error) => {
        toast({
          title: "Failed to create academic year dates",
          description: error.message,
          variant: "destructive",
        });
      },
    },
  });

  const updateAcademicYearMutation = useUpdateAcademicYear({
    mutationConfig: {
      onSuccess: () => {
        toast({
          title: "Academic year dates updated successfully",
        });
        queryClient.invalidateQueries({
          queryKey: ["academic-year-list"],
        });
        hideDialog();
      },
      onError: (error) => {
        toast({
          title: "Failed to update academic year dates",
          description: error.message,
          variant: "destructive",
        });
      },
    },
  });

  function onSubmit(data: AcademicYearFormInputs) {
    if (academicYear) {
      updateAcademicYearMutation.mutate({
        ...data,
        id: academicYear.id,
      });
    } else {
      createAcademicYearMutation.mutate(data);
    }
  }

  return (
    <CustomForm formMethods={form} onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-4">
          <CustomForm.CalendarField
            field={{
              name: "start_date",
              label: "Start Date",
              required: true,
            }}
          />
          <CustomForm.CalendarField
            field={{
              name: "end_date",
              label: "End Date",
              required: true,
            }}
          />
        </div>

        <p className="text-muted-foreground text-sm">
          Note: This cannot be edited once ideas have been submitted.
        </p>
      </div>

      <div className="space-y-2">
        <CustomForm.CalendarField
          field={{
            name: "idea_submission_deadline",
            label: "Idea Submission Deadline",
            required: true,
          }}
        />

        <p className="text-muted-foreground text-sm">
          Note: This can only be modified up to 2 weeks before the start date.
        </p>
      </div>

      <div className="space-y-2">
        <CustomForm.CalendarField
          field={{
            name: "final_closure_date",
            label: "Final Closure Date",
            required: true,
          }}
        />

        <p className="text-muted-foreground text-sm">
          Note: This can still be extended even if the idea submission deadline
          has passed but no earlier than its date.
        </p>
      </div>

      <CustomForm.Button
        state={
          createAcademicYearMutation.isPending ||
          updateAcademicYearMutation.isPending
            ? "loading"
            : "default"
        }
        type="submit"
        className="w-full"
      >
        {!!academicYear ? "Update" : "Create"}
      </CustomForm.Button>
    </CustomForm>
  );
}

export default AcademicYearForm;
