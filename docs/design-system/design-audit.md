# MedNova — Design System Phase 1: Code Audit

Date: 2026-10-08 · Branch: `Staging` · Scope: `src/` (698 `.ts/.tsx/.css` files, 424 `.tsx`)

**Method.** Counts come from regex scans over `src/` (helper scripts live outside the repo, in the OS temp folder). Counts include responsive/state variants (`md:text-sm` counts as `text-sm`) unless stated. "Importers" for components are the number of `.tsx` files containing a `<Name` JSX tag, which also catches usages through barrel files. Nothing in the repo except this file and `tokens.json` was touched. "Not found" always states where I looked.

---

## 1. Foundations

### 1.1 CSS variables (`src/app/globals.css`, 255 lines)

`:root` (light). oklch values were converted to sRGB by script; `#` values are literal in the file.

| Token | Source value | sRGB | Note |
|---|---|---|---|
| `--background`, `--card`, `--popover` | `oklch(1 0 0)` | `#ffffff` | |
| `--foreground`, `--card-foreground`, `--popover-foreground`, `--sidebar-foreground` | `oklch(0.147 0.004 49.25)` | `#0c0a09` | warm near-black |
| `--primary` | `#32A88D` | `#32A88D` | brand teal, literal hex |
| `--primary-foreground`, `--sidebar`, `--sidebar-primary-foreground` | `oklch(0.985 0.001 106.423)` | `#fafaf9` | |
| `--secondary` | `#1F6069` | `#1F6069` | dark teal, literal hex |
| `--secondary-foreground`, `--accent-foreground`, `--sidebar-primary` | `oklch(0.216 0.006 56.043)` | `#1c1917` | |
| `--muted`, `--accent`, `--sidebar-accent` | `oklch(0.97 0.001 106.424)` | `#f5f5f4` | |
| `--muted-foreground` | `oklch(0.553 0.013 58.071)` | `#79716b` | |
| `--destructive` | `oklch(0.577 0.245 27.325)` | `#e7000b` | slightly out of gamut |
| `--destructive-foreground` | `oklch(0.98 0.01 180)` | `#f2fbf9` | declared but never mapped into `@theme` and unused in classes |
| `--border`, `--input`, `--sidebar-border` | `oklch(0.923 0.003 48.717)` | `#e7e5e4` | |
| `--ring` | `oklch(0.709 0.01 56.259)` | `#a6a09b` | warm gray, **not teal** |
| `--chart-1..5` | oklch | `#f54900 #009689 #104e64 #ffb900 #fe9a00` | shadcn defaults; no chart library found (searched `package.json`, `src/`) |
| `--radius` | `0.625rem` | 10 px | |

- `.dark` block exists with shadcn defaults (primary turns gray). **It is unused in practice**: 43 `dark:` occurrences, all inside shadcn primitives plus 2 shared files; no toggle, no `ThemeProvider` (searched `src/` for `ThemeProvider`, `useTheme`; the only hit is `src/components/ui/sonner.tsx` reading `useTheme()` from `next-themes`, which returns `"system"` since no provider exists).
- `@theme inline` maps the shadcn colour tokens to `--color-*`, and radii: `sm = radius-4px (6)`, `md = radius-2px (8)`, `lg = radius (10)`, `xl = radius+4px (14)`.
- `@theme inline` sets `--font-sans: var(--font-geist-sans)` and `--font-mono: var(--font-geist-mono)`. **Neither variable is defined anywhere** (see 1.3).
- Custom CSS: `.chat-shadow`, `.no-spinner`, keyframes `shimmer`, `nav-progress`, `contact-pulse-ring`, `contact-pop-in`, `.ltr/.rtl` helpers, `@custom-variant dark`. `tw-animate-css` is imported (provides `animate-in/out`, `accordion-*`). **`animate-float` is used 17 times but defined nowhere** (searched `globals.css`, `src/`; no `tailwind.config` exists, Tailwind v4) — it is a silent no-op.

### 1.2 Colour usage in components

**Hardcoded hex** (outside `globals.css`): 1066 literal occurrences, 36 distinct values. **Arbitrary Tailwind hex classes**: 1052 occurrences, 63 distinct classes.

| Family | Values (count) | Verdict |
|---|---|---|
| Brand teal | `#32A88D` **874** | the real primary. 35 `bg-primary` + 40 `text-primary` vs ~860 hardcoded |
| Teal hover/darker | `#2a8a7a` 89, `#2a9278` 7, `#2a9178` 4, `#2a8f7a` 3, `#2a9079` 2, `#2b8e77` 2 | one intent (hover/darker), six values → collapse to `#2a8a7a` |
| Dark teal | `#1F6069` 29 | = `--secondary`; used in gradients and program pages |
| Dark green text | `#0f3d35` 2 | only in `StatusBadge` "available" |
| Greys | `#4b5563` 4 | = gray-600 |
| Tints | `#f0fdf4` 5 | = green-50 |
| Social brands | `#25d366 #1ebe57 #1da1f2 #0d8ddb #0077b5 #005983 #feda75 #fa7e1e #d62976` (3–4 each) | legitimate brand colours; keep as isolated primitives |

