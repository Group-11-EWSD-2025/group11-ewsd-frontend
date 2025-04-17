import CustomForm from "@/components/common/CustomForm";
import { toast } from "@/hooks/use-toast";
import { hideDialog, showDialog } from "@/lib/utils";
import { useGetDepartmentList } from "@/modules/Departments/api/queryGetDepartmentList";
import { TRole } from "@/types/roles";
import { TUser } from "@/types/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../../components/ui/button";
import { useCreateUser } from "../api/mutateCreateUser";
import { deleteUser } from "../api/mutateDeleteUser";
import { useEditUser } from "../api/mutateEditUser";

interface UserFormProps {
  user?: TUser;
  rolesData: TRole[];
}

// Define schema with isEditMode parameter
const createUserSchema = (isEditMode: boolean) =>
  z
    .object({
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
      role: z.enum(["qa-manager", "qa-coordinator", "staff"], {
        required_error: "Role is required",
        invalid_type_error:
          "Role must be one of: qa-manager, qa-coordinator, or staff",
      }),
      staff_department: z.string().optional(),
      others_department: z
        .array(
          z.union([z.string(), z.number()]).transform((val) => String(val)),
        )
        .optional(),
      password: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      // Staff department validation
      if (data.role === "staff" && !data.staff_department) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Staff department is required when role is staff",
          path: ["staff_department"],
        });
      }

      // Others department validation
      if (
        data.role === "qa-coordinator" &&
        (!data.others_department || data.others_department.length === 0)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Other departments are required for qa-coordinator role",
          path: ["others_department"],
        });
      }

      // Password validation only for new users
      if (!isEditMode && (!data.password || data.password.length < 6)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password must be at least 6 characters",
          path: ["password"],
        });
      }
    });

// Then infer the type
export type UserFormInputs = z.infer<ReturnType<typeof createUserSchema>>;

function UserForm({ user, rolesData }: UserFormProps) {
  const queryClient = useQueryClient();
  const isEditMode = !!user;
  const userSchema = createUserSchema(isEditMode);

  const UserForm = useForm<UserFormInputs>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      role:
        (user?.role as "qa-manager" | "qa-coordinator" | "staff") || "staff",
      staff_department:
        user?.role === "staff" ? user?.departments?.[0]?.id || "" : "",
      others_department:
        user?.role !== "staff"
          ? user?.departments?.map((dept) => dept.id) || []
          : [],
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
        hideDialog();
      },
    },
  });

  const editUser = useEditUser({
    mutationConfig: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getUsers"] });
        queryClient.invalidateQueries({
          queryKey: ["getDepartmentList", { userId: user?.id }],
        });
        toast({ title: "User updated successfully" });
        hideDialog();
      },
    },
  });

  const onSubmit = (data: UserFormInputs) => {
    if (isEditMode) {
      editUser.mutate({ ...data, id: user?.id.toString() });
    } else {
      createUser.mutate(data);
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
          deleteUser({ id: user?.id || 0 });
        },
      },
    });
  };

  console.log(UserForm.formState.errors);

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
            options: rolesData.filter((role) => role.value !== "admin"),
            required: true,
          }}
          description={
            UserForm.watch("role") === "qa-manager"
              ? "This user will be able to view all departments."
              : undefined
          }
        />
        {UserForm.watch("role") === "qa-coordinator" && (
          <CustomForm.MultiSelectField
            field={{
              label: "Assigned Department",
              name: "others_department",
              required: true,
              options: departmentsOptions || [],
              placeholder: "Select departments",
              onValueChange: (value) =>
                UserForm.setValue("others_department", value),
            }}
          />
        )}
        {UserForm.watch("role") === "staff" && (
          <CustomForm.SelectField
            field={{
              name: "staff_department",
              label: "Assigned Department",
              placeholder: "Select departments",
              options: departmentsOptions || [],
              required: true,
              onChange: (e) =>
                UserForm.setValue("staff_department", e.target.value),
            }}
          />
        )}

        {!isEditMode && (
          <CustomForm.PasswordField
            field={{
              label: "Set User Password to Login",
              name: "password",
              placeholder: "Enter password",
              required: true,
            }}
          />
        )}
        <div className="flex justify-between">
          {isEditMode && (
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete User
            </Button>
          )}
          <div className={isEditMode ? "" : "ml-auto"}>
            <CustomForm.Button
              state={
                createUser.isPending || editUser.isPending
                  ? "loading"
                  : "default"
              }
            >
              {isEditMode ? "Update" : "Create"}
            </CustomForm.Button>
          </div>
        </div>
      </div>
    </CustomForm>
  );
}

export default UserForm;
