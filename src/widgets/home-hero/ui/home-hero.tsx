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

import { ProgressSection } from "@/features/success-rate";

export function HeroSection() {
  return (
    <div className="w-1/2 h-[87px]  w-full flex flex-col justify-between">
      <h1 className="text-blue-500 font-bold  text-[24px] h-[29px]">
        복잡한 공공데이터, AI로 쉽고 빠르게 활용하세요
      </h1>
      <h2 className=" font-medium text-gray-500 text-left h-[48px]  text-[20px]">
        OpenDataMCP로 번거로운 공공데이터포털, 클릭 한 번에 쉽게!
        <br />
        누구나 손쉽게, AI가 연결하는 공공데이터 활용의 시작
      </h2>
    </div>
  );
}

export function HomeHero() {
  return (
    <div id="headContent" className="w-full h-full">
      <div className="flex flex-col max-w-[1200px] mx-auto items-center justify-center w-full h-[248px] space-y-[40px]">
        <HeroSection />
        <ProgressSection />
      </div>
    </div>
  );
}
