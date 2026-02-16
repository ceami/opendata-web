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

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/shared/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Badge } from "@/shared/ui/badge";
import { Input } from "@/shared/ui/input";
import {
  ExternalLink,
  Package,
  Code,
  Database,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type {
  LicenseInfo,
  FrontendLicenses,
  BackendLicenses,
} from "@/entities/license";

interface LicensesViewProps {
  frontendLicenses?: FrontendLicenses;
  backendLicenses?: BackendLicenses;
}

function LicenseRow({ pkg }: { pkg: LicenseInfo }) {
  const [expanded, setExpanded] = useState(false);
  const link = pkg.repository || pkg.homepage;
  const hasDetails = pkg.author || pkg.description || link;

  const licenseVariant = (license: string) => {
    const l = license.toLowerCase();
    if (l.includes("mit")) return "default";
    if (l.includes("apache")) return "secondary";
    if (l.includes("bsd") || l.includes("isc")) return "outline";
    if (l.includes("gpl") || l.includes("agpl")) return "destructive";
    return "default";
  };

  return (
    <div
      className="group border-b border-border/60 last:border-0 transition-colors hover:bg-muted/30"
      role="button"
      tabIndex={0}
      onClick={() => hasDetails && setExpanded(!expanded)}
      onKeyDown={(e) =>
        hasDetails && (e.key === "Enter" || e.key === " ") && setExpanded(!expanded)
      }
    >
      <div className="flex items-center gap-4 px-4 py-3 text-sm min-h-[52px]">
        <Package className="h-4 w-4 shrink-0 text-muted-foreground" />
        <div className="min-w-0 flex-1">
          <span className="font-medium text-foreground">{pkg.name}</span>
          <span className="text-muted-foreground ml-1.5">v{pkg.version}</span>
        </div>
        {pkg.license && (
          <Badge
            variant={licenseVariant(pkg.license) as "default" | "secondary" | "outline" | "destructive"}
            className="shrink-0 text-xs"
          >
            {pkg.license}
          </Badge>
        )}
        <div className="flex items-center gap-2 shrink-0">
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
              onClick={(e) => e.stopPropagation()}
              aria-label="패키지 링크 열기"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          {hasDetails && (
            <span className="text-muted-foreground">
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </span>
          )}
        </div>
      </div>
      {expanded && hasDetails && (
        <div className="px-4 pb-3 pl-11 text-sm text-muted-foreground space-y-1.5 border-t border-border/40 pt-3">
          {pkg.description && (
            <p className="line-clamp-2">{pkg.description}</p>
          )}
          {pkg.author && (
            <p>
              <span className="font-medium text-foreground/80">작성자:</span>{" "}
              {pkg.author}
            </p>
          )}
          {pkg.homepage && pkg.homepage !== link && (
            <a
              href={pkg.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              홈페이지 <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function PackageList({
  packages,
  type,
}: {
  packages: LicenseInfo[];
  type: "npm" | "python";
}) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    if (!query.trim()) return packages;
    const q = query.toLowerCase();
    return packages.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.license?.toLowerCase().includes(q) ?? false) ||
        (p.description?.toLowerCase().includes(q) ?? false)
    );
  }, [packages, query]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="패키지, 라이선스로 검색..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
          autoComplete="off"
        />
      </div>
      <Card className="overflow-hidden border-border/60">
        <CardContent className="p-0">
          {filtered.length ? (
            <div className="divide-y-0">
              {filtered.map((pkg) => (
                <LicenseRow
                  key={`${pkg.name}-${pkg.version}`}
                  pkg={{ ...pkg, type }}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground text-sm">
              검색 결과가 없습니다.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const INFRA_ITEMS = [
  { name: "MongoDB", license: "Server Side Public License (SSPL) 1.0" },
  { name: "Milvus", license: "Apache License 2.0" },
  { name: "Elasticsearch", license: "Elastic License 2.0" },
  { name: "etcd", license: "Apache License 2.0" },
  { name: "MinIO", license: "GNU Affero General Public License v3.0" },
  { name: "Python", license: "Python Software Foundation License" },
];

export function LicensesView({
  frontendLicenses,
  backendLicenses,
}: LicensesViewProps) {
  const [frontendData, setFrontendData] = useState<FrontendLicenses | null>(
    frontendLicenses ?? null
  );
  const [backendData, setBackendData] = useState<BackendLicenses | null>(
    backendLicenses ?? null
  );
  const [loading, setLoading] = useState(
    !frontendLicenses && !backendLicenses
  );

  useEffect(() => {
    if (!frontendLicenses || !backendLicenses) {
      const loadLicenses = async () => {
        try {
          const [frontendRes, backendRes] = await Promise.allSettled([
            fetch("/licenses.json"),
            fetch("/backend_licenses.json"),
          ]);

          if (frontendRes.status === "fulfilled") {
            const raw = await frontendRes.value.json();
            setFrontendData({
              generated_at: new Date().toISOString(),
              packages: raw.map(
                (p: {
                  name: string;
                  installedVersion: string;
                  licenseType: string;
                  link: string;
                  author: string;
                }) => ({
                  name: p.name,
                  version: p.installedVersion,
                  type: "npm" as const,
                  homepage: p.link?.startsWith("git+")
                    ? p.link.replace("git+", "").replace(".git", "")
                    : p.link,
                  author: p.author !== "n/a" ? p.author : undefined,
                  license: p.licenseType !== "n/a" ? p.licenseType : undefined,
                  repository: p.link?.startsWith("git+")
                    ? p.link.replace("git+", "").replace(".git", "")
                    : undefined,
                })
              ),
            });
          }

          if (backendRes.status === "fulfilled") {
            const data = await backendRes.value.json();
            setBackendData(data);
          }
        } catch (error) {
          console.error("라이선스 데이터 로드 실패:", error);
        } finally {
          setLoading(false);
        }
      };
      loadLicenses();
    }
  }, [frontendLicenses, backendLicenses]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[320px] gap-4">
        <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        <p className="text-sm text-muted-foreground">라이선스 정보를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      <div className="space-y-2">
        <h1 className="text-primary font-bold text-2xl tracking-tight">
          라이선스 정보
        </h1>
        <p className="text-muted-foreground">
          이 프로젝트에서 사용된 오픈소스 라이브러리 및 인프라의 라이선스 정보입니다.
        </p>
      </div>

      <Tabs defaultValue="frontend" className="w-full">
        <TabsList className="h-10 p-1 bg-muted/50 rounded-lg inline-flex w-full max-w-md">
          <TabsTrigger
            value="frontend"
            className="flex-1 gap-2 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Package className="h-4 w-4" />
            프론트엔드 ({frontendData?.packages?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger
            value="backend"
            className="flex-1 gap-2 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Code className="h-4 w-4" />
            백엔드 ({backendData?.packages?.length ?? 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="frontend" className="mt-6 focus-visible:outline-none">
          <PackageList
            packages={frontendData?.packages ?? []}
            type="npm"
          />
        </TabsContent>

        <TabsContent value="backend" className="mt-6 focus-visible:outline-none">
          <PackageList
            packages={backendData?.packages ?? []}
            type="python"
          />
        </TabsContent>
      </Tabs>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Database className="h-4 w-4 text-muted-foreground" />
          인프라 구성 요소
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {INFRA_ITEMS.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg border border-border/60 bg-card text-sm"
            >
              <span className="font-medium">{item.name}</span>
              <Badge variant="outline" className="text-xs font-normal shrink-0">
                {item.license}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
