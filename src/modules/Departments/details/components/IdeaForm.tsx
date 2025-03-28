import CustomForm from "@/components/common/CustomForm";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ideaSchema = z.object({
  privacySettings: z.enum(["public", "anonymous"]),
  // message: z.string().min(1),
  "agree-terms-conditions": z.boolean(),
});
export type IdeaFormInputs = z.infer<typeof ideaSchema>;

export default function IdeaForm() {
  const ideaForm = useForm<IdeaFormInputs>({
    resolver: zodResolver(ideaSchema),
    defaultValues: {
      privacySettings: "public",
      // message: "",
      "agree-terms-conditions": false,
    },
  });

  function onSubmit(data: IdeaFormInputs) {
    console.log(data);
  }

  console.log(ideaForm.formState.errors);
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
