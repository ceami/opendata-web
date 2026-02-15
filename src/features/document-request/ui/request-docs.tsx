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

import React, { useMemo, useState } from "react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { preventRapidClicks } from "@/shared/lib/utils";

export function RequestDocks() {
  const [inputValue, setInputValue] = useState("");
  const { mutate } = useMutation({
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
      setInputValue("");
      if (data?.message === "저장완료") {
        toast.success("문서 요청이 완료되었습니다.");
      } else {
        toast.error("문서 요청에 실패했습니다.");
      }
    },
  });

  const submitOnce = useMemo(
    () => preventRapidClicks(() => mutate(), 800),
    [mutate]
  );

  return (
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
  );
}
