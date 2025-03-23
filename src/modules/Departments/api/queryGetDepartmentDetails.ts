import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export type GetDepartmentDetailsRequest = {
  id: string;
};

export const getDepartmentDetails = (data: GetDepartmentDetailsRequest) => {
  return queryOptions({
    queryKey: ["getDepartmentDetails", data.id],
    queryFn: () => AXIOS_CLIENT.get(`department/detail/${data.id}`),
  });
};

type UseGetDepartmentDetailsOptions = {
  queryConfig?: QueryConfig<typeof getDepartmentDetails>;
  data: GetDepartmentDetailsRequest;
};

export const useGetDepartmentDetails = ({
  queryConfig,
  data,
}: UseGetDepartmentDetailsOptions) => {
  return useQuery({
    ...getDepartmentDetails(data),
    ...queryConfig,
  });
};
