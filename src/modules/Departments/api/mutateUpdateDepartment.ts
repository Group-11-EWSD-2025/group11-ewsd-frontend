import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { MutationConfig } from "@/lib/react-query";
import { DepartmentDetailsFormInputs } from "@/modules/Departments/details/Settings";
import { useMutation } from "@tanstack/react-query";

export const updateDepartment = (data: DepartmentDetailsFormInputs) => {
  return AXIOS_CLIENT.post(
    `department/update`,
    {
      id: data.id,
      name: data.name,
    },
    {
      headers: { "Content-Type": "application/json" },
    },
  );
};

export const useUpdateDepartment = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof updateDepartment>;
}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateDepartment,
  });
};
