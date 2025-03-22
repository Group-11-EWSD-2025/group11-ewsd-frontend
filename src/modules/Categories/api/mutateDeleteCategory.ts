import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";

export const deleteCategory = (id: string) => {
  return AXIOS_CLIENT.post(
    `category/delete`,
    {
      id,
    },
    {
      headers: { "Content-Type": "application/json" },
    },
  );
};

export const useDeleteCategory = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof deleteCategory>;
}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteCategory,
  });
};