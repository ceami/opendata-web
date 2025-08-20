"use client";
import React, { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { preventRapidClicks } from "@/lib/utils";

const Request = () => {
  return (
    <div className="w-full h-full  max-w-[1200px] mx-auto space-y-10">
      <RequestDocks />
      <RequestGuide />
    </div>
  );
};

export default Request;

export const RequestDocks = () => {
  const [inputValue, setInputValue] = useState("");
  const { data, isPending, isError, mutate } = useMutation({
    mutationKey: ["documentRequest"],
    mutationFn: async () => {
      if (!inputValue) {
        toast.error("URL을 입력해주세요.");
        return;
      }

      const bodyData = {
        list_id: null,
        url: inputValue,
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
    onSuccess: (data) => {
      if (data.message === "저장되었습니다.") {
        setInputValue("");
        toast.success("문서 요청이 완료되었습니다.");
      } else {
        setInputValue("");
        toast.error("문서 요청에 실패했습니다.");
      }
    },
    onError: (error) => {
      // console.log(error);
      // toast.error("문서 요청에 실패했습니다.");
    },
  });

  // 이벤트 기본동작 차단은 즉시 하고, 호출만 쿨다운 처리
  const submitOnce = useMemo(
    () => preventRapidClicks(() => mutate(), 800),
    [mutate]
  );

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!inputValue.trim()) {
            toast.error("URL을 입력해주세요.");
            return;
          }
          submitOnce();
        }}
      >
        <p className="text-blue-500 text-[24px] font-bold mb-4">
          새로운 데이터가 있다면 요청하세요
        </p>
        <div className="flex flex-col flex-row max-w-[600px] mx-auto gap-2 w-full">
          <Input
            placeholder="공공데이터포털 신규 페이지 URL을 입력하세요"
            className="flex-1 px-[20px] py-[8px] border border-black border-1 rounded-[5px] bg-[#f1f3f4]"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button
            type="submit"
            className="sm:w-auto w-full bg-[#f1f3f4] text-black text-[16px] hover:bg-blue-500 hover:text-white border-black border-1 rounded-[5px]   "
          >
            제출
          </Button>
        </div>
      </form>
    </div>
  );
};

export const RequestGuide = () => {
  return (
    <div className="">
      <h2 className="text-[20px] font-medium mb-4 text-gray-800">
        OpenData MCP 데이터 요청 가이드라인
      </h2>

      <div className="space-y-8 text-gray-800">
        {/* 1. 데이터 요청 유형 */}
        <section className="">
          <h3 className="text-lg  ">1. 데이터 요청 유형</h3>
          <ol className=" ml-1 space-y-3">
            <li>
              <p className="">(1) 기존 데이터 요청</p>
              <ul className="list-disc ml-7 text-gray-700">
                <li>
                  공공데이터포털에 등록된 데이터셋 중 검색을 통해 확인 가능한
                  경우
                </li>
              </ul>
            </li>
            <li>
              <p className="">(2) 신규 데이터 요청</p>
              <ul className="list-disc ml-7 text-gray-700">
                <li>검색 시 해당 데이터셋이 존재하지 않는 경우</li>
                <li>
                  공공데이터포털에 존재하지만, 본 사이트에 등록되지 않은
                  데이터의 신규 개방 요청
                </li>
              </ul>
            </li>
          </ol>
        </section>

        {/* 2. 데이터 요청 우선순위 */}
        <section>
          <h3 className="text-lg  ">2. 데이터 요청 우선순위</h3>
          <ol className="ml-1 space-y-4">
            <li>
              <p className="">(1) 공공데이터포털(data.go.kr)</p>
              <ul className="list-disc ml-7 text-gray-700">
                <li>
                  국가 및 지방자치단체, 공공기관이 제공하는 공식 오픈 데이터
                </li>
                <li>최우선 처리 대상</li>
              </ul>
            </li>
            <li>
              <p className="">(2) 공공데이터포털 연계 사이트</p>
              <ul className="list-disc ml-7 text-gray-700">
                <li>
                  공공데이터포털 API 또는 데이터셋 연계를 통해 자료를 제공하는
                  기관 웹사이트
                </li>
                <li>
                  공공데이터포털을 통해 접근 가능하거나 포털 메타데이터에서
                  출처로 확인되는 경우 포함
                </li>
              </ul>
            </li>
            <li>
              <p className="">(3) 외부 사이트</p>
              <ul className="list-disc ml-7 text-gray-700">
                <li>
                  공공데이터포털과 직접 연계되지 않은 민간/기관 웹사이트 (예: AI
                  Hub, KOSIS 등)
                </li>
                <li>
                  현재 기능 준비 중으로 추후 지원 예정이며, 공지사항을 통해 안내
                </li>
              </ul>
            </li>
          </ol>
        </section>

        {/* 3. 검토 및 처리 */}
        <section>
          <h3 className="text-lg  ">3. 검토 및 처리</h3>
          <ul className="list-disc ml-7 text-gray-700">
            <li>우선순위에 따라 담당 부서에서 검토 후 처리 결과 안내</li>
          </ul>
        </section>
      </div>
    </div>
  );
};
