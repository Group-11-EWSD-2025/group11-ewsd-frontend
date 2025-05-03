import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";

export const storePageView = (page_name: string) => {
  return AXIOS_CLIENT.post(
    `store-view`,
    {
      page_name,
    },
    {
      headers: { "Content-Type": "application/json" },
    },
  );
};

export const useStorePageView = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof storePageView>;
}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: storePageView,
  });
};
