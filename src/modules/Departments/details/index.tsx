import IdeaCard from "@/components/common/IdeaCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect } from "react";
import { useDepartmentRedirect } from "../hooks/useDepartmentRedirect";

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

const DepartmentDetails = () => {
  const { redirectDepartment } = useDepartmentRedirect();

  useEffect(() => {
    redirectDepartment();
  }, [redirectDepartment]);

  return (
    <div>
      <Tabs defaultValue="all" className="w-full space-y-2">
        <div className="border-border-weak -md fixed top-[var(--topbar-height)] z-10 flex h-[var(--topbar-height)] w-[calc(100%-var(--sidebar-width))] justify-between gap-2 border-y bg-[#FEFEFE] px-4 md:items-center">
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
        </div>
        <div
          className="mx-auto space-y-4 p-4 lg:max-w-[var(--content-width)] lg:p-6"
          style={{ marginTop: "calc(var(--topbar-height) * 2)" }}
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
