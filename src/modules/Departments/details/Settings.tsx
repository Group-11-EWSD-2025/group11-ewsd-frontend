import CustomForm from "@/components/common/CustomForm";
import FetchErrorText from "@/components/common/FetchErrorText";
import NoDataFound from "@/components/common/NoDataFound";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { COORDINATOR_OPTIONS } from "@/constants";
import { toast } from "@/hooks/use-toast";
import { getInitials, showDialog } from "@/lib/utils";
import { useDeleteDepartment } from "@/modules/Departments/api/mutateDeleteDepartment";
import { useGetUsers } from "@/modules/Users/api/queryGetUsers";
import { TUser } from "@/types/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";

function Settings() {
  return (
    <div className="mx-auto w-full py-4 lg:max-w-[var(--content-width)] lg:py-6">
      <div className="flex flex-col gap-y-4">
        <DepartmentDetailsForm />
        <DepartmentMembers />
        <DeleteDepartment />
      </div>
    </div>
  );
}

// TODO: Implement update department
function DepartmentDetailsForm() {
  const schema = z.object({
    departmentName: z
      .string()
      .min(3, { message: "Department name must be at least 3 characters" }),
    coordinator: z.string(),
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
        <CustomForm.Button type="submit">Save Changes</CustomForm.Button>
      </div>
    </CustomForm>
  );
}

function DepartmentMembers() {
  const { id } = useParams();
  const getUsers = useGetUsers({
    params: {
      departmentId: id,
      perPage: 1000,
      page: 1,
    },
  });
  const allUsers = getUsers.data?.body.data;

  return (
    <div className="border-border-weak space-y-4 rounded-xl border bg-white p-4 lg:p-5">
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Department Members</h2>
          <p className="text-brand">
            View and manage all members assigned to this department including
            staff and QA coordinator role.
          </p>
        </div>
      </div>
      <div>
        {/* header */}
        <div className="mb-2 grid grid-cols-12 gap-4 border-b py-3.5">
          <div className="col-span-6">
            <p className="text-brand text-sm">Name</p>
          </div>
          <div className="col-span-6">
            <p className="text-brand text-sm">Role</p>
          </div>
        </div>
        {/* items */}
        {getUsers.isLoading && (
          <div className="flex flex-col gap-y-2">
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} className="h-14 w-full" />
            ))}
          </div>
        )}
        {getUsers.isError && <FetchErrorText />}
        {getUsers.isSuccess && allUsers.length === 0 && <NoDataFound />}
        {getUsers.isSuccess &&
          allUsers.length > 0 &&
          allUsers.map((member: TUser) => (
            <div
              key={member.name}
              className="grid grid-cols-12 gap-4 border-b py-4 last:border-b-0 last:pb-0"
            >
              <div className="col-span-6 flex items-center gap-x-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p>{member.name}</p>
                  <p className="text-brand text-sm">{member.email}</p>
                </div>
              </div>
              <div className="col-span-6">
                <p>{member.role}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

function DeleteDepartment() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const deleteDepartment = useDeleteDepartment({
    mutationConfig: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["getDepartmentList"],
        });
        toast({ title: "Department deleted successfull." });
      },
    },
  });

  function handleDeleteDepartment() {
    showDialog({
      isAlert: true,
      title: "Delete Department",
      description:
        "Are you sure you want to delete this department? This action cannot be undone.",
      action: {
        label: "Delete",
        variant: "destructive",
        state: deleteDepartment.isPending ? "loading" : "default",
        onClick: () => {
          deleteDepartment.mutate(id as string);
        },
      },
    });
  }

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
      <Button variant="destructive" onClick={handleDeleteDepartment}>
        <Trash size={20} />
        Delete Department
      </Button>
    </div>
  );
}

export default Settings;
