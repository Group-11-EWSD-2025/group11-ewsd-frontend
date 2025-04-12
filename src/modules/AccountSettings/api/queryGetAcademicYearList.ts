import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getAcademicYearList = () => {
  return queryOptions({
    queryKey: ["academic-year-list"],
    queryFn: () => AXIOS_CLIENT.get(`academic-years`),
  });
};

type UseGetAcademicYearListOptions = {
  queryConfig?: QueryConfig<typeof getAcademicYearList>;
};

export const useGetAcademicYearList = ({
  queryConfig,
}: UseGetAcademicYearListOptions) => {
  return useQuery({
    ...getAcademicYearList(),
    ...queryConfig,
  });
};
