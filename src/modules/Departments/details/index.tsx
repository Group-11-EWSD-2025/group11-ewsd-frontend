import { DateRangePicker } from "@/components/common/DateRangePicker";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FEATURES, useAuthorize } from "@/hooks/useAuthorize";
import { cn, showDialog } from "@/lib/utils";
import { useGetCategoryList } from "@/modules/Categories/api/queryGetCategoryList";
import ExportDataDialog from "@/modules/Departments/details/components/ExportDataDialog";
import IdeaForm from "@/modules/Departments/details/components/IdeaForm";
import IdeaListView from "@/modules/Departments/details/components/IdeaListView";
import { useDepartmentRedirect } from "@/modules/Departments/hooks/useDepartmentRedirect";
import { format, parseISO } from "date-fns";
import { Bell, Download, Loader2 } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect } from "react";

const tabs = [
  {
    label: "Latest",
    value: "latest",
  },
  {
    label: "Most Popular",
    value: "most-popular",
  },
  {
    label: "Most Viewed",
    value: "most-viewed",
  },
];

const IS_FINAL_CLOSURE_DATE = true;

export type Filter = {
  tab: string;
  dateRange: {
    from: Date;
    to: Date;
  };
  categoryId: string;
};

const DepartmentDetails = () => {
  const { checkFeatureAvailability } = useAuthorize();
  const { isDepartmentListLoading, redirectDepartment } =
    useDepartmentRedirect();
  const [, setTab] = useQueryState("tab", {
    defaultValue: "latest",
  });
  const [startDate, setStartDate] = useQueryState(
    "startDate",
    parseAsString.withDefault(format(new Date(), "yyyy-MM-dd")),
  );
  const [endDate, setEndDate] = useQueryState(
    "endDate",
    parseAsString.withDefault(format(new Date(), "yyyy-MM-dd")),
  );
  const [, setCategoryId] = useQueryState("categoryId", {
    defaultValue: "",
  });

  useEffect(() => {
    redirectDepartment();
  }, [redirectDepartment]);

  const IS_SHOW_EXPORT_DATA_BUTTON =
    IS_FINAL_CLOSURE_DATE && checkFeatureAvailability(FEATURES.EXPORT_DATA);

  const { data: categoriesResponse, isLoading: isLoadingCategories } =
    useGetCategoryList({
      params: {
        page: 1,
        perPage: 1000,
      },
      queryConfig: {
        refetchOnMount: true,
        refetchOnWindowFocus: false,
      },
    });

  function handleExportData() {
    showDialog({
      title: "Export All Data",
      description:
        "Download all submitted ideas, comments, and uploaded documents for record-keeping and transfer. ",
      children: <ExportDataDialog />,
    });
  }

  function handleCreateNewIdea() {
    showDialog({
      title: "Create New Idea",
      children: <IdeaForm />,
    });
  }

  if (isDepartmentListLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  return (
    <div>
      <Tabs defaultValue="latest" className="w-full space-y-2">
        <div className="border-border-weak fixed top-[var(--topbar-height)] z-10 flex h-[var(--topbar-height)] w-[calc(100%-var(--sidebar-width))] justify-between gap-2 border-y border-b-0 bg-[#FEFEFE] px-4 md:items-center">
          <TabsList className="bg-background flex">
            {tabs.map((tabItem) => (
              <TabsTrigger
                key={tabItem.value}
                value={tabItem.value}
                className="data-[state=active]:bg-slate-100"
                onClick={() => {
                  setTab(tabItem.value);
                }}
              >
                {tabItem.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="h-10">
              <DateRangePicker
                value={{
                  from: startDate ? parseISO(startDate) : new Date(),
                  to: endDate ? parseISO(endDate) : new Date(),
                }}
                onChange={(value) => {
                  setStartDate(format(value?.from ?? new Date(), "yyyy-MM-dd"));
                  setEndDate(format(value?.to ?? new Date(), "yyyy-MM-dd"));
                }}
              />
            </div>

            {isLoadingCategories ? (
              <Skeleton className="h-10 w-24" />
            ) : (
              <Select
                onValueChange={(value) => {
                  setCategoryId(value);
                }}
              >
                <SelectTrigger className="bg-background h-10 min-w-[180px] shadow-none">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categoriesResponse?.body.data.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {checkFeatureAvailability(FEATURES.CREATE_IDEA) && (
              <Button type="button" onClick={handleCreateNewIdea}>
                Create New Idea
              </Button>
            )}
          </div>
        </div>

        {IS_SHOW_EXPORT_DATA_BUTTON && (
          <div className="fixed top-[calc(var(--topbar-height)*2)] z-10 flex w-[calc(100%-var(--sidebar-width))] items-center justify-between gap-2 border-y bg-slate-300 px-4">
            <div className="flex gap-4 py-2">
              <div className="flex items-center">
                <Bell size={16} />
              </div>
              <p className="text-sm">
                The Final Closure Date has been reached. You can now download
                all data (ideas, comments, and documents).
              </p>
            </div>
            <Button type="button" variant="link" onClick={handleExportData}>
              <Download size={16} />
              Export All Data
            </Button>
          </div>
        )}
        <div
          className={cn(
            "mx-auto w-full space-y-4 p-4 lg:mt-[var(--topbar-height)] lg:max-w-[var(--content-width)] lg:p-6",
            {
              "lg:mt-[calc(var(--topbar-height)+var(--notification-height))]":
                IS_SHOW_EXPORT_DATA_BUTTON,
            },
          )}
        >
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <IdeaListView />
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default DepartmentDetails;
