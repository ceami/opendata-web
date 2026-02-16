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

export function RequestGuide() {
  return (
    <div className="">
      <h2 className="text-base md:text-lg font-semibold mb-4 text-foreground">
        OpenData MCP 데이터 요청 가이드라인
      </h2>

      <div className="space-y-8 text-foreground">
        <section className="">
          <h3 className="text-base md:text-lg">1. 데이터 요청 유형</h3>
          <ol className="ml-1 space-y-3 text-sm md:text-base">
            <li>
              <p className="">(1) 기존 데이터 요청</p>
              <ul className="list-disc ml-4 md:ml-7 text-muted-foreground">
                <li>
                  공공데이터포털에 등록된 데이터셋 중 검색을 통해 확인 가능한
                  경우
                </li>
              </ul>
            </li>
            <li>
              <p className="">(2) 신규 데이터 요청</p>
              <ul className="list-disc ml-4 md:ml-7 text-muted-foreground">
                <li>검색 시 해당 데이터셋이 존재하지 않는 경우</li>
                <li>
                  공공데이터포털에 존재하지만, 본 사이트에 등록되지 않은
                  데이터의 신규 개방 요청
                </li>
              </ul>
            </li>
          </ol>
        </section>

        <section>
          <h3 className="text-base md:text-lg">2. 데이터 요청 우선순위</h3>
          <ol className="ml-1 space-y-4 text-sm md:text-base">
            <li>
              <p className="">(1) 공공데이터포털(data.go.kr)</p>
              <ul className="list-disc ml-4 md:ml-7 text-muted-foreground">
                <li>
                  국가 및 지방자치단체, 공공기관이 제공하는 공식 오픈 데이터
                </li>
                <li>최우선 처리 대상</li>
              </ul>
            </li>
            <li>
              <p className="">(2) 공공데이터포털 연계 사이트</p>
              <ul className="list-disc ml-4 md:ml-7 text-muted-foreground">
                <li>
                  공공데이터포털 API 또는 데이터셋 연계를 통해 자료를 제공하는
                  기관 웹사이트
                </li>
                <li>
                  공공데이터포털을 통해 접근 가능하거나 포털 메타데이터에서
                  출처로 확인되는 경우 포함
                </li>
              </ul>
            </li>
            <li>
              <p className="">(3) 외부 사이트</p>
              <ul className="list-disc ml-4 md:ml-7 text-muted-foreground">
                <li>
                  공공데이터포털과 직접 연계되지 않은 민간/기관 웹사이트 (예: AI
                  Hub, KOSIS 등)
                </li>
                <li>
                  현재 기능 준비 중으로 추후 지원 예정이며, 공지사항을 통해 안내
                </li>
              </ul>
            </li>
          </ol>
        </section>

        <section>
          <h3 className="text-base md:text-lg">3. 검토 및 처리</h3>
          <ul className="list-disc ml-4 md:ml-7 text-muted-foreground text-sm md:text-base">
            <li>우선순위에 따라 담당 부서에서 검토 후 처리 결과 안내</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