Top files for `#32A88D`: `src/app/[locale]/termsandconditions/page.tsx` 34, `src/features/profile/_create/ui/PatientForm/PatientSuccess.tsx` 22, `src/features/consultations/TherapistConsultation/components/ConsultationList.tsx` 21. `#2a8a7a`: `termsandconditions/page.tsx` 10, `ConsultationActions.tsx` 8, `coming-soon/page.tsx` 5. `#1F6069`: `src/features/programs/ui/program-list/ProgramsList.tsx` 9, `ProgramDetailContent.tsx` 4, `ProgramDetailHeader.tsx` 3.

Teal arbitrary classes: `text-[#32A88D]` 284, `bg-[#32A88D]` 166, `border-[#32A88D]` 76, `from-[#32A88D]` 53, `to-[#32A88D]` 21, `ring-[#32A88D]` 19. Opacity steps on it: `/10` 152, `/20` 34, `/5` 20, `/90` 18, `/30` 12, `/40` 3, and one-offs `/15 /25 /50`. Hover pair: `to-[#2a8a7a]` 46, `from-[#2a8a7a]` 21, `bg-[#2a8a7a]` 13.

No `rgb()/hsl()/oklch()` literals outside `globals.css` (only one arbitrary shadow, `shadow-[0_10px_40px_rgba(50,168,141,0.12)]` in `src/app/not-found.tsx`).

**Semantic token usage** (shadcn names): `text-muted-foreground` 341, `text-foreground` 103, `bg-muted` 94, `text-destructive` 55, `border-border` 50, `text-primary` 40, `bg-primary` 35, `ring-destructive` 24, `bg-accent` 21, `bg-background` 20, `bg-card` 19, `bg-destructive` 17, `ring-ring` 14, `bg-secondary` 8.

**Default Tailwind palette** (class count by family): gray **1296**, emerald 201, blue 177, red 155, amber 139, green 92, rose 82, yellow 38, slate 33, purple 32, sky 30, teal 26, violet 20, indigo 10, pink 9, orange 5, cyan 2.
Most-used shades: `text-gray-800` 188, `text-gray-600` 178, `border-gray-100` 147, `text-gray-700` 132, `text-gray-500` 128, `border-gray-200` 104, `bg-gray-50` 103, `bg-gray-200` 74, `border-gray-300` 48, `text-red-500` 44, `bg-gray-100` 41, `text-gray-400` 37, `text-gray-900` 33.
→ Pages are really built on the **gray** scale, while shadcn primitives use the **stone-like** semantic tokens. Two neutral systems side by side.

### 1.3 Typography

- `src/app/layout.tsx`: `Cairo({ subsets: ["arabic"], weight: ["400","700"], variable: "--font-cairo" })`, applied as `<body className={cairo.variable}>`.
- **Cairo is never applied.** `--font-cairo` is defined as a CSS variable but no `font-family: var(--font-cairo)`, no `font-cairo` class, no `fontFamily` exists in `src/` or in the compiled CSS (`/_next/static/css/app/layout.css` fetched from the dev server). The Tailwind default font is `var(--font-geist-sans)`, which is also undefined. Net effect: body text falls back to the browser default font stack. The `@font-face` rules for Cairo are emitted (400/700, 3 unicode-range subsets), so the bytes are downloaded and unused. I could not confirm visually (browser pane timed out); the CSS evidence is conclusive.
- Weights loaded: 400, 700. Weights used: `font-medium` 396, `font-semibold` 207, `font-bold` 196, `font-extrabold` 8, `font-normal` 7, `font-mono` 6. 500/600/800 are synthesized (faux bold/regular).
- Sizes (unprefixed): `text-sm` 596, `text-xs` 293, `text-lg` 132, `text-2xl` 86, `text-xl` 44, `text-base` 30, `text-3xl` 22, `text-4xl` 8; with variants also `text-5xl` 10, `text-6xl` 4. Arbitrary: `text-[11px]` 14, `text-[10px]` 9, `text-[13px]` 2, `text-[0.8rem]` 2.
- Line height: `leading-relaxed` 27, `leading-tight` 12, `leading-none` 10, `leading-8` 6, `leading-7` 3, `leading-normal` 1. Tracking: `tracking-wide` 8, `tracking-tight` 1.
- Headings de facto: h1 → `text-2xl` (23 of the h1s), h2 → `text-2xl` 12 / `text-3xl` 8 / `text-xl` 7, h3 → `text-lg` 36 / `text-xl` 28. No consistent heading scale.
- No `<h*>` base styles in `globals.css` (Tailwind preflight resets them).

### 1.4 Spacing, radius, shadow

