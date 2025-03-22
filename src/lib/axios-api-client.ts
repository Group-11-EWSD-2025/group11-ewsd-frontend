import { API_BASE_URL } from "@/config/env";
import { toast } from "@/hooks/use-toast";
import { clearLoginState, getLoginState } from "@/lib/utils";
import Axios, { InternalAxiosRequestConfig } from "axios";

function requestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = "application/json";
  }
  const token = getLoginState().token;

  if (!!token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

function handleResponseError(error: any) {
  if (error.response.status === 401 || error.response.status === 403) {
    toast({
      title: "Unauthorized",
      description: "Please login again",
      variant: "destructive",
    });
    clearLoginState();
  }
  return Promise.reject(error);
}

function createAxiosClient(baseURL: string) {
  const client = Axios.create({ baseURL });
  client.interceptors.request.use(requestInterceptor);
  client.interceptors.response.use((response) => response, handleResponseError);
  return client;
}

export const AXIOS_CLIENT = createAxiosClient(API_BASE_URL);
