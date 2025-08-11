import { AppWindowIcon, CodeIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

// 데이터 타입 정의
export type DataItem = {
  list_id: number;
  list_title: string;
  org_nm: string;
  token_count: number;
  has_generated_doc: boolean;
};

export type PageData = {
  has_next: boolean;
  has_prev: boolean;
  items: DataItem[];
  page: number;
  size: number;
  total: number;
  total_pages: number;
};

const fetchData = async (page: number, sortBy: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/document?page=${page}&size=20&sort_by=${sortBy}`
  );
  const data = await response.json();
  return data;
};

export const TabContent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTab, setCurrentTab] = useState("popular");

  const { data, isLoading, error, refetch } = useQuery<PageData>({
    queryKey: ["data", currentPage, currentTab],
    queryFn: () => fetchData(currentPage, currentTab),
  });

  console.log("현재 페이지 데이터:", data);

  const handlePageChange = (page: number) => {
    console.log(`페이지 ${page}로 이동`);
    setCurrentPage(page);
  };

  const handleTabChange = (tab: string) => {
    console.log(`탭 변경: ${tab}`);
    setCurrentTab(tab);
    setCurrentPage(1); // 탭 변경 시 첫 페이지로 리셋
  };

  return (
    <div className="flex w-full w-full max-w-[1200px] flex-col gap-6">
      <Tabs defaultValue="popular" onValueChange={handleTabChange}>
        <TabsList className="">
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
        </TabsList>
        <TabsContent value="popular" className="w-full max-w-[1200px] w-full">
          <div className="w-full bg-white">
            <DataTableDemo data={data} isLoading={isLoading} />
          </div>
        </TabsContent>
        <TabsContent value="trending" className="w-full max-w-[1200px] w-full">
          <div className="w-full bg-white">
            <DataTableDemo data={data} isLoading={isLoading} />
          </div>
        </TabsContent>
        <PaginationDemo
          data={data}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      </Tabs>
    </div>
  );
};

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const columns: ColumnDef<DataItem>[] = [
  {
    accessorKey: "list_title",
    header: ({ column }) => {
      return <div className="text-left font-medium">이름</div>;
    },
    cell: ({ row }) => (
      <div className="text-left font-medium">{row.getValue("list_title")}</div>
    ),
    size: 350,
  },
  {
    accessorKey: "org_nm",
    header: ({ column }) => {
      return <div className="text-left font-medium">제공기관</div>;
    },
    cell: ({ row }) => (
      <div className="text-left">{row.getValue("org_nm")}</div>
    ),
    size: 180,
  },
  {
    accessorKey: "token_count",
    header: ({ column }) => {
      return <div className="text-left font-medium">토큰수</div>;
    },
    cell: ({ row }) => {
      const tokenCount = row.getValue("token_count") as number;
      return (
        <div className="text-left font-medium">
          {tokenCount.toLocaleString()}
        </div>
      );
    },
    size: 100,
  },
  {
    accessorKey: "updated_at",
    header: "업데이트 시간",
    cell: ({ row }) => {
      return (
        <div className="text-left text-sm text-muted-foreground">
          2024-01-01
        </div>
      );
    },
    size: 120,
  },
  {
    accessorKey: "has_generated_doc",
    header: "상태",
    cell: ({ row }) => {
      const hasGeneratedDoc = row.getValue("has_generated_doc") as boolean;
      return (
        <div className="text-left">
          <div
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              hasGeneratedDoc
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {hasGeneratedDoc ? "완료" : "대기중"}
          </div>
        </div>
      );
    },
    size: 80,
  },
];

interface DataTableDemoProps {
  data: any;
  isLoading: boolean;
}

export function DataTableDemo({ data, isLoading }: DataTableDemoProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // 현재 페이지의 데이터만 표시 (마지막 페이지)
  const currentPageData = data?.items || [];

  // 디버깅을 위한 로그
  console.log("테이블 데이터:", currentPageData);
  console.log("전체 페이지 데이터:", data);

  const table = useReactTable({
    data: currentPageData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="">
        <DropdownMenu>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id === "list_title"
                      ? "이름"
                      : column.id === "org_nm"
                      ? "제공기관"
                      : column.id === "token_count"
                      ? "토큰수"
                      : column.id === "updated_at"
                      ? "업데이트 시간"
                      : column.id === "has_generated_doc"
                      ? "상태"
                      : column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{
                        width: `${header.getSize()}px`,
                        minWidth: `${header.getSize()}px`,
                        maxWidth: `${header.getSize()}px`,
                      }}
                      className="px-6 py-4 text-left font-medium"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
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
                  로딩 중...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-gray-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: `${cell.column.getSize()}px`,
                        minWidth: `${cell.column.getSize()}px`,
                        maxWidth: `${cell.column.getSize()}px`,
                      }}
                      className="px-6 py-4"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
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
                  결과가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationDemoProps {
  data: any;
  currentPage: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export function PaginationDemo({
  data,
  currentPage,
  onPageChange,
  isLoading,
}: PaginationDemoProps) {
  const totalPages = data?.total_pages || 1;
  const total = data?.total || 0;

  const handlePageChange = (page: number) => {
    console.log(`페이지 ${page}로 이동`);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={i === currentPage}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // 현재 페이지 주변의 페이지들만 표시
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);

      if (startPage > 1) {
        pages.push(
          <PaginationItem key={1}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(1);
              }}
            >
              1
            </PaginationLink>
          </PaginationItem>
        );
        if (startPage > 2) {
          pages.push(
            <PaginationItem key="ellipsis1">
              <PaginationEllipsis />
            </PaginationItem>
          );
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={i === currentPage}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push(
            <PaginationItem key="ellipsis2">
              <PaginationEllipsis />
            </PaginationItem>
          );
        }
        pages.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(totalPages);
              }}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-sm text-muted-foreground">
        총 {total.toLocaleString()}개 항목 중 {(currentPage - 1) * 20 + 1}-
        {Math.min(currentPage * 20, total)}번째
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage - 1);
              }}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {renderPageNumbers()}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage + 1);
              }}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      {isLoading && <div className="text-sm text-muted-foreground"></div>}
    </div>
  );
}
