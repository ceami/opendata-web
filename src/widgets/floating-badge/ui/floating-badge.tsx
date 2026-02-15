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

import Image from "next/image";

export function FloatingBadge() {
  return (
    <div className="fixed bottom-10 right-10 z-50">
      <Image
        src="/badge.png"
        alt="badge"
        width={200}
        height={200}
        className="object-contain w-[200px]"
      />
    </div>
  );
}
