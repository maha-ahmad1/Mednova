# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

No test framework is configured in this project.

## Tech Stack

- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript 5 (strict)
- **Styling**: Tailwind CSS v4 + shadcn/ui (New York style) + `cn()` from `@/lib/utils`
- **State**: Zustand (client state) + TanStack React Query v5 (server state) + NextAuth.js v4 (auth/session)
- **HTTP**: Axios with a custom instance at `@/lib/axios/axiosInstance.tsx` that auto-injects Bearer tokens
- **Forms**: React Hook Form + Zod + `@hookform/resolvers`
- **i18n**: next-intl v4 — locales: `ar` (default, RTL) and `en` (LTR)
- **Real-time**: Laravel Echo + Pusher.js for WebSocket events
- **Error tracking**: Sentry; toasts via Sonner
- **Icons**: Lucide React

## Architecture

### Routing & Locale

All user-facing routes live under `src/app/[locale]/`. The middleware (`src/middleware.ts`) handles:
- Injecting the locale prefix (always present: `/ar/...` or `/en/...`)
- Auth guards — public routes, profile-completion checks, and admin-only paths (`/control-panel/...`)
- Role-based redirects based on `approval_status` and token type from the NextAuth session

The `[locale]` layout wraps pages with `NextIntlClientProvider` and sets `dir="rtl"` or `dir="ltr"`.

### Feature-Based Structure

Business logic lives in `src/features/<feature>/`:
```
src/features/auth/
├── api/authApi.tsx        # Axios calls
└── ui/                    # Components for this feature
```
Shared/reusable UI goes in `src/shared/ui/`, base shadcn components in `src/components/ui/`.

### Data Fetching Pattern

1. **API functions** defined in `src/features/*/api/` using the axios instance
2. **`useFetcher`** (`src/hooks/useFetcher.ts`) — generic React Query `useQuery` wrapper (5-minute stale time)
3. **Mutations** use `useMutation` directly from React Query with error handling via `src/lib/handleFormErrors.ts`

Backend base URL: `https://api.mednovacare.com/api` (configured via `NEXT_PUBLIC_API_URL`)

### State Layers

| Layer | Tool | Location |
|---|---|---|
| Auth / session | NextAuth (`useSession`) | `src/lib/auth.ts` |
| Client UI state | Zustand stores | `src/store/` |
| Server / async data | React Query | via `useFetcher` or `useMutation` |
| Real-time events | Laravel Echo + Pusher | `src/services/echo/`, `src/hooks/useEchoNotifications.ts` |

### Form Error Handling

Backend returns 422 with field-level errors. Use `src/lib/handleFormErrors.ts` to map them to `react-hook-form`'s `setError()`. General errors go to a toast via Sonner.

## Coding Conventions

### Components

- Server components by default; add `"use client"` only when needed
- i18n: always `const t = useTranslations()` — never hardcode strings
- RTL awareness: check `useLocale()` for conditional classnames or `dir` props
- `cn()` from `@/lib/utils` for conditional classnames (wraps `clsx` + `tailwind-merge`)

### File & Folder Naming

- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Stores: `useCamelCaseStore.ts` or `CamelCaseStore.ts`
- Utilities/services: `kebab-case.ts`

### TypeScript

- Strict mode is on — no implicit `any`
- Types live in `src/types/`; NextAuth types are augmented in `src/types/next-auth.d.ts`
- Prefer Zod schemas for runtime validation; infer types from schemas

### Path Aliases

Use `@/` for all internal imports (maps to `src/`). Example: `import { cn } from "@/lib/utils"`.

### Zustand Stores

```ts
export const useStore = create<State>((set) => ({
  data: null,
  setData: (data) => set({ data }),
}));
```

### Adding a New Feature

1. Create `src/features/<feature>/api/<feature>Api.ts` for API calls
2. Create `src/features/<feature>/ui/` for components
3. Add route under `src/app/[locale]/<route>/`
4. Add i18n keys to both `src/messages/en.json` and `src/messages/ar.json`
5. Register protected/public status in `src/middleware.ts` if needed

## Environment Variables

| Variable | Purpose |
|---|---|
| `NEXTAUTH_SECRET` | JWT signing key |
| `NEXTAUTH_URL` | Auth callback URL |
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
| `NEXT_PUBLIC_PUSHER_APP_KEY` | Pusher WebSocket key |
| `NEXT_PUBLIC_PUSHER_APP_CLUSTER` | Pusher cluster (eu) |
