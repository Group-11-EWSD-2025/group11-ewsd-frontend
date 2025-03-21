import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getUsers = ({
  departmentId,
  perPage,
  page,
  role,
  search,
}: {
  departmentId?: string;
  perPage?: number;
  page?: number;
  role?: string;
  search?: string;
}) => {
  // Build query params dynamically
  const params = new URLSearchParams();

  if (departmentId) params.append("department_id", departmentId);
  if (perPage) params.append("per_page", perPage.toString());
  if (page) params.append("page", page.toString());
  if (role) params.append("role", role);
  if (search) params.append("search", search);

  const queryString = params.toString();

  return queryOptions({
    queryKey: ["getUsers", departmentId, perPage, page, role, search],
    queryFn: () =>
      AXIOS_CLIENT.get(`users${queryString ? `?${queryString}` : ""}`),
    select: (data) => data?.data,
  });
};

type UseGetUsersOptions = {
  params?: {
    departmentId?: string;
    perPage?: number;
    page?: number;
    role?: string;
    search?: string;
  };
  queryConfig?: QueryConfig<typeof getUsers>;
};

export const useGetUsers = ({
  params = {},
  queryConfig,
}: UseGetUsersOptions) => {
  return useQuery({
    ...getUsers(params),
    ...queryConfig,
  });
};