- **Spacing** (de facto 4-pt scale: steps 1/2/3/4/6/8 = 4/8/12/16/24/32 px). `p-4` 757, `p-3` 546, `p-6` 324, `p-2` 250, `p-8` 140, `p-1` 104, `p-5` 64. `px-4` 520, `px-3` 104, `px-6` 99, `px-8` 61. `py-3` 359, `py-2` 135, `py-1` 76. `gap-2` 429, `gap-3` 230, `gap-4` 126, `gap-1` 95, `gap-6` 62, `gap-1.5` 27, `gap-5` 26, `gap-8` 26. `space-y-4` 98, `-2` 69, `-3` 61, `-6` 58. 40 arbitrary px values. Half steps (0.5/1.5/2.5) only on icons and badges.
- **Radius**: `rounded-full` 364, `rounded-xl` **340**, `rounded-lg` 220, `rounded-2xl` 152, `rounded` 62, `rounded-md` 59, `rounded-3xl` 9, `rounded-none` 9, `rounded-sm` 5. Resolved: sm 6, md 8, lg 10, xl 14 (token-driven); 2xl 16 and 3xl 24 are Tailwind defaults. Buttons/inputs are md (8); shadcn Card is xl (14); custom cards mix xl/2xl.
- **Shadow**: `shadow-lg` 106, `shadow-xl` 62, `shadow-sm` 48, `shadow-md` 40, `shadow-2xl` 25, `shadow-none` 9, `shadow-xs` 8, plus 1 branded arbitrary shadow. Heavy use of lg/xl; no elevation rule.
- **Focus rings**: `focus-visible:ring-[3px]` 9 + `focus-visible:ring-ring` 9 (shadcn, gray), `focus:ring-[#32A88D]` 19 and `focus:ring-2` 14 (custom, teal), `outline-none` 14.

### 1.5 Layout, breakpoints, sidebars

- No `tailwind.config.*` (searched repo root). Default breakpoints: `sm:` 489, `lg:` 313, `md:` 306, `xl:` 20, no `2xl:`; one `min-[360px]`.
- Containers: `container` class 24 uses; `max-w-7xl` 47, `max-w-md` 45, `max-w-5xl` 28, `max-w-2xl` 18, `max-w-sm` 10, `max-w-lg` 9, `max-w-3xl` 6. Programs list page uses `max-w-5xl mx-auto space-y-5 p-4 sm:p-6`; details `max-w-7xl`.
- Heights: `h-16` 39, `h-20` 18, `h-14` 14, `h-24` 12.
- **Profile/dashboard shell** (`src/app/[locale]/profile/layout.tsx`): page `bg-gray-50`; sidebar wrapper `fixed … lg:top-36 lg:start-10 lg:w-70` (280 px, floating rounded-2xl card, `shadow-xl`) and on mobile a **fixed bottom bar** (`bottom-0 start-0 end-0`, safe-area padding, `border-t`); main content `lg:ms-80` and `pb-[calc(4rem+env(safe-area-inset-bottom))]` on mobile, `container mx-auto px-4 py-4 md:px-6 md:py-8`. Chrome (navbar + sidebar) is hidden on `/create`, `/pending`, `/rejected`.
- **Public navbar** (`src/shared/ui/components/Navbar/Navbar.tsx`, 15 usages): `sticky top-0 z-50 flex items-center justify-between px-4 lg:px-20 bg-white`. No explicit height (set by the logo, `Logo` default 100×100). Mobile: hamburger + collapsible search row.
- **Control-panel shell** (`AdminLayoutShell.tsx`): root `<div dir="rtl" class="min-h-screen bg-muted/30">`; `AdminSidebar` `lg:w-72` expanded / `lg:w-20` collapsed, `Sheet` on mobile; `TopNavbar` fixed `h-16`; content `pt-16` + `lg:pr-72` / `lg:pr-20` (**physical `pr`, RTL hardcoded**, will break in English).

### 1.6 Icons

Only `lucide-react` (^0.545). 218 files import it, 187 distinct icons. Top: `Loader2` 66, `Clock` 25, `CheckCircle2` 19, `Edit` 18, `Star` 17, `User` 16, `MessageCircle` 16, `X` 16.
Sizes (both orders summed): `h-4 w-4` **382**, `h-5 w-5` 225, `h-6 w-6` 55, `w-10 h-10` 53, `w-3 h-3` 49, `h-3.5 w-3.5` 30, `w-12 h-12` 28, `size-4` 27. `strokeWidth` customised once (2.5); default 2 everywhere else. No `size={}` prop usage.

### 1.7 Motion

`transition-all` 135, `transition-colors` 85, `duration-200` 89, `duration-300` 65, `duration-500` 12. `animate-spin` 78 (Loader2), `animate-pulse` 37 (skeletons), `animate-float` 17 (**undefined**).

### 1.8 Contrast (WCAG 2.x, computed)

