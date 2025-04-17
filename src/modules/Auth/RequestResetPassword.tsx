import CustomForm from "@/components/common/CustomForm";
import { PublicPageEndPoints } from "@/ecosystem/PageEndpoints/Public";
import { toast } from "@/hooks/use-toast";
import { useResetPassword } from "@/modules/Auth/api/mutateResetPassword";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const requestResetPasswordSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(3, { message: "Email must be at least 3 characters" }),
});

export type RequestResetPasswordFormInputs = z.infer<
  typeof requestResetPasswordSchema
>;

const RequestResetPassword = () => {
  const navigate = useNavigate();

  const requestResetPasswordForm = useForm<RequestResetPasswordFormInputs>({
    resolver: zodResolver(requestResetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const requestResetPasswordMutation = useResetPassword({
    mutationConfig: {
      onSuccess: (response) => {
        toast({
          title: response.data.meta.message,
        });
        navigate(PublicPageEndPoints.resetPassword.success.path);
      },
    },
  });

  const onSubmit = (data: RequestResetPasswordFormInputs) => {
    requestResetPasswordMutation.mutate(data);
  };

  return (
    <div className="bg-muted flex h-screen flex-col items-center justify-center gap-y-7">
      <h2 className="text-2xl font-semibold">IdeaHub</h2>
      <div className="flex w-[384px] flex-col gap-y-6 rounded-xl bg-white p-6 shadow-md">
        <Link to={PublicPageEndPoints.login.root.path}>
          <ArrowLeft size={32} />
        </Link>
        <div className="flex flex-col gap-y-2">
          <h3 className="text-2xl font-semibold">Request Password Reset</h3>
          <p className="text-sm text-gray-500">
            Enter your email to request a password reset. The admin will be
            notified, and you'll receive a new password once it's updated. Your
            current session will be logged out.
          </p>
        </div>
        <CustomForm
          formMethods={requestResetPasswordForm}
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

          <CustomForm.Button
            type="submit"
            className="w-full"
            state={
              requestResetPasswordMutation.isPending ? "loading" : "default"
            }
          >
            Send Request
          </CustomForm.Button>
        </CustomForm>
      </div>
    </div>
  );
};

export default RequestResetPassword;
