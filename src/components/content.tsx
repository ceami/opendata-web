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
import { RxMagnifyingGlass } from "react-icons/rx";
import { useDataTable } from "@/contexts/DataTableContext";
import { cn } from "@/lib/utils";

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

const fetchData = async (page: number, sortBy: string, query: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/document?q=${query}&page=${page}&size=20&sort_by=${sortBy}`
  );
  const data = await response.json();
  return data;
};

export const TabContent = () => {
  const {
    currentPage,
    currentTab,
    query,
    setCurrentPage,
    setCurrentTab,
    setQuery,
  } = useDataTable();

  const { data, isLoading, error, refetch } = useQuery<PageData>({
    queryKey: ["data", currentPage, currentTab, query],
    queryFn: () => fetchData(currentPage, currentTab, query),
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

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    setCurrentPage(1); // 검색 시 첫 페이지로 리셋
  };

  return (
    <div className="flex w-full w-full max-w-[1200px] flex-col gap-6">
      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <TabsList className="flex justify-between w-full">
          <div className="flex justify-start ">
            <TabsTrigger
              value="popular"
              className="relative text-[20px] font-semibold data-[state=active]:text-blue-500 data-[state=active]:font-bold transition-colors duration-200 relative"
            >
              Popular
              <div
                className={cn(
                  "w-[80px] flex justify-center h-[3px] transition-colors duration-200 absolute bottom-[4px] left-1/2 -translate-x-1/2",
                  currentTab === "popular" ? "bg-blue-500" : "bg-gray-300"
                )}
              />
            </TabsTrigger>
            <TabsTrigger
              value="trending"
              className="text-[20px] font-semibold data-[state=active]:text-blue-500 data-[state=active]:font-bold transition-colors duration-200 relative"
            >
              Trending
              <div
                className={cn(
                  "w-[80px] flex justify-center h-[3px] transition-colors duration-200 absolute bottom-[4px] left-1/2 -translate-x-1/2",
                  currentTab === "trending" ? "bg-blue-500" : "bg-gray-300"
                )}
              />
            </TabsTrigger>
          </div>
          <div className="relative flex justify-end w-1/3 items-center">
            <Input
              type="email"
              placeholder="데이터를 검색해보세요"
              className="rounded-full border-2 border-gray-500 bg-[#f1f3f4]"
              value={query}
              onChange={(e) => {
                handleQueryChange(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  refetch();
                }
              }}
            />
            <RxMagnifyingGlass
              className=" text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-transparent"
              size={20}
              onClick={() => refetch()}
            />
          </div>
        </TabsList>
        <TabsContent value="popular" className="w-full max-w-[1200px] w-full ">
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
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
} from "react-icons/io5";
import { useRouter } from "next/navigation";

const linClamp = (text: string) => {
  if (text.length > 36) {
    return text.slice(0, 36) + "...";
  }
  return text;
};

const humanizeKo = (dateInput: string | Date, nowInput: Date = new Date()) => {
  if (!dateInput) return "-";
  const dt = dateInput instanceof Date ? dateInput : new Date(dateInput);
  const now = nowInput instanceof Date ? nowInput : new Date(nowInput);

  let seconds = Math.floor((now.getTime() - dt.getTime()) / 1000);

  // 미래
  if (seconds < 0) {
    seconds = -seconds;
    if (seconds < 60) return "곧";
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}분 후`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}시간 후`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}일 후`;
    if (days < 365) return `${Math.floor(days / 7)}주 후`;
    return `${Math.floor(days / 365)}년 후`;
  }

  // 과거
  if (seconds < 60) return "방금 전";
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}일 전`;
  if (days < 365) return `${Math.floor(days / 7)}주 전`;
  return `${Math.floor(days / 365)}년 전`;
};

export const columns: ColumnDef<DataItem>[] = [
  {
    accessorKey: "list_title",
    header: ({ column }) => {
      return <div className="text-left font-semibold">이름</div>;
    },
    cell: ({ row }) => (
      <div className="text-left font-medium">
        {linClamp(row.getValue("list_title"))}
      </div>
    ),
    size: 350,
  },
  {
    accessorKey: "org_nm",
    header: ({ column }) => {
      return <div className="text-left font-semibold">제공기관</div>;
    },
    cell: ({ row }) => (
      <div className="text-left">{row.getValue("org_nm")}</div>
    ),
    size: 180,
  },
  {
    accessorKey: "token_count",
    header: ({ column }) => {
      return <div className="text-center font-semibold">토큰수</div>;
    },
    cell: ({ row }) => {
      const tokenCount = row.getValue("token_count") as number;
      return (
        <div className="text-center font-medium">
          {tokenCount.toLocaleString()}
        </div>
      );
    },
    size: 100,
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => {
      return <div className="text-center font-semibold">업데이트 시간</div>;
    },
    cell: ({ row }) => {
      return (
        <div className="text-center text-sm text-muted-foreground">
          {humanizeKo(row.getValue("updated_at"))}
        </div>
      );
    },
    size: 120,
  },
  {
    accessorKey: "has_generated_doc",
    header: ({ column }) => {
      return <div className="text-center font-semibold">상태</div>;
    },
    cell: ({ row }) => {
      const hasGeneratedDoc = row.getValue("has_generated_doc") as boolean;
      return (
        <div className="text-center flex justify-center items-center">
          {hasGeneratedDoc ? (
            <IoCheckmarkCircleOutline size={20} className=" text-green-500" />
          ) : (
            <IoCloseCircleOutline size={20} className="text-red-500" />
          )}
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
  const router = useRouter();

  // 현재 페이지의 데이터만 표시 (마지막 페이지)
  const currentPageData = data?.items || [];

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
                    className="capitalize "
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
          <TableHeader className="bg-gray-100 ">
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
                  <Skeleton className="w-full h-24 mb-2" />
                  <Skeleton className="w-full h-24 mb-2" />
                  <Skeleton className="w-full h-24 mb-2" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-gray-50 cursor-pointer hover:text-blue-500"
                  onClick={() => {
                    router.push(`/${row.original.list_id}`);
                  }}
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
import { Skeleton } from "./ui/skeleton";
// import { useRouter } from "next/navigation";

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
      {/* <div className="text-sm text-muted-foreground">
        총 {total.toLocaleString()}개 항목 중 {(currentPage - 1) * 20 + 1}-
        {Math.min(currentPage * 20, total)}번째
      </div> */}
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

export const Content = () => {
  return (
    <div className="w-full min-h-[calc(100vh-75px)] h-full mx-auto max-w-[1200px]">
      <div id="tabContent" className="">
        <TabContent />
      </div>
    </div>
  );
};
