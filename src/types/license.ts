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
