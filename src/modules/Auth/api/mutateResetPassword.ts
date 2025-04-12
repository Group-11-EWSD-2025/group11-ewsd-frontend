import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { ResetPasswordFormInputs } from "../ResetPassword";

export const resetPassword = (data: ResetPasswordFormInputs) => {
  return AXIOS_CLIENT.post(
    `reset-password`,
    {
      email: data.email,
    },
    {
      headers: { "Content-Type": "application/json" },
    },
  );
};

export const useResetPassword = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof resetPassword>;
}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: resetPassword,
  });
};
