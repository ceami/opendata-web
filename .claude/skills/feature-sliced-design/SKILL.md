---
name: Feature-Sliced Design
description: Use when the user asks to "implement FSD", "use Feature-Sliced Design", "organize architecture", "structure project folders", "set up FSD layers", "create feature slices", "refactor to FSD", or mentions "feature slices", "layered architecture", "FSD methodology", "views layer", "entities layer", "shared layer", "Next.js with FSD". Provides comprehensive guidance for implementing Feature-Sliced Design (FSD v2.1) in Next.js applications. For monorepo (Turborepo) see SKILL-MONOREPO.md.
version: 0.3.0
---

# Feature-Sliced Design

## Purpose

Feature-Sliced Design (FSD) is an architectural methodology for organizing frontend applications into a standardized, scalable structure. It provides clear separation of concerns through a layered hierarchy that prevents circular dependencies and promotes maintainability.

**Why use FSD:**
- **Scalability**: Grows naturally as your application expands
- **Maintainability**: Clear boundaries make refactoring safer
- **Team collaboration**: Consistent structure enables parallel development
- **Onboarding**: New developers understand architecture quickly

**Unified `src/app/` structure:**
Both Next.js App Router and FSD App layer live in **`src/app/`**. Next.js recognizes `layout.tsx`, `page.tsx`, etc. inside `src/app/`, so all code stays under `src/` without a root-level `app/` folder, aligning with [FSD v2.1](https://feature-sliced.design/docs/reference/layers).

**Custom 'views' layer:**
This skill uses 'views' instead of the standard FSD 'pages' layer. Page business logic goes in `/src/views`; routing structure stays in `/src/app/`.

## When to Use

Apply Feature-Sliced Design when:
- Starting new Next.js projects that require clear architectural boundaries
- Refactoring growing codebases that lack consistent structure
- Working with multi-developer teams needing standardized organization
- Building applications with complex business logic requiring separation of concerns
- Developing monorepo applications (Turborepo, etc.) — see [MONOREPO.md](./MONOREPO.md)
- Scaling applications where circular dependencies become problematic
- Creating enterprise applications with long-term maintenance requirements

## Core Principles (FSD v2.1)

### Layer Hierarchy

FSD v2.1 organizes code into **7 layers** (from most to least responsibility/dependency):

1. **app** - App-wide matters (entrypoint, providers, global styles, router config)
2. **processes** - Deprecated; move contents to `features` and `app`
3. **views** - Page-level business logic (custom naming; standard FSD uses 'pages')
4. **widgets** - Large self-sufficient UI blocks
5. **features** - Main user interactions and business value
6. **entities** - Business domain objects and models
7. **shared** - Foundation (UI kit, API client, libs, config)

You don't have to use every layer — add only what brings value. Most projects use at least Shared, Pages (or views), and App.

**Import rule:** A module can only import from layers **strictly below** it.

```
┌─────────────────┐
│      app        │  ← Can import from all layers below
├─────────────────┤
│     views       │  ← Can import: widgets, features, entities, shared
├─────────────────┤
│    widgets      │  ← Can import: features, entities, shared
├─────────────────┤
│    features     │  ← Can import: entities, shared
├─────────────────┤
│    entities     │  ← Can import: shared only
├─────────────────┤
│     shared      │  ← Cannot import from any FSD layer
└─────────────────┘
```

This hierarchy prevents circular dependencies and ensures clear architectural boundaries.

### 'Views' vs 'Pages' Layer

**Why 'views' instead of 'pages':**
- Standard FSD uses 'pages'; 'views' clarifies page business logic
- `/src/app/` handles routing; `/src/views` handles page composition and logic

**Separation of concerns:**
- **`src/app/`**: Next.js routing + FSD App layer
  - `layout.tsx`, `page.tsx`, route groups, providers, styles
  - `page.tsx` imports from `@/views` and renders
- **`src/views/`**: Page business logic, component composition
  - View components, models, API calls
  - Composes widgets, features, entities

### Slices

**Slices** are domain-based partitions within layers (except app and shared, which have no slices — they consist of segments only; segments can import each other freely).

**Examples:**
- `views/dashboard` - Dashboard page slice
- `widgets/header` - Header widget slice
- `features/auth` - Authentication feature slice
- `entities/user` - User entity slice

**Public API pattern:**
Each slice exports through `index.ts` to control its public interface. Use explicit exports — avoid `export * from` (hurts discoverability and can expose internals).

```typescript
// src/features/auth/index.ts
export { LoginForm } from './ui/LoginForm';
export { useAuth } from './model/useAuth';
export type { AuthState } from './model/types';
// Internal implementation details NOT exported
```

Consumers import from the public API only; avoid deep imports like `@/features/auth/ui/LoginForm`.

### Segments

**Segments** are purpose-based groupings within slices (and directly in app/shared):

- **ui/** - React components, visual elements
- **model/** - Business logic, state management, TypeScript types
- **api/** - API clients, data fetching, external integrations
- **lib/** - One area of focus per library (e.g., dates, colors, text); document in README; avoid generic helpers dumps
- **config/** - Configuration constants, feature flags

**Shared layer segments** (FSD v2.1): `api`, `ui`, `lib`, `config`, `i18n`, `routes`

**Example structure:**
```
features/
└── auth/
    ├── ui/
    │   ├── LoginForm.tsx
    │   └── SignupForm.tsx
    ├── model/
    │   ├── useAuth.ts
    │   └── types.ts
    ├── api/
    │   └── authApi.ts
    └── index.ts
```

### Naming Conventions

**Core rule:** Use kebab-case for folders and slices; use camelCase for hooks, stores, and function collections.

| Target | Convention | Example |
|--------|------------|---------|
| Folders, slices | kebab-case | `user-profile/`, `theme-toggle/`, `notification-panel/` |
| Component files | kebab-case | `home-view.tsx`, `login-form.tsx`, `user-card.tsx` |
| Hook files | camelCase | `useAuth.ts`, `useDashboard.ts` |
| Store files | camelCase | `authStore.ts`, `asidebarStore.ts` |
| Function/API collections | camelCase | `userApi.ts`, `formatDate.ts`, `validation.ts` |
| lib segment single file | kebab-case or camelCase | `format.ts`, `validation.ts` (match main export) |

**Rationale**
- Hooks, stores, functions: Export names (`useAuth`, `authStore`) use camelCase, so matching file names makes search and inference easier
- Components: Using kebab-case keeps project style consistent with folder naming

## FSD with Next.js App Router

### Routing Architecture

Next.js recognizes routing files inside `src/app/`. All FSD layers live under `src/`; **no root-level `app/` folder**.

**File organization:**
```
my-nextjs-app/
├── src/
│   ├── app/                    # Next.js routing + FSD App layer
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home route
│   │   ├── dashboard/
│   │   │   └── page.tsx        # Dashboard route
│   │   ├── settings/
│   │   │   └── page.tsx        # Settings route
│   │   ├── providers/
│   │   ├── styles/
│   │   └── config/
│   │
│   └── views/                  # Page business logic
│       ├── home/
│       │   ├── ui/
│       │   │   └── HomeView.tsx
│       │   └── index.ts
│       ├── dashboard/
│       │   ├── ui/
│       │   │   └── DashboardView.tsx
│       │   ├── model/
│       │   │   └── useDashboard.ts
│       │   └── index.ts
│       └── settings/
│           ├── ui/
│           │   └── SettingsView.tsx
│           └── index.ts
```

**Routing pages import from views:**
```typescript
// src/app/dashboard/page.tsx - Routing
import { DashboardView } from '@/views/dashboard';

export default function DashboardPage() {
  return <DashboardView />;
}

// src/views/dashboard/ui/DashboardView.tsx - Business logic
import { Header } from '@/widgets/header';
import { StatsCard } from '@/features/analytics';

export function DashboardView() {
  return (
    <div>
      <Header />
      <StatsCard />
    </div>
  );
}
```

### Standalone Next.js Structure

All FSD layers and Next.js routing under `src/`:

```
my-nextjs-app/
├── src/
│   ├── app/                     # Next.js routing + FSD App layer
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home route
│   │   ├── (auth)/              # Route group
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── signup/
│   │   │       └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── api/                 # API routes
│   │   │   └── users/
│   │   │       └── route.ts
│   │   ├── not-found.tsx
│   │   ├── providers/
│   │   │   ├── AuthProvider.tsx
│   │   │   └── QueryProvider.tsx
│   │   ├── styles/
│   │   │   └── globals.css
│   │   └── config/
│   │       └── constants.ts
│   │
│   ├── views/
│   │   ├── home/
│   │   ├── dashboard/
│   │   ├── login/
│   │   └── signup/
│   │
│   ├── widgets/
│   │   ├── header/
│   │   ├── sidebar/
│   │   ├── footer/
│   │   └── notification-panel/
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── search/
│   │   ├── theme-toggle/
│   │   └── user-profile/
│   │
│   ├── entities/
│   │   ├── user/
│   │   ├── post/
│   │   ├── comment/
│   │   └── session/
│   │
│   └── shared/
│       ├── ui/
│       │   ├── button/
│       │   ├── input/
│       │   └── card/
│       ├── lib/
│       │   ├── format.ts
│       │   └── validation.ts
│       ├── api/
│       │   └── client.ts
│       └── config/
│           └── env.ts
│
├── public/
│   ├── images/
│   └── fonts/
│
└── package.json
```

**Monorepo (Turborepo):** See [SKILL-MONOREPO.md](./SKILL-MONOREPO.md)

## Layer Definitions (FSD v2.1)

### app Layer

**Purpose:** App-wide matters — technical (e.g., context providers) and business (e.g., analytics).

**Typical segments** (FSD v2.1): `entrypoint`, `styles`, `store`, `routes`. With Next.js, add `providers/` for global providers.

**Responsibilities:**
- Entrypoint and global providers (theme, auth, query client)
- Global styles and CSS
- Router configuration
- Global store config

**Import rules:** Can import from all layers below.

**No slices:** Contains segments directly.

**Example:**
```typescript
// src/app/providers/Providers.tsx
'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/shared/api/queryClient';
import { AuthProvider } from '@/features/auth';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}

// src/app/layout.tsx
import { Providers } from '@/app/providers/Providers';
import '@/app/styles/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### views Layer

**Purpose:** Pages (screens/activities) that make up the app. One page usually corresponds to one slice; similar pages (e.g., login/register) can share a slice.

**FSD v2.1:** No limit on code in a page slice as long as navigation stays easy. Unreused UI blocks can stay in the page slice. Page slices typically have `ui/` (UI, loading, error boundaries) and `api/` (data fetching). Dedicated data models are uncommon; small state can live in components.

**Responsibilities:**
- Compose widgets, features, and entities into complete pages
- Page-specific state management
- Data fetching for the page
- SEO metadata

**Import rules:** Can import from widgets, features, entities, shared.

**Has slices:** Each page gets its own slice (e.g., `views/dashboard`, `views/settings`).

**Example:**
```typescript
// src/views/dashboard/ui/DashboardView.tsx
import { Header } from '@/widgets/header';
import { Sidebar } from '@/widgets/sidebar';
import { StatsCard } from '@/features/analytics';
import { RecentActivity } from '@/features/activity';
import { User } from '@/entities/user';

interface DashboardViewProps {
  user: User;
}

export function DashboardView({ user }: DashboardViewProps) {
  return (
    <div className="dashboard">
      <Header user={user} />
      <div className="dashboard-content">
        <Sidebar />
        <main>
          <StatsCard userId={user.id} />
          <RecentActivity userId={user.id} />
        </main>
      </div>
    </div>
  );
}

// src/views/dashboard/index.ts
export { DashboardView } from './ui/DashboardView';

// src/app/dashboard/page.tsx
import { DashboardView } from '@/views/dashboard';
import { getCurrentUser } from '@/entities/user';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  return <DashboardView user={user} />;
}
```

### widgets Layer

**Purpose:** Large self-sufficient UI blocks. Most useful when reused across multiple pages or when a page has multiple large independent blocks.

**FSD v2.1:** If a block makes up most of a page's content and is never reused, place it directly in the page slice — do not make it a widget.

**Responsibilities:**
- Reusable across multiple pages
- Compose multiple features together
- Complex UI layouts (headers, sidebars, footers)
- Navigation components

**Import rules:** Can import from features, entities, shared.

**Has slices:** Each widget gets its own slice (e.g., `widgets/header`, `widgets/sidebar`).

**Tip (FSD v2.1):** With nested routing (Remix, Next.js App Router), you can use Widgets like Pages — full router blocks with data fetching, loading states, and error boundaries. Page layouts can live here too.

**Example:**
```typescript
// src/widgets/header/ui/Header.tsx
import { SearchBar } from '@/features/search';
import { UserMenu } from '@/features/user-menu';
import { NotificationBell } from '@/features/notifications';
import { User } from '@/entities/user';
import { Logo } from '@/shared/ui/logo';

interface HeaderProps {
  user: User;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="header">
      <Logo />
      <SearchBar />
      <div className="header-actions">
        <NotificationBell userId={user.id} />
        <UserMenu user={user} />
      </div>
    </header>
  );
}

// src/widgets/header/index.ts
export { Header } from './ui/Header';
```

### features Layer

**Purpose:** Main interactions users care about. Often involve entities.

**FSD v2.1 principle:** Not everything needs to be a feature. A good indicator: reused on several pages. If there are too many features, important ones get lost. Optimize for newcomers to quickly discover large important areas.

**Responsibilities:**
- Specific user actions (login, add to cart, like post)
- Feature-specific state management
- Business logic and validation
- API interactions for the feature

**Import rules:** Can import from entities, shared.

**Has slices:** Each feature gets its own slice (e.g., `features/auth`, `features/search`).

**Example:**
```typescript
// src/features/auth/model/types.ts
export interface LoginCredentials {
  email: string;
  password: string;
}

// src/features/auth/api/login.ts
import { User } from '@/entities/user';
import { apiClient } from '@/shared/api/client';
import type { LoginCredentials } from '../model/types';

export async function login(credentials: LoginCredentials): Promise<User> {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
}

// src/features/auth/ui/LoginForm.tsx
'use client';

import { useState } from 'react';
import { login } from '../api/login';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <Button type="submit">Login</Button>
    </form>
  );
}

// src/features/auth/index.ts
export { LoginForm } from './ui/LoginForm';
export { login } from './api/login';
export type { LoginCredentials } from './model/types';
```

### entities Layer

**Purpose:** Concepts from the real world the project works with — terms the business uses (User, Post, Group, etc.).

**Entity relationships (FSD v2.1):** Slices cannot know each other by default. When one entity's data contains another, use the `@x` cross-reference API: `entities/song/@x/artist.ts` exports types for `entities/artist` to import. See [Public API for cross-imports](https://feature-sliced.design/docs/reference/public-api#public-api-for-cross-imports). Keep cross-imports minimal; prefer higher layers (Features, Pages) for interaction logic.

**Responsibilities:**
- Data structures representing business concepts
- Entity-specific utilities
- Base API operations (CRUD)
- Type definitions

**Import rules:** Can import from shared only.

**Has slices:** Each entity gets its own slice (e.g., `entities/user`, `entities/post`).

**Example:**
```typescript
// src/entities/user/model/types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user';
}

// src/entities/user/api/getUser.ts
import { apiClient } from '@/shared/api/client';
import type { User } from '../model/types';

export async function getUser(id: string): Promise<User> {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
}

export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.get('/users/me');
  return response.data;
}

// src/entities/user/ui/UserCard.tsx
import type { User } from '../model/types';
import { Avatar } from '@/shared/ui/avatar';

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  return (
    <div className="user-card">
      <Avatar src={user.avatar} alt={user.name} />
      <div>
        <h3>{user.name}</h3>
        <p>{user.email}</p>
      </div>
    </div>
  );
}

// src/entities/user/index.ts
export { UserCard } from './ui/UserCard';
export { getUser, getCurrentUser } from './api/getUser';
export type { User } from './model/types';
```

**@x cross-reference example** (when entity A references entity B):
```typescript
// entities/artist/model/artist.ts
import type { Song } from "entities/song/@x/artist";

export interface Artist {
  name: string;
  songs: Array<Song>;
}

// entities/song/@x/artist.ts  — public API for entities/artist only
export type { Song } from "../model/song";
```

### shared Layer

**Purpose:** Foundation — connections to the external world (backends, third-party libs, env). Also highly contained internal libraries.

**Segments (FSD v2.1):** `api`, `ui`, `lib`, `config`, `i18n`, `routes`. Avoid names like `components`, `hooks`, `types` — use purpose-based names. `lib/` should NOT be a helpers dump; each library should have one focus (dates, colors, text, etc.) documented in a README.

**Responsibilities:**
- UI kit (button, input, card components)
- API client and request functions
- Internal libraries (one focus each)
- Environment variables, global config, feature flags
- i18n setup, route constants

**Import rules:** Cannot import from any FSD layer (only external packages).

**No slices:** Contains segments directly.

**Example:**
```typescript
// src/shared/ui/button/Button.tsx
import { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`button button--${variant} button--${size} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// src/shared/lib/format.ts
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US').format(date);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

// src/shared/api/client.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// src/shared/config/env.ts
export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL!,
  nodeEnv: process.env.NODE_ENV,
} as const;
```

## Workflow

### Step 1: Set Up Layer Directories

Create the FSD folder structure:

```bash
mkdir -p src/{app,views,widgets,features,entities,shared}
mkdir -p src/app/{providers,styles,config}
mkdir -p src/shared/{ui,lib,api,config}
```

### Step 2: Create First Entity

Start with entities (bottom layer). Define your core business models:

```typescript
// src/entities/user/model/types.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

// src/entities/user/api/getUser.ts
export async function getUser(id: string): Promise<User> {
  // API implementation
}

// src/entities/user/index.ts
export type { User } from './model/types';
export { getUser } from './api/getUser';
```

### Step 3: Build Features Using Entities

Create features that use entities:

```typescript
// src/features/user-profile/ui/UserProfile.tsx
import { User } from '@/entities/user'; // ✅ Feature imports entity

export function UserProfile({ user }: { user: User }) {
  return <div>{user.name}</div>;
}

// src/features/user-profile/index.ts
export { UserProfile } from './ui/UserProfile';
```

### Step 4: Compose Widgets from Features

Build composite widgets:

```typescript
// src/widgets/header/ui/Header.tsx
import { UserProfile } from '@/features/user-profile'; // ✅ Widget imports feature
import { SearchBar } from '@/features/search';

export function Header({ user }) {
  return (
    <header>
      <SearchBar />
      <UserProfile user={user} />
    </header>
  );
}
```

### Step 5: Assemble Views

Create page-level views:

```typescript
// src/views/dashboard/ui/DashboardView.tsx
import { Header } from '@/widgets/header'; // ✅ View imports widget

export function DashboardView() {
  return (
    <div>
      <Header />
      {/* More content */}
    </div>
  );
}

