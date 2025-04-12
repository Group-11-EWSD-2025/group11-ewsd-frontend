import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { UserDetailFormInputs } from "../components/ProfileAndSecurity";

export const updateUserDetail = (data: UserDetailFormInputs) => {
  const formData = new FormData();
  formData.append("id", data.id.toString());
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("phone", data.phone);
  formData.append("role", data.role);

  if (data.profile instanceof File) {
    formData.append("profile", data.profile);
  }

  return AXIOS_CLIENT.post(`user/update`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const useUpdateUserDetail = ({
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
