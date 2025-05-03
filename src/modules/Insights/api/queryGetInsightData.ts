import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export type GetInsightDataRequest = {
  academicYearId: string;
  departmentId: string;
};

export const getInsightData = (data: GetInsightDataRequest) => {
  return queryOptions({
    queryKey: ["getInsightData", data.academicYearId, data.departmentId],
    queryFn: () =>
      AXIOS_CLIENT.get(
        `insight?academic_year_id=${data.academicYearId}&department_id=${data.departmentId}`,
      ),
    enabled: !!data.academicYearId && !!data.departmentId,
  });
};

type UseGetInsightDataOptions = {
  queryConfig?: QueryConfig<typeof getInsightData>;
  data: GetInsightDataRequest;
};

export const useGetInsightData = ({
  queryConfig,
  data,
}: UseGetInsightDataOptions) => {
  return useQuery({
    ...getInsightData(data),
    ...queryConfig,
  });
};
