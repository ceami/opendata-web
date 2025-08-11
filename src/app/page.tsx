"use client";
import * as React from "react";

import { Progress } from "@/components/ui/progress";
import { ContentHeader } from "../components/content-header";
import { TabContent } from "@/components/content";

export default function Home() {
  return (
    <div className="">
      <div className="min-h-[calc(100vh-75px)] h-full mx-auto max-w-[1200px]">
        <div id="contentHeader" className="">
          <ContentHeader />
        </div>

        <div id="tabContent" className="">
          <TabContent />
        </div>
      </div>
    </div>
  );
}