| Pair | Ratio | AA text (4.5) | AA large/UI (3.0) |
|---|---|---|---|
| White on `#32A88D` (primary button label if white) | **2.95** | FAIL | FAIL |
| `--primary-foreground` `#fafaf9` on `#32A88D` (what `Button` default really renders) | **2.82** | FAIL | FAIL |
| `#32A88D` text on white | 2.95 | FAIL | FAIL |
| `#32A88D` text on gray-50 | 2.82 | FAIL | FAIL |
| `#32A88D` text on its `/10` tint | 2.67 | FAIL | FAIL |
| White on `#2a8a7a` (hover shade) | 4.19 | FAIL (large OK) | pass |
| `#1F6069` on white | 7.15 | pass | pass |
| `muted-foreground` `#79716b` on white | 4.79 | pass | pass |
| `muted-foreground` on gray-50 `#f9fafb` | 4.58 | pass (barely) | pass |
| `muted-foreground` on `--muted` `#f5f5f4` | 4.39 | FAIL (barely) | pass |
| `gray-400` on white / gray-50 (37 uses) | 2.54 / 2.43 | FAIL | FAIL |
| `gray-500` on white / gray-50 | 4.83 / 4.63 | pass | pass |
| `gray-600` on white | 7.56 | pass | pass |
| `red-500` on white (44 uses) | 3.76 | FAIL | pass |
| `white` on `--destructive` | 4.77 | pass | pass |
| Status chips: amber-600/amber-100 2.86 ✗, sky-600/sky-100 3.57 ✗, blue-600/blue-100 4.24 ✗, purple-600/purple-100 4.56 ✓, rose-700/rose-100 5.24 ✓, emerald-700/emerald-100 4.84 ✓, amber-700/amber-100 4.51 ✓, blue-700/blue-100 5.49 ✓, `#0f3d35` on emerald-400 6.28 ✓ | | | |

**Consequence for the Figma library:** brand teal `#32A88D` can't carry white text at body size. Options (decision for the design owner): keep `#32A88D` for large/bold button labels (≥ 18.66 px bold; still only 2.95, so it fails even that), or darken the primary fill to ≈ `#2a8a7a` (4.19) / `#27806f`-ish for ≥ 4.5, or use dark text (`#0f3d35`, 6.28 on `#34d399` pattern already used by StatusBadge "available").

---

## 2. Component inventory

JSX-tag usage counts (files containing `<Name`). RTL column: **L** = uses logical utilities, **P** = physical (`left/right/ml/mr/text-right`), **HC** = hardcoded `dir="rtl"`. i18n: ✓ uses `useTranslations`, ✗ hardcoded Arabic/English, – no text.

### 2.1 `src/components/ui/` (shadcn, New York) — 22 primitives

| Component | Purpose | Variants / props | States | RTL | i18n | Used by |
|---|---|---|---|---|---|---|
| `button.tsx` | action | variant: default/destructive/outline/secondary/ghost/link; size: default h-9, sm h-8, lg **h-12 w-full**, icon 9, icon-sm 8, icon-lg 10; `asChild` | hover, focus-visible ring 3px (gray), disabled .5, aria-invalid | L (no dir-specific) | – | 144 |
| `badge.tsx` | label | default/secondary/destructive/outline; `rounded-md px-2 py-0.5 text-xs` | – | L | – | 58 |
| `card.tsx` | container | Card/Header/Title/Content/Footer/Action; `rounded-xl border py-6 shadow-sm gap-6` | – | L (`@container`) | – | 50 |
| `input.tsx` | text field | none; `h-9 … p-5` | **focus/invalid classes broken (see §3.7)** | L | – | 27 |
| `textarea.tsx` | multiline | none; `min-h-16 field-sizing-fixed` | focus ring, invalid, disabled | L | – | 13 |
| `select.tsx` | dropdown | trigger size default h-9 / sm h-8 | focus ring, invalid, disabled | L (`ps-2 pe-8`, `end-2`) | – | 14 |
| `checkbox.tsx` | Radix checkbox | none; `size-4 rounded-[4px]` | checked=primary (token, gray focus ring) | L | – | 6 |
| `dialog.tsx` | modal | Dialog/Content/Header/Footer/Title/Description; `sm:max-w-lg rounded-lg p-6` | open/close animation | **P**: close button `right-4`, header `sm:text-left` | – | 15 |
| `tabs.tsx` | tabs | pill style: list `bg-muted rounded-lg h-9`, active `bg-background shadow-sm` | active, focus | L | – | 11 |
| `sheet.tsx`, `dropdown-menu.tsx`, `calendar.tsx` | overlays/date | shadcn | | **P** (dropdown 11, calendar 9 physical classes) | – | 3 / 17 / 1 |
| `label`, `form`, `separator`, `progress`, `scroll-area`, `avatar`, `accordion`, `input-otp`, `skeleton`, `sonner` | shadcn | | | L | – | 17, 8, 5, 4, 3, 7, 2, 2, 40, 1 |
| `NavbarWrapper.tsx` | **entire file commented out** | | | | | 0 (imports `LandingNavbar`) |

**Not found** in `src/components/ui/` (searched directory listing): `table`, `switch`, `radio-group`, `alert-dialog`, `tooltip`, `popover`, `pagination`, `alert`, `breadcrumb`. DESIGN.md claims a `table.tsx`; none exists.

### 2.2 `src/shared/ui/`

