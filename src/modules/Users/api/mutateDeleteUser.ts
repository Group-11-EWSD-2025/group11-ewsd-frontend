import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";

export const deleteUser = (data: { id: number }) => {
  return AXIOS_CLIENT.post(
    `user/delete`,
    {
      id: data.id,
    },
    {
      headers: { "Content-Type": "application/json" },
    },
  );
};

export const useDeleteUser = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof deleteUser>;
}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteUser,
  });
};
