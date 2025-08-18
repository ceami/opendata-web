"use client";
import * as React from "react";

import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";

const fetchData = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/document/success-rate`
  );
  const data = await response.json();
  return data;
};

export const ContentHeader = () => {
  return (
    <div id="headContent" className="w-full h-full">
      <div className="flex flex-col max-w-[1200px] mx-auto items-center justify-center w-full h-[248px] space-y-[40px]">
        <HeroSection />
        <ProgressSection />
      </div>
    </div>
  );
};

export const HeroSection = () => {
  return (
    <div className="w-1/2 h-[87px]  w-full flex flex-col justify-between">
      <h1 className="text-blue-500 font-bold  text-[24px] h-[29px]">
        복잡한 공공데이터포털 사용법, AI 도구로 손쉽게 사용해 보세요
      </h1>
      <h2 className=" font-medium text-gray-500 text-left h-[48px]  text-[20px]">
        OpenData MCP는 사용법이 어려운 공공데이터포털의 API와 데이터셋
        다운로드를 MCP
        <br />
        사용이 가능한 도구에서 손쉽게
      </h2>
    </div>
  );
};

export const ProgressSection = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["data"],
    queryFn: () => fetchData(),
  });

  return (
    <div className="w-full h-[100px] bg-white border-1 border-gray-400 rounded-[5px] flex flex-col px-[24px] py-[16px] justify-center">
      <div className="flex flex-col justify-between h-full space-y-0.5">
        <div className="flex text-gray-900 items-center bg-white justify-between w-full px-2">
          <span className="text-[18px] font-semibold   ">
            데이터 표준문서 제공
          </span>
          <span className=" text-[18px] font-semibold">
            {data?.successRate}%
          </span>
        </div>
        <div className="w-full px-2">
          <Progress value={data?.successRate} className="" />
        </div>

        <p className="text-gray-500 px-2 text-right text-[15px] ">
          *공공데이터포털에서 제공하는 데이터 중 통합문서가 생성된 데이터의
          비율임
        </p>
      </div>
    </div>
  );
};
