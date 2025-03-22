import CustomForm from "@/components/common/CustomForm";
import { toast } from "@/hooks/use-toast";
import { hideDialog } from "@/lib/utils";
import { useUpdateCategory } from "@/modules/Categories/api/mutateUpdateCategory";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const categorySchema = z.object({
  name: z
    .string()
    .min(2, { message: "Category name must be at least 2 characters" }),
});

export type CategoryFormInputs = z.infer<typeof categorySchema>;

interface CategoryEditFormProps {
  category: {
    id: string;
    name: string;
  };
}

function CategoryEditForm({ category }: CategoryEditFormProps) {
  const queryClient = useQueryClient();
  const categoryForm = useForm<CategoryFormInputs>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (category) {
      categoryForm.reset({
        name: category.name,
      });
    }
  }, [category, categoryForm]);

  const updateCategory = useUpdateCategory({
    mutationConfig: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["getCategoryList"],
        });
        hideDialog();
        toast({
          title: "Category updated successfully",
        });
      },
    },
  });

  const onSubmit = (data: CategoryFormInputs) => {
    updateCategory.mutate({
      id: category.id,
      ...data,
    });
  };

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
          state={updateCategory.isPending ? "loading" : "default"}
        >
          {updateCategory.isPending ? "Updating..." : "Update"}
        </CustomForm.Button>
      </div>
    </CustomForm>
  );
}

export default CategoryEditForm;
