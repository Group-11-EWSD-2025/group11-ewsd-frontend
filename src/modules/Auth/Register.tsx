import CustomForm from "@/components/common/CustomForm";
import { FormLabel } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { setLoginState, showDialog } from "@/lib/utils";
import { useLogin } from "@/modules/Auth/api/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { useGetProfile } from "./api/getProfile";
import ConfirmOTPDialog from "./components/ConfirmOTPForm";

const registerSchema = z
  .object({
    name: z.string().min(3, { message: "Name must be at least 3 characters" }),
    email: z
      .string()
      .email({ message: "Invalid email address" })
      .min(3, { message: "Email must be at least 3 characters" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    retypePassword: z
      .string()
      .min(1, { message: "Retype password is required" }),
    termAggrement: z.boolean().optional(),
    new: z.string().min(1, { message: "New password is required" }),
  })
  .refine((data) => data.password === data.retypePassword, {
    message: "Passwords do not match",
    path: ["retypePassword"],
  });

export type RegisterFormInputs = z.infer<typeof registerSchema>;

export default function Register() {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const registerForm = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: email || "",
      name: "",
      password: "",
      retypePassword: "",
      termAggrement: false,
      new: "",
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
      },
    },
  });

  const onSubmit = (data: RegisterFormInputs) => {
    showDialog({
      size: "md",
      title: "Welcome! James Bond 🤗",
      titleClassName: "text-primary text-center font-medium",
      description:
        "We’ve sent a 6-digit OTP code to your email. Please enter it below to verify your account.",
      descriptionClassName: "text-primary font-[400]",

      // cancel: {
      //   label: "Cancel",
      //   onClick: () => {
      //     console.log("cancel");
      //   },
      // },
      // action: {
      //   label: "Submit",
      //   onClick: () => {
      //     // console.log("submit");
      //     hideDialog();
      //   },
      // },
      children: <ConfirmOTPDialog />,
    });
  };

  return (
    <div className="bg-primary-foreground flex h-screen flex-col items-center justify-center gap-y-8">
      <div className="flex flex-col items-center gap-y-2">
        <h1 className="text-primary-gradient">Magick Workforce</h1>
        <h4>🥳 Register now</h4>
      </div>
      <CustomForm
        formMethods={registerForm}
        onSubmit={onSubmit}
        className="border-border-input bg-background space-y-6 rounded-lg border p-8 shadow-sm"
      >
        <CustomForm.InputField
          field={{
            label: "Name",
            name: "name",
            type: "text",
            placeholder: "Enter your name",
            className: "min-w-[450px]",
          }}
        />
        <CustomForm.InputField
          field={{
            label: "Email",
            name: "email",
            type: "text",
            placeholder: "Enter email",
            className: "min-w-[450px]",
          }}
        />

        <CustomForm.PasswordField
          strengthBar
          field={{
            label: "Password",
            name: "password",
            placeholder: "Enter password",
            className: "min-w-[450px]",
          }}
        />
        <CustomForm.PasswordField
          field={{
            label: "Retype Password",
            name: "retypePassword",
            placeholder: "Re-Enter password",
            className: "min-w-[450px]",
          }}
        />
        <CustomForm.PinInput
          field={{
            label: "New Password",
            slotCount: 6,
            name: "new",
            placeholder: "Re-Enter password",
            className: "w-[76px] h-[70px] ",
          }}
        />
        <div className="flex items-center justify-between">
          <CustomForm.CheckboxField
            field={{
              label: (
                <FormLabel
                  htmlFor="termAggrement"
                  className="text-foreground text-sm"
                >
                  I agree to{" "}
                  <Link className="text-chart-3 underline" to="/">
                    Terms & Conditions
                  </Link>
                </FormLabel>
              ),
              name: "termAggrement",
            }}
          />
        </div>

        <CustomForm.Button type="submit" className="w-full">
          {(loginMutation.isPending || getProfileQuery.isFetching) && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Continue
        </CustomForm.Button>
      </CustomForm>
    </div>
  );
}
