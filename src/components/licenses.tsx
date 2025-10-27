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

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Package, Code, Database, Server } from "lucide-react";
import {
  LicenseInfo,
  FrontendLicenses,
  BackendLicenses,
} from "@/types/license";

interface LicensesProps {
  frontendLicenses?: FrontendLicenses;
  backendLicenses?: BackendLicenses;
}

export function Licenses({ frontendLicenses, backendLicenses }: LicensesProps) {
  const [frontendData, setFrontendData] = useState<FrontendLicenses | null>(
    frontendLicenses || null
  );
  const [backendData, setBackendData] = useState<BackendLicenses | null>(
    backendLicenses || null
  );
  const [loading, setLoading] = useState(!frontendLicenses && !backendLicenses);

  useEffect(() => {
    if (!frontendLicenses || !backendLicenses) {
      const loadLicenses = async () => {
        try {
          const [frontendRes, backendRes] = await Promise.allSettled([
            fetch("/licenses.json"),
            fetch("/backend_licenses.json"),
          ]);

          if (frontendRes.status === "fulfilled") {
            const frontendData = await frontendRes.value.json();
            setFrontendData(frontendData);
          }

          if (backendRes.status === "fulfilled") {
            const backendData = await backendRes.value.json();
            setBackendData(backendData);
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

  const getLicenseBadgeVariant = (license: string) => {
    const licenseLower = license.toLowerCase();
    if (licenseLower.includes("mit")) return "default";
    if (licenseLower.includes("apache")) return "secondary";
    if (licenseLower.includes("bsd")) return "outline";
    if (licenseLower.includes("gpl")) return "destructive";
    return "default";
  };

  const getPackageIcon = (type: string) => {
    switch (type) {
      case "npm":
        return <Package className="h-4 w-4" />;
      case "python":
        return <Code className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const renderLicenseCard = (pkg: LicenseInfo) => (
    <Card key={`${pkg.name}-${pkg.version}`} className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getPackageIcon(pkg.type)}
            <CardTitle className="text-lg">{pkg.name}</CardTitle>
            <Badge variant="outline" className="text-xs">
              v{pkg.version}
            </Badge>
          </div>
          {pkg.license && (
            <Badge variant={getLicenseBadgeVariant(pkg.license)}>
              {pkg.license}
            </Badge>
          )}
        </div>
        {pkg.description && (
          <CardDescription className="text-sm">
            {pkg.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 text-sm text-muted-foreground">
          {pkg.author && (
            <div className="flex items-center gap-2">
              <span className="font-medium">작성자:</span>
              <span>{pkg.author}</span>
            </div>
          )}
          {pkg.homepage && (
            <div className="flex items-center gap-2">
              <span className="font-medium">홈페이지:</span>
              <a
                href={pkg.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
              >
                {pkg.homepage}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
          {pkg.repository && (
            <div className="flex items-center gap-2">
              <span className="font-medium">저장소:</span>
              <a
                href={pkg.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
              >
                {pkg.repository}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">
          라이선스 정보를 로드하는 중...
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">라이선스 정보</h1>
        <p className="text-xl text-muted-foreground">
          이 프로젝트에서 사용된 모든 오픈소스 라이브러리의 라이선스 정보입니다.
        </p>
      </div>

      <Tabs defaultValue="frontend" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="frontend" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            프론트엔드 ({frontendData?.packages?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="backend" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            백엔드 ({backendData?.packages?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="frontend" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5" />
              <h2 className="text-2xl font-semibold">프론트엔드 의존성</h2>
            </div>
            {frontendData?.packages?.length ? (
              <div className="grid gap-4">
                {frontendData.packages.map(renderLicenseCard)}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    프론트엔드 라이선스 정보를 찾을 수 없습니다.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="backend" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Code className="h-5 w-5" />
              <h2 className="text-2xl font-semibold">백엔드 의존성</h2>
            </div>
            {backendData?.packages?.length ? (
              <div className="grid gap-4">
                {backendData.packages.map(renderLicenseCard)}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    백엔드 라이선스 정보를 찾을 수 없습니다.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Database className="h-4 w-4" />
          <span className="font-medium">인프라 구성 요소</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              <span className="font-medium">MongoDB</span>
              <Badge variant="outline">
                Server Side Public License (SSPL) 1.0
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              <span className="font-medium">Milvus</span>
              <Badge variant="outline">Apache License 2.0</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              <span className="font-medium">Elasticsearch</span>
              <Badge variant="outline">Elastic License 2.0</Badge>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              <span className="font-medium">etcd</span>
              <Badge variant="outline">Apache License 2.0</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              <span className="font-medium">MinIO</span>
              <Badge variant="outline">
                GNU Affero General Public License v3.0
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              <span className="font-medium">Python</span>
              <Badge variant="outline">
                Python Software Foundation License
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

