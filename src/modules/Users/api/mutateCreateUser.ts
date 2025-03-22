import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { UserFormInputs } from "../components/UserForm";

export const createUser = (data: UserFormInputs) => {
  return AXIOS_CLIENT.post(
    `user/store`,
    {
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      password: data.password,
      department_id: data.department_id,
    },
    {
      headers: { "Content-Type": "application/json" },
    },
  );
};

export const useCreateUser = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof createUser>;
}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createUser,
  });
};