// src/views/dashboard/index.ts
export { DashboardView } from './ui/DashboardView';
```

### Step 6: Connect to App Router

Wire views to Next.js routing:

```typescript
// src/app/dashboard/page.tsx
import { DashboardView } from '@/views/dashboard';

export default function DashboardPage() {
  return <DashboardView />;
}
```

## Import Rules and Dependencies

### Allowed Import Patterns

```typescript
// ✅ Layer importing from layer below
import { User } from '@/entities/user';          // Feature → Entity
import { LoginForm } from '@/features/auth';     // Widget → Feature
import { Header } from '@/widgets/header';       // View → Widget

// ✅ Any layer importing from shared
import { Button } from '@/shared/ui/button';
import { formatDate } from '@/shared/lib/format';

// ✅ Slice importing from different slice in lower layer
import { User } from '@/entities/user';          // features/auth → entities/user
import { Post } from '@/entities/post';          // features/like → entities/post
```

### Forbidden Import Patterns

```typescript
// ❌ Layer importing from same or higher layer
import { DashboardView } from '@/views/dashboard';  // Feature → View (upward)
import { Header } from '@/widgets/header';          // Feature → Widget (upward)
import { LoginForm } from '@/features/login';       // features/auth → features/login (same layer)

// ❌ Cross-slice imports within same layer
import { SearchBar } from '@/features/search';      // features/auth → features/search

