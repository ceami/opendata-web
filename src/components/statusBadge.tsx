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

export const StatusBadge = ({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: string;
}) => {
  return (
    <span
      className={`inline-flex items-center min-w-[70px] justify-center py-1 rounded-[5px] text-xs font-light ${
        getVariantStyles(variant).className
      }`}
    >
      {children}
    </span>
  );
};

export const getVariantStyles = (variant: string) => {
  switch (variant) {
    case "API":
      return {
        title: "오픈 API",
        className:
          "bg-[#009689] border-[#00ddca] text-white border rounded-[5px]",
      };
    case "FILE":
      return {
        title: "파일 데이터",
        className:
          "bg-[#FE9A00] border-[#FFC66F] text-white border rounded-[5px]",
      };
    default:
      return {
        title: "기본",
        className: "bg-gray-100 text-gray-800",
      };
  }
};
