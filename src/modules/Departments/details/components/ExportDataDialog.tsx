import CustomForm from "@/components/common/CustomForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const exportSchema = z.object({
  format: z.enum(["csv", "zip"]),
});
export type ExportFormInputs = z.infer<typeof exportSchema>;

const EXPORT_OPTIONS = [
  {
    label: (
      <span>
        CSV File{" "}
        <span className="text-brand">for all idea and comment data.</span>
      </span>
    ),
    value: "csv",
  },
  {
    label: (
      <span>
        ZIP File <span className="text-brand">for any uploaded documents.</span>
      </span>
    ),
    value: "zip",
  },
];

export const ExportDataDialog = () => {
  const exportForm = useForm<ExportFormInputs>({
    resolver: zodResolver(exportSchema),
    defaultValues: {
      format: "csv",
    },
  });

  function onSubmit(data: any) {
    console.log(data);
  }
  return (
    <CustomForm
      formMethods={exportForm}
      onSubmit={onSubmit}
      className="mt-6 space-y-4"
    >
      <div className="space-y-4">
        <CustomForm.RadioField
          field={{
            label: "Choose your preferred export format:",
            name: "format",
            options: EXPORT_OPTIONS,
            className: "space-y-4",
          }}
        />
      </div>
      <div className="flex justify-end">
        <CustomForm.Button type="submit">Export Data</CustomForm.Button>
      </div>
    </CustomForm>
  );
};

export default ExportDataDialog;
