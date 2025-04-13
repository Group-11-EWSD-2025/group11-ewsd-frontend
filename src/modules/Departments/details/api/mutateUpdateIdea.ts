import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { IdeaFormInputs } from "../components/IdeaForm";

type UpdateIdeaData = IdeaFormInputs & { id: string };

export const updateIdea = (data: UpdateIdeaData) => {
  return AXIOS_CLIENT.post(`idea/update`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const useUpdateIdea = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof updateIdea>;
}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateIdea,
  });
};
