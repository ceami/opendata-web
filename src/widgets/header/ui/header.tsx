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

import React from "react";
import { Button } from "@/shared/ui/button";
import { ContactModal } from "@/features/contact";
import { useRouter } from "next/navigation";

export function Header() {
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
          <a
            href="/file/OpenData.pdf"
            download="OpenData.pdf"
            className="text-[18px] px-2 font-bold cursor-pointer hover:text-blue-600 transition-colors duration-300"
          >
            사용 방법
          </a>
          <button
            className="text-[18px] px-2 font-bold cursor-pointer hover:text-blue-600 transition-colors duration-300"
            onClick={() =>
              window.open("https://smithery.ai/server/@iosif2/opendata-mcp")
            }
          >
            MCP 설치
          </button>
          <Button
            variant="outline"
            className="bg-[#1565c0] text-white  cursor-pointer   font-semibold duration-300 transition-colors px-[22px] py-[8px]"
            onClick={() => router.push("/request")}
          >
            + 문서 요청
          </Button>
          <ContactModal>
            <Button
              variant="outline"
              className="bg-[#1565c0] text-white cursor-pointer font-semibold duration-300 transition-colors px-[22px] py-[8px]"
            >
              문의하기
            </Button>
          </ContactModal>
        </div>
      </div>
    </div>
  );
}
