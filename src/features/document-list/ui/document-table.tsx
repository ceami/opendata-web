/*
 * Copyright 2025 Team Aeris
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
"use client";

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
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
} from "@/shared/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { BiCheckCircle, BiErrorCircle } from "react-icons/bi";
import { StatusBadge, getVariantStyles, linClamp, humanizeKo, countToken } from "@/entities/document";
import { Skeleton } from "@/shared/ui/skeleton";
import type { DataItem, PageData } from "@/entities/document";

export const columns: ColumnDef<DataItem>[] = [
  {
    accessorKey: "listTitle",
    header: () => <div className="text-left font-medium text-base">이름</div>,
    cell: ({ row }) => (
      <div className="text-left font-medium text-foreground">
        {linClamp(row.getValue("listTitle"), 27)}
      </div>
    ),
    size: 350,
  },
  {
    accessorKey: "orgNm",
    header: () => (
      <div className="text-left font-medium text-base">제공기관</div>
    ),
    cell: ({ row }) => (
      <div className="line-clamp-1 text-left font-normal text-muted-foreground">
        {linClamp(row.getValue("orgNm"), 13)}
      </div>
    ),
    size: 180,
  },
  {
    accessorKey: "dataType",
    header: () => <div className="text-center font-medium text-base">구분</div>,
    cell: ({ row }) => {
      const dataType = row.getValue("dataType") as string;

      return (
        <div className="text-center">
          <StatusBadge variant={dataType}>
            {getVariantStyles(dataType).title}
          </StatusBadge>
        </div>
      );
    },
    size: 100,
  },
  {
    accessorKey: "tokenCount",
    header: () => <div className="text-center font-medium text-base">토큰수</div>,
    cell: ({ row }) => {
      const tokenCount = row.getValue("tokenCount") as number;
      return (
        <div className="text-center font-normal text-muted-foreground">{countToken(tokenCount)}</div>
      );
    },
    size: 100,
  },
  {
    accessorKey: "updatedAt",
    header: () => <div className="text-center font-medium text-base">업데이트</div>,
    cell: ({ row }) => (
      <div className="text-center text-base font-normal text-muted-foreground">
        {humanizeKo(row.getValue("updatedAt"))}
      </div>
    ),
    size: 100,
  },
  {
    accessorKey: "hasGeneratedDoc",
    header: () => <div className="text-center font-medium text-base">상태</div>,
    cell: ({ row }) => {
      const hasGeneratedDoc = row.getValue("hasGeneratedDoc") as boolean;
      return (
        <div className="text-center flex justify-center items-center">
          {hasGeneratedDoc ? (
            <BiCheckCircle size={18} className="text-green-600" />
          ) : (
            <BiErrorCircle size={18} className="text-destructive" />
          )}
        </div>
      );
    },
    size: 100,
  },
];

interface DocumentTableProps {
  data: PageData | undefined;
}

export function DocumentTable({ data }: DocumentTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const router = useRouter();

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
    <div className="w-full overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 custom-scrollbar">
      <div className="min-w-[640px]">
        <DropdownMenu>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize "
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) =>
                    column.toggleVisibility(!!value)
                  }
                >
                  {column.id === "listTitle"
                    ? "이름"
                    : column.id === "orgNm"
                    ? "제공기관"
                    : column.id === "tokenCount"
                    ? "토큰수"
                    : column.id === "dataType"
                    ? "구분"
                    : column.id === "updatedAt"
                    ? "업데이트 시간"
                    : column.id === "hasGeneratedDoc"
                    ? "상태"
                    : column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="min-w-0">
        <Table className="w-full min-w-[640px]">
          <TableHeader className="bg-muted text-base font-medium">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{
                      width: `${header.getSize()}px`,
                      minWidth: `${header.getSize()}px`,
                      maxWidth: `${header.getSize()}px`,
                    }}
                    className="py-3"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="">
            {table.getRowModel().rows?.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer hover:text-primary text-foreground transition-colors"
                  onClick={() => {
                    router.push(`/${row.original.listId}`);
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
                      className="py-3 px-2 text-base"
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

export function DocumentTableSkeleton() {
  return (
    <div className="w-full">
      <div className="">
        <DropdownMenu>
          <DropdownMenuContent align="end" />
        </DropdownMenu>
      </div>
      <div className="">
        <Table className="w-full ">
          <TableHeader className="bg-muted text-base font-medium">
            <TableRow>
              {columns.map((col, index) => (
                <TableHead
                  key={String(col.accessorKey ?? index)}
                  className="py-3"
                />
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="">
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                <Skeleton key="1" className="w-full h-24 mb-2" />
                <Skeleton key="2" className="w-full h-24 mb-2" />
                <Skeleton key="3" className="w-full h-24 mb-2" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
