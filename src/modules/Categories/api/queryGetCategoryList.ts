import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { Category, ApiResponse } from "@/modules/Categories/types";

export const getCategoryList = (params?: { page?: number }) => {
  return queryOptions({
    queryKey: ["getCategoryList", params],
    queryFn: async (): Promise<ApiResponse<Category>> => {
      const response = await AXIOS_CLIENT.get<ApiResponse<Category>>("categories", {
        params
      });
      return response.data;
    },
  });
};

type UseGetCategoryListOptions = {
  params?: {
    perPage?: number;
    page?: number;
    search?: string;
  }
  queryConfig?: QueryConfig<typeof getCategoryList>;
};

export const useGetCategoryList = ({
  params,
  queryConfig,
}: UseGetCategoryListOptions = {}) => {
  return useQuery({
    ...getCategoryList(params),
    ...queryConfig,
  });
};