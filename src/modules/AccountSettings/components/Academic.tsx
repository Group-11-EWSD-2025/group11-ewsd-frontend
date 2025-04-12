import CustomForm from "@/components/common/CustomForm";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { addWeeks, format, formatDate, parseISO } from "date-fns";
import { Calendar, MoreVertical, Pencil, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const academicYearCreateSchema = z
  .object({
    start_date: z.date({
      required_error: "Start date is required",
    }),
    end_date: z.date({
      required_error: "End date is required",
    }),
    idea_submission_deadline: z.date({
      required_error: "Idea Submission deadline is required",
    }),
    final_closure_date: z.date({
      required_error: "Final closure date is required",
    }),
  })
  .refine(
    (data) => {
      return data.end_date > data.start_date;
    },
    {
      message: "End date must be after start date",
      path: ["end_date"],
    },
  )
  .refine(
    (data) => {
      return data.final_closure_date > data.idea_submission_deadline;
    },
    {
      message: "Final closure date must be after submission deadline",
      path: ["final_closure_date"],
    },
  );

const academicYearEditSchema = z
  .object({
    id: z.number().optional(),
    start_date: z.date({
      required_error: "Start date is required",
    }),
    end_date: z.date({
      required_error: "End date is required",
    }),
    idea_submission_deadline: z.date({
      required_error: "Idea Submission deadline is required",
    }),
    final_closure_date: z.date({
      required_error: "Final closure date is required",
    }),
  })
  .refine(
    (data) => {
      return data.end_date > data.start_date;
    },
    {
      message: "End date must be after start date",
      path: ["end_date"],
    },
  )
  .refine(
    (data) => {
      return data.final_closure_date > data.idea_submission_deadline;
    },
    {
      message: "Final closure date must be after submission deadline",
      path: ["final_closure_date"],
    },
  );

export type AcademicCreateFormInputs = z.infer<typeof academicYearCreateSchema>;

export type AcademicEditFormInputs = z.infer<typeof academicYearEditSchema>;

interface AcademicYearData {
  id: number;
  start_date: string;
  end_date: string;
  idea_submission_deadline: string;
  final_closure_date: string;
  status: "active" | "closed";
}

interface CreateAcademicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AcademicCreateFormInputs) => void;
}

const CreateAcademicDialog = ({
  open,
  onOpenChange,
  onSubmit,
}: CreateAcademicDialogProps) => {
  const form = useForm<AcademicCreateFormInputs>({
    resolver: zodResolver(academicYearCreateSchema),
    defaultValues: {
      start_date: new Date(),
      end_date: addWeeks(new Date(), 1),
      idea_submission_deadline: addWeeks(new Date(), 2),
      final_closure_date: addWeeks(new Date(), 2),
    },
  });

  const handleSubmit = (data: AcademicCreateFormInputs) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Academic Year</DialogTitle>
        </DialogHeader>
        <CustomForm
          formMethods={form}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start from</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                          }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End at</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center">
                        <CalendarComponent
                          mode="single"
                          className="z-100"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                          }}
                          disabled={(date) => {
                            const start = form.getValues("start_date");
                            return date <= start || date < new Date();
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <p className="text-muted-foreground text-sm">
            Note: This cannot be edited once ideas have been submitted.
          </p>

          <FormField
            control={form.control}
            name="idea_submission_deadline"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Idea Submission Deadline*</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        className="z-100"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                        }}
                        // disabled={(date) => {
                        //   // const start = form.getValues("start_date");
                        //   // const end = form.getValues("end_date");
                        //   return (
                        //     date <= start || date >= end || date < new Date()
                        //   );
                        // }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <p className="text-muted-foreground text-sm">
            Note: This can only be modified up to 2 weeks before the set date.
          </p>

          <FormField
            control={form.control}
            name="final_closure_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Final Closure Date*</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        className="z-100"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                        }}
                        // disabled={(date) => {}}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <p className="text-muted-foreground text-sm">
            Note: This can still be extended even if the idea submission
            deadline has passed but no earlier than its date.
          </p>

          <CustomForm.Button type="submit" className="w-full">
            Create
          </CustomForm.Button>
        </CustomForm>
      </DialogContent>
    </Dialog>
  );
};

interface EditAcademicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AcademicEditFormInputs) => void;
  academicYear: AcademicYearData | null;
}

