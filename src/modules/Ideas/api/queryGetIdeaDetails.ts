import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export type GetIdeaDetailsRequest = {
  id: string;
};

export const getIdeaDetails = (data: GetIdeaDetailsRequest) => {
  return queryOptions({
    queryKey: ["getIdeaDetails", data.id],
    queryFn: () => AXIOS_CLIENT.get(`idea/${data.id}`),
  });
};

type UseGetIdeaDetailsOptions = {
  queryConfig?: QueryConfig<typeof getIdeaDetails>;
  data: GetIdeaDetailsRequest;
};

export const useGetIdeaDetails = ({
  queryConfig,
  data,
}: UseGetIdeaDetailsOptions) => {
  return useQuery({
    ...getIdeaDetails(data),
    ...queryConfig,
  });
};
