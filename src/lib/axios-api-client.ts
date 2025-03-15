import { API_BASE_URL } from "@/config/env";
import { toast } from "@/hooks/use-toast";
import { getLoginState } from "@/lib/utils";
import Axios, { InternalAxiosRequestConfig } from "axios";
import * as changeCase from "change-case";

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

function createAxiosClient(baseURL: string) {
  const client = Axios.create({ baseURL });
  client.interceptors.request.use(requestInterceptor);
  client.interceptors.response.use((response) => response, handleResponseError);
  return client;
}

export const AXIOS_CLIENT = createAxiosClient(API_BASE_URL);
