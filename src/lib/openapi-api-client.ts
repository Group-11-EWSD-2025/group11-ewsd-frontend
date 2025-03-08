import { API_BASE_URL } from "@/config/env";
import { toast } from "@/hooks/use-toast";
import { getLoginState } from "@/lib/utils";
import type { paths as servicePaths } from "@/types/api-schema/service-schema";
import * as changeCase from "change-case";
import createClient, { Middleware } from "openapi-fetch";

function handleResponseError(error: any) {
  toast({
    title: changeCase.sentenceCase(error.response.data.error),
    description: error.response.data.error_description,
    variant: "destructive",
  });
  if (error.response?.status === 401) {
    return new Response(error.response.data, { status: 401 });
  } else {
    console.error("API Error:", error);
  }
  return Promise.reject(error);
}

export const serviceApiClient = createClient<servicePaths>({
  baseUrl: API_BASE_URL,
});

export const apiServiceMiddleware = () => {
  const authMiddleware: Middleware = {
    async onRequest({ request }) {
      const token = getLoginState().token;
      if (!!token) {
        request.headers.set("Authorization", `Bearer ${token}`);
      }
      return request;
    },
    async onResponse({ response }) {
      const { body, ...resOptions } = response;
      if (response.status === 401) {
        handleResponseError({ response });
        return new Response(body, { ...resOptions });
      }
      return new Response(body, { ...resOptions });
    },
  };

  serviceApiClient.use(authMiddleware);
  return serviceApiClient;
};

export const SERVICE_API_CLIENT = apiServiceMiddleware();
