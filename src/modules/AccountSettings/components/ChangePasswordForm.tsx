import CustomForm from "@/components/common/CustomForm";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { showDialog } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useChangePassword } from "../api/mutateChangePassword";
// Schema
const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(3, {
      message: "Current password must be at least 3 characters",
    }),
    newPassword: z.string().min(3, {
      message: "New password must be at least 3 characters",
    }),
    confirmPassword: z.string().min(3, {
      message: "Confirm password must be at least 3 characters",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormInputs = z.infer<typeof changePasswordSchema>;

function ChangePasswordForm() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const changePasswordForm = useForm<ChangePasswordFormInputs>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const changePasswordMutation = useChangePassword({
    mutationConfig: {
      onSuccess: (response) => {
        toast({
          title: response.data.meta.message,
        });
        showDialog({
          isAlert: true,
          title: "Your password is changed.",
          description:
            "Your password has been successfully updated. For security purposes, please log in again using your new password.",
          action: {
            label: "Back to login",
            onClick: () => {
              logout();
              navigate("/login");
            },
          },
        });
      },
    },
  });

  function onSubmit(data: ChangePasswordFormInputs) {
    changePasswordMutation.mutate(data);
  }

  return (
    <CustomForm
      formMethods={changePasswordForm}
      onSubmit={onSubmit}
      className="space-y-4"
    >
      <CustomForm.PasswordField
        field={{
          type: "password",
          name: "currentPassword",
          label: "Current Password",
          required: true,
        }}
      />
      <CustomForm.PasswordField
        field={{
          type: "password",
          name: "newPassword",
          label: "New Password",
          required: true,
        }}
      />
      <CustomForm.PasswordField
        field={{
          type: "password",
          name: "confirmPassword",
          label: "Confirm Password",
          required: true,
        }}
      />
      <div className="flex justify-end">
        <CustomForm.Button
          state={changePasswordMutation.isPending ? "loading" : "default"}
          type="submit"
        >
          Update Password
        </CustomForm.Button>
      </div>
    </CustomForm>
  );
}
export default ChangePasswordForm;
