"use client";
import React, { use } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IoAdd } from "react-icons/io5";
export const Header = () => {
  const router = useRouter();
  return (
    <div className="font-bold">
      <div className="flex justify-between text-[20px] items-center max-w-[1200px] h-[75px] mx-auto transition-all duration-300">
        <div className="flex items-center gap-1">
          <img src="/logo.png" alt="logo" />
          Open Data
          {/* <Button
            variant="outline"
            className="bg-white text-black font-bold border-2 text-[20px] cursor-pointer h-12 py-2 transition-colors duration-300"
            onClick={() => router.push("/")}
          >
            OPEN DATA
          </Button> */}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="link"
              className="underline text-[20px] px-2 font-bold cursor-pointer hover:text-blue-600 transition-colors duration-300"
              onClick={() =>
                window.open("/https://smithery.ai/server/@iosif2/open-data-mcp")
              }
              // style={{ cursor: "pointer" }}
            >
              MCP 설치
            </Button>
            {/* <Button
              variant="link"
              className="underline text-[20px] px-2 font-bold cursor-pointer hover:text-blue-600 transition-colors duration-300"
              onClick={() => router.push("/about")}
              // style={{ cursor: "pointer" }}
            >
              About us
            </Button> */}
          </div>
          <Button
            variant="outline"
            className="bg-[#1565c0] text-white font-bold  cursor-pointer h-10  duration-300 transition-colors"
            onClick={() => router.push("/request")}
          >
            <IoAdd className="mr-1" />
            문서 요청
          </Button>
        </div>
      </div>
    </div>
  );
};
