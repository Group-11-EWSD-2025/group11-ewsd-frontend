import CustomForm from "@/components/common/CustomForm";
import { PublicPageEndPoints } from "@/ecosystem/PageEndpoints/Public";
import { toast } from "@/hooks/use-toast";
import { useResetPassword } from "@/modules/Auth/api/mutateResetPassword";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const resetPasswordSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(3, { message: "Email must be at least 3 characters" }),
});

export type ResetPasswordFormInputs = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const navigate = useNavigate();

  const resetPasswordForm = useForm<ResetPasswordFormInputs>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const resetPasswordMutation = useResetPassword({
    mutationConfig: {
      onSuccess: () => {
        toast({
          title: "Password reset successfully",
        });
        navigate(PublicPageEndPoints.login.root.path);
      },
    },
  });

  const onSubmit = (data: ResetPasswordFormInputs) => {
    resetPasswordMutation.mutate(data);
  };

  return (
    <div className="bg-muted flex h-screen flex-col items-center justify-center gap-y-7">
      <h2 className="text-2xl font-semibold">IdeaHub</h2>
      <div className="flex w-[384px] flex-col gap-y-6 rounded-xl bg-white p-6 shadow-md">
        <Lock className="h-8 w-8" />
        <div className="flex flex-col gap-y-1">
          <h3 className="text-2xl font-semibold">Reset Password</h3>
          <p className="text-sm text-gray-500">
            Enter your email to reset your password.
          </p>
        </div>
        <CustomForm
          formMethods={resetPasswordForm}
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
            state={resetPasswordMutation.isPending ? "loading" : "default"}
          >
            Reset Password
          </CustomForm.Button>
        </CustomForm>
      </div>
    </div>
  );
};

export default ResetPassword;
