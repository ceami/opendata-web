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

import { useState, useEffect } from "react";
import Image from "next/image";
import { ProgressSection } from "@/features/success-rate";

const HERO_SLIDES = [
  {
    title: "공공데이터포털의 복잡한 API 문서, AI로 쉽고 빠르게 활용하세요",
    subtitle: (
      <>
        OpenData MCP로 번거로운 공공데이터포털, 클릭 한 번에 쉽게
        <br className="hidden md:block" />
        <span className="md:block">누구나 손쉽게, AI가 연결하는 공공데이터포털 활용의 시작!</span>
      </>
    ),
    showProgress: true,
  },
  {
    title: "입찰⋅R&D 정보지원시스템 이지알앤디, AI로 한눈에",
    subtitle: (
      <>
        나라장터·IRIS 통합공고를 한곳에서 검색하고,
        <br className="hidden md:block" />
        <span className="md:block">AI가 요약·분석해 드립니다</span>
      </>
    ),
    showProgress: false,
  },
];

export function HeroSection() {
  const slide = HERO_SLIDES[0];
  return (
    <div className="w-full flex flex-col justify-between gap-2 md:gap-3">
      <h1 className="text-primary font-bold text-xl md:text-2xl leading-tight text-center md:text-left">
        {slide.title}
      </h1>
      <h2 className="font-medium text-muted-foreground text-center md:text-left text-base md:text-lg leading-relaxed">
        {slide.subtitle}
      </h2>
    </div>
  );
}

export function HomeHero() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="headContent" className="w-full h-full px-0">
      <div className="flex flex-col max-w-[var(--content-max-width)] mx-auto w-full h-[320px] md:h-[380px] py-4 md:py-5">
        <div className="flex-1 min-h-0 overflow-hidden relative">
          <div
            className="flex absolute top-0 left-0 h-full transition-transform duration-300 ease-in-out"
            style={{
              width: `${HERO_SLIDES.length * 100}%`,
              transform: `translateX(-${activeIndex * (100 / HERO_SLIDES.length)}%)`,
            }}
          >
            {HERO_SLIDES.map((slide, index) => (
              <div
                key={index}
                className="shrink-0 grid pr-4 gap-x-4 gap-y-1 md:gap-y-2"
                style={{
                  width: `${100 / HERO_SLIDES.length}%`,
                  gridTemplateColumns: "1fr auto",
                  gridTemplateRows: "auto auto auto",
                }}
              >
                <h1 className="text-primary font-bold text-xl md:text-2xl leading-tight text-center md:text-left min-w-0">
                  {slide.title}
                </h1>
                <div
                  className="row-span-2 flex items-center justify-end"
                  style={{ gridRow: "1 / 3", gridColumn: 2 }}
                >
                  {index === 0 ? (
                    <Image
                      src="/badge.png"
                      alt="badge"
                      width={120}
                      height={120}
                      className="object-contain w-[100px] md:w-[140px] h-[100px] md:h-[140px]"
                    />
                  ) : (
                    <div className="w-[100px] md:w-[140px] h-[100px] md:h-[140px]" />
                  )}
                </div>
                <h2 className="font-medium text-muted-foreground text-center md:text-left text-base md:text-lg leading-relaxed">
                  {slide.subtitle}
                </h2>
                <div
                  className="min-h-[80px] md:min-h-[100px] col-span-2"
                  style={{ gridColumn: "1 / -1" }}
                >
                  {slide.showProgress && <ProgressSection />}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center gap-2 pt-2 pb-2 shrink-0">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`히어로 ${index + 1}번으로 이동`}
              onClick={() => setActiveIndex(index)}
              className="size-2.5 md:size-3 rounded-full border-2 border-primary transition-all hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              style={{
                backgroundColor: index === activeIndex ? "var(--primary)" : "transparent",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
