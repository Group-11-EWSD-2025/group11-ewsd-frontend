import { Badge } from "@/components/ui/badge";
import {
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
import { useSearchParams } from "react-router-dom";

import Pagination from "@/components/common/Pagination";
import UserForm from "@/components/common/UserForm";
import { Button } from "@/components/ui/button";
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
import { ROLE_OPTIONS } from "@/constants";
import { toast } from "@/hooks/use-toast";
import { showDialog } from "@/lib/utils";
import { TUser } from "@/types/users";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteUser } from "./api/mutateDeleteUser";
import { useGetUsers } from "./api/queryGetUsers";

// Custom hook for debounced value
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

const Users = () => {
  // URL search params
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const [tableState, setTableState] = React.useState({
    sorting: [] as SortingState,
    columnFilters: [] as ColumnFiltersState,
    columnVisibility: {} as VisibilityState,
    rowSelection: {} as Record<string, boolean>,
  });

  const [filtersAndPagination, setFiltersAndPagination] = React.useState({
    role: searchParams.get("role") || "all",
    status: searchParams.get("status") || "all",
    pageSize: parseInt(searchParams.get("page_size") || "4"),
    currentPage: parseInt(searchParams.get("page") || "1"),
    searchTerm: searchParams.get("search") || "",
    totalCount: 0,
  });

  // Apply debounce to search term
  const debouncedSearchTerm = useDebounce(filtersAndPagination.searchTerm, 500);

  // Helper functions to update specific parts of the state
  const updateTableState = (newState: Partial<typeof tableState>) => {
    setTableState((prev) => ({ ...prev, ...newState }));
  };

  const updateFiltersAndPagination = (
    newState: Partial<typeof filtersAndPagination>,
  ) => {
    setFiltersAndPagination((prev) => ({ ...prev, ...newState }));
  };

  // Sync URL with state when filters change
  React.useEffect(() => {
    const params = new URLSearchParams();

    // Always include page, page_size in URL
    params.set("role", filtersAndPagination.role);
    params.set("status", filtersAndPagination.status);
    params.set("page", filtersAndPagination.currentPage.toString());
    params.set("page_size", filtersAndPagination.pageSize.toString());

    if (debouncedSearchTerm) {
      params.set("search", debouncedSearchTerm);
    }

    setSearchParams(params, { replace: true });
  }, [
    debouncedSearchTerm,
    filtersAndPagination.role,
    filtersAndPagination.status,
    filtersAndPagination.currentPage,
    filtersAndPagination.pageSize,
    setSearchParams,
  ]);

  // Update API call with search term
  const {
    data: usersData,
    isLoading: isUsersLoading,
    isError,
    error,
  } = useGetUsers({
    params: {
      ...(filtersAndPagination.role !== "all" && {
        role: filtersAndPagination.role,
      }),
      ...(filtersAndPagination.status !== "all" && {
        status: filtersAndPagination.status,
      }),
      ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
      perPage: filtersAndPagination.pageSize,
      page: filtersAndPagination.currentPage,
    },
  });

  const { mutate: deleteUser, isPending: isDeletingUser } = useDeleteUser({
    mutationConfig: {
      onSuccess: () => {
        toast({
          title: "User deleted successfully",
        });
        queryClient.invalidateQueries({ queryKey: ["getUsers"] });
      },
    },
  });

  // Extract users and metadata from the response
  const users = React.useMemo(() => {
    if (!usersData?.body) return [];

    // Update total count from API response if available
    if (usersData?.body?.total) {
      updateFiltersAndPagination({ totalCount: usersData?.body.total });
    }
    return usersData?.body?.data || [];
  }, [usersData?.body]);

  // Define columns
  const columns: ColumnDef<TUser>[] = [
    {
      accessorKey: "name",
      header: () => {
        return <div className="text-gray-500">Name</div>;
      },
      cell: ({ row }) => {
        const userName = row.getValue("name") as string;
        const userEmail = row.original.email;

        // Debug logging

        return (
          <div className="flex flex-col">
            <p className="font-medium">{userName}</p>
            <p className="text-sm text-gray-600">{userEmail}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "phone",
      header: () => {
        return <div className="text-gray-500">Phone</div>;
      },
      cell: ({ row }) => <div>{row.getValue("phone") || "N/A"}</div>,
    },
    {
      accessorKey: "department",
      header: () => {
        return <div className="text-gray-500">Assigned Department</div>;
      },
      cell: ({ row }) => <div>{row.getValue("department") || "N/A"}</div>,
    },
    {
      accessorKey: "role",
      header: () => {
        return <div className="text-gray-500">Role</div>;
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("role")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: () => <div className="text-gray-500">Status</div>,
      cell: ({ row }) => {
        // Default to "active" if status is not provided
        const status = (row.original.status || "active") as string;
        const badgeVariant = getBadgeVariantForStatus(status);
        return (
          <Badge
            variant={badgeVariant}
            className="rounded-full px-3 py-1 capitalize"
          >
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <Popover>
          <PopoverTrigger>
            <MoreVertical className="h-4 w-4 cursor-pointer" />
          </PopoverTrigger>
          <PopoverContent align="end" className="flex w-[186px] flex-col p-1">
            <Button
              variant="ghost"
              onClick={() => handleEditUser(row.original)}
              className="w-full justify-start p-2"
            >
              <Pencil className="size-4 text-slate-700" />
              Edit User
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleDeleteUser(row.original)}
              className="w-full justify-start p-2"
            >
              <Trash className="text-destructive size-4" />
              <p className="text-destructive">Delete User</p>
            </Button>
          </PopoverContent>
        </Popover>
      ),
    },
  ];

  // Helper function to determine badge variant based on status
  const getBadgeVariantForStatus = (
    status: string,
  ):
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "success"
    | "warning"
    | "info" => {
    switch (status.toLowerCase()) {
      case "active":
        return "success";
      case "pending":
        return "warning";
      case "disabled":
        return "outline";
      case "suspended":
        return "destructive";
      case "new":
        return "info";
      default:
        return "default";
    }
  };

  // Calculate total pages based on total items from API
  const totalPages = Math.ceil(
    filtersAndPagination.totalCount / filtersAndPagination.pageSize,
  );

  // Handle page change for pagination
  const handlePageChange = (page: number) => {
    updateFiltersAndPagination({ currentPage: page });
  };

  // Handle role change
  const handleRoleChange = (value: string) => {
    updateFiltersAndPagination({
      role: value,
      currentPage: 1, // Reset to first page when filter changes
    });
  };

  // Handle page size change
  const handlePageSizeChange = (size: number) => {
    updateFiltersAndPagination({
      pageSize: size,
      currentPage: 1, // Reset to first page when page size changes
    });
  };

  // Handle search term change
  const handleSearchChange = (value: string) => {
    updateFiltersAndPagination({
      searchTerm: value,
      ...(value === "" && { currentPage: 1 }), // Reset to first page when clearing search
    });
  };

  const table = useReactTable({
    data: users,
    columns,
    onSortingChange: (sorting) =>
      updateTableState({ sorting: sorting as SortingState }),
    onColumnFiltersChange: (columnFilters) =>
      updateTableState({ columnFilters: columnFilters as ColumnFiltersState }),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: (columnVisibility) =>
      updateTableState({
        columnVisibility: columnVisibility as VisibilityState,
      }),
    onRowSelectionChange: (rowSelection) =>
      updateTableState({
        rowSelection: rowSelection as Record<string, boolean>,
      }),
    manualPagination: true,
    state: {
      sorting: tableState.sorting,
      columnFilters: tableState.columnFilters,
      columnVisibility: tableState.columnVisibility,
      rowSelection: tableState.rowSelection,
      pagination: {
        pageIndex: filtersAndPagination.currentPage - 1, // Convert 1-indexed to 0-indexed
        pageSize: filtersAndPagination.pageSize,
      },
    },
    pageCount: totalPages,
  });

  function handleCreateUser() {
    showDialog({
      title: "Create User",
      children: <UserForm />,
    });
  }

  function handleEditUser(user: TUser) {
    showDialog({
      title: "Edit User",
      children: <UserForm user={user} />,
    });
  }

  function handleDeleteUser(user: TUser) {
    showDialog({
      isAlert: true,
      title: "Are you sure you want to delete this user?",
      children: (
        <p className="text-brand text-sm">
          This action cannot be undone, and the user will lose access to the
          system.
        </p>
      ),
      cancel: {
        label: "Cancel",
      },
      action: {
        label: "Yes, Delete",
        variant: "destructive",
        onClick: () => {
          deleteUser({ id: user.id });
        },
      },
    });
  }

  return (
    <div className="p-4 lg:p-6">
      {/* Header with search and filters */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex items-center gap-2">
          <Input
            placeholder="Search..."
            value={filtersAndPagination.searchTerm}
            onChange={(event) => handleSearchChange(event.target.value)}
            className="min-w-xs border bg-white py-5 text-base placeholder:text-gray-400"
          />
          <SearchIcon className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-gray-400" />
        </div>
        <div className="flex items-center gap-2">
          <Select
            defaultValue="all"
            value={filtersAndPagination.role}
            onValueChange={handleRoleChange}
          >
            <SelectTrigger className="h-10 min-w-36 border bg-white shadow-none">
              <SelectValue placeholder="All Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Role</SelectItem>
              {ROLE_OPTIONS.map((role) => (
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
            {isUsersLoading || isDeletingUser ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading users...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-red-500"
                >
                  Error loading users:{" "}
                  {(error as Error)?.message || "Unknown error"}
                </TableCell>
              </TableRow>
            ) : users.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
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
        currentPage={filtersAndPagination.currentPage}
        totalPages={totalPages}
        pageSize={filtersAndPagination.pageSize}
        totalItems={filtersAndPagination.totalCount}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default Users;
