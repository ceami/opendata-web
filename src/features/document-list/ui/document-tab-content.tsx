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

import { Input } from "@/shared/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { RxMagnifyingGlass } from "react-icons/rx";
import { useDataTable } from "../model/useDataTable";
import { cn } from "@/shared/lib/utils";
import { fetchDocumentList } from "@/entities/document";
import { DocumentTable, DocumentTableSkeleton } from "./document-table";
import { DocumentPagination } from "./document-pagination";

export function DocumentTabContent() {
  const {
    currentPage,
    currentTab,
    query,
    setCurrentPage,
    setCurrentTab,
    setQuery,
  } = useDataTable();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["data", currentPage, currentTab, query],
    queryFn: () => fetchDocumentList(currentPage, currentTab, query),
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    setCurrentPage(1);
  };

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    setCurrentPage(1);
  };

  return (
    <div className="flex w-full mt-4 md:mt-7 max-w-[var(--content-max-width)] flex-col gap-4 md:gap-6 px-0">
      <Tabs value={currentTab} onValueChange={handleTabChange} className="gap-4 md:gap-6">
        <TabsList className="flex flex-col md:flex-row md:justify-between w-full gap-4 md:gap-0 h-auto py-2">
          <div className="flex justify-start">
            <TabsTrigger
              value="popular"
              className="relative text-base font-semibold transition-colors duration-200"
            >
              인기순
              <div
                className={cn(
                  "w-full flex justify-center bg-foreground transition-colors duration-200 absolute bottom-[1px]",
                  currentTab === "popular" ? "h-[3px]" : "h-[1px]"
                )}
              />
            </TabsTrigger>
            <TabsTrigger
              value="trending"
              className="text-base font-semibold transition-colors duration-200 relative"
            >
              최신순
              <div
                className={cn(
                  "w-full flex justify-center bg-foreground transition-colors duration-200 absolute bottom-[1px]",
                  currentTab === "trending" ? "h-[3px]" : "h-[1px]"
                )}
              />
            </TabsTrigger>
          </div>

          <div className="relative flex justify-end w-full md:w-1/3 items-center">
            <Input
              type="search"
              placeholder="데이터를 검색해보세요"
              className="bg-muted placeholder:text-muted-foreground"
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
              className="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-transparent cursor-pointer transition-colors"
              size={20}
              onClick={() => refetch()}
            />
          </div>
        </TabsList>
        <TabsContent value="popular" className="w-full max-w-[var(--content-max-width)] mt-0 pt-4">
          <div className="w-full bg-background overflow-hidden">
            {isLoading ? (
              <DocumentTableSkeleton />
            ) : (
              <DocumentTable data={data} />
            )}
          </div>
        </TabsContent>
        <TabsContent value="trending" className="w-full max-w-[var(--content-max-width)] mt-0 pt-4">
          <div className="w-full bg-background overflow-hidden">
            {isLoading ? (
              <DocumentTableSkeleton />
            ) : (
              <DocumentTable data={data} />
            )}
          </div>
        </TabsContent>
        <DocumentPagination
          data={data}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </Tabs>
    </div>
  );
}
