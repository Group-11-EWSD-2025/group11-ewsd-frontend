import CustomForm from "@/components/common/CustomForm";
import { FileUploadField } from "@/components/common/FileUploadDragAndDrop";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { hideDialog } from "@/lib/utils";
import { useGetCategoryList } from "@/modules/Categories/api/queryGetCategoryList";
import { TIdea } from "@/types/idea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { PaperclipIcon, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateIdea } from "../api/mutateCreateIdea";
import { useUpdateIdea } from "../api/mutateUpdateIdea";

const MAX_TOTAL_FILES = 3;

const ideaSchema = z.object({
  privacy: z.enum(["public", "anonymous"]),
  content: z.string().min(1),
  category_id: z.string().min(1),
  "agree-terms-conditions": z.boolean(),
  files: z.array(z.instanceof(File)).optional(),
});
export type IdeaFormInputs = z.infer<typeof ideaSchema>;

export default function IdeaForm({ idea }: { idea?: TIdea }) {
  const queryClient = useQueryClient();
  const [removedFileIds, setRemovedFileIds] = useState<string[]>([]);
  const [filesArray, setFilesArray] = useState<File[]>(
    idea?.files.map((file) => new File([file.file], file.file)) || [],
  );

  const ideaForm = useForm<IdeaFormInputs>({
    resolver: zodResolver(ideaSchema),
    defaultValues: {
      privacy:
        (idea?.privacy as "public" | "anonymous" | undefined) ?? "public",
      content: idea?.content ?? "",
      category_id: idea?.category_id.toString() ?? "",
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

  const updateIdea = useUpdateIdea({
    mutationConfig: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["getIdeaList"],
        });
        toast({ title: "Idea updated successfully" });
        hideDialog();
      },
    },
  });
  const existingFiles = filesArray?.map((file) => file.name);

  const handleRemoveExistingFile = (fileName: string) => {
    // Remove from preview
    setFilesArray((prev) => prev.filter((file) => file.name !== fileName));
    // Add to removed files list
    setRemovedFileIds((prev) => [...prev, fileName]);
  };

  async function onSubmit(data: IdeaFormInputs) {
    const formData = new FormData();
    formData.append("id", idea?.id ?? "");
    formData.append("privacy", data.privacy);
    formData.append("content", data.content);
    formData.append("category_id", data.category_id);
    let fileIndex = 0;

    if (data.files) {
      data.files.forEach((file) => {
        formData.append(`files[${fileIndex}]`, file);
        fileIndex++;
      });
    }

    if (idea) {
      // Update case
      formData.append("id", idea.id.toString());
      // Only include files that haven't been removed
      const remainingExistingFiles =
        existingFiles?.filter((file) => !removedFileIds.includes(file)) || [];
      formData.append("existing_files", JSON.stringify(remainingExistingFiles));
      updateIdea.mutate(formData as any);
    } else {
      // Create case
      createIdea.mutate(formData as any);
    }
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
          <Label>Attachments (up to {MAX_TOTAL_FILES} items)</Label>
          <div className="mt-2">
            <div className="flex flex-wrap gap-4">
              {/* Existing files preview */}
              {filesArray?.map((file) => (
                <div key={file.name} className="relative">
                  <div className="h-[120px] w-[120px] overflow-hidden rounded-lg border border-gray-200">
                    <img
                      src={file.name}
                      alt="Attachment preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    className="absolute top-2 right-2 rounded-full bg-white p-1 shadow-md transition-opacity"
                    onClick={() => handleRemoveExistingFile(file.name)}
                  >
                    <X className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              ))}

              {/* File upload button */}
              {/* {remainingFileSlots > 0 && ( */}
              <CustomForm.FileUploadField
                field={{
                  name: "files",
                  children: (
                    <FileUploadField.SimpleUpload>
                      <div className="flex h-[120px] w-[120px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 hover:bg-gray-50">
                        <PaperclipIcon className="mb-2 h-6 w-6 text-gray-500" />
                        <p className="text-sm text-gray-500">Choose File</p>
                      </div>
                    </FileUploadField.SimpleUpload>
                  ),
                  isMultiple: true,
                  // maxFiles: remainingFileSlots,
                }}
              />
              {/* )} */}
            </div>
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
          state={
            createIdea.isPending || updateIdea.isPending ? "loading" : "default"
          }
        >
          {idea ? "Update" : "Submit"}
        </CustomForm.Button>
      </div>
    </CustomForm>
  );
}
