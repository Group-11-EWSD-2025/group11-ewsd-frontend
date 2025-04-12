import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";

export const createNewAcademicYear = (id: number) => {
  return AXIOS_CLIENT.post(
    `academic-year/delete`,
    {
      id,
    },
    {
      headers: { "Content-Type": "application/json" },
    },
  );
};

export const useDeleteAcademicYear = ({
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