| Component (path under `src/shared/ui/`) | Purpose | Props / variants | RTL | i18n | Used by |
|---|---|---|---|---|---|
| `components/Navbar/Navbar.tsx` | main navbar, `variant="dashboard"` adds search | variant, className | L (`pe-10`, `end-3`, `rtl:space-x-reverse`) | ✓ | 15 |
| `components/Navbar.tsx`, `Header.tsx` | older navbars | | | | 0, 0 |
| `components/LandingNavbar.tsx` | landing nav | | | | 2 |
| `components/Footer.tsx` | footer | | | ✗ | 5 |
| `components/FloatingContactWidget.tsx` | floating contact | | | | 1 (`[locale]/layout.tsx`) |
| `components/LanguageSwitcher.tsx` | locale toggle | | | | n/m |
| `components/BreadcrumbNav.tsx` | breadcrumbs | | | | 8 |
| `components/PaginationControls.tsx` | pager (prev/next + count) | currentPage, lastPage, total, isLoading | L | **✗ hardcoded Arabic** | 14 |
| `components/EmptyState.tsx` | empty/error state | `type` no-results/error/empty/no-data, title, description, onAction | – | ✗ (props, Arabic defaults at call sites) | 4 |
| `components/states/EmptyState.tsx`, `states/LoadingState.tsx` | duplicates | | | | 0, 0 |
| `components/states/ErrorState.tsx` | error block | | | ✓/✗ mixed | 3 |
| `components/LoadingSkeleton.tsx` | skeleton | | | | 0 |
| `components/TextArea.tsx` | textarea w/ label | rtl prop, teal focus | HC prop | ✗ | 4 |
| `components/ProgramCard.tsx` | program card | | | | 4 |
| `components/RatingBadge.tsx` | rating pill | | | | 2 |
| `components/cards/BaseCard` | card base (DESIGN.md "primary pattern") | `rounded-2xl shadow-lg` | | | **0** |
| `components/SearchFiltersBar.tsx`, `filters/SearchFiltersBar.tsx` | filter bar (two copies) | | | | 0 / 0 |
| `components/Button.tsx` | custom button | | | | 0 |
| `forms/components/FormInput` | RHF input + label + error | | L | ✓ | 30 |
| `forms/components/FormSelect` | | | | ✓ | 19 |
| `forms/components/FormPhoneInput` | phone with country code | | | | 7 |
| `forms/components/FormPasswordInput`, `FormCitySelect`, `FormFileUpload`, `FormAccountTypeSelector`, `ProfileImageUpload`, `SocialLoginButton` | form fields | | | | – |
| `forms/components/FormStepCard` | step section card | | | | 10 |
| `forms/components/FormSubmitButton` | submit w/ loading | | | | 20 |
| `forms/components/CustomCheckbox`, `FormCheckbox` | native-input checkboxes | | | | 1, 1 |
| `src/components/LoadingButton` | button + spinner | | | | 8 |

### 2.3 Feature-level reusable UI

| Component | Path | Purpose / variants | Used by |
|---|---|---|---|
| `StatusBadge` | `features/financial/ui/shared/StatusBadge.tsx` | 8 financial statuses, i18n ✓, `rounded-full` outline Badge | 4 |
| `ConsultantProgramStatusBadge` | `features/consultant-programs/ui/components/` | draft/pending/approved/rejected/archived | 2 |
| `WithdrawalStatusBadge` | `features/control-panel/financial/ui/components/` | pending_review/approved/rejected | 2 |
| `DisputeStatusBadge` | `features/admin/disputes/ui/components/` | opened/under_review/resolved, hardcoded Arabic | 2 |
| `UserTypeBadge`, `SubscriptionBadge` | `features/control-panel/users/ui/components/` | | 2, 1 |
| `ConfirmationModal` | `features/control-panel/users/ui/components/` | confirm dialog, `sm:max-w-md`, Cancel outline + Confirm primary | 8 |
| `RejectReasonDialog` | `features/control-panel/programs/ui/components/` | reason ≥ 10 chars, destructive, `dir="rtl"` | 3 |
| `DisputeDialog` | `features/consultations/details/ui/dialogs/` | reason ≥ 20 chars | 1 |
| 11 other `*Dialog.tsx` | e.g. `WithdrawRequestDialog`, `ReviewDialog` (×2), `ConsultationDialog` | one-off forms | 1 each |
| `StepperHeader` | `features/profile/_create/ui/StepperHeader/index.tsx` | steps stepper, hardcoded `dir="rtl"`, no i18n | 3 |
| `Sidebar` (profile) | `features/profile/_create/ui/sidebar/index.tsx` | user card + nav, bottom bar on mobile | 1 |
| `AdminSidebar`, `SidebarGroup`, `SidebarItem`, `SidebarSubItem`, `TopNavbar`, `AdminLayoutShell` | `features/control-panel/admin-layout/ui/` | control-panel shell; item = `flex-row-reverse … text-right rounded-lg px-3 py-2.5 text-sm` | 1 / 1 / – / – / 1 / 5 |
| `NotificationEmptyState` | `features/notifications/components/` | | 1 |
| `ConsultationEmptyState` | `features/consultations/ui/EmptyState.tsx` | | 0 |
| 16 table components | see §3.4 | raw `<table>` | – |

