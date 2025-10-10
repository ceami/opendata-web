// app/(routes)/[your-page]/GiscusComments.tsx
"use client";

import Giscus from "@giscus/react";

export default function GiscusComments() {
  return (
    <Giscus
      id="giscus-comments"
      repo="ceami/opendata-web" // 본인 repo "owner/name"
      repoId="R_kgDOPb0Zug" // giscus.app에서 받은 값
      category="Q&A" // 카테고리 이름
      categoryId="DIC_kwDOPb0Zus4Cwa2v" // giscus.app에서 받은 값
      mapping="pathname" // 글 매핑 방식: 'pathname'이 가장 간단
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme="light" // 라이트/다크 자동
      lang="ko"
      loading="lazy"
    />
  );
}
