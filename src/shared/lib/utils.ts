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
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function preventRapidClicks<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn | Promise<TReturn>,
  cooldownMs = 600
) {
  let isCooling = false;

  return (...args: TArgs): (TReturn | Promise<TReturn>) | undefined => {
    if (isCooling) return undefined as unknown as TReturn | Promise<TReturn>;
    isCooling = true;

    try {
      const result = fn(...args);

      if (result instanceof Promise) {
        return result.finally(() => {
          isCooling = false;
        });
      }

      setTimeout(() => {
        isCooling = false;
      }, cooldownMs);

      return result;
    } catch (error) {
      isCooling = false;
      throw error;
    }
  };
}
