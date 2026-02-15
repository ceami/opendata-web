# FSD with Turborepo Monorepo

Guide for applying Feature-Sliced Design in a monorepo environment.  
See [SKILL.md](./SKILL.md) for core FSD concepts.

## Structure Principles

- Each app (`web`, `admin`, etc.) has an **independent FSD structure**
- No cross-app imports from FSD layers
- Shared code lives in `packages/` with `workspace:*` dependency management
- Each app unifies Next.js routing and FSD App layer in `src/app/`

## Turborepo + FSD Directory Structure

```
turborepo-root/
├── apps/
│   ├── web/                           # Consumer-facing app
│   │   ├── src/
│   │   │   ├── app/                   # Next.js routing + FSD App layer
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── shop/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── providers/
│   │   │   │   ├── styles/
│   │   │   │   └── ...
│   │   │   ├── views/
│   │   │   │   ├── home/
│   │   │   │   └── shop/
│   │   │   ├── widgets/
│   │   │   │   ├── product-grid/
│   │   │   │   └── shopping-cart/
│   │   │   ├── features/
│   │   │   │   ├── add-to-cart/
│   │   │   │   └── checkout/
│   │   │   ├── entities/
│   │   │   │   ├── product/
│   │   │   │   └── order/
│   │   │   └── shared/
│   │   └── package.json
│   │
│   └── admin/                         # Admin dashboard app
│       ├── src/
│       │   ├── app/
│       │   │   ├── layout.tsx
│       │   │   ├── page.tsx
│       │   │   ├── products/
│       │   │   │   └── page.tsx
│       │   │   ├── providers/
│       │   │   └── styles/
│       │   ├── views/
│       │   │   ├── dashboard/
│       │   │   └── products/
│       │   ├── widgets/
│       │   │   ├── admin-header/
│       │   │   └── stats-panel/
│       │   ├── features/
│       │   │   ├── product-editor/
│       │   │   └── user-management/
│       │   ├── entities/
│       │   │   ├── product/
│       │   │   └── admin/
│       │   └── shared/
│       └── package.json
│
├── packages/                          # Optional shared packages
│   ├── ui/                            # Shared UI (similar to shared/ui)
│   │   ├── button/
│   │   └── input/
│   ├── utils/
│   │   └── validation.ts
│   └── types/
│       └── common.ts
│
├── turbo.json
└── package.json
```

## Key Principles

1. **App independence**: Each app (`web`, `admin`) has its own FSD structure and does not import from other apps' FSD layers
2. **`packages/` usage**: Shared code goes in `packages/`; apps depend on it via `workspace:*` protocol
3. **`src/app/` unification**: Next.js App Router and FSD App layer live in `src/app/` (no root-level `app/`)

## References

- [Frontend Monorepo Architecture](https://feature-sliced.design/blog/frontend-monorepo-explained) - Official FSD monorepo guide
- [Turborepo Documentation](https://turbo.build/repo/docs) - Turborepo docs
