import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";

export const disableUser = (data: { id: number }) => {
  return AXIOS_CLIENT.post(
    `user/disable`,
    {
      id: data.id,
    },
    {
      headers: { "Content-Type": "application/json" },
    },
  );
};

export const useDisableUser = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof disableUser>;
}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: disableUser,
  });
};
