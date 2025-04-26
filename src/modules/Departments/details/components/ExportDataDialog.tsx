import CustomForm from "@/components/common/CustomForm";
import { useGetAcademicYearList } from "@/modules/AccountSettings/api/queryGetAcademicYearList";
import { AcademicYearData } from "@/modules/AccountSettings/components/Academic";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { z } from "zod";
import { useExportData } from "../api/queryExportData";

const exportSchema = z.object({
  csv: z.boolean(),
  zip: z.boolean(),
});
export type ExportFormInputs = z.infer<typeof exportSchema>;

export const ExportDataDialog = () => {
  const location = useLocation();
  const departmentId = location.pathname.split("/")[2];

  const exportForm = useForm<ExportFormInputs>({
    resolver: zodResolver(exportSchema),
    defaultValues: {
      csv: true,
      zip: true,
    },
  });

  const getAcademicYearList = useGetAcademicYearList({});
  const academicYears = getAcademicYearList.data?.data.body || [];

  const academicYearId = academicYears.find(
    (year: AcademicYearData) => year.status === "active",
  )?.id;

  const exportData = useExportData({
    params: {
      departmentId,
      academicYearId,
      csv: exportForm.getValues("csv"),
      zip: exportForm.getValues("zip"),
    },
    queryConfig: {
      enabled: false,
      retry: false,
    },
  });

  function onSubmit() {
    if (exportForm.getValues("csv") || exportForm.getValues("zip")) {
      exportData.refetch();
    }
  }

  return (
    <CustomForm
      formMethods={exportForm}
      onSubmit={onSubmit}
      className="mt-6 space-y-4"
    >
      <div className="space-y-4">
        <CustomForm.CheckboxField
          field={{
            label: (
              <span className="flex items-center gap-x-2 text-sm">
                CSV File
                <span className="text-brand">
                  for all idea and comment data.
                </span>
              </span>
            ),
            name: "csv",
          }}
        />
        <CustomForm.CheckboxField
          field={{
            label: (
              <span className="flex items-center gap-x-2 text-sm">
                ZIP File
                <span className="text-brand">for any uploaded documents.</span>
              </span>
            ),
            name: "zip",
          }}
        />
      </div>
      <div className="flex justify-end">
        <CustomForm.Button
          state={exportData.isLoading ? "loading" : "default"}
          type="submit"
          disabled={
            !exportForm.getValues("csv") && !exportForm.getValues("zip")
          }
        >
          Export Data
        </CustomForm.Button>
      </div>
    </CustomForm>
  );
};

export default ExportDataDialog;
