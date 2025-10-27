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
import { useRouter } from "next/navigation";
export const Footer = () => {
  const router = useRouter();

  return (
    <div className="bg-white  fixed bottom-0 w-full h-[60px]">
      <div className="flex justify-between max-w-[1200px] mx-auto h-full">
        <p className=" flex items-center  text-[18px] font-light">
          © 2025 OpenDataMCP is an ezrnd project
        </p>
        <button
          className="px-2  cursor-pointer hover:text-blue-600 transition-colors duration-300"
          onClick={() => router.push("/licenses")}
        >
          Licenses
        </button>
      </div>
    </div>
  );
};
