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
import { getVariantStyles, StatusBadge } from "@/components/statusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useMemo } from "react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { IoCopyOutline } from "react-icons/io5";
import { BiCheckCircle, BiErrorCircle } from "react-icons/bi";
import { preventRapidClicks } from "@/lib/utils";
import { MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import GiscusComments from "./giscusComments";

const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`.replace(/\.$/, "");
};

const DetailPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = React.use(params);

  const { data, isError, isPending } = useQuery({
    queryKey: ["detailData", slug],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/document/std-docs/${slug}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
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
      <div className="w-full min-h-calc(100vh-100px) h-full max-w-[1200px] mx-auto space-y-8 pb-40">
        <div className="w-full h-full flex items-center justify-center">
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full min-h-calc(100vh-100px)  flex items-center justify-center max-w-[1200px] mx-auto ">
        <div className="rounded-md bg-transparent  p-20  text-center w-full border border-gray-300  ">
          데이터 조회 실패
        </div>
      </div>
    );
  }

  const comments = "댓글 영역";

  return (
    <div className="w-full h-full max-w-[1200px] mx-auto space-y-8 pb-40">
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
      {data?.recommendations.length > 0 && (
        <RecommandDocument recommendations={data?.recommendations} />
      )}
      <GiscusComments />
    </div>
  );
};

export default DetailPage;

const DetailHeaders = ({
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
}) => {
  const createdAtDate = createdAt ? formatDate(createdAt) : "-";
  const updatedAtDate = updatedAt ? formatDate(updatedAt) : "-";

  const tableData = [
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
        } catch (err) {
          toast.error("링크 복사에 실패했습니다.");
        }

        document.body.removeChild(textArea);
      }
    } catch (err) {
      toast.error("링크 복사에 실패했습니다.");
    }
  };

  const GeneratedStatus = ({
    generatedStatus,
  }: {
    generatedStatus?: boolean;
  }) => {
    return generatedStatus ? (
      <div className="place-items-start flex items-center gap-2  bg-[#f1f3f4] h-[30px] border  border-gray-500 border-px rounded-[5px] px-2 py-1">
        <BiCheckCircle size={20} className="text-green-500" />
        <p className="text-black">생성완료</p>
      </div>
    ) : (
      <div className="place-items-start flex items-center gap-2  bg-[#f1f3f4] h-[30px] border  border-gray-500 border-px rounded-[5px] px-2 py-1">
        <BiErrorCircle size={20} className="text-red-500" />
        <p className="text-black">생성안됨</p>
      </div>
    );
  };

  return (
    <div className="w-full h-auto  space-y-4   border border-gray-300 rounded-[5px] bg-white  px-5 py-4">
      <div>
        <StatusBadge variant={dataType}>
          {getVariantStyles(dataType).title}
        </StatusBadge>
      </div>
      <div className="flex justify-between relative">
        <div className="flex flex-col justify-between">
          <div className="flex items-center ">
            <h1 className="text-[24px] font-bold">{listTitle}</h1>
            <IoCopyOutline
              size={20}
              className="inline-block ml-2  text-gray-500 cursor-pointer hover:text-gray-700"
              onClick={handleShare}
            />
          </div>
          <div>
            <button
              onClick={() => window.open(detailUrl, "_blank")}
              className="text-blue-600 text-[16px] cursor-pointer  hover:text-blue-800 "
            >
              {detailUrl}
            </button>
          </div>
        </div>
        <GeneratedStatus generatedStatus={generatedStatus} />
      </div>

      <div className="flex items-center text-[16px] justify-end py-2">
        <p>등록일: {createdAtDate}</p>
        <p className="ml-1">
          (마지막 업데이트: {updatedAtDate && `${updatedAtDate}`})
        </p>
      </div>

      <div className="text-[18px] whitespace-pre-line break-words">
        {description || "설명이 없습니다."}
      </div>

      <div>
        <Table tableData={tableData} />
      </div>

      <div className="flex items-center text-[16px]">
        <div className="flex flex-wrap  gap-2 ml-2">
          {keywords?.map((keyword: string, index: number) => (
            <span
              key={index}
              className="bg-[#f1f3f4] text-black border  border-[#a6a9ac] border-px px-2 py-1 rounded text-[16px]"
            >
              #{keyword}
            </span>
          )) || <span>키워드가 없습니다.</span>}
        </div>
      </div>
    </div>
  );
};

type TableItem = { label: string; value: string };
const Table = ({ tableData }: { tableData: TableItem[] }) => {
  return (
    <div className="my-2 w-full text-sm">
      {tableData
        .reduce(
          (
            rows: Array<[TableItem, TableItem | null]>,
            item: TableItem,
            index: number
          ) => {
            if (index % 2 === 0) {
              rows.push([item, tableData[index + 1] || null]);
            }
            return rows;
          },
          [] as Array<[TableItem, TableItem | null]>
        )
        .map((pair: [TableItem, TableItem | null], rowIndex: number) => (
          <div
            key={rowIndex}
            className="flex border border-b border-white text-[16px]"
          >
            <div className="w-1/5 bg-[#f1f3f4] p-2 text-center text-[black]">
              {pair[0].label}
            </div>
            <div className="w-1/4 p-2 ">{pair[0].value || "-"}</div>
            {pair[1] ? (
              <>
                <div className="w-1/5 bg-[#f1f3f4] p-2 text-center text-[black]">
                  {pair[1].label}
                </div>
                <div className="w-1/4 p-2">{pair[1].value}</div>
              </>
            ) : (
              <div className="w-1/2 p-2 text-center">{pair[0].value}</div>
            )}
          </div>
        ))}
    </div>
  );
};

const DetailContent = ({
  markdownText,
  tokenCount,
  generatedAt,
  slug,
}: {
  markdownText: string;
  tokenCount: number;
  generatedAt: string;
  slug: string;
}) => {
  const { data, isPending, isError, mutate } = useMutation({
    mutationKey: ["documentRequest"],
    mutationFn: async () => {
      const bodyData = {
        list_id: slug,
        url: "",
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/document/save-request`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(bodyData),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    },
    onSuccess: () => {
      toast.success("문서 요청이 완료되었습니다.");
    },
    onError: (error) => {
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
        } catch (err) {
          toast.error("복사에 실패했습니다.");
        }

        document.body.removeChild(textArea);
      }
    } catch (err) {
      toast.error("복사에 실패했습니다.");
    }
  };

  const transformDate = (date: string) => {
    if (date == null) return "-";
    const dateObj = new Date(date);
    const transDate = formatDate(dateObj.toLocaleDateString("ko-KR"));

    return transDate;
  };

  const countToken = (tokenCount: number) => {
    if (tokenCount < 1000) {
      return tokenCount.toLocaleString();
    } else if (tokenCount < 1000000) {
      return (tokenCount / 1000).toFixed(1) + "K";
    } else {
      return (tokenCount / 1000000).toFixed(1) + "M";
    }
  };
  return (
    <div className="border border-gray-300 rounded-[5px] bg-white  px-5 py-4  h-full">
      <p className="text-[20px] font-medium text-mb-4 text-grey-900 py-[11px] ">
        표준 문서
      </p>
      <div className=" h-[650px]  ">
        <div className="w-full flex space-x-2 ">
          <div className="flex items-center justify-between w-full ">
            <div className="flex items-center space-x-2 ">
              <p className="border border-px inline-block px-4 py-1 border-gray-300 rounded-[5px] bg-gray-100 mb-4">
                토큰: {countToken(tokenCount) ?? 0}
              </p>

              <p className="border border-px inline-block px-4 py-1 border-gray-300 rounded-[5px] bg-gray-100 mb-4">
                생성일: {transformDate(generatedAt)}
              </p>
            </div>
            <div className="flex items-center   ">
              <Button
                className={`group border border-px inline-block px-4 py-1 border-gray-300 cursor-pointer rounded-[5px] bg-gray-100 mb-4 hover:bg-gray-200 transition-colors text-black`}
                onClick={handleCopy}
                disabled={!markdownText}
              >
                <IoCopyOutline
                  size={20}
                  className="inline-block  mr-1 text-gray-500 cursor-pointer hover:text-gray-700 group-hover:text-gray-700"
                />
                내용 복사
              </Button>
            </div>
          </div>
        </div>

        <div className="custom-scrollbar p-4 w-full max-h-[560px] h-full rounded-[5px] border border-gray-300 rounded-[5px] overflow-y-auto">
          {markdownText ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={config}>
              {markdownText}
            </ReactMarkdown>
          ) : markdownText === null ? (
            <div className="w-full h-full items-center text-center flex flex-col justify-center">
              <Button
                className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 cursor-pointer"
                onClick={() => handleClick()}
              >
                문서 요청하기
              </Button>
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8">
              문서 내용을 불러오는 중입니다...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const config: Components = {
  h1: ({ node, ...props }) => (
    <h1 className="text-2xl font-bold mb-4" {...props} />
  ),
  h2: ({ node, ...props }) => (
    <h2 className="text-xl font-bold mb-3" {...props} />
  ),
  h3: ({ node, ...props }) => (
    <h3 className="text-lg font-bold mb-2" {...props} />
  ),
  p: ({ node, ...props }) => (
    <p
      className="mb-3 text-gray-700 whitespace-pre-line break-words"
      {...props}
    />
  ),
  ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-3" {...props} />,
  ol: ({ node, ...props }) => (
    <ol className="list-decimal pl-6 mb-3" {...props} />
  ),
  li: ({ node, ...props }) => <li className="mb-1" {...props} />,
  blockquote: ({ node, ...props }) => (
    <blockquote
      className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-3"
      {...props}
    />
  ),
  code: ({
    inline,
    ...props
  }: { inline?: boolean } & React.HTMLAttributes<HTMLElement>) =>
    inline ? (
      <code
        className="bg-gray-200  px-1 py-0.5 rounded  text-sm break-all max-w-full inline-block align-middle"
        {...props}
      />
    ) : (
      <code
        className="inline-block w-auto bg-gray-200 p-2 rounded text-sm mb-3 whitespace-pre-wrap break-all max-w-full "
        {...props}
      />
    ),
  pre: ({ node, ...props }) => (
    <pre
      className="inline-block w-auto bg-gray-200 p-3 rounded text-sm mb-3 whitespace-pre-wrap break-all max-w-full w-full"
      {...props}
    />
  ),
  a: ({ node, ...props }) => (
    <a
      className="text-blue-600 hover:text-blue-800 underline break-all"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  table: ({ node, ...props }) => (
    <div className="w-full overflow-x-auto mb-3">
      <table
        className="border-collapse border border-gray-300 w-full min-w-[640px]"
        {...props}
      />
    </div>
  ),
  th: ({ node, ...props }) => (
    <th
      className="border border-gray-300 px-4 py-2 bg-gray-100 font-bold align-top"
      {...props}
    />
  ),
  td: ({ node, ...props }) => (
    <td className="border border-gray-300 px-4 py-2 align-top" {...props} />
  ),
  hr: ({ node, ...props }) => (
    <hr className="my-6 border-gray-300" {...props} />
  ),
};

export type RecommendationItem = {
  dataType: string;
  listId: number;
  listTitle: string;
  orgNm: string;
  similarityScore: number;
};

const RecommandDocument = ({
  recommendations,
}: {
  recommendations: RecommendationItem[];
}) => {
  const recommendationsMap = recommendations;

  return (
    <div className="border border-gray-300 rounded-[5px] bg-white  px-5 py-4  h-full">
      <p className="text-[20px] font-medium text-mb-4 text-grey-900 py-[11px] ">
        추천 문서
      </p>
      <div className="grid grid-cols-2 grid-rows-2 gap-4">
        {recommendationsMap?.map((item: RecommendationItem, index: number) => {
          return (
            <div
              key={index}
              className="flex p-2 flex-col gap-y-1 hover:bg-gray-50 transition-colors transition-all duration-300 group cursor-pointer border border-gray-300 rounded-[5px] bg-white  "
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
                <p className="text-[16px] group-hover:text-blue-500 font-medium text-grey-900">
                  {item.listTitle}
                </p>
                <div className="flex justify-between">
                  <p className="text-[14px] text-grey-500">{item.orgNm}</p>
                  <p className="text-[14px] text-grey-500 flex items-center gap-x-1">
                    <span className="text-grey-500">유사도:</span>
                    <span className="font-semibold">
                      {(item.similarityScore * 100).toFixed(0)}%
                    </span>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