const EditAcademicDialog = ({
  open,
  onOpenChange,
  onSubmit,
  academicYear,
}: EditAcademicDialogProps) => {
  const form = useForm<AcademicEditFormInputs>({
    resolver: zodResolver(academicYearEditSchema),
  });

  useEffect(() => {
    if (academicYear) {
      form.reset({
        id: academicYear.id,
        start_date: parseISO(academicYear.start_date),
        end_date: parseISO(academicYear.end_date),
        idea_submission_deadline: parseISO(
          academicYear.idea_submission_deadline,
        ),
        final_closure_date: parseISO(academicYear.final_closure_date),
      });
    }
  }, [academicYear, form]);

  const handleSubmit = (data: AcademicEditFormInputs) => {
    onSubmit(data);
    form.reset();
  };

  if (!academicYear) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Academic Year</DialogTitle>
        </DialogHeader>
        <CustomForm
          formMethods={form}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start from</FormLabel>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                      disabled
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End at</FormLabel>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                      disabled
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <p className="text-muted-foreground text-sm">
            Note: This cannot be edited once ideas have been submitted.
          </p>

          <FormField
            control={form.control}
            name="idea_submission_deadline"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Idea Submission Deadline*</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                        disabled={field.value < addWeeks(new Date(), 2)}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        className="z-100"
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                        }}
                        // now + 2 weeks
                        disabled={(date) => {
                          return date < addWeeks(new Date(), 2);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <p className="text-muted-foreground text-sm">
            Note: This can only be modified up to 2 weeks before the set date.
          </p>

          <FormField
            control={form.control}
            name="final_closure_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Final Closure Date*</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                        disabled={field.value < addWeeks(new Date(), 2)}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        className="z-100"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                        }}
                        // now + 2 weeks
                        disabled={(date) => {
                          return date < addWeeks(new Date(), 2);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <p className="text-muted-foreground text-sm">
            Note: This can still be extended even if the idea submission
            deadline has passed but no earlier than its date.
          </p>

          <CustomForm.Button type="submit" className="w-full">
            Save Changes
          </CustomForm.Button>
        </CustomForm>
      </DialogContent>
    </Dialog>
  );
};

interface AcademicProps {
  academicYears: AcademicYearData[];
  onCreateAcademicYear: (data: AcademicCreateFormInputs) => void;
  onUpdateAcademicYear: (data: AcademicEditFormInputs) => void;
  onDeleteAcademicYear: (id: number) => void;
}

const Academic = ({
  academicYears,
  onCreateAcademicYear,
  onUpdateAcademicYear,
  onDeleteAcademicYear,
}: AcademicProps) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(true);
  const [editingYear, setEditingYear] = useState<AcademicYearData | null>(null);

  const handleCreate = (data: AcademicCreateFormInputs) => {
    onCreateAcademicYear(data);
    setIsCreateOpen(false);
  };

  const handleEdit = (data: AcademicEditFormInputs) => {
    if (editingYear) {
      onUpdateAcademicYear(data);
      setEditingYear(null);
    }
  };

  const handleDelete = (id: number) => {
    onDeleteAcademicYear(id);
  };

  // is academic year active
  const isActive = academicYears.some((year) => year.status === "active");

  return (
    <div className="space-y-6">
      <div className="bg-card flex flex-col gap-8 rounded-lg border p-6 shadow-sm">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-medium">Academic Year</h2>
          <p className="text-muted-foreground">
            Define the start and end point for the academic year, including
            deadlines for idea submission and commenting. Please note that a new
            academic year cannot be created while there is an active one. Close
            the current academic year before adding a new one.
          </p>
        </div>

        <div>
          <Button onClick={() => setIsCreateOpen(true)} disabled={isActive}>
            <Plus className="mr-2 h-4 w-4" />
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
              academicYears.map((year) => (
                <TableRow key={year.id}>
                  <TableCell>
                    <div>
                      {formatDate(parseISO(year.start_date), "dd MMM yy")} -{" "}
                      {formatDate(parseISO(year.end_date), "dd MMM yy")}
                    </div>
                    <div
                      className={cn(
                        "text-muted-foreground text-sm capitalize",
                        year.status === "active"
                          ? "text-green-500"
                          : "text-gray-500",
                      )}
                    >
                      {year.status}
                    </div>
                  </TableCell>
                  <TableCell>
                    {year.idea_submission_deadline
                      ? formatDate(
                          parseISO(year.idea_submission_deadline),
                          "dd MMM yyyy",
                        )
                      : "-"}
                  </TableCell>
                  <TableCell className="flex items-center justify-between">
                    {year.final_closure_date
                      ? formatDate(
                          parseISO(year.final_closure_date),
                          "dd MMM yyyy",
                        )
                      : "-"}
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {year.status === "active" && (
                          <DropdownMenuItem
                            onClick={() => {
                              setIsEditOpen(true);
                              setEditingYear(year);
                            }}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Academic
                          </DropdownMenuItem>
                        )}
                        {year.status !== "active" && (
                          <DropdownMenuItem
                            onClick={() => handleDelete(year.id)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete Academic Year
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <CreateAcademicDialog
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSubmit={handleCreate}
        />

        <EditAcademicDialog
          open={isEditOpen}
          onOpenChange={(open) => {
            setIsEditOpen(!isEditOpen);
            setEditingYear(null);
          }}
          onSubmit={handleEdit}
          academicYear={editingYear}
        />
      </div>
    </div>
  );
};

export default Academic;
