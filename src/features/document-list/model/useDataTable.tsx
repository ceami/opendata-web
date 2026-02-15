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

import React, {
  createContext,
  use,
  useState,
  useEffect,
} from "react";

interface DataTableContextType {
  currentPage: number;
  currentTab: string;
  query: string;
  setCurrentPage: (page: number) => void;
  setCurrentTab: (tab: string) => void;
  setQuery: (query: string) => void;
  restoreState: (page: number, tab: string, searchQuery: string) => void;
}

const DataTableContext = createContext<DataTableContextType | undefined>(
  undefined
);

export const DataTableProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTab, setCurrentTab] = useState("popular");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const savedState = localStorage.getItem("dataTableState");
    if (savedState) {
      try {
        const { page, tab, searchQuery } = JSON.parse(savedState);
        setCurrentPage(page || 1);
        setCurrentTab(tab || "popular");
        setQuery(searchQuery || "");
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "dataTableState",
      JSON.stringify({
        page: currentPage,
        tab: currentTab,
        searchQuery: query,
      })
    );
  }, [currentPage, currentTab, query]);

  const restoreState = (page: number, tab: string, searchQuery: string) => {
    setCurrentPage(page);
    setCurrentTab(tab);
    setQuery(searchQuery);
  };

  return (
    <DataTableContext.Provider
      value={{
        currentPage,
        currentTab,
        query,
        setCurrentPage,
        setCurrentTab,
        setQuery,
        restoreState,
      }}
    >
      {children}
    </DataTableContext.Provider>
  );
};

export const useDataTable = () => {
  const context = use(DataTableContext);
  if (!context) {
    throw new Error("useDataTable must be used within DataTableProvider");
  }
  return context;
};
