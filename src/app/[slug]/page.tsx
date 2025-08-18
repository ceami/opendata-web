"use client";
import { StatusBadge } from "@/components/statusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import { IoCopyOutline } from "react-icons/io5";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

const DetailPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = React.use(params);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["detailData", slug],
    queryFn: async () => {
      // Simulate fetching data based on the slug
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/document/std-docs/${slug}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5분 동안은 데이터를 fresh로 간주
    gcTime: 1000 * 60 * 30, // 30분 동안 캐시 유지 (이전 cacheTime)

    // 재요청 방지 옵션들
    refetchOnWindowFocus: false, // 윈도우 포커스 시 재요청 방지
    refetchOnMount: false, // 컴포넌트 마운트 시 재요청 방지 (캐시가 있으면)
    refetchOnReconnect: false, // 네트워크 재연결 시 재요청 방지

    // 재시도 옵션
    retry: 1, // 실패 시 1번만 재시도
    retryDelay: 1000, // 재시도 간격 1초

    // 데이터가 있을 때만 활성화 (선택사항)
    enabled: !!slug, // slug가 있을 때만 쿼리 실행
  });

  // console.log(data);

  return (
    <div className="w-full h-full max-w-[1200px] mx-auto space-y-8 ">
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
      />
      <DetailContent
        markdownText={data?.markdown}
        tokenCount={data?.tokenCount}
        createdAtDate={data?.createdAt}
      />
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
}) => {
  const createdAtDate = createdAt
    ? new Date(createdAt).toLocaleDateString("ko-KR")
    : "-";
  const updatedAtDate = updatedAt
    ? new Date(updatedAt).toLocaleDateString("ko-KR")
    : "-";

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
    // console.log("공유 버튼 클릭됨");

    // 현재 페이지 URL 가져오기
    const currentUrl = window.location.href;
    // console.log("현재 페이지 URL:", currentUrl);

    try {
      // 최신 브라우저용 Clipboard API 사용
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(currentUrl);
        toast.success("페이지 링크가 클립보드에 복사되었습니다!");
        // console.log("페이지 링크 복사 성공");
      } else {
        // 구형 브라우저용 fallback
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
            // console.log("페이지 링크 복사 성공");
          } else {
            toast.error("링크 복사에 실패했습니다.");
            // console.log("링크 복사 실패");
          }
        } catch (err) {
          // console.error("링크 복사 에러:", err);
          toast.error("링크 복사에 실패했습니다.");
        }

        document.body.removeChild(textArea);
      }
    } catch (err) {
      // console.error("링크 복사 중 에러 발생:", err);
      toast.error("링크 복사에 실패했습니다.");
    }
  };

  return (
    <div className="w-full h-auto  space-y-4  ">
      <div>
        <StatusBadge variant="API">오픈 API</StatusBadge>
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
            <a
              href={detailUrl}
              className="text-blue-600 text-[16px]  hover:text-blue-800 "
            >
              {detailUrl}
            </a>
          </div>
        </div>
        <div className="place-items-start flex items-center gap-2  bg-[#f1f3f4] h-[30px] border  border-gray-500 border-px rounded-[5px] px-2 py-1">
          <IoCheckmarkCircleOutline size={20} className="text-[#179301]" />
          <p className="text-black">생성완료</p>
        </div>
      </div>

      <div className="flex items-center text-[16px] justify-end">
        등록일: {createdAtDate}
        (마지막업데이트: {updatedAtDate && `${updatedAtDate}`})
      </div>

      <div>
        <Table tableData={tableData} />
      </div>

      <div>
        <p className="text-[20px] font-medium">설명</p>
        <div className="ml-2 text-[18px]">
          {description || "설명이 없습니다."}
        </div>
      </div>
      <div className="flex items-center text-[16px]">
        <p className="min-w-[60px]">키워드 :</p>
        <div className="flex flex-wrap  gap-2 ml-2">
          {keywords?.map((keyword: string, index: number) => (
            <span
              key={index}
              className="bg-[#f1f3f4] text-black border  border-[#a6a9ac] border-px px-2 py-1 rounded text-[16px]"
            >
              {keyword}
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
            <div className="w-1/4 bg-[#f1f3f4] p-2 text-center text-[black]">
              {pair[0].label}
            </div>
            <div className="w-1/4 p-2 ">{pair[0].value || "-"}</div>
            {pair[1] ? (
              <>
                <div className="w-1/4 bg-[#f1f3f4] p-2 text-center text-[black]">
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
  createdAtDate,
}: {
  markdownText: string;
  tokenCount: number;
  createdAtDate: string;
}) => {
  const buttonCss = `border border-px inline-block px-4 py-1 border-gray-300 cursor-pointer rounded-[5px] bg-gray-100 mb-4 hover:bg-gray-200 transition-colors text-black`;

  const handleCopy = async () => {
    // console.log("복사 버튼 클릭됨");
    // console.log("markdownText:", markdownText);

    if (!markdownText) {
      toast.error("복사할 내용이 없습니다.");
      return;
    }

    try {
      // 최신 브라우저용 Clipboard API 사용
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(markdownText);
        toast.success("텍스트가 클립보드에 복사되었습니다!");
        // console.log("Clipboard API로 복사 성공");
      } else {
        // 구형 브라우저용 fallback
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
            // console.log("execCommand로 복사 성공");
          } else {
            toast.error("복사에 실패했습니다.");
            // console.log("execCommand 복사 실패");
          }
        } catch (err) {
          // console.error("execCommand 에러:", err);
          toast.error("복사에 실패했습니다.");
        }

        document.body.removeChild(textArea);
      }
    } catch (err) {
      // console.error("복사 중 에러 발생:", err);
      toast.error("복사에 실패했습니다.");
    }
  };

  const transformDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("ko-KR");
  };

  return (
    <div className="">
      <p className="text-[16px] font-medium text-mb-4 text-grey-900">
        표준 문서
      </p>
      <div className=" h-[650px] px-[25px] py-[16px] ">
        <div className="w-full flex space-x-2 ">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2 ">
              <p className="border border-px inline-block px-4 py-1 border-gray-300 rounded-[5px] bg-gray-100 mb-4">
                토큰: {tokenCount || 803}
              </p>

              <p className="border border-px inline-block px-4 py-1 border-gray-300 rounded-[5px] bg-gray-100 mb-4">
                생성일: {transformDate(createdAtDate)}
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

        <div className="custom-scrollbar w-full h-[calc(100%-60px)]  rounded-[5px] bg-[#f1f3f4]  overflow-y-auto">
          {markdownText ? (
            <ReactMarkdown components={config}>{markdownText}</ReactMarkdown>
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
  p: ({ node, ...props }) => <p className="mb-3 text-gray-700" {...props} />,
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
      <code className="bg-gray-200 px-1 py-0.5 rounded text-sm" {...props} />
    ) : (
      <code
        className="block bg-gray-200 p-3 rounded text-sm overflow-x-auto mb-3"
        {...props}
      />
    ),
  pre: ({ node, ...props }) => (
    <pre
      className="bg-gray-200 p-3 rounded text-sm overflow-x-auto mb-3"
      {...props}
    />
  ),
  a: ({ node, ...props }) => (
    <a className="text-blue-600 hover:text-blue-800 underline" {...props} />
  ),
  table: ({ node, ...props }) => (
    <table
      className="border-collapse border border-gray-300 w-full mb-3"
      {...props}
    />
  ),
  th: ({ node, ...props }) => (
    <th
      className="border border-gray-300 px-4 py-2 bg-gray-100 font-bold"
      {...props}
    />
  ),
  td: ({ node, ...props }) => (
    <td className="border border-gray-300 px-4 py-2" {...props} />
  ),
  hr: ({ node, ...props }) => (
    <hr className="my-6 border-gray-300" {...props} />
  ),
};

const RequestDocks = () => {
  return (
    <div>
      <form action="submit">
        <p className="text-gray-700 mb-4">
          Up-to-date documentation for LLMs and AI code editors Copy the latest
          docs and code for any library
          <br /> — paste into Cursor, Claude, or other LLMs.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <Input
            placeholder="Enter your request here..."
            className="flex-1 h-10"
          />
          <Button className="h-10 px-6 sm:w-auto w-full">Submit</Button>
        </div>
      </form>
    </div>
  );
};

// export const RequestGuide = () => {
//   return (
//     <div className="bg-gray-50 p-6 rounded-lg border">
//       <h2 className="text-xl font-bold mb-4 text-gray-800">Guidelines</h2>

//       <div className="space-y-4">
//         <div className="flex items-start space-x-3">
//           <div className="w-2 h-2 rounded-full bg-green-500 mt-3 flex-shrink-0"></div>
//           <div>
//             <h3 className="text-lg font-semibold mb-2 text-gray-700">
//               Repository Requirements
//             </h3>
//             <p className="text-gray-600">
//               Use public/open source GitHub repositories with URLs in the format{" "}
//               <code className="bg-gray-200 px-2 py-1 rounded text-sm">
//                 https://github.com/username/repo
//               </code>
//             </p>
//           </div>
//         </div>

//         <div className="flex items-start space-x-3">
//           <div className="w-2 h-2 rounded-full bg-green-500 mt-3 flex-shrink-0"></div>
//           <div>
//             <h3 className="text-lg font-semibold mb-2 text-gray-700">
//               Supported Files
//             </h3>
//             <p className="text-gray-600 mb-2">
//               Context7 extracts code snippets only from documentation files with
//               these extensions:
//             </p>
//             <div className="flex flex-wrap gap-2">
//               {[".md", ".mdx", ".html", ".rst", ".ipynb"].map((ext) => (
//                 <span
//                   key={ext}
//                   className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono"
//                 >
//                   {ext}
//                 </span>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="flex items-start space-x-3">
//           <div className="w-2 h-2 rounded-full bg-green-500 mt-3 flex-shrink-0"></div>
//           <div>
//             <h3 className="text-lg font-semibold mb-2 text-gray-700">
//               Indexing Focus
//             </h3>
//             <p className="text-gray-600">
//               The system specifically targets and processes code snippets within
//               documentation while ignoring the pages that lack code snippets.
//               The system specifically targets and processes code snippets within
//               documentation while ignoring the pages that lack code snippets.
//               The system specifically targets and processes code snippets within
//               documentation while ignoring the pages that lack code snippets.
//               The system specifically targets and processes code snippets within
//               documentation while ignoring the pages that lack code snippets.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
