import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { MutationConfig } from "@/lib/react-query";
import { CategoryFormInputs } from "@/modules/Categories/components/CategoryCreateForm";
import { useMutation } from "@tanstack/react-query";

export const createCategory = (data: CategoryFormInputs) => {
  return AXIOS_CLIENT.post(
    `category/store`,
    {
      name: data.name,
    },
    {
      headers: { "Content-Type": "application/json" },
    },
  );
};

export const useCreateCategory = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof createCategory>;
}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createCategory,
  });
};
