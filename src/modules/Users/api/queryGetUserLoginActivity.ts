import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getUserLoginActivity = ({ userId }: { userId: string }) => {
  // Build query params dynamically
  const params = new URLSearchParams();

  const queryString = params.toString();

  return queryOptions({
    queryKey: ["getUserLoginActivity", { userId }],
    queryFn: () =>
      AXIOS_CLIENT.get(
        `users/${userId}/activity-logs${queryString ? `?${queryString}` : ""}`,
      ),
    select: (data) => data?.data,
  });
};

type UseGetUserLoginActivityOptions = {
  params: {
    userId: string;
  };
  queryConfig?: QueryConfig<typeof getUserLoginActivity>;
};

export const useGetUserLoginActivity = ({
  params,
  queryConfig,
}: UseGetUserLoginActivityOptions) => {
  return useQuery({
    ...getUserLoginActivity(params),
    ...queryConfig,
  });
};
