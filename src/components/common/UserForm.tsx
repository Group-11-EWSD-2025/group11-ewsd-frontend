import CustomForm from "@/components/common/CustomForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MultiSelect } from "../ui/multi-select";

const DEPARTMENTS_OPTIONS = [
  { value: "react", label: "React" },
  { value: "angular", label: "Angular" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
  { value: "ember", label: "Ember" },
];

const ROLES_OPTIONS = [
  { label: "Teacher", value: "teacher" },
  { label: "Assistant", value: "assistant" },
  { label: "Admin", value: "admin" },
];

const userSchema = z.object({
  name: z
    .string()
    .min(3, { message: "User name must be at least 3 characters" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(3, { message: "Email must be at least 3 characters" }),
  phoneNumber: z
    .string()
    .min(10, { message: "Phone number must be at least 10 characters" })
    .regex(/^[0-9+\-\s()]*$/, { message: "Invalid phone number format" })
    .refine((val) => val.replace(/[\s()+\-]/g, "").length >= 10, {
      message: "Phone number must have at least 10 digits",
    }),
  role: z.enum(["teacher", "assistant", "admin"], {
    message: "Invalid role selected",
  }),
  assignedDepartment: z.enum(
    ["business-management", "architecture-design", "education-teaching"],
    {
      message: "Invalid department",
    },
  ),
  userPassword: z
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

function UserForm() {
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([
    "react",
    "angular",
  ]);

  const userForm = useForm<UserFormInputs>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      role: "teacher",
      assignedDepartment: "business-management",
      userPassword: "",
    },
  });

  const onSubmit = (data: UserFormInputs) => {
    console.log(data);
  };

  return (
    <CustomForm
      formMethods={userForm}
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
              name: "phoneNumber",
              type: "text",
              placeholder: "Enter phone number",
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
            name: "assignedDepartment",
            label: "Assigned Department",
            placeholder: "Select",
            options: DEPARTMENTS_OPTIONS,
            required: true,
          }}
        />
        <MultiSelect
          options={DEPARTMENTS_OPTIONS}
          onValueChange={setSelectedFrameworks}
          defaultValue={selectedFrameworks}
          placeholder="Select frameworks"
          variant="inverted"
          animation={2}
          maxCount={3}
        />
        <CustomForm.PasswordField
          field={{
            label: "Set User Password to Login",
            name: "userPassword",
            placeholder: "Enter password",
            required: true,
          }}
        />
        <div className="flex justify-end">
          <CustomForm.Button>Create</CustomForm.Button>
        </div>
      </div>
    </CustomForm>
  );
}

export default UserForm;