// ❌ Shared importing from FSD layers
import { User } from '@/entities/user';             // shared/lib → entities/user
```

### Valid vs Invalid Examples

**Invalid (cross-feature import):**
```typescript
// ❌ src/features/search/ui/SearchBar.tsx
import { LoginForm } from '@/features/auth'; // Same layer import
```

**Valid (extract to widget):**
```typescript
// ✅ src/widgets/navbar/ui/Navbar.tsx
import { SearchBar } from '@/features/search';
import { LoginForm } from '@/features/auth';

export function Navbar() {
  return (
    <nav>
      <SearchBar />
      <LoginForm />
    </nav>
  );
}
```

### Fixing Circular Dependencies

**Problem:**
```typescript
// features/auth imports features/user-settings
// features/user-settings imports features/auth
// ❌ Circular dependency
```

**Solution 1: Extract to entity**
```typescript
// Move shared logic to entities/user
// Both features import from entities/user
// ✅ No circular dependency
```

**Solution 2: Extract to widget**
```typescript
// Create widgets/user-panel that imports both features
// ✅ Widget layer can import from features
```

### Public API Enforcement

Always use `index.ts` to control exports:

```typescript
// src/features/auth/index.ts
export { LoginForm } from './ui/LoginForm';
export { useAuth } from './model/useAuth';
export type { AuthState } from './model/types';

