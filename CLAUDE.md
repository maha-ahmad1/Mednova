# CLAUDE.md

Mednova: bilingual (Arabic default/RTL, English/LTR) healthcare platform. Patients book remote consultations with service providers, enrol in programs (courses), and submit home-care requests. Next.js 15 App Router, next-intl, NextAuth, React Query, Zustand.

@DESIGN.md

## Workflow

- After every change run `npx tsc --noEmit` and `npm run lint`. Do not introduce new errors. There are no tests.
- For UI changes, check the result in both `/ar` and `/en`.
- When you fix an issue listed here as a known gap, remove it from this file in the same PR.
- The backend is Laravel and owned by another teammate. Never invent endpoints, params or response shapes. If you don't know one, ask.
- Ask before editing: `src/middleware.ts`, `src/lib/auth.ts`, `src/types/next-auth.d.ts`, `src/lib/echo.ts`, `next.config.ts`, `src/instrumentation-client.ts`, `src/instrumentation.ts`, `sentry.*.config.ts`, any `.env*` file, `package.json`. Ask before installing packages.
- Never print, log or commit secrets.
- Naming for new files: stores `useXStore.ts`, utils camelCase (`dateUtils.ts`). Never rename existing files to match these rules.
- Use `/add-api-hook` for a new API call and `/add-form` for a new form.

## Git

- Create feature branches from `Staging`. Open PRs against `Staging`.
- Branch names: `type/short-description` (e.g. `fix/payment-redirect`).
- `main` is updated only by release PRs from `Staging`. Never push or open a PR directly to `main`.
- Commit format: `type(scope): message`. English, lowercase. Scope is the feature folder name. The type must match the change (`fix` for fixes, never `test`).

## Privacy

- Never put personal or patient data (emails, phones, names, medical info, tokens) in console output or in anything that can reach Sentry: `Sentry.*`, thrown error messages, raw axios errors.
- New code uses `logger` from `@/utils/logger` (dev-only console, never reaches Sentry). Add no new `console.*`. Existing code that logs emails (e.g. `OtpInputs.tsx`) is not a pattern to copy.
- Known issue (tracked as a bug): Sentry runs with `sendDefaultPii: true` and Replay masking is not explicit. Do not treat this as the intended config.

## API conventions

- New API files: `src/features/<feature>/api/<name>.api.ts`. Files without JSX use `.ts`, not `.tsx`.
- Pass the `AxiosInstance` from `useAxiosInstance()` into API functions. The only exception is `src/features/auth/api/authApi.tsx`, which has its own instance.
- Envelope: `{ success: boolean, message?: string, data: T }`.
- Query params go in `{ params }`. `FormData` bodies need `{ headers: { "Content-Type": "multipart/form-data" } }`.
- Mutations handle errors with `axios.isAxiosError()` and `handleBackendFormError` (`src/lib/backendFormErrors.ts`) for 422 field errors. General errors go to a Sonner toast.
- Real-time: Echo client in `src/lib/echo.ts`, event subscribers in `src/services/echo/`, hook `src/hooks/useEchoNotifications.ts`.

## Common pitfalls

