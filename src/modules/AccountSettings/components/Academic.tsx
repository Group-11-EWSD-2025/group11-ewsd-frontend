import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { cn, showDialog } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { formatDate, parseISO } from "date-fns";
import { MoreVertical, Pencil, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { useDeleteAcademicYear } from "../api/mutateDeleteAcademicYear";
import { useGetAcademicYearList } from "../api/queryGetAcademicYearList";
import AcademicYearForm from "./AcademicYearForm";

export type AcademicYearData = {
  id: number;
  start_date: string;
  end_date: string;
  idea_submission_deadline: string;
  final_closure_date: string;
  status: "active" | "closed";
  idea_count: number;
};

const Academic = () => {
  const getAcademicYearList = useGetAcademicYearList({});

  const academicYears = getAcademicYearList.data?.data.body || [];

  const handleCreate = () => {
    showDialog({
      title: "Create Academic Year",
      children: <AcademicYearForm />,
    });
  };

  // is academic year active
  const isActive = academicYears.some(
    (year: AcademicYearData) => year.status === "active",
  );

  return (
    <div className="space-y-6">
      <div className="bg-card flex flex-col gap-8 rounded-lg border p-6 shadow-sm">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Academic Year</h2>
          <p className="text-muted-foreground">
            Define the start and end point for the academic year, including
            deadlines for idea submission and commenting. Please note that a new
            academic year cannot be created while there is an active one. Close
            the current academic year before adding a new one.
          </p>
        </div>

        <div>
          <Button onClick={handleCreate} disabled={isActive}>
            <Plus className="h-4 w-4" />
            Create
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Academic Duration</TableHead>
              <TableHead>Idea Submission Deadline</TableHead>
              <TableHead>Final Closure Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {academicYears.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-muted-foreground h-24 text-center"
                >
                  No academic years found. Please create one.
                </TableCell>
              </TableRow>
            ) : (
              academicYears.map((year: AcademicYearData) => (
                <AcademicYearRow key={year.id} year={year} />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const AcademicYearRow = ({ year }: { year: AcademicYearData }) => {
  const queryClient = useQueryClient();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleEdit = () => {
    showDialog({
      title: "Edit Academic Year",
      children: <AcademicYearForm academicYear={year} />,
    });
  };

  const deleteAcademicYearMutation = useDeleteAcademicYear({
    mutationConfig: {
      onSuccess: () => {
        toast({
          title: "Academic year dates is deleted successfully",
        });
        queryClient.invalidateQueries({
          queryKey: ["academic-year-list"],
        });
      },
      onError: (error) => {
        toast({
          title: "Failed to delete academic year.",
          description: error.message,
          variant: "destructive",
        });
      },
    },
  });
  const handleDelete = (id: number) => {
    showDialog({
      title: "Delete Academic Year",
      description: "Are you sure you want to delete this academic year?",
      action: {
        variant: "destructive",
        label: "Delete",
        state: deleteAcademicYearMutation.isPending ? "loading" : "default",
        onClick: () => {
          deleteAcademicYearMutation.mutate(id);
        },
      },
    });
  };

  return (
    <TableRow key={year.id}>
      <TableCell>
        <div>
          {formatDate(parseISO(year.start_date), "dd MMM yy")} -{" "}
          {formatDate(parseISO(year.end_date), "dd MMM yy")}
        </div>
        <div
          className={cn(
            "text-muted-foreground text-sm capitalize",
            year.status === "active" ? "text-green-500" : "text-gray-500",
          )}
        >
          {year.status}
        </div>
      </TableCell>
      <TableCell>
        {year.idea_submission_deadline
          ? formatDate(parseISO(year.idea_submission_deadline), "dd MMM yyyy")
          : "-"}
      </TableCell>
      <TableCell className="flex items-center justify-between">
        {year.final_closure_date
          ? formatDate(parseISO(year.final_closure_date), "dd MMM yyyy")
          : "-"}
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex w-auto flex-col p-1" align="end">
            {year.status === "active" && (
              <Button
                variant="ghost"
                onClick={handleEdit}
                className="w-full justify-start rounded-none p-2 text-slate-700"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit Academic
              </Button>
            )}
            {year.status !== "active" && (
              <Button
                variant="ghost"
                className="w-full justify-start rounded-none p-2 !text-red-500"
                onClick={() => handleDelete(year.id)}
              >
                <Trash className="mr-2 h-4 w-4 text-red-500" />
                Delete Academic Year
              </Button>
            )}
          </PopoverContent>
        </Popover>
      </TableCell>
    </TableRow>
  );
};

export default Academic;
