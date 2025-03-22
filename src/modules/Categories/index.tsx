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
  MoreVertical,
  Pencil,
  Plus,
  SearchIcon,
  Tag,
  Trash,
} from "lucide-react";
import * as React from "react";

import Pagination from "@/components/common/Pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { hideDialog, showDialog } from "@/lib/utils";
import { useDeleteCategory } from "@/modules/Categories/api/mutateDeleteCategory";
import { useGetCategoryList } from "@/modules/Categories/api/queryGetCategoryList";
import { Category } from "@/modules/Categories/types";
import { useQueryClient } from "@tanstack/react-query";
import CategoryCreateForm from "./components/CategoryCreateForm";
import CategoryEditForm from "./components/CategoryEditForm";

const Categories = () => {
  const queryClient = useQueryClient();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [currentPage, setCurrentPage] = React.useState(1);

  const { data: apiResponse, isLoading } = useGetCategoryList({
    params: {
      page: currentPage,
    },
    queryConfig: {
      retry: false,
    },
  });

  const deleteCategory = useDeleteCategory({
    mutationConfig: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["getCategoryList"],
        });
        hideDialog();
        toast({
          title: "Category deleted successfully",
        });
      },
    },
  });

  const categoryResult = apiResponse?.body;

  const pageSize = categoryResult?.per_page || 10;

  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "name",
      header: () => <div className="text-gray-500">Category Name</div>,
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "created_at",
      header: () => <div className="text-gray-500">Created At</div>,
      cell: ({ row }) => (
        <div className="text-gray-600">
          {formatDate(row.getValue("created_at"))}
        </div>
      ),
    },
    {
      accessorKey: "ideas",
      header: () => <div className="text-gray-500">Tagged With</div>,
      cell: ({ row }) => {
        const ideas = row.getValue("ideas") as string[] | undefined;
        return (
          <div className="flex flex-wrap gap-1">
            {ideas && ideas.length > 0 ? (
              ideas.map((tag, index) => (
                <Badge key={index} variant="outline" className="bg-blue-50">
                  <Tag className="mr-1 h-3 w-3" />
                  {tag}
                </Badge>
              ))
            ) : (
              <span className="text-gray-400">—</span>
            )}
          </div>
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
              onClick={() => handleEditCategory(row.original)}
              className="w-full justify-start p-2"
            >
              <Pencil className="size-4 text-slate-700" />
              Edit Category
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleDeleteCategory(row.original.id)}
              className="w-full justify-start p-2"
            >
              <Trash className="text-destructive size-4" />
              <p className="text-destructive">Delete Category</p>
            </Button>
          </PopoverContent>
        </Popover>
      ),
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const table = useReactTable({
    data: categoryResult?.data || [],
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
        pageIndex: (categoryResult?.current_page || 1) - 1,
        pageSize,
      },
    },
    pageCount: categoryResult?.last_page || 1,
  });

  function handleCreateCategory() {
    showDialog({
      title: "Create Category",
      children: <CategoryCreateForm />,
    });
  }

  function handleEditCategory(category: Category) {
    showDialog({
      title: "Edit Category",
      children: <CategoryEditForm category={category} />,
    });
  }

  function handleDeleteCategory(id: string) {
    showDialog({
      isAlert: true,
      title: "Are you sure you want to delete this category?",
      children: (
        <p className="text-brand text-sm">
          This action cannot be undone. Categories associated with existing
          items will be removed.
        </p>
      ),
      cancel: {
        label: "Cancel",
      },
      action: {
        label: "Yes, Delete",
        variant: "destructive",
        state: deleteCategory.isPending ? "loading" : "default",
        onClick: () => {
          deleteCategory.mutate(id);
        },
      },
    });
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    table.getColumn("name")?.setFilterValue(value);
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex items-center gap-2">
          <Input
            placeholder="Search categories..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={handleSearch}
            className="min-w-xs border bg-white py-5 text-base placeholder:text-gray-400"
          />
          <SearchIcon className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-gray-400" />
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="flex items-center gap-1"
            onClick={handleCreateCategory}
          >
            <Plus className="h-4 w-4" />
            Create Category
          </Button>
        </div>
      </div>

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
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading categories...
                </TableCell>
              </TableRow>
            ) : categoryResult?.data.length ? (
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
                  No categories found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {categoryResult && (
        <Pagination
          variant="simple"
          currentPage={currentPage}
          totalPages={categoryResult.last_page}
          pageSize={categoryResult.per_page}
          totalItems={categoryResult.total}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default Categories;
