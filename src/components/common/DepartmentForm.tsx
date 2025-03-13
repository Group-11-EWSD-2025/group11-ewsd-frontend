import CustomForm from "@/components/common/CustomForm";
import { Button } from "@/components/ui/button";
import { COORDINATOR_OPTIONS, ROLE_OPTIONS } from "@/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const departmentSchema = z.object({
  departmentName: z
    .string()
    .min(3, { message: "Department name must be at least 3 characters" }),
  coordinator: z
    .string()
    .min(6, { message: "Coordinator must be at least 6 characters" }),
  staffs: z
    .array(
      z.object({
        email: z.string().email({ message: "Invalid email address" }),
        role: z.enum(["teacher", "assistant", "admin"], {
          message: "Invalid role selected",
        }),
      }),
    )
    .min(1, { message: "At least one staff member is required" }),
});

export type DepartmentFormInputs = z.infer<typeof departmentSchema>;

function DepartmentForm() {
  const departmentForm = useForm<DepartmentFormInputs>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      departmentName: "",
      coordinator: "",
      staffs: [{ email: "", role: "teacher" }],
    },
  });

  const { fields, append } = useFieldArray({
    control: departmentForm.control,
    name: "staffs",
  });

  const onSubmit = (data: DepartmentFormInputs) => {
    console.log(data);
  };

  return (
    <CustomForm
      formMethods={departmentForm}
      onSubmit={onSubmit}
      className="mt-6 space-y-6"
    >
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Basic Information</h2>
        <CustomForm.InputField
          field={{
            label: "Department Name",
            name: "departmentName",
            type: "text",
            placeholder: "Enter department name",
          }}
        />
        <CustomForm.SelectField
          field={{
            name: "coordinator",
            label: "Assigned QR Coordinator",
            placeholder: "Select",
            options: COORDINATOR_OPTIONS,
          }}
        />
      </div>
      <hr />
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Staff</h2>
          <p className="text-brand">
            Add staff members to your department to start collecting ideas.
          </p>
        </div>
        <div className="space-y-2">
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-2 gap-x-4">
                <CustomForm.InputField
                  field={{
                    label: "Email",
                    name: `staffs.${index}.email`,
                    type: "text",
                    placeholder: "Enter email",
                  }}
                />
                <CustomForm.SelectField
                  field={{
                    name: `staffs.${index}.role`,
                    label: "Role",
                    placeholder: "Select",
                    options: ROLE_OPTIONS,
                  }}
                />
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => append({ email: "", role: "teacher" })}
          >
            <Plus size={16} />
            Add Another
          </Button>
        </div>
        <div className="flex justify-end">
          <CustomForm.Button>Create</CustomForm.Button>
        </div>
      </div>
    </CustomForm>
  );
}

export default DepartmentForm;
