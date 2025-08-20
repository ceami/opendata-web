import type { Metadata } from "next";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <QueryProvider>
          <DataTableProvider>
            <div
              className="min-h-screen flex flex-col "
              style={{
                // 상단 0→160px 구간에서 #D8E2E7 → white로 그라데이션, 이후 전체는 white 유지
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
