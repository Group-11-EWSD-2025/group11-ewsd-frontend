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
import {
  ChevronDown,
  Laptop,
  MoreVertical,
  Pencil,
  Plus,
  SearchIcon,
  Trash,
  UserX,
} from "lucide-react";
import * as React from "react";
import { useSearchParams } from "react-router-dom";

import Pagination from "@/components/common/Pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "@/hooks/use-toast";
import { getInitials, hideDialog, showDialog } from "@/lib/utils";
import LoginActivity from "@/modules/Users/components/LoginActivity";
import UserForm from "@/modules/Users/components/UserForm";
import { TRole } from "@/types/roles";
import { TUser } from "@/types/users";
import { useQueryClient } from "@tanstack/react-query";
import { useGetRoles } from "../Auth/api/queryGetRoles";
import { useDeleteUser } from "./api/mutateDeleteUser";
import { useGetUsers } from "./api/queryGetUsers";

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
    pageSize: parseInt(searchParams.get("page_size") || "8"),
    currentPage: parseInt(searchParams.get("page") || "1"),
    search: searchParams.get("search") || "",
    totalCount: 0,
  });

  // Apply debounce to search term
  const debouncedSearchTerm = useDebounce(filtersAndPagination.search, 500);

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

  const { data: rolesData } = useGetRoles({
    queryConfig: {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    },
  });
  // Update API call with search term
  const {
    data: usersData,
    isLoading: isUsersLoading,
    isError,
    error,
    refetch,
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
    queryConfig: {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    },
  });

  // Force refetch when filter parameters change
  React.useEffect(() => {
    refetch();
  }, [
    debouncedSearchTerm,
    filtersAndPagination.role,
    filtersAndPagination.status,
    filtersAndPagination.currentPage,
    filtersAndPagination.pageSize,
    refetch,
  ]);

  const { mutate: deleteUser, isPending: isDeletingUser } = useDeleteUser({
    mutationConfig: {
      onSuccess: () => {
        toast({
          title: "User deleted successfully",
        });
        // Invalidate all getUsers queries regardless of params
        queryClient.invalidateQueries({
          queryKey: ["getUsers"],
          exact: false,
        });
        hideDialog();
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

        return (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={row.original.avatar} />
              <AvatarFallback className="text-sm">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="font-medium">{userName}</p>
              <p className="text-sm text-gray-600">{userEmail}</p>
            </div>
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
      cell: ({ row }) => {
        const departmentsArray = row.original.departments;
        if (!departmentsArray?.length) return <div>N/A</div>;

        if (departmentsArray.length === 1) {
          return <div>{departmentsArray[0]?.name ?? "N/A"}</div>;
        }

        return (
          <Popover>
            <PopoverTrigger className="flex items-center gap-1">
              <span>{departmentsArray.length} departments</span>
              <ChevronDown className="h-4 w-4" />
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              <div className="flex flex-col gap-1">
                {departmentsArray.map((dept) => (
                  <div
                    key={dept.id}
                    className="rounded px-2 py-1 hover:bg-gray-100"
                  >
                    {dept.name}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        );
      },
    },
    {
      accessorKey: "role",
      header: () => {
        return <div className="text-gray-500">Role</div>;
      },
      cell: ({ row }) => (
        <div>
          {
            rolesData?.body?.find(
              (role: TRole) => role.value === row.original.role,
            )?.label
          }
        </div>
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
      cell: ({ row }) => {
        const { authState } = useAuth();
        const isAdmin = authState?.userData?.role === "admin";

        if (!isAdmin) return null;

        return (
          <Popover>
            <PopoverTrigger>
              <MoreVertical className="h-4 w-4 cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent align="end" className="flex w-[186px] flex-col p-1">
              {isAdmin ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => handleViewLoginActivity(row.original)}
                    className="w-full justify-start rounded-none p-2"
                  >
                    <Laptop className="size-4 text-slate-700" />
                    View Login Activity
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleEditUser(row.original)}
                    className="w-full justify-start rounded-none p-2"
                  >
                    <Pencil className="size-4 text-slate-700" />
                    Edit User
                  </Button>
                  <Separator />
                  <Button
                    variant="ghost"
                    onClick={() => handleDisableUser(row.original)}
                    className="w-full justify-start rounded-none p-2"
                  >
                    <UserX className="size-4 text-slate-700" />
                    Disable User
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleDeleteUser(row.original)}
                    className="w-full justify-start rounded-none p-2"
                  >
                    <Trash className="text-destructive size-4" />
                    <p className="text-destructive">Delete User</p>
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => handleDisableUser(row.original)}
                  className="w-full justify-start rounded-none p-2"
                >
                  <UserX className="size-4 text-slate-700" />
                  Disable User
                </Button>
              )}
            </PopoverContent>
          </Popover>
        );
      },
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
      search: value,
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
      children: <UserForm rolesData={rolesData?.body} />,
    });
  }

  function handleEditUser(user: TUser) {
    showDialog({
      title: "Edit User",
      children: <UserForm user={user} rolesData={rolesData?.body} />,
    });
  }

  function handleViewLoginActivity(user: TUser) {
    showDialog({
      children: <LoginActivity user={user} />,
      cancel: {
        label: "Close",
        variant: "default",
      },
    });
  }

  function handleDeleteUser(user: TUser) {
    showDialog({
      isAlert: true,
      title: "Are you sure you want to delete this user?",
      children: (
        <p className="text-brand text-sm">
          This action cannot be undone, and the user will lose access to the
          system. Any submitted ideas and comments will remain but will be
          marked as <span className="font-bold">Anonymous</span>.
        </p>
      ),
      cancel: {
        label: "Cancel",
      },
      action: {
        label: "Yes, Delete",
        variant: "destructive",
        state: isDeletingUser ? "loading" : "default",
        onClick: () => {
          deleteUser({ id: user.id });
        },
      },
    });
  }

  function handleDisableUser(user: TUser) {
    showDialog({
      isAlert: true,
      title: "Are you sure you want to disable this user?",
      children: (
        <div>
          <p className="text-brand text-sm">
            This action cannot be undone, and the user will lose access to the
            system.
          </p>
        </div>
      ),
      cancel: {
        label: "Cancel",
      },
      action: {
        label: "Yes, Disable",
        variant: "destructive",
        state: isDeletingUser ? "loading" : "default",
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
            value={filtersAndPagination.search}
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
              {rolesData?.body?.map((role: TRole) => (
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
