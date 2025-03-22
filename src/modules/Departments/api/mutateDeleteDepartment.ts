import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";

export const deleteDepartment = (id: string) => {
  return AXIOS_CLIENT.post(
    `department/delete`,
    {
      id,
    },
    {
      headers: { "Content-Type": "application/json" },
    },
  );
};

export const useDeleteDepartment = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof deleteDepartment>;
}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteDepartment,
  });
};
