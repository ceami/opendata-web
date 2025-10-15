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
export interface LicenseInfo {
  name: string;
  version: string;
  type: "npm" | "python";
  homepage?: string;
  author?: string;
  license?: string;
  repository?: string;
  description?: string;
}

export interface LicenseReportPackage {
  department: string;
  relatedTo: string;
  name: string;
  licensePeriod: string;
  material: string;
  licenseType: string;
  link: string;
  remoteVersion: string;
  installedVersion: string;
  definedVersion: string;
  author: string;
}

export interface FrontendLicenses {
  generated_at: string;
  packages: LicenseInfo[];
}

export interface BackendLicenses {
  generated_at: string;
  packages: LicenseInfo[];
}
