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
import React from "react";
import Script from "next/script";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { FloatingBadge } from "@/widgets/floating-badge";
import { QueryProvider } from "./provider/query-provider";
import { DataTableProvider } from "@/features/document-list";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OpenDataMCP",
  description:
    "공공데이터포털 데이터를 검색·정렬·페이지네이션으로 탐색하고, 표준 문서(Markdown)를 열람·복사하며, 신규 문서 생성을 요청할 수 있는 OpenDataMCP 웹 클라이언트",
  icons: {
    icon: "/logo.png",
  },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        {GA_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { send_page_view: false });
              `}
            </Script>
          </>
        ) : null}

        <QueryProvider>
          <DataTableProvider>
            <div
              className="min-h-screen flex flex-col"
              style={{
                backgroundColor: "#ffffff",
                backgroundImage:
                  "linear-gradient(to bottom, #D8E2E7 0px, #ffffff 200px)",
                backgroundRepeat: "no-repeat",
              }}
            >
              <Header />
              <main className="flex-1 pt-10 ">{children}</main>
              <Footer />
              <FloatingBadge />
            </div>
          </DataTableProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
