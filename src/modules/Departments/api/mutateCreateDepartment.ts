import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { MutationConfig } from "@/lib/react-query";
import { DepartmentFormInputs } from "@/modules/Departments/components/DepartmentForm";
import { useMutation } from "@tanstack/react-query";

export const createDepartment = (data: DepartmentFormInputs) => {
  return AXIOS_CLIENT.post(
    `department/store`,
    {
      name: data.name,
      user_id: data.user_id,
    },
    {
      headers: { "Content-Type": "application/json" },
    },
  );
};

export const useCreateDepartment = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof createDepartment>;
}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createDepartment,
  });
};
