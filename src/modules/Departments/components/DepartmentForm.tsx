import CustomForm from "@/components/common/CustomForm";
import FetchErrorText from "@/components/common/FetchErrorText";
import { toast } from "@/hooks/use-toast";
import { hideDialog } from "@/lib/utils";
import { useCreateDepartment } from "@/modules/Departments/api/mutateCreateDepartment";
import { useGetUsers } from "@/modules/Users/api/queryGetUsers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const departmentSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Department name must be at least 2 characters" }),
});

export type DepartmentFormInputs = z.infer<typeof departmentSchema>;

function DepartmentForm() {
  const queryClient = useQueryClient();
  const departmentForm = useForm<DepartmentFormInputs>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
    },
  });

  const getUsers = useGetUsers({
    params: {
      perPage: 1000,
      page: 1,
      role: "qa-coordinator",
    },
  });

  const createDepartment = useCreateDepartment({
    mutationConfig: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["getDepartmentList"],
        });
        hideDialog();
        toast({
          title: "Department created successfully",
        });
      },
    },
  });

  const onSubmit = (data: DepartmentFormInputs) => {
    createDepartment.mutate(data);
  };

  if (getUsers.isLoading) {
    return (
      <div className="flex h-10 items-center justify-center">
        <Loader2 className="size-4 animate-spin" />
      </div>
    );
  }

  if (getUsers.isError) {
    return <FetchErrorText />;
  }

  const coordinators = getUsers.data.body.data;
  console.log(coordinators);

  return (
    <CustomForm
      formMethods={departmentForm}
      onSubmit={onSubmit}
      className="mt-6 space-y-4"
    >
      <CustomForm.InputField
        field={{
          label: "Department Name",
          name: "name",
          type: "text",
          placeholder: "Enter department name",
        }}
      />
      <p className="text-brand">
        Note: Newly created departments will be automatically assigned to the
        current academic year.
      </p>
      {/* {coordinators.length > 0 && (
        <CustomForm.SelectField
          field={{
            label: "Assigned QR Coordinator",
            name: "user_id",
            placeholder: "Select",
            options: coordinators.map((user: TUser) => ({
              label: user.name,
              value: `${user.id}`,
            })),
          }}
        />
      )} */}
      <div className="flex justify-end">
        <CustomForm.Button
          state={createDepartment.isPending ? "loading" : "default"}
        >
          {createDepartment.isPending ? "Creating..." : "Create"}
        </CustomForm.Button>
      </div>
    </CustomForm>
  );
}

export default DepartmentForm;
