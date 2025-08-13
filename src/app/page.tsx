"use client";
import * as React from "react";

import { Content } from "@/components/content";
import { ContentHeader } from "@/components/content-header";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full">
      <ContentHeader />
      <Content />
    </div>
  );
}
