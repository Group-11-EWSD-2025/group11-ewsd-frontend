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
import { CircleCheck, Plus } from "lucide-react";

const ideasCount = 2;
const steps = [
  "Once departments are available, staff can start submitting their ideas.",
  "You'll be able to manage categories, oversee submissions, and track engagement.",
];

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

const Home = () => {
  return (
    <>
      {ideasCount > 0 ? (
        <div className="space-y-4 p-4 lg:p-6">
          <h1 className="border-border-weak border-b pb-6 text-lg font-medium lg:text-xl">
            {ideasCount} Ideas Posted
          </h1>
          <Tabs defaultValue="all" className="w-full space-y-2">
            <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
              <TabsList className="bg-muted bg-background flex">
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
            {tabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                {tab.content}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      ) : (
        <div className="flex h-full items-center justify-center p-4">
          <div className="border-border-weak m-auto max-w-[540px] space-y-7 rounded-xl border bg-white p-4 lg:p-10">
            <div className="space-y-2">
              <h2 className="text-2xl font-medium">🎉 Welcome to IdeaHub</h2>
              <p className="text-brand">
                It looks like no departments have been set up yet. Departments
                help organize idea submissions and ensure a smooth review
                process.
              </p>
            </div>
            <hr className="border-border-weak" />
            <div className="space-y-5">
              <h3 className="text-lg font-medium">What’s next step?</h3>
              <ul className="space-y-5">
                {steps.map((step) => (
                  <li key={step} className="grid grid-cols-[20px_1fr] gap-x-4">
                    <CircleCheck size={20} className="text-brand" />
                    <p className="text-brand">{step}</p>
                  </li>
                ))}
              </ul>
            </div>
            <Button className="w-full">
              <Plus size={20} />
              Create Department
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
