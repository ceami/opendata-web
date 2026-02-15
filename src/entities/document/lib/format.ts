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

export function linClamp(text: string, maxCount: number): string {
  if (text?.length > maxCount) {
    return text.slice(0, maxCount) + "...";
  }
  return text;
}

export function humanizeKo(
  dateInput: string | Date,
  nowInput: Date = new Date()
): string {
  if (!dateInput) return "-";
  const dt = dateInput instanceof Date ? dateInput : new Date(dateInput);
  const now = nowInput instanceof Date ? nowInput : new Date(nowInput);

  let seconds = Math.floor((now.getTime() - dt.getTime()) / 1000);

  if (seconds < 0) {
    seconds = -seconds;
    if (seconds < 60) return "곧";
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}분 후`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}시간 후`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}일 후`;
    if (days < 365) return `${Math.floor(days / 7)}주 후`;
    return `${Math.floor(days / 365)}년 후`;
  }

  if (seconds < 60) return "방금 전";
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}일 전`;
  if (days < 365) return `${Math.floor(days / 7)}주 전`;
  return `${Math.floor(days / 365)}년 전`;
}

export function countToken(tokenCount: number): string {
  if (tokenCount < 1000) {
    return tokenCount.toLocaleString();
  } else if (tokenCount < 1000000) {
    return (tokenCount / 1000).toFixed(1) + "K";
  } else {
    return (tokenCount / 1000000).toFixed(1) + "M";
  }
}
