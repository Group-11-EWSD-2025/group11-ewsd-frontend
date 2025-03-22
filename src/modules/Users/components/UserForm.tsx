import CustomForm from "@/components/common/CustomForm";
import { toast } from "@/hooks/use-toast";
import { hideDialog, showDialog } from "@/lib/utils";
import { useGetDepartmentList } from "@/modules/Departments/api/queryGetDepartmentList";
import { TUser } from "@/types/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../../components/ui/button";
import { useCreateUser } from "../api/mutateCreateUser";

const ROLES_OPTIONS = [
  { label: "Teacher", value: "teacher", desc: "Teacher role for teaching" },
  {
    label: "Assistant",
    value: "assistant",
    desc: "Assistant role for assisting",
  },
  { label: "Admin", value: "admin", desc: "Admin role for managing" },
];

const userSchema = z.object({
  name: z
    .string()
    .min(3, { message: "User name must be at least 3 characters" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(3, { message: "Email must be at least 3 characters" }),
  phone: z
    .string()
    .min(3, { message: "Phone number is required" })
    .regex(/^[0-9+\-\s()]*$/, { message: "Invalid phone number format" }),
  role: z.enum(["teacher", "assistant", "admin"], {
    message: "Invalid role selected",
  }),
  department_id: z
    .string()
    .min(1, { message: "At least one department must be selected" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      },
    ),
});

export type UserFormInputs = z.infer<typeof userSchema>;

interface UserFormProps {
  user?: TUser;
}

function UserForm({ user }: UserFormProps) {
  const queryClient = useQueryClient();
  const isEditMode = !!user;

  const UserForm = useForm<UserFormInputs>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      role: (user?.role as "teacher" | "assistant" | "admin") || "teacher",
      department_id: user?.department_id || "",
      password: "",
    },
  });

  const getDepartmentList = useGetDepartmentList({
    queryConfig: {
      retry: false,
    },
  });

  const departmentsOptions = getDepartmentList.data?.data.body.map(
    (department: { id: string; name: string }) => ({
      value: department.id,
      label: department.name,
    }),
  );

  const createUser = useCreateUser({
    mutationConfig: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["getUsers"],
        });
        toast({ title: "User created successfully" });
      },
    },
  });

  const onSubmit = (data: UserFormInputs) => {
    if (isEditMode) {
      console.log("Update user", user.id, data);
    } else {
      createUser.mutate(data);
      hideDialog();
    }
  };

  const handleDeleteUser = () => {
    showDialog({
      isAlert: true,
      title: "Are you sure you want to delete this user?",
      children: (
        <p className="text-brand text-sm">
          This action cannot be undone, and the user will lose access to the
          system. Any submitted ideas and comments will remain but will be
          marked as <b>Anonymous</b>.
        </p>
      ),
      cancel: {
        label: "Cancel",
      },
      action: {
        label: "Yes, Delete",
        variant: "destructive",
        onClick: () => {
          console.log("Delete user", user?.id);
        },
      },
    });
  };

  return (
    <CustomForm
      formMethods={UserForm}
      onSubmit={onSubmit}
      className="mt-6 space-y-6"
    >
      <div className="space-y-4">
        <CustomForm.InputField
          field={{
            label: "Name",
            name: "name",
            type: "text",
            placeholder: "Enter name",
            required: true,
          }}
        />
        <div className="grid grid-cols-2 gap-x-4">
          <CustomForm.InputField
            field={{
              label: "Email",
              name: "email",
              type: "text",
              placeholder: "Enter email",
              required: true,
            }}
          />
          <CustomForm.InputField
            field={{
              label: "Phone Number",
              name: "phone",
              type: "text",
              placeholder: "Enter phone number",
              required: true,
            }}
          />
        </div>
        <CustomForm.SelectField
          field={{
            name: "role",
            label: "Role",
            placeholder: "Select",
            options: ROLES_OPTIONS,
            required: true,
          }}
        />
        <CustomForm.SelectField
          field={{
            name: "department_id",
            label: "Assigned Department",
            placeholder: "Select",
            options: departmentsOptions,
            required: true,
          }}
        />
        <CustomForm.PasswordField
          field={{
            label: "Set User Password to Login",
            name: "password",
            placeholder: "Enter password",
            required: true,
          }}
        />
        <div className="flex justify-between">
          {isEditMode && (
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete User
            </Button>
          )}
          <div className={isEditMode ? "" : "ml-auto"}>
            <CustomForm.Button>
              {isEditMode ? "Update" : "Create"}
            </CustomForm.Button>
          </div>
        </div>
      </div>
    </CustomForm>
  );
}

export default UserForm;
