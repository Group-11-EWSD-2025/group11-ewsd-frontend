import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getRoles = () => {
  return queryOptions({
    queryKey: ["getRoles"],
    queryFn: () => AXIOS_CLIENT.get("roles"),
    select: (data) => data?.data,
  });
};

type UseGetRolesOptions = {
  queryConfig?: QueryConfig<typeof getRoles>;
};

export const useGetRoles = ({ queryConfig }: UseGetRolesOptions) => {
  return useQuery({
    ...getRoles(),
    ...queryConfig,
  });
};
