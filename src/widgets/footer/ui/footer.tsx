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

export function Footer() {
  const router = useRouter();

  return (
    <div className="bg-background fixed bottom-0 w-full h-[52px] md:h-[60px] border-t border-border/40">
      <div className="flex justify-between items-center max-w-[var(--content-max-width)] mx-auto h-full px-4">
        <p className="flex items-center text-xs md:text-sm font-normal text-muted-foreground truncate max-w-[60%]">
          © 2025 OpenData MCP is an ezrnd project
        </p>
        <button
          className="px-2 cursor-pointer text-muted-foreground hover:text-primary transition-colors duration-200 text-xs md:text-sm shrink-0"
          onClick={() => router.push("/licenses")}
        >
          Licenses
        </button>
      </div>
    </div>
  );
}
