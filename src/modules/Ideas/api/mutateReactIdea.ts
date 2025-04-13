import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";

export type TReactIdea = {
  id: string;
  type: "like" | "remove-like" | "unlike" | "remove-unlike";
};

export const reactIdea = (data: TReactIdea) => {
  switch (data.type) {
    case "like":
      return AXIOS_CLIENT.post(`like/store`, {
        idea_id: data.id,
      });
    case "remove-like":
      return AXIOS_CLIENT.post(`like/remove`, {
        idea_id: data.id,
      });
    case "unlike":
      return AXIOS_CLIENT.post(`unlike/store`, {
        idea_id: data.id,
      });
    case "remove-unlike":
      return AXIOS_CLIENT.post(`unlike/remove`, {
        idea_id: data.id,
      });
  }
};

export const useReactIdea = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof reactIdea>;
}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: (data: TReactIdea) => reactIdea(data),
  });
};
