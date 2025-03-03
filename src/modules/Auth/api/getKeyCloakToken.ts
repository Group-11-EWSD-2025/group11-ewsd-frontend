import { AXIOS_KEYCLOAK_CLIENT } from "@/lib/axios-api-client";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export type GetKeyCloakTokenPayload = {
  code: string;
  redirectUri: string;
};

export type GetKeyCloakTokenResponse = {
  access_token: string;
  // ... other response fields
};

export const getKeyCloakToken = (data: GetKeyCloakTokenPayload) => {
  return AXIOS_KEYCLOAK_CLIENT.post<GetKeyCloakTokenResponse>(
    `/token`,
    new URLSearchParams({
      grant_type: "authorization_code",
      client_id: "public-client",
      code: data.code,
      redirect_uri: data.redirectUri,
    }).toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );
};

export const useGetKeyCloakToken = ({
  mutationConfig,
}: {
  mutationConfig?: UseMutationOptions<
    AxiosResponse<GetKeyCloakTokenResponse>,
    unknown,
    GetKeyCloakTokenPayload
  >;
} = {}) => {
  return useMutation({
    mutationFn: getKeyCloakToken,
    ...mutationConfig,
  });
};
