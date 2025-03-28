import IdeaCard from "@/components/common/IdeaCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, showDialog } from "@/lib/utils";
import ExportDataDialog from "@/modules/Departments/details/components/ExportDataDialog";
import IdeaForm from "@/modules/Departments/details/components/IdeaForm";
import { useDepartmentRedirect } from "@/modules/Departments/hooks/useDepartmentRedirect";
import { Bell, Download } from "lucide-react";
import { useEffect } from "react";

const tabs = [
  {
    label: "All",
    value: "all",
    content: (
      <div className="space-y-4">
        <IdeaCard />
        <IdeaCard />
        <IdeaCard />
      </div>
    ),
  },
  {
    label: "Most Popular",
    value: "most-popular",
    content: null,
  },
  {
    label: "Most Viewed",
    value: "most-viewed",
    content: null,
  },
  {
    label: "Latest",
    value: "latest",
    content: null,
  },
];

const IS_FINAL_CLOSURE_DATE = true;

const DepartmentDetails = () => {
  const { redirectDepartment } = useDepartmentRedirect();

  useEffect(() => {
    redirectDepartment();
  }, [redirectDepartment]);

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

  return (
    <div>
      <Tabs defaultValue="all" className="w-full space-y-2">
        <div className="border-border-weak fixed top-[var(--topbar-height)] z-10 flex h-[var(--topbar-height)] w-[calc(100%-var(--sidebar-width))] justify-between gap-2 border-y border-b-0 bg-[#FEFEFE] px-4 md:items-center">
          <TabsList className="bg-background flex">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-slate-100"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex items-center gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="bg-background w-[180px] shadow-none">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="category1">Category 1</SelectItem>
                <SelectItem value="category2">Category 2</SelectItem>
              </SelectContent>
            </Select>

            <Button type="button" onClick={handleCreateNewIdea}>
              Create New Idea
            </Button>
          </div>
        </div>
        {IS_FINAL_CLOSURE_DATE && (
          <div className="fixed top-[calc(var(--topbar-height)*2)] z-10 flex h-[var(--notification-height)] w-[calc(100%-var(--sidebar-width))] justify-between gap-2 border-y bg-slate-300 px-4">
            <div className="flex items-center gap-2">
              <Bell size={16} />
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
            "mx-auto space-y-4 p-4 lg:mt-[var(--topbar-height)] lg:max-w-[var(--content-width)] lg:p-6",
            {
              "lg:mt-[calc(var(--topbar-height)+var(--notification-height))]":
                IS_FINAL_CLOSURE_DATE,
            },
          )}
        >
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {tab.content}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default DepartmentDetails;
