import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreVertical, Pencil, Plus, SearchIcon, Trash } from "lucide-react";
import * as React from "react";

import Pagination from "@/components/common/Pagination";
import UserForm from "@/components/common/UserForm";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { showDialog } from "@/lib/utils";
import { dialogState } from "@/recoil/common";
import { useRecoilState } from "recoil";

// Define the data type
type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
};

// Sample data
const data: User[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@gmail.com",
    phone: "062342332",
    department: "Business & Management",
    role: "Staff",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@gmail.com",
    phone: "061235354",
    department: "Marketing",
    role: "QA Coordinator",
  },
  {
    id: "3",
    name: "Prof. Susan",
    email: "susan@gmail.com",
    phone: "062323232",
    department: "Research",
    role: "QA Manager",
  },
  {
    id: "4",
    name: "Lisa Chen",
    email: "lisa@gmail.com",
    phone: "065939952",
    department: "Administration",
    role: "Admin",
  },
  {
    id: "5",
    name: "Michael Brown",
    email: "michael@gmail.com",
    phone: "062345678",
    department: "IT",
    role: "Developer",
  },
  {
    id: "6",
    name: "Emily Davis",
    email: "emily@gmail.com",
    phone: "061234567",
    department: "Human Resources",
    role: "HR Manager",
  },
  {
    id: "7",
    name: "David Wilson",
    email: "david@gmail.com",
    phone: "062345678",
    department: "Finance",
    role: "Accountant",
  },
  {
    id: "8",
    name: "Jennifer Lee",
    email: "jennifer@gmail.com",
    phone: "061234567",
    department: "Marketing",
    role: "Marketing Specialist",
  },
  {
    id: "9",
    name: "Robert Taylor",
    email: "robert@gmail.com",
    phone: "062345678",
    department: "IT",
    role: "System Administrator",
  },
  {
    id: "10",
    name: "Jessica Martinez",
    email: "jessica@gmail.com",
    phone: "061234567",
    department: "Research",
    role: "Researcher",
  },
  {
    id: "11",
    name: "Thomas Anderson",
    email: "thomas@gmail.com",
    phone: "062345678",
    department: "Business & Management",
    role: "Project Manager",
  },
  {
    id: "12",
    name: "Amanda White",
    email: "amanda@gmail.com",
    phone: "061234567",
    department: "Human Resources",
    role: "HR Specialist",
  },
];

// Role options for filtering
const roleOptions = [
  { label: "Staff", value: "Staff" },
  { label: "QA Coordinator", value: "QA Coordinator" },
  { label: "QA Manager", value: "QA Manager" },
  { label: "Admin", value: "Admin" },
  { label: "Developer", value: "Developer" },
  { label: "HR Manager", value: "HR Manager" },
  { label: "Accountant", value: "Accountant" },
  { label: "Marketing Specialist", value: "Marketing Specialist" },
  { label: "System Administrator", value: "System Administrator" },
  { label: "Researcher", value: "Researcher" },
  { label: "Project Manager", value: "Project Manager" },
  { label: "HR Specialist", value: "HR Specialist" },
];

