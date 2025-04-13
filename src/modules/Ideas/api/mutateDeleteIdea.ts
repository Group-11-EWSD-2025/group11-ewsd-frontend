import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";

export const deleteIdea = (id: string) => {
  return AXIOS_CLIENT.post(
    `idea/delete`,
    {
      id,
    },
    {
      headers: { "Content-Type": "application/json" },
    },
  );
};

export const useDeleteIdea = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof deleteIdea>;
}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteIdea,
  });
};
