import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { MutationConfig } from "@/lib/react-query";
import { AcademicYearFormInputs } from "@/modules/AccountSettings/components/AcademicYearForm";
import { useMutation } from "@tanstack/react-query";
import { formatDate } from "date-fns";

export const createNewAcademicYear = (data: AcademicYearFormInputs) => {
  const formattedData = {
    start_date: formatDate(data.start_date, "yyyy-MM-dd"),
    end_date: formatDate(data.end_date, "yyyy-MM-dd"),
    idea_submission_deadline: formatDate(
      data.idea_submission_deadline,
      "yyyy-MM-dd",
    ),
    final_closure_date: formatDate(data.final_closure_date, "yyyy-MM-dd"),
  };
  return AXIOS_CLIENT.post(`academic-year/store`, formattedData, {
    headers: { "Content-Type": "application/json" },
  });
};

export const useCreateAcademicYear = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof createNewAcademicYear>;
}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createNewAcademicYear,
  });
};
