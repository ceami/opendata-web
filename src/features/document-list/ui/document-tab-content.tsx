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
import { DocumentTable } from "./document-table";
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
    <div className="flex w-full  mt-7 max-w-[1200px] flex-col gap-6">
      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <TabsList className="flex justify-between w-full">
          <div className="flex justify-start ">
            <TabsTrigger
              value="popular"
              className="relative text-[18px] font-semibold transition-colors duration-200 relative"
            >
              인기순
              <div
                className={cn(
                  "w-full flex justify-center  bg-black transition-colors duration-200 absolute bottom-[1px] ",
                  currentTab === "popular" ? "h-[3px]" : " h-[1px]"
                )}
              />
            </TabsTrigger>
            <TabsTrigger
              value="trending"
              className="text-[18px] font-semibold transition-colors duration-200 relative"
            >
              최신순
              <div
                className={cn(
                  "w-full flex justify-center  bg-black transition-colors duration-200 absolute bottom-[1px] ",
                  currentTab === "trending" ? "h-[3px]" : " h-[1px]"
                )}
              />
            </TabsTrigger>
          </div>

          <div className="relative flex justify-end w-1/3 items-center">
            <Input
              type="email"
              placeholder="데이터를 검색해보세요"
              className="rounded-[12px] border-px border-gray-300 bg-[#f1f3f4]"
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
              className=" text-black absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-transparent"
              size={20}
              onClick={() => refetch()}
            />
          </div>
        </TabsList>
        <TabsContent value="popular" className="w-full max-w-[1200px] w-full ">
          <div className="w-full bg-white">
            <DocumentTable data={data} isLoading={isLoading} />
          </div>
        </TabsContent>
        <TabsContent value="trending" className="w-full max-w-[1200px] w-full">
          <div className="w-full bg-white">
            <DocumentTable data={data} isLoading={isLoading} />
          </div>
        </TabsContent>
        <DocumentPagination
          data={data}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      </Tabs>
    </div>
  );
}