// ❌ Do NOT export internal helpers
// export { validatePassword } from './lib/validation'; // Keep internal
```

Import from public API only:

```typescript
// ✅ Correct
import { LoginForm } from '@/features/auth';

// ❌ Wrong (deep import)
import { LoginForm } from '@/features/auth/ui/LoginForm';
```

## Segment Patterns

### ui/ Segment

**Purpose:** React components and visual elements.

**When to use:**
- Any React component
- UI composition
- Visual presentation

**Example:**
```typescript
// src/entities/user/ui/UserCard.tsx
import type { User } from '../model/types';

export function UserCard({ user }: { user: User }) {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}
```

### model/ Segment

**Purpose:** Business logic, state management, and type definitions.

**When to use:**
- TypeScript interfaces and types
- React hooks for state
- Business logic functions
- Data transformations

**Example:**
```typescript
// src/features/auth/model/useAuth.ts
'use client';

import { create } from 'zustand';
import type { User } from '@/entities/user';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
```

### api/ Segment

**Purpose:** API clients, data fetching, and external integrations.

**When to use:**
- HTTP requests
- WebSocket connections
- Third-party API integrations
- Server actions (Next.js)

**Example:**
```typescript
// src/entities/user/api/userApi.ts
'use server';

import { apiClient } from '@/shared/api/client';
import type { User } from '../model/types';

