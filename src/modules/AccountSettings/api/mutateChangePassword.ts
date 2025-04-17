import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { ChangePasswordFormInputs } from "../components/ChangePasswordForm";

export const changePassword = (data: ChangePasswordFormInputs) => {
  const formattedData = {
    current_password: data.currentPassword,
    new_password: data.newPassword,
  };

  return AXIOS_CLIENT.post(`change-password`, formattedData, {
    headers: { "Content-Type": "application/json" },
  });
};

export const useChangePassword = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof changePassword>;
}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: changePassword,
  });
};
