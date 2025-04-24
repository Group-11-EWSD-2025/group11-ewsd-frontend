import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";

export type TToggleHideIdea = {
  id: string;
  type: "hide" | "unhide";
};

export const toggleHideIdea = (data: TToggleHideIdea) => {
  switch (data.type) {
    case "hide":
      return AXIOS_CLIENT.post(`idea/hide`, {
        id: data.id,
      });
    case "unhide":
      return AXIOS_CLIENT.post(`idea/unhide`, {
        id: data.id,
      });
  }
};

export const useToggleHideIdea = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof toggleHideIdea>;
}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: (data: TToggleHideIdea) => toggleHideIdea(data),
  });
};
