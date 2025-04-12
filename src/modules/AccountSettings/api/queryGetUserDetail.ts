import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getUserDetail = (id: string) => {
  return queryOptions({
    queryKey: ["getUserDetail", id],
    queryFn: () => AXIOS_CLIENT.get(`users/${id}`),
  });
};

type UseGetUserDetailOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getUserDetail>;
};

export const useGetUserDetail = ({
  id,
  queryConfig,
}: UseGetUserDetailOptions) => {
  return useQuery({
    ...getUserDetail(id),
    ...queryConfig,
  });
};
