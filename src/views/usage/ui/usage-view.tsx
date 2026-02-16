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

import { Button } from "@/shared/ui/button";
import { Download } from "lucide-react";

const USAGE_PDF_PATH = "/file/OpenData.pdf";

export function UsageView() {
  return (
    <div className="w-full h-full max-w-[var(--content-max-width)] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">
          사용 방법
        </h1>
        <a href={USAGE_PDF_PATH} download="OpenData.pdf" className="inline-flex">
          <Button
            type="button"
            variant="outline"
            className="gap-2 cursor-pointer"
          >
            <Download className="size-4" />
            PDF 다운로드
          </Button>
        </a>
      </div>
      <div className="min-h-[600px] md:min-h-[calc(100vh-280px)] rounded-lg border border-border overflow-hidden bg-muted/30">
        <iframe
          src={USAGE_PDF_PATH}
          title="사용 방법"
          className="w-full h-full min-h-[600px] md:min-h-[calc(100vh-280px)]"
        />
      </div>
    </div>
  );
}
