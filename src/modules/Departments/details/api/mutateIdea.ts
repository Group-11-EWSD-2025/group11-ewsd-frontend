import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";

export const createIdea = (data: FormData) => {
  return AXIOS_CLIENT.post(`idea/store`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const useCreateIdea = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof createIdea>;
}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createIdea,
  });
};