export async function fetchUsers(): Promise<User[]> {
  const response = await apiClient.get('/users');
  return response.data;
}

export async function createUser(data: Omit<User, 'id'>): Promise<User> {
  const response = await apiClient.post('/users', data);
  return response.data;
}
```

### lib/ Segment

**Purpose:** Utility functions and helpers specific to the slice.

**When to use:**
- Slice-specific utilities
- Validation functions
- Data transformation helpers

**Example:**
```typescript
// src/features/auth/lib/validation.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export function validateLogin(data: unknown) {
  return loginSchema.parse(data);
}
```

### config/ Segment

**Purpose:** Configuration constants and feature flags.

**When to use:**
- Feature-specific constants
- Configuration objects
- Feature flags

**Example:**
```typescript
// src/app/config/theme.ts
export const theme = {
  colors: {
    primary: '#0070f3',
    secondary: '#ff4081',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
  },
} as const;
```

## Migration Strategy

### Migrating Existing Next.js App to FSD

**Bottom-up approach** (recommended):

1. **Start with shared layer**
   - Extract common UI components to `shared/ui/`
   - Move utilities to `shared/lib/`
   - Configure API client in `shared/api/`

2. **Define entities**
   - Identify business domain objects (User, Post, Comment)
   - Create entity types in `entities/{name}/model/`
   - Move CRUD operations to `entities/{name}/api/`

3. **Extract features**
   - Identify user interactions (login, search, like)
   - Create feature slices in `features/{name}/`
   - Use entities within features

4. **Build widgets**
   - Identify composite UI blocks (Header, Sidebar)
   - Create widget slices in `widgets/{name}/`
   - Compose features within widgets

5. **Organize views**
   - Move page business logic from page files to `src/views`
   - Keep only routing (`page.tsx`, `layout.tsx`) in `src/app/`; `page.tsx` imports from views
   - Compose widgets in views

6. **Configure app layer**
   - Set up FSD App layer under `src/app/` (providers, styles, config)
   - If you have a root `app/`, move it into `src/app/`

### Handling Existing Code

**Incremental migration:**
- Migrate one page at a time
- Start with least complex pages
- Use both old and new structure during transition
- Update imports as you migrate

**Testing throughout:**
- Run tests after each layer migration
- Ensure no functionality breaks
- Verify import paths are correct

## Best Practices

**Keep slices isolated:**
- No cross-slice imports within the same layer
- Each slice should be independent
- Extract shared logic to lower layers

**Use Public API pattern:**
- Always export through `index.ts`
- Prevents deep imports
- Makes refactoring easier

**Colocate tests:**
```
features/
└── auth/
    ├── ui/
    │   ├── LoginForm.tsx
    │   └── LoginForm.test.tsx  # Test next to implementation
    └── index.ts
