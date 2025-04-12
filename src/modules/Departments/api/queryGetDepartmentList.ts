import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getDepartmentList = (params: { userId?: string }) => {
  return queryOptions({
    queryKey: ["getDepartmentList", params],
    queryFn: () =>
      AXIOS_CLIENT.get("departments", {
        params: {
          user_id: params.userId,
        },
      }),
  });
};

type UseGetDepartmentListOptions = {
  params?: {
    userId?: string;
  };
  queryConfig?: QueryConfig<typeof getDepartmentList>;
};

export const useGetDepartmentList = ({
  params = {},
  queryConfig,
}: UseGetDepartmentListOptions) => {
  return useQuery({
    ...getDepartmentList(params),
    ...queryConfig,
  });
};
