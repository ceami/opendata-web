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
import fs from "fs";
import path from "path";
import { LicensesView } from "@/views/licenses";
import type {
  FrontendLicenses,
  BackendLicenses,
  LicenseReportPackage,
  LicenseInfo,
} from "@/entities/license";

function convertLicenseReportToLicenseInfo(
  packages: LicenseReportPackage[]
): LicenseInfo[] {
  return packages.map((pkg) => ({
    name: pkg.name,
    version: pkg.installedVersion,
    type: "npm" as const,
    homepage: pkg.link.startsWith("git+")
      ? pkg.link.replace("git+", "").replace(".git", "")
      : pkg.link,
    author: pkg.author !== "n/a" ? pkg.author : undefined,
    license: pkg.licenseType !== "n/a" ? pkg.licenseType : undefined,
    repository: pkg.link.startsWith("git+")
      ? pkg.link.replace("git+", "").replace(".git", "")
      : undefined,
  }));
}

async function getLicensesData(): Promise<{
  frontendLicenses?: FrontendLicenses;
  backendLicenses?: BackendLicenses;
}> {
  try {
    const publicDir = path.join(process.cwd(), "public");

    let frontendLicenses: FrontendLicenses | undefined;
    const frontendPath = path.join(publicDir, "licenses.json");
    if (fs.existsSync(frontendPath)) {
      const frontendData = fs.readFileSync(frontendPath, "utf8");
      const rawPackages: LicenseReportPackage[] = JSON.parse(frontendData);
      frontendLicenses = {
        generated_at: new Date().toISOString(),
        packages: convertLicenseReportToLicenseInfo(rawPackages),
      };
    }

    let backendLicenses: BackendLicenses | undefined;
    const backendPath = path.join(publicDir, "backend_licenses.json");
    if (fs.existsSync(backendPath)) {
      const backendData = fs.readFileSync(backendPath, "utf8");
      backendLicenses = JSON.parse(backendData);
    }

    return { frontendLicenses, backendLicenses };
  } catch (error) {
    console.error("라이선스 데이터 로드 실패:", error);
    return {};
  }
}

export default async function LicensesPage() {
  const { frontendLicenses, backendLicenses } = await getLicensesData();

  return (
    <div className="w-full h-full my-20 max-w-[var(--content-max-width)] mx-auto space-y-10">
      <LicensesView
        frontendLicenses={frontendLicenses}
        backendLicenses={backendLicenses}
      />
    </div>
  );
}

export const metadata = {
  title: "라이선스 정보 | Open Data MCP Web",
  description:
    "이 프로젝트에서 사용된 모든 오픈소스 라이브러리의 라이선스 정보를 확인하세요.",
};
