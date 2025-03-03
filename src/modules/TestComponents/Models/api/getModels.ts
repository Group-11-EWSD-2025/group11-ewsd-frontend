import { AXIOS_AGENTIC_CLIENT } from "@/lib/axios-api-client";
import { QueryConfig } from "@/lib/react-query";
import { modelApiResponseSchema } from "@/modules/TestComponents/Models/schema/modelSchema";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getModels = async () => {
  const response = await AXIOS_AGENTIC_CLIENT.get("/models");
  return modelApiResponseSchema.parse(response.data);
};

export const getModelsQueryOptions = () => {
  return queryOptions({
    queryKey: ["getModels"],
    queryFn: () => getModels(),
  });
};

type UseGetModelsOptions = {
  queryConfig?: QueryConfig<typeof getModelsQueryOptions>;
};

export const useGetModels = ({ queryConfig }: UseGetModelsOptions) =>
  useQuery({
    ...getModelsQueryOptions(),
    ...queryConfig,
  });