```

**Avoid "god slices":**
- Keep slices focused on single responsibility
- Split large slices into multiple smaller ones
- Extract common logic to shared layer

**Name by domain, not tech:**
- ✅ `features/product-search`
- ❌ `features/search-bar-component`

**Use TypeScript strict mode:**
```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

**Document architecture decisions:**
- Keep ADR (Architecture Decision Records)
- Document why certain slices exist
- Explain layer boundary decisions

## Common Patterns

### Shared UI Components

```typescript
// src/shared/ui/button/Button.tsx
export function Button({ children, ...props }) {
  return <button {...props}>{children}</button>;
}

// Usage in feature
import { Button } from '@/shared/ui/button';
```

### API Client Setup

```typescript
// src/shared/api/client.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Usage in entity
import { apiClient } from '@/shared/api/client';
```

### Form Handling with Features

```typescript
// src/features/product-form/ui/ProductForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema } from '../lib/validation';
import { createProduct } from '../api/createProduct';

export function ProductForm() {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(productSchema),
  });

  return <form onSubmit={handleSubmit(createProduct)}>...</form>;
}
```

### Authentication Integration

```typescript
// src/features/auth/model/useAuth.ts
export const useAuth = create<AuthState>((set) => ({...}));

// src/widgets/header/ui/Header.tsx
import { useAuth } from '@/features/auth';

export function Header() {
  const { user } = useAuth();
  return <header>Welcome, {user?.name}</header>;
}
```

