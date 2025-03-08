import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { MutationConfig } from "@/lib/react-query";
import { LoginFormInputs } from "@/modules/Auth/Login";
import { useMutation } from "@tanstack/react-query";

export const login = (data: LoginFormInputs) => {
  return AXIOS_CLIENT.post(
    `/login`,
    {
      email: data.email,
      password: data.password,
    },
    {
      headers: { "Content-Type": "application/json" },
    },
  );
};

export const useLogin = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof login>;
}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: login,
  });
};
