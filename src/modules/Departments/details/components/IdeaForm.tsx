import CustomForm from "@/components/common/CustomForm";
import { FileUploadField } from "@/components/common/FileUploadDragAndDrop";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { hideDialog } from "@/lib/utils";
import { useGetCategoryList } from "@/modules/Categories/api/queryGetCategoryList";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { PaperclipIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateIdea } from "../api/mutateIdea";

const ideaSchema = z.object({
  privacy: z.enum(["public", "anonymous"]),
  content: z.string().min(1),
  category_id: z.string().min(1),
  "agree-terms-conditions": z.boolean(),
  files: z.array(z.instanceof(File)).optional(),
});
export type IdeaFormInputs = z.infer<typeof ideaSchema>;

export default function IdeaForm() {
  const queryClient = useQueryClient();
  const ideaForm = useForm<IdeaFormInputs>({
    resolver: zodResolver(ideaSchema),
    defaultValues: {
      privacy: "public",
      content: "",
      category_id: "",
      "agree-terms-conditions": false,
      files: [],
    },
  });

  const { data: categoriesResponse } = useGetCategoryList({
    params: {
      page: 1,
      perPage: 1000,
    },
    queryConfig: {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    },
  });

  const createIdea = useCreateIdea({
    mutationConfig: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["getIdeaList"],
        });
        toast({ title: "Idea created successfully" });
        hideDialog();
      },
    },
  });

  function onSubmit(data: IdeaFormInputs) {
    const formData = new FormData();
    formData.append("privacy", data.privacy);
    formData.append("content", data.content);
    formData.append("category_id", data.category_id);
    if (data.files) {
      data.files.forEach((file) => {
        formData.append("files", file);
      });
    }
    createIdea.mutate(formData);
  }

  return (
    <CustomForm formMethods={ideaForm} onSubmit={onSubmit}>
      <div className="space-y-4 py-6">
        <div className="flex justify-between gap-10">
          <div>
            <Label htmlFor="privacy" className="font-semibold">
              Privacy Settings
            </Label>
            <p className="text-sm text-[#64748B]">
              Control how your idea is displayed to others.
            </p>
          </div>
          <Tabs
            defaultValue="public"
            value={ideaForm.watch("privacy")}
            onValueChange={(value) => {
              ideaForm.setValue("privacy", value as "public" | "anonymous");
            }}
          >
            <TabsList className="flex w-full">
              <TabsTrigger value="public">Public</TabsTrigger>
              <TabsTrigger value="anonymous">Anonymous</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <CustomForm.TextareaField
          field={{
            label: "Idea Message",
            name: "content",
            required: true,
          }}
        />

        <CustomForm.SelectField
          field={{
            label: "Category",
            name: "category_id",
            required: true,
            placeholder: "Select a category",
            options:
              categoriesResponse?.body?.data?.map((category) => ({
                label: category.name,
                value: category.id,
              })) || [],
          }}
        />

        <div>
          <Label>Attachments (up to 3 items)</Label>
          <div className="mt-2">
            <CustomForm.FileUploadField
              field={{
                name: "files",
                children: (
                  <FileUploadField.SimpleUpload>
                    <div className="relative mx-auto flex size-[128px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 p-4 hover:bg-gray-50">
                      <PaperclipIcon className="h-6 w-6 text-gray-500" />
                      <p className="text-gray-500">Choose File</p>
                    </div>
                  </FileUploadField.SimpleUpload>
                ),
                isMultiple: true,
                maxFiles: 3,
              }}
            />
          </div>
        </div>
      </div>
      <div className="border-brand-border flex items-center justify-between gap-20 border-t pt-6">
        <CustomForm.CheckboxField
          field={{
            label:
              "I agree to the Terms and Conditions for submitting an idea to this department.",
            name: "agree-terms-conditions",
          }}
        />
        <CustomForm.Button
          disabled={!ideaForm.getValues("agree-terms-conditions")}
          type="submit"
          state={createIdea.isPending ? "loading" : "default"}
        >
          Submit
        </CustomForm.Button>
      </div>
    </CustomForm>
  );
}
