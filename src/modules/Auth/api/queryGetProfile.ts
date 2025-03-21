import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getProfile = () => {
  return queryOptions({
    queryKey: ["getProfile"],
    queryFn: () => AXIOS_CLIENT.get("me"),
  });
};

type UseGetProfileOptions = {
  queryConfig?: QueryConfig<typeof getProfile>;
};

export const useGetProfile = ({ queryConfig }: UseGetProfileOptions) => {
  return useQuery({
    ...getProfile(),
    ...queryConfig,
  });
};
