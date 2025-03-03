import { SERVICE_API_CLIENT } from "@/lib/openapi-api-client";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getProfileQueryOptions = () => {
  return queryOptions({
    queryKey: ["getProfile"],
    queryFn: () => SERVICE_API_CLIENT.GET("/api/users/me", {}),
  });
};

type UseGetProfileOptions = {
  queryConfig?: QueryConfig<typeof getProfileQueryOptions>;
};

export const useGetProfile = ({ queryConfig }: UseGetProfileOptions) => {
  return useQuery({
    ...getProfileQueryOptions(),
    ...queryConfig,
  });
};
