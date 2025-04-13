import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";

export type TCommentIdea = {
  id: string;
  content: string;
  privacy: "public" | "private";
};

export const commentIdea = (data: TCommentIdea) => {
  return AXIOS_CLIENT.post(`comment/store`, {
    idea_id: data.id,
    content: data.content,
    privacy: data.privacy,
  });
};

export const useCommentIdea = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof commentIdea>;
}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: (data: TCommentIdea) => commentIdea(data),
  });
};
