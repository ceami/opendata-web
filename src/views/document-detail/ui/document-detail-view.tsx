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

import React, { useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { IoCopyOutline } from "react-icons/io5";
import { BiCheckCircle, BiErrorCircle } from "react-icons/bi";
import { Button } from "@/shared/ui/button";
import {
  StatusBadge,
  getVariantStyles,
  fetchDocumentDetail,
  countToken,
  type RecommendationItem,
} from "@/entities/document";
import { preventRapidClicks } from "@/shared/lib/utils";
import { GiscusComments } from "./giscus-comments";

const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`.replace(/\.$/, "");
};

interface DocumentDetailViewProps {
  slug: string;
}

export function DocumentDetailView({ slug }: DocumentDetailViewProps) {
  const { data, isError, isPending } = useQuery({
    queryKey: ["detailData", slug],
    queryFn: () => fetchDocumentDetail(slug),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1,
    retryDelay: 1000,
    enabled: !!slug,
  });

  if (isPending) {
    return (
      <div className="w-full min-h-calc(100vh-100px) h-full max-w-[var(--content-max-width)] mx-auto space-y-8 pb-40">
        <div className="w-full h-full flex items-center justify-center"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full min-h-calc(100vh-100px)  flex items-center justify-center max-w-[var(--content-max-width)] mx-auto ">
        <div className="bg-muted/50 p-20 text-center w-full text-muted-foreground">
          데이터 조회 실패
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full max-w-[var(--content-max-width)] mx-auto space-y-6 md:space-y-8 pb-32 md:pb-40 px-0">
      <DetailHeaders
        description={data?.description}
        listTitle={data?.listTitle}
        detailUrl={data?.detailUrl}
        orgNm={data?.orgNm}
        deptNm={data?.deptNm}
        isCharged={data?.isCharged}
        permission={data?.permission}
        createdAt={data?.createdAt}
        updatedAt={data?.updatedAt}
        keywords={data?.keywords}
        generatedStatus={data?.generatedStatus}
        dataType={data?.dataType}
      />
      <DetailContent
        markdownText={data?.markdown}
        tokenCount={data?.tokenCount}
        generatedAt={data?.generatedAt}
        slug={slug}
      />
      {data?.recommendations?.length > 0 && (
        <RecommendDocument recommendations={data.recommendations} />
      )}
      <GiscusComments />
    </div>
  );
}

type TableItem = { label: string; value: string };

function DetailHeaders({
  description,
  listTitle,
  detailUrl,
  orgNm,
  deptNm,
  isCharged,
  permission,
  createdAt,
  updatedAt,
  keywords = [],
  generatedStatus,
  dataType,
}: {
  description: string;
  listTitle: string;
  detailUrl: string;
  orgNm: string;
  deptNm: string;
  isCharged: boolean;
  permission: string;
  createdAt: string;
  updatedAt: string;
  keywords?: string[];
  generatedStatus?: boolean;
  dataType: string;
}) {
  const createdAtDate = createdAt ? formatDate(createdAt) : "-";
  const updatedAtDate = updatedAt ? formatDate(updatedAt) : "-";

  const tableData: TableItem[] = [
    { label: "제공기관", value: orgNm || "-" },
    { label: "관리부서명", value: deptNm || "-" },
    {
      label: "비용부과유무",
      value:
        typeof isCharged === "boolean" ? (isCharged ? "유료" : "무료") : "-",
    },
    { label: "이용허락범위", value: permission || "-" },
  ];

  const handleShare = async () => {
    const currentUrl = window.location.href;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(currentUrl);
        toast.success("페이지 링크가 클립보드에 복사되었습니다!");
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = currentUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          const successful = document.execCommand("copy");
          if (successful) {
            toast.success("페이지 링크가 클립보드에 복사되었습니다!");
          } else {
            toast.error("링크 복사에 실패했습니다.");
          }
        } catch {
          toast.error("링크 복사에 실패했습니다.");
        }

        document.body.removeChild(textArea);
      }
    } catch {
      toast.error("링크 복사에 실패했습니다.");
    }
  };

  return (
    <div className="w-full h-auto space-y-4 bg-background px-4 md:px-5 py-4">
      <div>
        <StatusBadge variant={dataType}>
          {getVariantStyles(dataType).title}
        </StatusBadge>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 relative">
        <div className="flex flex-col justify-between min-w-0">
          <div className="flex items-start gap-2 break-words">
            <h1 className="text-lg md:text-xl font-bold text-foreground break-words">{listTitle}</h1>
            <IoCopyOutline
              size={20}
              className="inline-block ml-2 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
              onClick={handleShare}
            />
          </div>
          <div>
            <button
              onClick={() => window.open(detailUrl, "_blank")}
              className="text-primary text-sm md:text-base cursor-pointer hover:text-primary/90 underline-offset-2 hover:underline transition-colors break-all text-left"
            >
              {detailUrl}
            </button>
          </div>
        </div>
        {generatedStatus ? (
          <div className="place-items-start flex items-center gap-2 bg-muted h-8 px-2.5 py-1 shrink-0 self-start">
            <BiCheckCircle size={18} className="text-green-600 shrink-0" />
            <p className="text-sm font-medium text-foreground">생성완료</p>
          </div>
        ) : (
          <div className="place-items-start flex items-center gap-2 bg-muted h-8 px-2.5 py-1 shrink-0 self-start">
            <BiErrorCircle size={18} className="text-destructive shrink-0" />
            <p className="text-sm font-medium text-foreground">생성안됨</p>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center text-xs md:text-sm text-muted-foreground sm:justify-end py-2 gap-0.5">
        <p>등록일: {createdAtDate}</p>
        <p className="sm:ml-1">(마지막 업데이트: {updatedAtDate})</p>
      </div>

      <div className="text-base leading-relaxed whitespace-pre-line break-words">
        {description || "설명이 없습니다."}
      </div>

      <div>
        <InfoTable tableData={tableData} />
      </div>

      <div className="flex items-center text-sm">
        <div className="flex flex-wrap gap-2 ml-2">
          {keywords?.map((keyword: string, index: number) => (
            <span
              key={index}
              className="bg-muted text-foreground px-2.5 py-1 text-sm"
            >
              #{keyword}
            </span>
          )) || <span className="text-muted-foreground">키워드가 없습니다.</span>}
        </div>
      </div>
    </div>
  );
}

function InfoTable({ tableData }: { tableData: TableItem[] }) {
  return (
    <div className="my-2 w-full text-xs md:text-sm overflow-x-auto">
      <div className="min-w-[320px]">
        {tableData
          .reduce(
            (rows: Array<[TableItem, TableItem | null]>, item, index) => {
              if (index % 2 === 0) {
                rows.push([item, tableData[index + 1] || null]);
              }
              return rows;
            },
            [] as Array<[TableItem, TableItem | null]>
          )
          .map((pair, rowIndex) => (
            <div
              key={rowIndex}
              className="flex border-b border-border/40 text-sm"
            >
              <div className="w-1/5 min-w-[70px] bg-muted p-2 md:p-2.5 text-center font-medium text-foreground">
                {pair[0].label}
              </div>
              <div className="flex-1 min-w-0 p-2 md:p-2.5 text-muted-foreground break-words">{pair[0].value || "-"}</div>
              {pair[1] ? (
                <>
                  <div className="w-1/5 min-w-[70px] bg-muted p-2 md:p-2.5 text-center font-medium text-foreground">
                    {pair[1].label}
                  </div>
                  <div className="flex-1 min-w-0 p-2 md:p-2.5 text-muted-foreground break-words">{pair[1].value}</div>
                </>
              ) : (
                <div className="flex-1 min-w-0"></div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

function DetailContent({
  markdownText,
  tokenCount,
  generatedAt,
  slug,
}: {
  markdownText: string;
  tokenCount: number;
  generatedAt: string;
  slug: string;
}) {
  const { mutate } = useMutation({
    mutationKey: ["documentRequest"],
    mutationFn: async () => {
      const bodyData = {
        list_id: slug,
        url: "",
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/document/save-request`,
        {
          headers: { "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify(bodyData),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("문서 요청이 완료되었습니다.");
    },
    onError: () => {
      toast.error("문서 요청에 실패했습니다.");
    },
  });

  const handleClick = useMemo(
    () => preventRapidClicks(() => mutate(), 800),
    [mutate]
  );

  const handleCopy = async () => {
    if (!markdownText) {
      toast.error("복사할 내용이 없습니다.");
      return;
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(markdownText);
        toast.success("텍스트가 클립보드에 복사되었습니다!");
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = markdownText;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          const successful = document.execCommand("copy");
          if (successful) {
            toast.success("텍스트가 클립보드에 복사되었습니다!");
          } else {
            toast.error("복사에 실패했습니다.");
          }
        } catch {
          toast.error("복사에 실패했습니다.");
        }

        document.body.removeChild(textArea);
      }
    } catch {
      toast.error("복사에 실패했습니다.");
    }
  };

  const transformDate = (date: string) => {
    if (date == null) return "-";
    const dateObj = new Date(date);
    return formatDate(dateObj.toLocaleDateString("ko-KR"));
  };

  const markdownComponents: Components = {
    h1: ({ ...props }) => (
      <h1 className="text-xl font-bold mb-4 text-foreground" {...props} />
    ),
    h2: ({ ...props }) => (
      <h2 className="text-lg font-semibold mb-3 text-foreground" {...props} />
    ),
    h3: ({ ...props }) => (
      <h3 className="text-base font-semibold mb-2 text-foreground" {...props} />
    ),
    p: ({ ...props }) => (
      <p
        className="mb-3 text-muted-foreground whitespace-pre-line break-words leading-relaxed"
        {...props}
      />
    ),
    ul: ({ ...props }) => <ul className="list-disc pl-6 mb-3" {...props} />,
    ol: ({ ...props }) => (
      <ol className="list-decimal pl-6 mb-3" {...props} />
    ),
    li: ({ ...props }) => <li className="mb-1" {...props} />,
    blockquote: ({ ...props }) => (
      <blockquote
        className="border-l-2 border-muted-foreground/30 pl-4 italic text-muted-foreground mb-3"
        {...props}
      />
    ),
    code: ({
      inline,
      ...props
    }: { inline?: boolean } & React.HTMLAttributes<HTMLElement>) =>
      inline ? (
        <code
          className="bg-muted px-1.5 py-0.5 rounded text-sm break-all max-w-full inline-block align-middle text-foreground"
          {...props}
        />
      ) : (
        <code
          className="inline-block w-auto bg-muted p-2 rounded text-sm mb-3 whitespace-pre-wrap break-all max-w-full text-foreground"
          {...props}
        />
      ),
    pre: ({ ...props }) => (
      <pre
        className="inline-block w-auto bg-muted p-3 rounded text-sm mb-3 whitespace-pre-wrap break-all max-w-full w-full"
        {...props}
      />
    ),
    a: ({ ...props }) => (
      <a
        className="text-primary hover:text-primary/90 underline break-all transition-colors"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    ),
    table: ({ ...props }) => (
      <div className="w-full overflow-x-auto mb-3">
        <table
          className="border-collapse w-full min-w-[640px]"
          {...props}
        />
      </div>
    ),
    th: ({ ...props }) => (
      <th
        className="border-b border-border/40 px-4 py-2 bg-muted font-semibold align-top text-foreground"
        {...props}
      />
    ),
    td: ({ ...props }) => (
      <td className="border-b border-border/40 px-4 py-2 align-top text-muted-foreground" {...props} />
    ),
    hr: ({ ...props }) => (
      <hr className="my-6 border-border/30" {...props} />
    ),
  };

  return (
    <div className="bg-background px-4 md:px-5 py-4 h-full">
      <p className="text-base md:text-lg font-semibold text-foreground mb-4 py-3">
        표준 문서
      </p>
      <div className="min-h-[400px] md:h-[650px]">
        <div className="w-full flex flex-col sm:flex-row sm:space-x-2 gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <p className="inline-block px-2 md:px-3 py-1.5 bg-muted text-xs md:text-sm text-muted-foreground">
                토큰: {countToken(tokenCount ?? 0)}
              </p>

              <p className="inline-block px-2 md:px-3 py-1.5 bg-muted text-xs md:text-sm text-muted-foreground">
                생성일: {transformDate(generatedAt)}
              </p>
            </div>
            <div className="flex items-center shrink-0">
              <Button
                variant="secondary"
                className="group inline-block px-3 py-1.5 cursor-pointer hover:bg-muted/80 transition-colors bg-muted text-sm"
                onClick={handleCopy}
                disabled={!markdownText}
              >
                <IoCopyOutline
                  size={18}
                  className="inline-block mr-1.5 text-muted-foreground group-hover:text-foreground transition-colors"
                />
                내용 복사
              </Button>
            </div>
          </div>
        </div>

        <div className="custom-scrollbar p-4 w-full max-h-[400px] md:max-h-[560px] h-full overflow-y-auto bg-muted/30">
          {markdownText ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {markdownText}
            </ReactMarkdown>
          ) : markdownText === null ? (
            <div className="w-full h-full items-center text-center flex flex-col justify-center">
              <Button
                className="bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90 cursor-pointer"
                onClick={() => handleClick()}
              >
                문서 요청하기
              </Button>
            </div>
          ) : (
            <div className="text-muted-foreground text-center py-8 text-sm">
              문서 내용을 불러오는 중입니다...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RecommendDocument({
  recommendations,
}: {
  recommendations: RecommendationItem[];
}) {
  return (
    <div className="bg-background px-4 md:px-5 py-4 h-full">
      <p className="text-base md:text-lg font-semibold text-foreground mb-4 py-3">
        추천 문서
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        {recommendations?.map((item, index) => (
          <div
            key={index}
            className="flex p-2 flex-col gap-y-1 hover:bg-muted/50 transition-colors duration-200 group cursor-pointer bg-muted/30"
            onClick={() => {
              window.open(`/${item.listId}`, "_blank");
            }}
          >
            <div className="flex justify-start">
              <StatusBadge variant={item.dataType}>
                {getVariantStyles(item.dataType).title}
              </StatusBadge>
            </div>
            <div className="p-2">
              <p className="text-base group-hover:text-primary font-medium text-foreground transition-colors">
                {item.listTitle}
              </p>
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">{item.orgNm}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-x-1">
                  <span>유사도:</span>
                  <span className="font-semibold">
                    {(item.similarityScore * 100).toFixed(0)}%
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