const Users = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedRole, setSelectedRole] = React.useState("all");
  const [pageSize] = React.useState(4);
  const [currentPage, setCurrentPage] = React.useState(1);

  const [dialog, setDialog] = useRecoilState(dialogState);
  console.log(dialog);

  // Define columns
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: () => {
        return <div className="text-sm font-medium text-gray-500">Name</div>;
      },
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "email",
      header: () => {
        return <div className="text-sm font-medium text-gray-500">Email</div>;
      },
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "phone",
      header: () => {
        return <div className="text-sm font-medium text-gray-500">Phone</div>;
      },
      cell: ({ row }) => <div>{row.getValue("phone")}</div>,
    },
    {
      accessorKey: "department",
      header: () => {
        return (
          <div className="text-sm font-medium text-gray-500">
            Assigned Department
          </div>
        );
      },
      cell: ({ row }) => <div>{row.getValue("department")}</div>,
    },
    {
      accessorKey: "role",
      header: () => {
        return <div className="text-sm font-medium text-gray-500">Role</div>;
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("role")}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
    },
  ];

  // Filter data based on role selection
  const filteredData = React.useMemo(() => {
    return data.filter((user) => {
      return selectedRole === "all" || user.role === selectedRole;
    });
  }, [selectedRole]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Handle page change for SimplePagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: currentPage - 1, // Convert 1-indexed to 0-indexed
        pageSize,
      },
    },
    pageCount: totalPages,
  });

  // Get current page data
  const currentData = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, currentPage, pageSize]);

  function handleCreateUser() {
    showDialog({
      title: "Create User",
      children: <UserForm />,
    });
  }

  function handleEditUser() {
    showDialog({
      title: "Edit User",
      children: <UserForm />,
    });
  }

  function handleDeleteUser() {
    showDialog({
      isAlert: true,
      title: "Are you sure you want to delete this user?",
      children: (
        <p className="text-brand text-sm">
          This action cannot be undone, and the user will lose access to the
          system. Any submitted ideas and comments will remain but will be
          marked as <b>Anonymous</b>.
        </p>
      ),
      cancel: {
        label: "Cancel",
      },
      action: {
        label: "Yes, Delete",
        variant: "destructive",
        onClick: () => {
          console.log("Delete user");
        },
      },
    });
  }

  return (
    <div className="container mx-auto">
      {/* Header with search and filters */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex items-center gap-2">
          <Input
            placeholder="Search..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="min-w-xs border bg-white py-5 placeholder:text-gray-400"
          />
          <SearchIcon className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-gray-400" />
        </div>
        <div className="flex items-center gap-2">
          <Select
            defaultValue="all"
            value={selectedRole}
            onValueChange={(value) => {
              setSelectedRole(value);
            }}
          >
            <SelectTrigger className="h-10 w-36 border bg-white shadow-none">
              <SelectValue placeholder="All Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Role</SelectItem>
              {roleOptions.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            className="flex items-center gap-1"
            onClick={handleCreateUser}
          >
            <Plus className="h-4 w-4" />
            Create User
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-sm border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {currentData.length > 0 ? (
              currentData.map((user) => {
                const row = table
                  .getRowModel()
                  .rows.find((r) => r.original.id === user.id);
                return (
                  <TableRow
                    key={user.id}
                    data-state={row?.getIsSelected() && "selected"}
                  >
                    {table
                      .getVisibleFlatColumns()
                      .map((column: Column<User>) => {
                        if (column.id === "select") {
                          return (
                            <TableCell key={column.id}>
                              <Checkbox
                                checked={row?.getIsSelected()}
                                onCheckedChange={(value: boolean) =>
                                  row?.toggleSelected(!!value)
                                }
                                aria-label="Select row"
                              />
                            </TableCell>
                          );
                        }
                        if (column.id === "actions") {
                          return (
                            <TableCell key={column.id}>
                              <Popover>
                                <PopoverTrigger>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="flex w-[160px] flex-col p-1">
                                  <Button
                                    variant="ghost"
                                    onClick={handleEditUser}
                                    className="w-full justify-start"
                                  >
                                    <Pencil className="size-4 text-slate-700" />
                                    Edit User
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    onClick={handleDeleteUser}
                                    className="w-full justify-start"
                                  >
                                    <Trash className="text-destructive size-4" />
                                    <p className="text-destructive">
                                      Delete User
                                    </p>
                                  </Button>
                                </PopoverContent>
                              </Popover>
                            </TableCell>
                          );
                        }
                        return (
                          <TableCell key={column.id}>
                            {column.id === "name" && user.name}
                            {column.id === "email" && user.email}
                            {column.id === "phone" && user.phone}
                            {column.id === "department" && user.department}
                            {column.id === "role" && (
                              <div className="capitalize">{user.role}</div>
                            )}
                          </TableCell>
                        );
                      })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <Pagination
        variant="simple"
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Users;
