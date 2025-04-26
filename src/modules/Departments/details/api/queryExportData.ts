import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const exportData = ({
  departmentId,
  academicYearId,
  csv,
  zip,
}: {
  departmentId?: string;
  academicYearId?: string;
  csv?: boolean;
  zip?: boolean;
}) => {
  const params = new URLSearchParams();

  if (departmentId) params.append("department_id", departmentId);
  if (academicYearId) params.append("academic_year_id", academicYearId);
  if (csv) params.append("csv", csv.toString());
  if (zip) params.append("zip", zip.toString());

  const queryString = params.toString();

  return queryOptions({
    queryKey: [
      "exportData",
      {
        departmentId,
        academicYearId,
        csv,
        zip,
      },
    ],
    queryFn: () => AXIOS_CLIENT.get(`export/idea-list?${queryString}`),
    select: (data) => data?.data,
  });
};

type UseExportDataOptions = {
  params?: {
    departmentId?: string;
    academicYearId?: string;
    csv?: boolean;
    zip?: boolean;
  };
  queryConfig?: QueryConfig<typeof exportData>;
};

export const useExportData = ({
  params = {},
  queryConfig,
}: UseExportDataOptions) => {
  return useQuery({
    ...exportData({ ...params }),
    ...queryConfig,
  });
};
