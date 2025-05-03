import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import useAcademicYear from "@/hooks/useAcademicYear";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { FileIcon, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { useGetDepartmentList } from "../Departments/api/queryGetDepartmentList";
import { useGetInsightData } from "./api/queryGetInsightData";

ChartJS.register(ArcElement, Tooltip, Legend);

interface BrowserUsage {
  browser: string;
  value: number;
}

interface PageView {
  page: string;
  views: number;
}

interface ActiveUser {
  user: string;
  activity: number;
}

const Insights = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");

  const { academicYear } = useAcademicYear();
  const academicYearId = academicYear?.id;

  const { data: getInsightData } = useGetInsightData({
    data: {
      academicYearId,
      departmentId: selectedDepartment,
    },
  });

  console.log(getInsightData?.data?.body);

  const browserData = getInsightData?.data?.body?.browser_usage
    ? Object.entries(getInsightData.data.body.browser_usage).map(
        ([browser, value]) => ({
          browser,
          value: value as number,
        }),
      )
    : [];

  const mostViewPages = getInsightData?.data?.body?.most_view_pages
    ? Object.entries(getInsightData.data.body.most_view_pages).map(
        ([page, views]) => ({
          page,
          views: views as number,
        }),
      )
    : [];

  const mostActiveUsers = getInsightData?.data?.body?.most_active_users
    ? Object.entries(getInsightData.data.body.most_active_users).map(
        ([user, activity]) => ({
          user,
          activity: activity as number,
        }),
      )
    : [];

  const getDepartmentList = useGetDepartmentList({
    queryConfig: {
      retry: false,
    },
  });

  const departmentsOptions = getDepartmentList.data?.data.body.map(
    (department: { id: string; name: string }) => ({
      value: department.id,
      label: department.name,
    }),
  );

  // Set default department when data is loaded
  useEffect(() => {
    if (departmentsOptions?.length && !selectedDepartment) {
      setSelectedDepartment(departmentsOptions[0].value);
    }
  }, [departmentsOptions]);

  const chartData = {
    labels: browserData.map((item) => item.browser),
    datasets: [
      {
        data: browserData.map((item) => item.value),
        backgroundColor: [
          "rgb(15, 23, 42)",
          "rgb(71, 85, 105)",
          "rgb(148, 163, 184)",
          "rgb(226, 232, 240)",
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "80%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context: any) => {
            const label = context.label || "";
            const value = context.raw || 0;
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  return (
    <div className="relative mx-auto space-y-4 p-4 lg:max-w-[var(--content-width)] lg:p-6">
      <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
        <h1 className="text-2xl font-semibold">Department Overview</h1>

        <Select
          value={selectedDepartment}
          onValueChange={setSelectedDepartment}
        >
          <SelectTrigger className="h-10 w-56 border bg-white shadow-none">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            {departmentsOptions?.map(
              (department: { value: string; label: string }) => (
                <SelectItem key={department.value} value={department.value}>
                  {department.label}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Statistics Cards */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="flex flex-col gap-10 rounded-md border border-gray-200 bg-white p-4">
          <p className="font-medium text-gray-800">Total Ideas Submitted</p>
          <p className="text-3xl font-semibold">
            {getInsightData?.data?.body?.total_ideas}
          </p>
        </div>
        <div className="flex flex-col gap-10 rounded-md border border-gray-200 bg-white p-4">
          <p className="font-medium text-gray-800">Total Comments</p>
          <p className="text-3xl font-semibold">
            {getInsightData?.data?.body?.total_comments}
          </p>
        </div>
        <div className="flex flex-col gap-10 rounded-md border border-gray-200 bg-white p-4">
          <p className="font-medium text-gray-800">Total Users</p>
          <p className="text-3xl font-semibold">
            {getInsightData?.data?.body?.total_users}
          </p>
        </div>
      </div>

      <Separator />

      {/* System Usage */}
      <div>
        <h2 className="font-semibold">System Usage</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          A quick glance at the top-performing pages, most active users, and
          preferred browsers.
        </p>
      </div>
      <div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3 rounded-md border border-gray-200 bg-white p-4 pb-0">
            <h3 className="font-medium">Most View Pages</h3>
            <div className="divide-y divide-gray-200">
              {mostViewPages.map((item: PageView) => (
                <div key={item.page} className="flex items-center gap-2 py-4">
                  <FileIcon className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm">{item.page}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 rounded-md border border-gray-200 bg-white p-4 pb-0">
            <h3 className="font-medium">Top Active Users</h3>
            <div className="divide-y divide-gray-200">
              {mostActiveUsers.map((item: ActiveUser) => (
                <div key={item.user} className="flex items-center gap-2 py-4">
                  <Users className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm">{item.user}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="space-y-4 rounded-md border border-gray-200 bg-white p-4">
        <h3 className="font-medium">Browser Usage Breakdown</h3>
        <div>
          <div className="flex items-center gap-4">
            <div className="relative h-[120px]">
              <Doughnut width={150} data={chartData} options={chartOptions} />
            </div>
            <div className="w-full space-y-4">
              {browserData.map((item: BrowserUsage, index: number) => (
                <div key={item.browser} className="flex items-center gap-2">
                  <div
                    className="size-[15px] rounded-[4px]"
                    style={{
                      backgroundColor:
                        chartData.datasets[0].backgroundColor[index],
                    }}
                  />
                  <div className="flex w-full items-center justify-between pr-8">
                    <span className="flex-1 text-sm">{item.browser}</span>
                    <span className="text-sm">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
