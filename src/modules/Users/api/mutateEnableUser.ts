import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";

export const enableUser = (data: { id: number }) => {
  return AXIOS_CLIENT.post(
    `user/enable`,
    {
      id: data.id,
    },
    {
      headers: { "Content-Type": "application/json" },
    },
  );
};

export const useEnableUser = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof enableUser>;
}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: enableUser,
  });
};
