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

import React, { useState } from "react";
import { Button } from "@/shared/ui/button";
import { ContactModal } from "@/features/contact";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

export function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const navLinks = (
    <>
      <button
        type="button"
        className="text-base px-2 font-medium cursor-pointer text-muted-foreground hover:text-primary transition-colors duration-200"
        onClick={() => {
          router.push("/usage");
          setMobileMenuOpen(false);
        }}
      >
        사용 방법
      </button>
      <button
        type="button"
        className="text-base px-2 font-medium cursor-pointer text-muted-foreground hover:text-primary transition-colors duration-200"
        onClick={() => {
          window.open("https://smithery.ai/server/@iosif2/opendata-mcp");
          setMobileMenuOpen(false);
        }}
      >
        MCP 설치
      </button>
      <Button
        className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer font-medium duration-200 transition-colors px-5 py-2 border-0"
        onClick={() => {
          router.push("/request");
          setMobileMenuOpen(false);
        }}
      >
        + 문서 요청
      </Button>
      <Button
        className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer font-medium duration-200 transition-colors px-5 py-2 border-0"
        onClick={() => setContactOpen(true)}
      >
        문의하기
      </Button>
    </>
  );

  return (
    <div className="font-semibold border-b border-border/40">
      <div className="flex justify-between text-lg items-center max-w-[var(--content-max-width)] min-h-[60px] md:h-[75px] mx-auto px-4 transition-all duration-300">
        <button
          className="flex items-center gap-1.5 text-base md:text-lg font-bold cursor-pointer text-foreground hover:text-primary transition-colors shrink-0"
          onClick={() => router.push("/")}
        >
          <img src="/logo.png" alt="logo" className="h-8 w-8 md:h-9 md:w-9" />
          OpenData
        </button>

        <div className="hidden md:flex items-center gap-2">{navLinks}</div>

        <button
          type="button"
          className="md:hidden p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background">
          <div className="flex flex-col max-w-[var(--content-max-width)] mx-auto px-4 py-3 gap-2">
            <button
              type="button"
              className="text-left text-base py-2 font-medium text-muted-foreground hover:text-primary transition-colors"
              onClick={() => {
                router.push("/usage");
                setMobileMenuOpen(false);
              }}
            >
              사용 방법
            </button>
            <button
              type="button"
              className="text-left text-base py-2 font-medium text-muted-foreground hover:text-primary transition-colors"
              onClick={() => {
                window.open("https://smithery.ai/server/@iosif2/opendata-mcp");
                setMobileMenuOpen(false);
              }}
            >
              MCP 설치
            </button>
            <Button
              className="w-full justify-center bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-2 border-0"
              onClick={() => {
                router.push("/request");
                setMobileMenuOpen(false);
              }}
            >
              + 문서 요청
            </Button>
            <Button
              className="w-full justify-center bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-2 border-0"
              type="button"
              onClick={() => {
                setContactOpen(true);
                setMobileMenuOpen(false);
              }}
            >
              문의하기
            </Button>
          </div>
        </div>
      )}

      <ContactModal
        open={contactOpen}
        onOpenChange={(open) => setContactOpen(open)}
      />
    </div>
  );
}
