import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "./provider/query-provider";
import { DataTableProvider } from "@/contexts/DataTableContext";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Toaster } from "react-hot-toast";

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
        {/* 1) gtag.js 로드 */}
        {GA_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            {/* 2) gtag 초기화 */}
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
            </div>
          </DataTableProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
