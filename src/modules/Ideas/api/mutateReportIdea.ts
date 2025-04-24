import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";

export const reportIdea = (id: string) => {
  return AXIOS_CLIENT.post(
    `idea/report`,
    {
      idea_id: id,
    },
    {
      headers: { "Content-Type": "application/json" },
    },
  );
};

export const useReportIdea = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof reportIdea>;
}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: reportIdea,
  });
};
