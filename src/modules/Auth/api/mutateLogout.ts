import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";

export const logout = () => {
  return AXIOS_CLIENT.post(
    `logout`,
    {},
    {
      headers: { "Content-Type": "application/json" },
    },
  );
};

export const useLogout = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof logout>;
}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: logout,
  });
};
