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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationLinkCurrent,
} from "@/shared/ui/pagination";
import type { PageData } from "@/entities/document";

interface DocumentPaginationProps {
  data: PageData | undefined;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function DocumentPagination({
  data,
  currentPage,
  onPageChange,
}: DocumentPaginationProps) {
  const totalPages = data?.totalPages || 1;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages: React.ReactNode[] = [];
    const blockSize = 10;

    const currentBlockStart =
      Math.floor((currentPage - 1) / blockSize) * blockSize + 1;
    const currentBlockEnd = Math.min(
      totalPages,
      currentBlockStart + blockSize - 1
    );

    for (let i = currentBlockStart; i <= currentBlockEnd; i++) {
      const isCurrentPage = i === currentPage;
      const LinkComponent = isCurrentPage
        ? PaginationLinkCurrent
        : PaginationLink;
      pages.push(
        <PaginationItem key={i}>
          <LinkComponent
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(i);
            }}
          >
            {i}
          </LinkComponent>
        </PaginationItem>
      );
    }

    return pages;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                const target = Math.max(1, currentPage - 10);
                handlePageChange(target);
              }}
              className={
                currentPage <= 10 ? "pointer-events-none opacity-50" : ""
              }
            >
              « 10
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href="#"
              aria-label="이전 페이지"
              title="이전 페이지"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage - 1);
              }}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            >
              ‹ 이전
            </PaginationLink>
          </PaginationItem>

          {renderPageNumbers()}

          <PaginationItem>
            <PaginationLink
              href="#"
              aria-label="다음 페이지"
              title="다음 페이지"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage + 1);
              }}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            >
              다음 ›
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                const target = Math.min(totalPages, currentPage + 10);
                handlePageChange(target);
              }}
              className={
                currentPage + 10 > totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            >
              10 »
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
