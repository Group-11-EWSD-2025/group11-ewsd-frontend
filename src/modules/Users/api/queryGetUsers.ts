import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getUsers = ({
  departmentId,
  perPage,
  page,
  role,
}: {
  departmentId: string;
  perPage: number;
  page: number;
  role: string;
}) => {
  return queryOptions({
    queryKey: ["getUsers", departmentId, perPage, page, role],
    queryFn: () =>
      AXIOS_CLIENT.get(
        `users?department_id=${departmentId}&per_page=${perPage}&page=${page}&role=${role}`,
      ),
  });
};

type UseGetUsersOptions = {
  params: {
    departmentId: string;
    perPage: number;
    page: number;
    role: string;
  };
  queryConfig?: QueryConfig<typeof getUsers>;
};

export const useGetUsers = ({ params, queryConfig }: UseGetUsersOptions) => {
  return useQuery({
    ...getUsers(params),
    ...queryConfig,
  });
};
