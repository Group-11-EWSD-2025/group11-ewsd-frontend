import { toast } from "@/hooks/use-toast";
import { clearLoginState, setLoginState } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetKeyCloakToken } from "../Auth/api/getKeyCloakToken";
import { useGetProfile } from "../Auth/api/getProfile";

const Redirect = () => {
  const isMounted = useRef(false);
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  const getProfileQuery = useGetProfile({
    queryConfig: {
      enabled: false,
    },
  });

  const GetKeyCloakTokenMutation = useGetKeyCloakToken({
    mutationConfig: {
      onSuccess: async (response) => {
        console.log("from getKeyCloakToken", response);
        setLoginState({
          token: response.data.access_token,
          userData: {
            email: "",
          },
        });

        getProfileQuery.refetch().then((profileResponse: any) => {
          if (profileResponse.data?.data?.code === 200) {
            setLoginState({
              token: response.data.access_token,
              userData: {
                email: profileResponse.data.data.data.email,
              },
            });

            toast({
              title: "Login successful",
              description: "You have been logged in successfully",
            });

            // Move navigation to the end after all operations are complete
            // navigate(PrivatePageEndPoints.home.path, { replace: true });
          } else {
            clearLoginState();
            // navigate(PublicPageEndPoints.login.path, { replace: true });
          }
        });
      },
      onError: () => {
        clearLoginState();
        // navigate(PublicPageEndPoints.login.path, { replace: true });
      },
    },
  });

  useEffect(() => {
    if (code && !GetKeyCloakTokenMutation.isPending && isMounted.current) {
      GetKeyCloakTokenMutation.mutate({
        code,
        redirectUri: "http://localhost:5173/redirect",
      });
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
  }, []);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
        <p className="text-muted-foreground text-sm">Redirecting...</p>
      </div>
      {/* <Button
        onClick={() => {
          GetKeyCloakTokenMutation.mutate({
            code: code || "",
            redirectUri: "http://localhost:5173/redirect",
          });
        }}
      >
        Login
      </Button> */}
    </div>
  );
};

export default Redirect;
