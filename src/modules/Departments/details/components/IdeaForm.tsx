import CustomForm from "@/components/common/CustomForm";
import { FileUploadField } from "@/components/common/FileUploadDragAndDrop";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { PaperclipIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ideaSchema = z.object({
  privacySettings: z.enum(["public", "anonymous"]),
  message: z.string().min(1),
  "agree-terms-conditions": z.boolean(),
  file: z.array(z.instanceof(File)).optional(),
});
export type IdeaFormInputs = z.infer<typeof ideaSchema>;

export default function IdeaForm() {
  const ideaForm = useForm<IdeaFormInputs>({
    resolver: zodResolver(ideaSchema),
    defaultValues: {
      privacySettings: "public",
      message: "",
      "agree-terms-conditions": false,
      file: [],
    },
  });

  function onSubmit(data: IdeaFormInputs) {
    console.log(data);
  }

  return (
    <CustomForm formMethods={ideaForm} onSubmit={onSubmit}>
      <div className="space-y-4 py-6">
        <div className="flex justify-between gap-10">
          <div>
            <Label htmlFor="privacySettings" className="font-semibold">
              Privacy Settings
            </Label>
            <p className="text-sm text-[#64748B]">
              Control how your idea is displayed to others.
            </p>
          </div>
          <Tabs
            defaultValue="public"
            value={ideaForm.watch("privacySettings")}
            onValueChange={(value) => {
              ideaForm.setValue(
                "privacySettings",
                value as "public" | "anonymous",
              );
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
            name: "message",
          }}
        />

        <CustomForm.SelectField
          field={{
            label: "Tagged with",
            name: "category",
            placeholder: "Select a category",
            options: [
              { label: "Category 1", value: "category1" },
              { label: "Category 2", value: "category2" },
              { label: "Category 3", value: "category3" },
            ],
          }}
        />

        <div>
          <Label>Attachments (up to 3 items)</Label>
          <div className="mt-2">
            <CustomForm.FileUploadField
              field={{
                name: "file",
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
        >
          Submit
        </CustomForm.Button>
      </div>
    </CustomForm>
  );
}
