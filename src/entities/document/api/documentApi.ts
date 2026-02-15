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
import type { PageData } from "../model/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function fetchDocumentList(
  page: number,
  sortBy: string,
  query: string
): Promise<PageData> {
  const response = await fetch(
    `${API_BASE}/api/v1/document?q=${query}&page=${page}&size=10&sort_by=${sortBy}&name_sort_by=all&org_sort_by=all&data_type_sort_by=all&token_count_sort_by=all&status_sort_by=all`
  );
  return response.json();
}

export async function fetchDocumentDetail(slug: string) {
  const response = await fetch(
    `${API_BASE}/api/v1/document/std-docs/${slug}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export async function fetchSuccessRate() {
  const response = await fetch(
    `${API_BASE}/api/v1/document/success-rate`
  );
  return response.json();
}
