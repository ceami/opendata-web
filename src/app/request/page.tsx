import React from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Request = () => {
  return (
    <div className="w-full h-full  max-w-[1200px] mx-auto space-y-10">
      <RequestDocks />
      <RequestGuide />
    </div>
  );
};

export default Request;

export const RequestDocks = () => {
  return (
    <div>
      <form action="submit">
        <p className="text-gray-700 mb-4">
          Up-to-date documentation for LLMs and AI code editors Copy the latest
          docs and code for any library
          <br /> — paste into Cursor, Claude, or other LLMs.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <Input
            placeholder="Enter your request here..."
            className="flex-1 h-10"
          />
          <Button className="h-10 px-6 sm:w-auto w-full">Submit</Button>
        </div>
      </form>
    </div>
  );
};

export const RequestGuide = () => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg border">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Guidelines</h2>

      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="w-2 h-2 rounded-full bg-green-500 mt-3 flex-shrink-0"></div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              Repository Requirements
            </h3>
            <p className="text-gray-600">
              Use public/open source GitHub repositories with URLs in the format{" "}
              <code className="bg-gray-200 px-2 py-1 rounded text-sm">
                https://github.com/username/repo
              </code>
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-2 h-2 rounded-full bg-green-500 mt-3 flex-shrink-0"></div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              Supported Files
            </h3>
            <p className="text-gray-600 mb-2">
              Context7 extracts code snippets only from documentation files with
              these extensions:
            </p>
            <div className="flex flex-wrap gap-2">
              {[".md", ".mdx", ".html", ".rst", ".ipynb"].map((ext) => (
                <span
                  key={ext}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono"
                >
                  {ext}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-2 h-2 rounded-full bg-green-500 mt-3 flex-shrink-0"></div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              Indexing Focus
            </h3>
            <p className="text-gray-600">
              The system specifically targets and processes code snippets within
              documentation while ignoring the pages that lack code snippets.
              The system specifically targets and processes code snippets within
              documentation while ignoring the pages that lack code snippets.
              The system specifically targets and processes code snippets within
              documentation while ignoring the pages that lack code snippets.
              The system specifically targets and processes code snippets within
              documentation while ignoring the pages that lack code snippets.
              The system specifically targets and processes code snippets within
              documentation while ignoring the pages that lack code snippets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
