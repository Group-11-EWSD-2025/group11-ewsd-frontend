import { AXIOS_KEYCLOAK_CLIENT } from "@/lib/axios-api-client";
import { MutationConfig } from "@/lib/react-query";
import { LoginFormInputs } from "@/modules/Auth/Login";
import { useMutation } from "@tanstack/react-query";

export const login = (data: LoginFormInputs) => {
  return AXIOS_KEYCLOAK_CLIENT.post(
    `/token`,
    new URLSearchParams({
      username: data.email,
      password: data.password,
      grant_type: "password",
      client_id: "public-client",
      scope: "email openid",
    }),
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
