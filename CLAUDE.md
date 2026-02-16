# CLAUDE.md

이 프로젝트는 공공데이터포털()의 API 또는 데이터셋 문서를 파싱하여 LLM이 이해하기 쉬운 형태로 변환해서 사용자가 쉽게 사용할 수 있는 MCP(model context protocol) 웹 페이지 입니다. 

---

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Use `bun` as the package manager (configured via `mise.toml`).

```bash
bun dev        # Start dev server
bun run build  # Production build
bun run lint   # ESLint
```

### Design patterns

Components use **Compound Component** and **Headless Component** patterns.

- **Compound Component**: Parent shares state/logic via Context; children can be composed flexibly (e.g. Tabs, Accordion).
- **Headless Component**: Provides only logic (hooks, components); UI is defined by the caller. May combine both (e.g. Radix Primitives + Compound + styles).

For details: `vercel-composition-patterns` skill (avoid boolean props, use children over render props).
For project structure and layers: `feature-sliced-design` skill.

### UI components

- `tailwind css v4` and `shadcn` in `@/shared/ui/` 

### Architecture (Feature-Sliced Design)

프로젝트는 FSD v2.1 아키텍처를 따릅니다.

```
src/
├── app/        # Next.js 라우팅 + 앱 전역 (layout, providers, styles)
├── views/      # 페이지별 비즈니스 로직 (HomeView, DocumentDetailView 등)
├── widgets/    # 재사용 가능한 큰 UI 블록 (Header, Footer, DocumentList 등)
├── features/   # 사용자 인터랙션 기능 (contact, document-list, document-request)
├── entities/   # 도메인 엔티티 (document, license)
└── shared/     # UI Kit, lib, config (shared만 FSD 레이어 import 불가)
```

### Path aliases

- With FSD: `@/app`, `@/views`, `@/widgets`, `@/features`, `@/entities`, `@/shared` (see feature-sliced-design skill)

### Adding shadcn components

```bash
bunx shadcn add <component>
```
