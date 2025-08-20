"use client";
import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export const Header = () => {
  const router = useRouter();
  return (
    <div className="font-bold">
      <div className="flex justify-between text-[20px] items-center max-w-[1200px] h-[75px] mx-auto transition-all duration-300">
        <button
          className="flex items-center gap-1 text-[20px] font-bold cursor-pointer"
          onClick={() => router.push("/")}
        >
          <img src="/logo.png" alt="logo" />
          OpenData
        </button>
        <div className="flex items-center gap-2">
          {/* <div className="flex items-center gap-2"> */}
          <button
            className="text-[18px] px-2 font-bold cursor-pointer hover:text-blue-600 transition-colors duration-300"
            onClick={() =>
              window.open("https://smithery.ai/server/@iosif2/opendata-mcp")
            }
          >
            MCP 설치
          </button>
          {/* </div> */}
          <Button
            variant="outline"
            className="bg-[#1565c0] text-white  cursor-pointer   font-semibold duration-300 transition-colors px-[22px] py-[8px]"
            onClick={() => router.push("/request")}
          >
            + 문서 요청
          </Button>
        </div>
      </div>
    </div>
  );
};
