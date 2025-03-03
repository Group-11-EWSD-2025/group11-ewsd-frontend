import GoogleIcon from "@/assets/google.svg?react";
import CustomForm from "@/components/common/CustomForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { setLoginState } from "@/lib/utils";
import { useGetProfile } from "@/modules/Auth/api/getProfile";
import { useLogin } from "@/modules/Auth/api/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(3, { message: "Email must be at least 3 characters" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().optional(),
});

export type LoginFormInputs = z.infer<typeof loginSchema>;

function Login() {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const loginForm = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: email || "",
      password: "",
      rememberMe: false,
    },
  });

  const getProfileQuery = useGetProfile({
    queryConfig: {
      enabled: false,
    },
  });

  const loginMutation = useLogin({
    mutationConfig: {
      onSuccess: (loginResponse) => {
        setLoginState({
          token: loginResponse.data.access_token,
          userData: {
            email: "",
          },
        });

        getProfileQuery.refetch().then((profileResponse: any) => {
          if (profileResponse.data?.data?.code === 200) {
            setLoginState({
              token: loginResponse.data.access_token,
              userData: {
                email: profileResponse.data.data.data.email,
              },
            });

            toast({
              title: "Login successful",
              description: "You have been logged in successfully",
            });
          }
        });
      },
    },
  });

  const onSubmit = (data: LoginFormInputs) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="bg-primary-foreground flex h-screen flex-col items-center justify-center gap-y-8">
      <div className="flex flex-col items-center gap-y-2">
        <h1 className="text-primary-gradient">Magick Workforce</h1>
        <h3>🔑 Login to your account</h3>
      </div>
      <CustomForm
        formMethods={loginForm}
        onSubmit={onSubmit}
        className="border-border-input bg-background space-y-6 rounded-lg border p-8 shadow-sm"
      >
        <CustomForm.InputField
          field={{
            label: "Email",
            name: "email",
            type: "text",
            placeholder: "Enter email",
            className: "w-[545px]",
          }}
        />
        <CustomForm.InputField
          field={{
            label: "Password",
            name: "password",
            type: "password",
            placeholder: "Enter password",
            className: "w-[545px]",
          }}
        />
        <div className="flex items-center justify-between">
          <CustomForm.CheckboxField
            field={{
              label: "Remember me",
              name: "rememberMe",
            }}
          />
          <Link
            to="/forgot-password"
            className="text-sm text-red-400 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <CustomForm.Button type="submit" className="w-full">
          {(loginMutation.isPending || getProfileQuery.isFetching) && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Login
        </CustomForm.Button>
      </CustomForm>
      <Button
        variant="ghost"
        className="flex items-center gap-x-2 rounded-lg bg-white px-8 py-3 shadow-sm"
      >
        <p className="text-base font-semibold">Continue with Google</p>
        <GoogleIcon />
      </Button>
    </div>
  );
}

export default Login;