- **Base URL has no `/api`.** `axiosInstance` uses `NEXT_PUBLIC_API_URL` as-is, so every feature path starts with `/api/...`. `authApi.tsx` appends `/api` itself, so do not prefix its paths.
- **`useFetcher` vs raw axios.** `useFetcher` returns the inner `response.data.data` (as `T | null`). Calling an API function directly returns the full envelope. Never mix the two.
- **`useFetcher` options.** `staleTime` is in minutes (default 5). It waits for an authenticated session unless `requiresAuth: false`. A `null` endpoint disables the query.
- **`useAxiosInstance()` is a client-only hook.** The instance is memoized on `[token, locale]` and sends `Accept-Language`. On a 401 it retries once with the refreshed session, then signs out. Video-stream 401s are exempt.
- **Navigation.** `Link`, `useRouter`, `usePathname` and `redirect` come from `@/i18n/navigation` (`localePrefix: "always"` drops the locale prefix otherwise). `useSearchParams`, `useParams` and `notFound` stay on `next/navigation`. When editing a file, switch only the first group. Never blind-replace the whole import.
- **`"use client"`.** Required for `useSession`, `useRouter`, `useAxiosInstance` and Zustand stores. Not required for `useTranslations`, which also works in server components. Use `getTranslations` in async server components.
- **`dir` and `lang`.** `dir` is set on a wrapper `<div>` in `src/app/[locale]/layout.tsx`, not on `<html>`. `<html>` in `src/app/layout.tsx` has no `lang`.
- **RTL.** New code uses logical utilities only: `ms-`/`me-`/`ps-`/`pe-`/`start-`/`end-`/`text-start`/`text-end`. Use `rtl:` variants only when no logical equivalent exists (e.g. flipping directional icons). Do not refactor existing physical classes (`ml-`, `mr-`, `left-`, `right-`) unless you are already editing that line.
- **Translations.** Every new UI string goes in both `src/messages/en.json` and `src/messages/ar.json`. No hardcoded text.
- **Checkout redirects.** Every external checkout redirect must go through `isAllowedCheckoutUrl` (`src/features/programs/utils/checkoutUrl.ts`). Known gap: `src/features/payment/pages/PaymentPageView.tsx` redirects without it.
- **`reviewee_type`.** The API currently returns a class name (e.g. `App\Models\Customer`). The backend is changing it to `customer` | `program`. Do not branch on the raw current value. Target `customer` | `program`. `platform` is NOT a valid `reviewee_type`; the backend rejects it. (`platform` is valid only for `creator.type` on courses.)
- **`consultant` and `specialist` are not roles.** "consultant" only appears in field and route names (`consultant_type`, `consultant/programs`). Never use either as a role value.
- **Images.** Remote image hosts are allowlisted in `next.config.ts`. A new host needs a config change (ask first, see Workflow).

## Glossary

- **Account types** (`type_account`): `patient`, `therapist`, `rehabilitation_center`. The API always returns `rehabilitation_center`. `center` appears only in the search filter `?type=center`, and the backend also accepts `rehabilitation_center` there.
- **Service provider**: `therapist` + `rehabilitation_center`.
- **Admin**: not a backend `type_account` value. `src/middleware.ts` treats a token as admin when `token.role`, `token.user.type_account` or `token.user.role` is `"admin"`. Control-panel login sets `type_account: "admin"` in `src/lib/auth.ts`. Admins skip the profile and approval flow and use `/control-panel/*`.
- **`approval_status`**: `pending` | `approved` | `rejected`. Incomplete profiles go to `/profile/create`, pending to `/profile/pending`, rejected to `/profile/rejected`. Routes that need an approved account are in `src/lib/routeConfig.ts`.
- **Programs** (courses): service providers manage them under `/profile/programs`. Patients enrol under `/profile/my-programs`. `creator.type` can be `platform`, meaning the admin/platform created it.
- **Kawader**: home-care requests. Patients submit them (P1–P5), admins handle them (A1–A3), with realtime notifications. `/profile/kawader` is patients only.

## Docs (read when working on the topic; not imported)

- `docs/kawader/api-reference.md`: Kawader API (Arabic).
- `docs/measurement-api.md`: smart-glove measurement sessions.
- `docs/booking-flow-audit.md`: booking flow through payment return.
- `docs/copy-audit-ar.md`: Arabic copy tone report. Read before writing Arabic UI text.
- `docs/design-system/`: design audit and tokens. Read alongside `DESIGN.md`.

## Environment variables

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | yes | Staging host locally, `https://api.mednovacare.com` in production. No `/api` suffix in either. The app throws at startup if unset. |
| `NEXTAUTH_SECRET` | yes | JWT signing key. Also read in `src/middleware.ts`. |
| `NEXTAUTH_URL` | yes | Auth callback URL, read by NextAuth. |
| `NEXT_PUBLIC_PAYMENT_HOSTS` | no | Comma-separated checkout host allowlist (host including port). Unset or blank falls back to `secure.amwalpay.com`. A set value replaces the default. Inlined at build time, so changing it needs a rebuild. |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET` | social login | Read in `src/lib/auth.ts`. Not set in the local `.env.local`. |
| `SENTRY_AUTH_TOKEN` | build only | Source-map upload. Lives in `.env.sentry-build-plugin`. |

The Pusher key is hardcoded in `src/lib/echo.ts` (cluster `eu`). There is no Pusher env var. Moving it to env is a separate task.
