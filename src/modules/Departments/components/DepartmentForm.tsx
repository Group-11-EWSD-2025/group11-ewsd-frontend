import CustomForm from "@/components/common/CustomForm";
import { toast } from "@/hooks/use-toast";
import { hideDialog } from "@/lib/utils";
import { useCreateDepartment } from "@/modules/Departments/api/mutateCreateDepartment";
import { useGetUsers } from "@/modules/Users/api/queryGetUsers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const departmentSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Department name must be at least 2 characters" }),
  user_id: z.string(),
});

export type DepartmentFormInputs = z.infer<typeof departmentSchema>;

function DepartmentForm() {
  const queryClient = useQueryClient();
  const departmentForm = useForm<DepartmentFormInputs>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
      user_id: "",
    },
  });

  const getUsers = useGetUsers({
    params: {
      departmentId: "1",
      perPage: 10,
      page: 1,
      role: "admin",
    },
    queryConfig: {
      retry: false,
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
    return (
      <div className="flex flex-col items-center justify-center gap-y-2 text-red-500">
        <AlertCircle className="size-4" />
        <p>Failed to fetch coordinators</p>
      </div>
    );
  }

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
            name: "name",
            type: "text",
            placeholder: "Enter department name",
          }}
        />
        <CustomForm.SelectField
          field={{
            label: "Assigned QR Coordinator",
            name: "user_id",
            placeholder: "Select",
            options: getUsers.data?.data.body.data.map((user: any) => ({
              label: user.name,
              value: `${user.id}`,
            })),
          }}
        />
      </div>
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
