import CustomForm from "@/components/common/CustomForm";
import { toast } from "@/hooks/use-toast";
import { hideDialog } from "@/lib/utils";
import { useCreateCategory } from "@/modules/Categories/api/mutateCreateCategory";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const categorySchema = z.object({
  name: z
    .string()
    .min(2, { message: "Category name must be at least 2 characters" }),
});

export type CategoryFormInputs = z.infer<typeof categorySchema>;

function CategoryForm() {
  const queryClient = useQueryClient();
  const categoryForm = useForm<CategoryFormInputs>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  });

  const createCategory = useCreateCategory({
    mutationConfig: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["getCategoryList"],
        });
        hideDialog();
        toast({
          title: "Category created successfully",
        });
      },
    },
  });

  const onSubmit = (data: CategoryFormInputs) => {
    createCategory.mutate(data);
  };

  if (createCategory.isPending) {
    return (
      <div className="flex h-10 items-center justify-center">
        <Loader2 className="size-4 animate-spin" />
      </div>
    );
  }

  return (
    <CustomForm
      formMethods={categoryForm}
      onSubmit={onSubmit}
      className="mt-6 space-y-6"
    >
      <div className="space-y-4">
        <CustomForm.InputField
          field={{
            label: "Category Name",
            name: "name",
            type: "text",
            placeholder: "Enter category name",
          }}
        />
      </div>
      <div className="flex justify-end">
        <CustomForm.Button
          state={createCategory.isPending ? "loading" : "default"}
        >
          {createCategory.isPending ? "Creating..." : "Create"}
        </CustomForm.Button>
      </div>
    </CustomForm>
  );
}

export default CategoryForm;