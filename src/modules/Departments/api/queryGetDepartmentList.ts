import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getDepartmentList = () => {
  return queryOptions({
    queryKey: ["getDepartmentList"],
    queryFn: () => AXIOS_CLIENT.get("departments"),
  });
};

type UseGetDepartmentListOptions = {
  queryConfig?: QueryConfig<typeof getDepartmentList>;
};

export const useGetDepartmentList = ({
  queryConfig,
}: UseGetDepartmentListOptions) => {
  return useQuery({
    ...getDepartmentList(),
    ...queryConfig,
  });
};
