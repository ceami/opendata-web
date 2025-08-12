"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";

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

  return (
    <div className="w-full h-full bg-gray-100 max-w-[1200px] mx-auto space-y-8 ">
      <DetailHeaders
        description={data?.description}
        title={data?.title}
        detailUrl={data?.detail_url}
      />
      <DetailContent
        markdownText={data?.markdown}
        tokenCount={data?.token_count}
      />
    </div>
  );
};

export default DetailPage;

export const DetailHeaders = ({
  description,
  title,
  detailUrl,
}: {
  description: string;
  title: string;
  detailUrl: string;
}) => {
  return (
    <div className=" w-full h-auto px-8 py-6 rounded-md border border-blue-500 border-px">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-gray-700">{description}</p>
      <a
        href={detailUrl}
        className="text-blue-600 hover:text-blue-800 underline"
      >
        자세히 보기
      </a>
    </div>
  );
};

export const DetailContent = ({
  markdownText,
  tokenCount,
}: {
  markdownText: string;
  tokenCount: number;
}) => {
  const buttonCss = `border border-px inline-block px-4 py-1 border-gray-300 cursor-pointer rounded-[10px] bg-gray-100 mb-4 hover:bg-gray-200 transition-colors text-black`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdownText);

      toast.success(" 텍스트가 클립보드에 복사되었습니다!"); // 또는 토스트 메시지 사용
    } catch (err) {
      // console.error("복사 실패:", err);
      // 대체 방법
      const textArea = document.createElement("textarea");
      textArea.value = markdownText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      toast.success("텍스트가 클립보드에 복사되었습니다!");
    }
  };

  return (
    <div className="">
      <p className="text-[16px] font-medium text-gray-500 mb-4">통합 문서</p>
      <div className=" h-[650px] px-8 py-6 rounded-md border border-blue-500 border-px">
        <div className="w-full flex justify-between ">
          <p className="border border-px inline-block px-4 py-1 border-gray-300 rounded-[10px] bg-gray-100 mb-4">
            Token: 803
          </p>
          <div className="w-1/2 flex justify-end space-x-4">
            <Button className={buttonCss}>RAW</Button>
            <Button className={buttonCss} onClick={handleCopy}>
              COPY
            </Button>
          </div>
        </div>
        <div className="custom-scrollbar border border-px w-full h-[calc(100%-60px)] border-gray-300 rounded-[10px] bg-gray-100 p-4 overflow-y-auto">
          <ReactMarkdown components={config}>{markdownText}</ReactMarkdown>
        </div>
      </div>
      <div className="mt-20 space-y-10">
        <RequestDocks />
        <RequestGuide />
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
  code: ({ node, inline, ...props }) =>
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

export const RequestDocks = () => {
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

export const RequestGuide = () => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg border">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Guidelines</h2>

      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="w-2 h-2 rounded-full bg-green-500 mt-3 flex-shrink-0"></div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              Repository Requirements
            </h3>
            <p className="text-gray-600">
              Use public/open source GitHub repositories with URLs in the format{" "}
              <code className="bg-gray-200 px-2 py-1 rounded text-sm">
                https://github.com/username/repo
              </code>
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-2 h-2 rounded-full bg-green-500 mt-3 flex-shrink-0"></div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              Supported Files
            </h3>
            <p className="text-gray-600 mb-2">
              Context7 extracts code snippets only from documentation files with
              these extensions:
            </p>
            <div className="flex flex-wrap gap-2">
              {[".md", ".mdx", ".html", ".rst", ".ipynb"].map((ext) => (
                <span
                  key={ext}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono"
                >
                  {ext}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-2 h-2 rounded-full bg-green-500 mt-3 flex-shrink-0"></div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              Indexing Focus
            </h3>
            <p className="text-gray-600">
              The system specifically targets and processes code snippets within
              documentation while ignoring the pages that lack code snippets.
              The system specifically targets and processes code snippets within
              documentation while ignoring the pages that lack code snippets.
              The system specifically targets and processes code snippets within
              documentation while ignoring the pages that lack code snippets.
              The system specifically targets and processes code snippets within
              documentation while ignoring the pages that lack code snippets.
              The system specifically targets and processes code snippets within
              documentation while ignoring the pages that lack code snippets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
