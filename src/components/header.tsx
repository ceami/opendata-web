import React from "react";
import { Button } from "./ui/button";

export const Header = () => {
  return (
    <div className="font-semibold">
      <div className="flex justify-between items-center max-w-[1200px] h-[75px] mx-auto">
        <Button
          variant="outline"
          className="bg-white text-black font-semibold border-2 "
        >
          OPEN DATA
        </Button>

        <div className="underline">MCP Server</div>

        <div className="underline">About us</div>

        <Button
          variant="outline"
          className="bg-[#1565c0] text-white font-semibold"
        >
          Request docs
        </Button>
      </div>
    </div>
  );
};
