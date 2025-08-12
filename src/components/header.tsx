"use client";
import React, { use } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
export const Header = () => {
  const router = useRouter();
  return (
    <div className="font-bold">
      <div className="flex justify-between text-[20px] items-center max-w-[1200px] h-[75px] mx-auto">
        <div>
          <Button
            variant="outline"
            className="bg-white text-black font-bold border-2 text-[20px] cursor-pointer h-12 py-2"
            onClick={() => router.push("/")}
          >
            OPEN DATA
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="link"
              className="underline text-[20px] px-2 font-bold cursor-pointer hover:text-blue-600"
              // onClick={() => router.push("/about")}
              // style={{ cursor: "pointer" }}
            >
              MCP Server
            </Button>
            <Button
              variant="link"
              className="underline text-[20px] px-2 font-bold cursor-pointer hover:text-blue-600"
              onClick={() => router.push("/about")}
              // style={{ cursor: "pointer" }}
            >
              About us
            </Button>
          </div>
          <Button
            variant="outline"
            className="bg-[#1565c0] text-white font-bold text-[20px] cursor-pointer h-12"
            onClick={() => router.push("/request")}
          >
            Request docs
          </Button>
        </div>
      </div>
    </div>
  );
};
