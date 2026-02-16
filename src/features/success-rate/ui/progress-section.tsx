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

import { Progress } from "@/shared/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { fetchSuccessRate } from "@/entities/document";

export function ProgressSection() {
  const { data } = useQuery({
    queryKey: ["success-rate"],
    queryFn: () => fetchSuccessRate(),
  });

  return (
    <div className="w-full min-h-[80px] md:min-h-[100px] bg-muted/50 flex flex-col px-4 md:px-6 py-3 md:py-4 justify-center">
      <div className="flex flex-col justify-between h-full space-y-0.5">
        <div className="flex text-foreground items-center justify-between w-full px-1 md:px-2">
          <span className="text-sm md:text-base font-semibold">
            데이터 표준문서 제공
          </span>
          <span className="text-sm md:text-base font-semibold text-primary">
            {data?.successRate}%
          </span>
        </div>
        <div className="w-full px-2">
          <Progress value={data?.successRate} className="" />
        </div>

        <p className="text-muted-foreground px-1 md:px-2 text-right text-xs md:text-sm">
          ※공공데이터포털에서 제공하는 데이터 중 통합문서가 생성된 데이터의 비율임
        </p>
      </div>
    </div>
  );
}
