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
import useAcademicYear from "@/hooks/useAcademicYear";
import { FEATURES, useAuthorize } from "@/hooks/useAuthorize";
import { cn, showDialog } from "@/lib/utils";
import { useGetCategoryList } from "@/modules/Categories/api/queryGetCategoryList";
import ExportDataDialog from "@/modules/Departments/details/components/ExportDataDialog";
import IdeaForm from "@/modules/Departments/details/components/IdeaForm";
import IdeaListView from "@/modules/Departments/details/components/IdeaListView";
import { useDepartmentRedirect } from "@/modules/Departments/hooks/useDepartmentRedirect";
import { format, parseISO } from "date-fns";
import { Bell, Download, Loader2, Plus } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect, useMemo } from "react";

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
  const [tab, setTab] = useQueryState(
    "tab",
    parseAsString.withDefault("latest"),
  );
  const [startDate, setStartDate] = useQueryState(
    "startDate",
    parseAsString.withDefault(""),
  );
  const [endDate, setEndDate] = useQueryState(
    "endDate",
    parseAsString.withDefault(""),
  );
  const [categoryId, setCategoryId] = useQueryState(
    "categoryId",
    parseAsString.withDefault(""),
  );

  const { isAfterFinalClosureDate, isIdeaSubmissionOpen } = useAcademicYear();

  const isUsingParams = useMemo(() => {
    return (
      !!categoryId ||
      (!!startDate && startDate !== format(new Date(), "yyyy-MM-dd")) ||
      (!!endDate && endDate !== format(new Date(), "yyyy-MM-dd"))
    );
  }, [categoryId, startDate, endDate]);

  useEffect(() => {
    redirectDepartment();
  }, [redirectDepartment]);

  const IS_SHOW_EXPORT_DATA_BUTTON =
    isAfterFinalClosureDate && checkFeatureAvailability(FEATURES.EXPORT_DATA);

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

  function handleResetFilters() {
    setStartDate("");
    setEndDate("");
    setCategoryId("");
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
      <Tabs defaultValue={tab} className="w-full gap-0">
        <div className="sticky top-0 z-10 flex w-full flex-col justify-center bg-[#FEFEFE]">
          <div className="border-border-weak flex flex-col justify-between gap-2 border p-4 md:flex-row md:items-start">
            <TabsList>
              <div className="bg-background flex">
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
              </div>
            </TabsList>

            <div className="flex flex-wrap items-center gap-2 md:justify-end">
              <div className="h-10">
                <DateRangePicker
                  value={{
                    from: startDate ? parseISO(startDate) : undefined,
                    to: endDate ? parseISO(endDate) : undefined,
                  }}
                  onChange={(value) => {
                    setStartDate(
                      format(value?.from ?? new Date(), "yyyy-MM-dd"),
                    );
                    setEndDate(format(value?.to ?? new Date(), "yyyy-MM-dd"));
                  }}
                />
              </div>

              {isLoadingCategories ? (
                <Skeleton className="h-10 w-24" />
              ) : (
                <div>
                  <Select
                    value={categoryId}
                    onValueChange={(value) => {
                      setCategoryId(value);
                    }}
                  >
                    <SelectTrigger className="bg-background h-10 min-w-[180px] shadow-none">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriesResponse?.body.data.map((category) => (
                        <SelectItem
                          key={category.id.toString()}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {isUsingParams && (
                <Button
                  variant="outline"
                  type="button"
                  className="h-10"
                  onClick={handleResetFilters}
                >
                  Reset Filters
                </Button>
              )}
              {isIdeaSubmissionOpen &&
                checkFeatureAvailability(FEATURES.CREATE_IDEA) && (
                  <>
                    <div className="hidden h-10 md:block">
                      <Button type="button" onClick={handleCreateNewIdea}>
                        Create New Idea
                      </Button>
                    </div>
                    <div className="block h-10 md:hidden">
                      <Button
                        type="button"
                        size="icon"
                        onClick={handleCreateNewIdea}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </>
                )}
            </div>
          </div>

          {IS_SHOW_EXPORT_DATA_BUTTON && (
            <div className="z-[1] flex w-full flex-col items-center justify-between gap-2 border-y bg-slate-300 px-4 md:flex-row">
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
        </div>

        <div
          className={cn(
            "mx-auto w-full space-y-4 p-4 pt-8 lg:max-w-[var(--content-width)] lg:p-6",
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
