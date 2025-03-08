import CustomForm from "@/components/common/CustomForm";
import { useAuth } from "@/context/AuthContext";
import { useLogin } from "@/modules/Auth/api/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(3, { message: "Email must be at least 3 characters" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export type LoginFormInputs = z.infer<typeof loginSchema>;

const Login = () => {
  const { setAuthState } = useAuth();
  const loginForm = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useLogin({
    mutationConfig: {
      onSuccess: (loginResponse) => {
        if (loginResponse.status === 200) {
          setAuthState({
            token: loginResponse.data.body.token,
            userData: {
              email: loginResponse.data.body.email,
            },
          });
        }
      },
    },
  });

  const onSubmit = (data: LoginFormInputs) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="bg-muted flex h-screen flex-col items-center justify-center gap-y-7">
      <h2 className="text-2xl font-semibold">IdeaHub</h2>
      <div className="flex w-[384px] flex-col gap-y-6 rounded-xl bg-white p-6 shadow-md">
        <Lock className="h-8 w-8" />
        <div className="flex flex-col gap-y-1">
          <h3 className="text-2xl font-semibold">Log In to Your Account</h3>
          <p className="text-sm text-gray-500">
            Enter your email and password to share your ideas and help improve
            our university.
          </p>
        </div>
        <CustomForm
          formMethods={loginForm}
          onSubmit={onSubmit}
          className="space-y-4"
        >
          <CustomForm.InputField
            field={{
              label: "Email",
              name: "email",
              type: "text",
              placeholder: "Enter email",
            }}
          />
          <CustomForm.PasswordField
            field={{
              label: "Password",
              name: "password",
              placeholder: "Enter password",
            }}
          />
          <CustomForm.Button
            type="submit"
            className="w-full"
            state={loginMutation.isPending ? "loading" : "default"}
          >
            Login
          </CustomForm.Button>
        </CustomForm>
      </div>
    </div>
  );
};

export default Login;
