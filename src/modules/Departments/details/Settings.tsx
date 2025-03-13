import CustomForm from "@/components/common/CustomForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { COORDINATOR_OPTIONS } from "@/constants";
import { getInitials } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

function Settings() {
  return (
    <div className="space-y-4 p-4 lg:p-10">
      <div className="flex flex-col gap-y-4">
        <DepartmentDetailsForm />
        <DepartmentMembers />
        <DeleteDepartment />
      </div>
    </div>
  );
}

function DepartmentDetailsForm() {
  const schema = z.object({
    departmentName: z
      .string()
      .min(3, { message: "Department name must be at least 3 characters" }),
    coordinator: z
      .string()
      .min(6, { message: "Coordinator must be at least 6 characters" }),
  });
  type FormInputs = z.infer<typeof schema>;

  const form = useForm<FormInputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      departmentName: "",
      coordinator: "",
    },
  });

  const onSubmit = (data: FormInputs) => {
    console.log(data);
  };

  return (
    <CustomForm
      formMethods={form}
      onSubmit={onSubmit}
      className="border-border-weak space-y-6 rounded-xl border bg-white p-4 lg:p-5"
    >
      <h2 className="text-lg font-semibold">Department Details</h2>
      <div className="space-y-4">
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
        <CustomForm.Button disabled={!form.formState.isValid}>
          Save Changes
        </CustomForm.Button>
      </div>
    </CustomForm>
  );
}

function DepartmentMembers() {
  const members = [
    {
      name: "Sarah Johnson",
      email: "sarah@gmail.com",
      role: "QA Coordinator",
    },
    {
      name: "John Smith",
      email: "john@gmail.com",
      role: "Staff",
    },
  ];
  return (
    <div className="border-border-weak space-y-4 rounded-xl border bg-white p-4 lg:p-5">
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Department Members</h2>
          <p className="text-brand">
            View and manage all members assigned to this department
            including staff and QA coordinator role.
          </p>
        </div>
        <Button>
          <Plus size={20} />
          Add Staffs
        </Button>
      </div>
      <div>
        {/* header */}
        <div className="grid grid-cols-11 gap-4 border-b py-3.5">
          <div className="col-span-4">
            <p className="text-brand text-sm">Name</p>
          </div>
          <div className="col-span-4">
            <p className="text-brand text-sm">Role</p>
          </div>
          <div className="col-span-3"></div>
        </div>
        {/* items */}
        {members.map((member) => (
          <div
            key={member.name}
            className="grid grid-cols-11 gap-4 border-b py-4 last:border-b-0 last:pb-0"
          >
            <div className="col-span-4 flex gap-x-4">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
              </Avatar>
              <div>
                <p>{member.name}</p>
                <p className="text-brand text-sm">{member.email}</p>
              </div>
            </div>
            <div className="col-span-4">
              <p>{member.role}</p>
            </div>
            <div className="col-span-3 flex items-center justify-end">
              {member.role !== "QA Coordinator" && (
                <Button variant="ghost">Remove</Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeleteDepartment() {
  return (
    <div className="border-border-weak space-y-6 rounded-xl border bg-white p-4 lg:p-5">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Delete Department</h2>
        <p className="text-brand">
          Deleting a department will permanently remove it from the system. Any
          submitted ideas will remain but will no longer be linked to this
          department. This action cannot be undone.
        </p>
      </div>
      <Button variant="destructive">
        <Trash size={20} />
        Delete Department
      </Button>
    </div>
  );
}
export default Settings;