### 2.4 Raw HTML bypassing primitives

`<button>` raw in 48 files, `<input>` raw in 16 files, `<input type="checkbox">` raw in 10 files, `<table>` raw in 16 files, `<select>` raw in 0.

---

## 3. Duplicates and drift

| # | Concept | Variants found | Evidence (usage) | Recommended canonical |
|---|---|---|---|---|
| 3.1 | **Status badge** | `StatusBadge` (financial), `ConsultantProgramStatusBadge`, `WithdrawalStatusBadge`, `DisputeStatusBadge`, `UserTypeBadge`, `SubscriptionBadge` | 4/2/2/2/2/1 usages. Pending: amber-100 bg with amber-600 text (financial) vs amber-700 (others). Info: sky vs blue. `DisputeStatusBadge` has hardcoded Arabic. | One `Badge` with a `status` variant set (success/pending/danger/info/neutral/frozen/available) mapped from domain statuses; AA-passing shades (amber-700, blue-700); label via i18n. Base on `StatusBadge` (the only i18n'd one). |
| 3.2 | **Empty state** | `shared/ui/components/EmptyState`, `states/EmptyState`, `NotificationEmptyState`, `consultations/ui/EmptyState` | 4 / 0 / 1 / 0 | Keep `shared/ui/components/EmptyState`; fix i18n and the `error` type using the `Award` icon; delete the 0-use copies. |
| 3.3 | **Textarea** | `ui/textarea.tsx` (13), `shared/ui/components/TextArea.tsx` (4, hardcoded teal, `rtl` prop) | | `ui/textarea.tsx` + a label wrapper from `FormInput`'s pattern. |
| 3.4 | **Table** | no shadcn table; 16 files render raw `<table>` with their own header/row styling | list in §2.4 (e.g. `TransactionsTable`, `WithdrawalsTable` ×2, `EscrowTable`, `DisputesTable`, `UsersManagementPage`) | Add `ui/table.tsx` (Table/Header/Row/Head/Cell) and migrate gradually. |
| 3.5 | **Checkbox** | `ui/checkbox.tsx` (Radix, 6), `CustomCheckbox` (1), `FormCheckbox` (1), plus 10 files with raw `<input type="checkbox">` | | `ui/checkbox.tsx`; wrap in a `FormCheckbox` that uses it. |
| 3.6 | **Pagination** | `PaginationControls` (14, hardcoded Arabic), `containers/Pagination.tsx` (0) | | `PaginationControls` with i18n. |
| 3.7 | **Input focus** | `ui/input.tsx` lines 12–13: `focus-visible:[#32A88D]`, `focus-visible:[#32A88D]-[3px]`, `aria-invalid:[#32A88D]-destructive/20` are **invalid Tailwind classes** (a bad find/replace of `ring` → `#32A88D`); trailing `p-5` overrides `px-3 py-1`. Result: teal border only, no ring, no invalid ring, 20 px padding. | 27 usages | Restore shadcn classes; decide on one ring colour (see 3.8). |
| 3.8 | **Focus ring** | shadcn primitives: gray `--ring` 3px; custom fields: teal `focus:ring-2` (19+14) | | Set `--ring` to teal at 50%; delete per-component overrides. |
| 3.9 | **Primary colour** | `--primary` token vs ~860 hardcoded `[#32A88D]`; `Button` default itself hardcodes `bg-[#32A88D]` and uses `text-primary-foreground` (#fafaf9) | | Point everything at `bg-primary`; define `--primary-hover` (#2a8a7a). |
| 3.10 | **Card** | `ui/card` (`rounded-xl shadow-sm py-6`), `BaseCard` (`rounded-2xl shadow-lg`, 0 uses), ad-hoc `rounded-2xl/xl bg-white border-gray-100 shadow-*` everywhere (rounded-xl 340, rounded-2xl 152) | | `ui/card` with a `radius`/`elevation` prop pair; delete `BaseCard`. |
| 3.11 | **Navbar / sidebars** | `Navbar/Navbar.tsx` (15) vs `Navbar.tsx`/`Header.tsx`/`LandingNavbar.tsx`; profile `Sidebar` vs `AdminSidebar` | | `Navbar/Navbar.tsx`; keep both sidebars (different products) but share the item component. |
| 3.12 | **Dialogs** | 15 files, 3 patterns (confirm, form, reason-required) with different widths (`max-w-md`, default `lg`), button orders, and `dir` handling | | Build `ConfirmDialog` + `ReasonDialog` over `ui/dialog` (see §4). |
| 3.13 | **Search filter bar** | two files at different paths, 0 direct tags | | Delete both or pick one (check consumers via barrel). |
| 3.14 | **Radius/shadow** | 6 radius steps and 6 shadow steps in routine use | | Radius: `md` (controls), `xl` (cards), `full` (pills/avatars). Shadow: `sm` (cards), `lg` (floating), `xl` (modals). |
| 3.15 | **Neutral scale** | gray (1296 classes) vs stone-like tokens | | Map `gray-*` roles to semantic tokens (text-strong/body/subtle, border-subtle/default). |

---

## 4. Page patterns (reference files)

| Pattern | Reference | Notes |
|---|---|---|
| Dashboard shell | `src/app/[locale]/profile/layout.tsx` | `bg-gray-50`; floating 280 px sidebar card on `lg`, bottom bar below; content `lg:ms-80`; hide chrome on create/pending/rejected |
| Control-panel shell | `src/features/control-panel/admin-layout/ui/AdminLayoutShell.tsx` | `dir="rtl"`, sidebar 288/80, top bar 64, content `lg:pr-72/20` (physical) |
| List page (filters + cards + pagination) | `src/features/consultant-programs/ui/ConsultantProgramsListPage.tsx` | header → skeleton → `ErrorState` → empty → cards; `PaginationControls` |
| List page (admin table) | `src/features/control-panel/programs/ui/ProgramsManagementPage.tsx` | raw table + filters + `PaginationControls` |
| Details | `src/features/programs/ui/program-detail/ProgramDetailView.tsx` | `max-w-7xl`, `lg:grid-cols-3` (2/3 content + 1/3 aside) |
| Multi-step form | `src/features/profile/_create/ui/TherapistForm/TherapistWrapper.tsx` | 5 steps, `StepperHeader`, Zustand draft store, `FormStepCard` per step. `ConsultantProgramForm.tsx` is single-page (`useFieldArray` for videos) |
| Dialogs | confirm: `control-panel/users/ui/components/ConfirmationModal.tsx`; reason: `control-panel/programs/ui/components/RejectReasonDialog.tsx` (min 10) and `consultations/details/ui/dialogs/DisputeDialog.tsx` (min 20); form: `financial/withdraw/ui/WithdrawRequestDialog.tsx` | |
| Loading | `ui/skeleton` (40 usages), `Loader2 animate-spin` (66), `LoadingButton` (8) | |
| Empty / error | `shared/ui/components/EmptyState`, `states/ErrorState` | |
| 404 | `src/app/not-found.tsx` | brand shadow |
| Toasts | Sonner mounted once in `src/app/layout.tsx` (`richColors`, `position="top-center"`); helpers `src/lib/toastUtils.ts` (success 3000 ms, error/warning 4000 ms). Direct calls: `toast.error` 131, `toast.success` 66, `toast.info` 6, `toast.warning` 2; helper `showSuccessToast` only 3 | |

"Kawader / كوادر": **Not found** (searched `src/`, `src/messages/*.json`, `docs/`). Closest feature is `src/features/consultant-programs/**`.

---

## 5. Figma library proposal

### 5.1 Variable collections

1. **Primitives** (Color): `teal/500 #32A88D`, `teal/600 #2a8a7a`, `teal/900 #1F6069`, `teal/950 #0f3d35`, stone and gray steps in use, status families (emerald, amber, purple, blue, rose, sky, slate), `red/500, red/600`, social brands. Source: `docs/design-system/tokens.json`.
2. **Semantic** (Color, one mode "Light"): shadcn names — `background, foreground, card, card-foreground, popover, primary, primary-hover, primary-foreground, secondary, muted, muted-foreground, accent, destructive, border, input, ring` + app-level `page-background, text-strong/body/subtle, border-subtle/default` + `status/*/{bg,fg,border}`. Add a **Dark** mode **only** if dark mode is ever shipped; today it isn't, so skip.
3. **Spacing** (Number): 2, 4, 6, 8, 10, 12, 16, 20, 24, 32.
4. **Radius** (Number): 4, 6, 8, 10, 14, 16, 24, 9999.
5. **Typography** (String/Number): family `Cairo`, sizes 10–60, weights 400/500/600/700.
6. Effect styles: shadow xs–2xl + `brand`.

Resolve first: primary-foreground (white vs #fafaf9 vs dark) and `--ring` colour, since both are visible on every control.

### 5.2 Text styles (from real usage; Cairo)

| Style | Size/LH | Weight | Seen as |
|---|---|---|---|
| Display | 36–48 / 40–48 | 700 | `text-4xl/5xl font-bold` hero |
| H1 | 24 / 32 | 700 | `text-2xl font-bold` (page titles, 23) |
| H2 | 20–24 / 28–32 | 600–700 | `text-xl/2xl font-semibold` |
| H3 | 18 / 28 | 600 | `text-lg font-semibold` (36) |
| Body | 14 / 20 | 400 | `text-sm` (596) |
| Body Strong | 14 / 20 | 600 | `text-sm font-semibold` |
| Body Large | 16 / 24 | 400 | `text-base` |
| Caption | 12 / 16 | 400/500 | `text-xs` (293) |
| Overline/Micro | 10–11 / 14 | 500 | `text-[10px]/[11px]` (23) |
| Button | 14 / 20 | 500 | `text-sm font-medium` |

Load weights 500/600 in Cairo (code only loads 400/700) or the design will not match what ships.

### 5.3 Component build order

Each row: variants → code file.

1. **Button** — variant (default, destructive, outline, secondary, ghost, link) × size (sm 32, default 36, lg 48, icon 36/32/40) × state (default, hover, focus, disabled, loading) → `src/components/ui/button.tsx`, `src/components/LoadingButton.tsx`.
2. **Input** — state (default, focus, invalid, disabled), with/without icon → `ui/input.tsx` (fix first), `forms/components/FormInput.tsx`.
3. **Textarea** → `ui/textarea.tsx`.
4. **Select** — trigger size (default 36, sm 32), open → `ui/select.tsx`, `FormSelect`.
5. **Checkbox** — checked/unchecked/disabled/invalid → `ui/checkbox.tsx`.
6. **Phone input** — country code + number, RTL/LTR → `forms/components/FormPhoneInput.tsx`.
7. **Badge** — single component, `status` variant: success, pending, danger, info, neutral, frozen, available; plus default/secondary/outline → `ui/badge.tsx` + consolidated status map (replaces 6 badges).
8. **Card** — elevation (sm/lg), padding, header/content/footer slots → `ui/card.tsx`.
9. **Table** — header, row, cell, selected/hover, empty row → new `ui/table.tsx` (no code equivalent).
10. **Pagination** → `shared/ui/components/PaginationControls.tsx`.
11. **Dialog** — confirm, form, reason-required (min length + counter) → `ui/dialog.tsx`, `ConfirmationModal`, `RejectReasonDialog`.
12. **EmptyState** — type no-results/error/empty/no-data × with/without action → `shared/ui/components/EmptyState.tsx`.
13. **Sidebar item** — state (default, active, hover, destructive), collapsed (icon only) → `admin-layout/ui/components/SidebarItem.tsx`; profile sidebar item.
14. **Navbar** — default / dashboard (with search), mobile → `shared/ui/components/Navbar/Navbar.tsx`.
15. **Stepper** (new) — step state (completed, current, upcoming), horizontal, RTL-aware → today `profile/_create/ui/StepperHeader/index.tsx`.
Later: Tabs (pill), Dropdown menu, Toast, Skeleton, Avatar, Breadcrumb.

### 5.4 RTL auto-layout guidance (Arabic-first)

- Design every frame in RTL first; mirror to LTR only to verify. Use Figma auto-layout with **text alignment "start"** and set layout direction per frame variable (RTL/LTR) rather than baking right-aligned text.
- Icons that imply direction (chevrons, arrows, back, pagination prev/next, progress) must be flipped in RTL; others (search, user, clock, check) must not.
- Component padding: model `padding-start/end`, never left/right. Matches code goal (`ps-*/pe-*/ms-*/me-*`). Today code has 328 physical vs 208 logical utilities, so expect drift in details.
- Inputs: label above, text start-aligned; phone numbers and OMR amounts remain LTR runs inside RTL (`dir="ltr"` inline) with 3-decimal OMR formatting.
- Sidebar sits on the **right** in RTL (start side), content margin on the start side (`lg:ms-80`); on mobile it becomes a bottom bar (profile) or a Sheet (admin).
- Stepper: first step at the right in RTL; connectors run right-to-left (today hardcoded via `right:`).
- Dialog close button at the **end** (left in RTL); today's code puts it at `right-4` (physical) in every RTL dialog — design it at the start of the title row's end side and file a code follow-up.

---

## 6. DESIGN.md: outdated or missing

(`DESIGN.md`, 605 lines, not edited.)

Wrong or outdated:
- States Cairo is applied through `--font-cairo`; in code it is **loaded but never applied** (§1.3).
- References `src/components/ui/table.tsx`; **file does not exist**; tables are raw HTML in 16 files.
- Dashboard layout: says `lg:mr-80`, content in flow; code is `lg:ms-80` with a `fixed lg:top-36 lg:start-10` floating card, and a **bottom bar on mobile** (DESIGN.md says h-16 mobile bar; the bar is `fixed bottom-0` with safe-area padding).
- States navbar `h-20` and `bg-card`; `Navbar.tsx` has no height class and uses `bg-white`.
- Input focus `ring-[3px]` teal: actual `input.tsx` classes are broken (§3.7).
- Lists `BaseCard` (`rounded-2xl shadow-lg`) as a primary pattern: **0 usages**.
- Tabs documented as teal active fill; `ui/tabs.tsx` is `bg-background shadow-sm` pill (teal tabs, if any, are bespoke).
- Footer gradient and status colour table are accurate only for `StatusBadge`; the other five badge components differ.

Missing:
- Semantic tokens other than primary/secondary (`muted`, `accent`, `destructive`, `ring`, `border`, `sidebar-*`, `chart-*`, `popover`), the radius token mapping (6/8/10/14), dark-mode status (unused).
- Contrast guidance (primary teal fails AA).
- Control-panel shell (`dir="rtl"`, 288/80 sidebar, 64 top bar) — not described.
- Fixed `--ring` colour, hover shade `#2a8a7a`, and the six near-duplicate teals.
- Toast conventions (`toastUtils.ts` durations), dialog patterns, icon size scale.
- The undefined `animate-float`, `--font-geist-*` references.
