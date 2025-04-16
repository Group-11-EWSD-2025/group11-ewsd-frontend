import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { MutationConfig } from "@/lib/react-query";
import { AcademicYearFormInputs } from "@/modules/AccountSettings/components/AcademicYearForm";
import { useMutation } from "@tanstack/react-query";
import { formatDate } from "date-fns";

export const updateUserDetail = (
  data: AcademicYearFormInputs & { id: number },
) => {
  const formattedData = {
    id: data.id,
    start_date: formatDate(data.start_date, "yyyy-MM-dd"),
    end_date: formatDate(data.end_date, "yyyy-MM-dd"),
    idea_submission_deadline: formatDate(
      data.idea_submission_deadline,
      "yyyy-MM-dd",
    ),
    final_closure_date: formatDate(data.final_closure_date, "yyyy-MM-dd"),
  };

  return AXIOS_CLIENT.post(`academic-year/update`, formattedData, {
    headers: { "Content-Type": "application/json" },
  });
};

export const useUpdateAcademicYear = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof updateUserDetail>;
}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateUserDetail,
  });
};
