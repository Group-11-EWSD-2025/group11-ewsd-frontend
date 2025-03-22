import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { MutationConfig } from "@/lib/react-query";
import { CategoryFormInputs } from "@/modules/Categories/components/CategoryEditForm";
import { useMutation } from "@tanstack/react-query";

interface UpdateCategoryData extends CategoryFormInputs {
  id: string;
}

export const updateCategory = (data: UpdateCategoryData) => {
  return AXIOS_CLIENT.post(
    `category/update`,
    {
      id: data.id,
      name: data.name,
    },
    {
      headers: { "Content-Type": "application/json" },
    },
  );
};

export const useUpdateCategory = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof updateCategory>;
}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateCategory,
  });
};
