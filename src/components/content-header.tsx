"use client";
import * as React from "react";

import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";

const fetchData = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/document/get_success_rate`
  );
  const data = await response.json();
  return data;
};

export const ContentHeader = () => {
  return (
    <div id="headContent" className="w-full h-full">
      <div className="flex flex-col max-w-[1200px]  items-center justify-center w-full h-[248px] space-y-2">
        <HeroSection />
        <ProgressSection />
      </div>
    </div>
  );
};

export const HeroSection = () => {
  return (
    <div className="w-1/2 h-[70px]  w-full">
      <h1 className="text-blue-500 font-semibold  text-lg leading-10">
        복잡한 공공데이터, 하나의 통합된 플랫폼에서.
      </h1>
      <h2 className="text-md font-medium text-gray-500">
        ODM MCP는 파편화된 공공데이터 사용 정보를 하나의 통합된 문서로
        제공합니다.
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
    <div className="w-full h-[100px] bg-white border-1 border-gray-400 rounded-lg flex flex-col px-2 py-2 justify-center">
      <div className="flex flex-col justify-between h-full space-y-0.5">
        <div className="flex text-gray-900 items-center font-semibold  bg-white justify-between w-full px-2">
          <span className="text-lg ">데이터 통합문서 제공</span>
          <span className=" text-lg">{data?.success_rate}%</span>
        </div>
        <div className="w-full px-2">
          <Progress value={data?.success_rate} className="" />
        </div>

        <p className="text-xs text-gray-500 px-2 text-right ">
          *공공데이터포털에서 제공하는 데이터 중 통합문서가 생성된 데이터의
          비율임.
        </p>
      </div>
    </div>
  );
};
