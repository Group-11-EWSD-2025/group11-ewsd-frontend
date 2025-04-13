import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { UserFormInputs } from "../components/UserForm";

export type EditUserFormInputs = UserFormInputs & {
  id: string;
};

export const editUser = (data: EditUserFormInputs) => {
  return AXIOS_CLIENT.post(
    `user/update`,
    {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      password: data.password,
      department_id:
        data.role === "staff" ? data.staff_department : data.others_department,
    },
    {
      headers: { "Content-Type": "application/json" },
    },
  );
};

export const useEditUser = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof editUser>;
}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: editUser,
  });
};
