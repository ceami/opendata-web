"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

interface DataTableContextType {
  currentPage: number;
  currentTab: string;
  query: string;
  setCurrentPage: (page: number) => void;
  setCurrentTab: (tab: string) => void;
  setQuery: (query: string) => void;
  // 상태 복원을 위한 함수
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

  // localStorage에서 상태 복원
  useEffect(() => {
    const savedState = localStorage.getItem("dataTableState");
    if (savedState) {
      try {
        const { page, tab, searchQuery } = JSON.parse(savedState);
        setCurrentPage(page || 1);
        setCurrentTab(tab || "popular");
        setQuery(searchQuery || "");
      } catch (error) {
        // console.error("Failed to restore state:", error);
      }
    }
  }, []);

  // 상태 변경 시 localStorage에 저장
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

  // 상태 복원 함수
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
  const context = useContext(DataTableContext);
  if (!context) {
    throw new Error("useDataTable must be used within DataTableProvider");
  }
  return context;
};