### Data Fetching with Server Components

```typescript
// src/app/dashboard/page.tsx
import { DashboardView } from '@/views/dashboard';
import { getUser } from '@/entities/user';

export default async function DashboardPage() {
  const user = await getUser('current');
  return <DashboardView user={user} />;
}

// src/views/dashboard/ui/DashboardView.tsx
import type { User } from '@/entities/user';

export function DashboardView({ user }: { user: User }) {
  return <div>Welcome, {user.name}</div>;
}
```

## Troubleshooting

### Circular Dependencies

**Problem:** Two slices import from each other.

**Solution:**
1. Extract shared logic to a lower layer (usually entities or shared)
2. Create a higher layer (widget) that imports both
3. Review if one slice should actually be split into multiple slices

### Import Path Issues

**Problem:** TypeScript cannot resolve `@/` imports.

**Solution:** Configure path aliases in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/app/*": ["src/app/*"],
      "@/views/*": ["src/views/*"],
      "@/widgets/*": ["src/widgets/*"],
      "@/features/*": ["src/features/*"],
      "@/entities/*": ["src/entities/*"],
      "@/shared/*": ["src/shared/*"]
    }
  }
}
```

### Build Errors

**Problem:** Next.js cannot find modules after restructuring.

**Solution:**
1. Clear `.next` directory: `rm -rf .next`
2. Reinstall dependencies: `npm install`
3. Restart dev server: `npm run dev`

## Configuration

### TypeScript Path Aliases

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/app/*": ["src/app/*"],
      "@/views/*": ["src/views/*"],
      "@/widgets/*": ["src/widgets/*"],
      "@/features/*": ["src/features/*"],
      "@/entities/*": ["src/entities/*"],
      "@/shared/*": ["src/shared/*"]
    }
  },
  "include": ["src"]
}
```

### ESLint Import Rules (Optional)

```javascript
// .eslintrc.js
module.exports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@/views/*', '@/widgets/*'],
            message: 'Features cannot import from views or widgets',
          },
        ],
      },
    ],
  },
};
```

## References

- [Official FSD Documentation](https://feature-sliced.design/) - Complete methodology guide
- [FSD Layers Reference (v2.1)](https://feature-sliced.design/docs/reference/layers)
- [FSD Public API](https://feature-sliced.design/docs/reference/public-api) - Public API and @x cross-imports
- [FSD with Next.js Guide](https://feature-sliced.design/docs/guides/tech/with-nextjs) - Next.js integration patterns
- [FSD GitHub Repository](https://github.com/feature-sliced/documentation) - Source documentation
- [FSD Tutorial](https://feature-sliced.design/docs/get-started/tutorial) - Step-by-step implementation guide
- [FSD Examples](https://github.com/feature-sliced/examples) - Real-world applications using FSD
- [SKILL-MONOREPO.md](./SKILL-MONOREPO.md) - Turborepo/Monorepo + FSD structure
