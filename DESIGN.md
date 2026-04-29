# DESIGN.md — MedNova Design System Reference

This file documents the actual design patterns extracted from the codebase.
Do **not** invent new patterns — always refer to this file first before writing UI code.

---

## 1. Design Principles

- **Modern dashboard aesthetic** — clean white surfaces, teal brand color, subtle shadows and borders.
- **Bilingual-first** — every component must work in both Arabic (RTL, default) and English (LTR). RTL is the primary design direction.
- **Minimal decoration** — rely on spacing, typography weight, and color to create hierarchy rather than decorative elements.
- **Accessible, readable** — sufficient contrast ratios, consistent focus rings (`focus-visible:ring-[3px]`), meaningful placeholder text.
- **Responsive** — mobile-first; sidebar collapses to a bottom bar on mobile (`lg:` breakpoint is the desktop threshold).

---

## 2. Colors

### Brand

| Role | Hex | Usage |
|------|-----|-------|
| Primary teal | `#32A88D` | Buttons, active tabs, focus rings, links, icons |
| Secondary dark teal | `#1F6069` | Gradient end, secondary accents |
| Primary hover | `#2a8a7a` / `#2a9278` | Hover states on primary elements |

### CSS Variables (defined in `src/app/globals.css`)

These variables drive the shadcn/ui component layer. Refer to them in Tailwind via `bg-primary`, `text-foreground`, etc.

```css
--background          /* page background  — white in light mode */
--foreground          /* main text        — dark gray           */
--card                /* card surface     — white               */
--card-foreground     /* text on cards                          */
--muted               /* subtle backgrounds (e.g. empty states) */
--muted-foreground    /* secondary / helper text                */
--border              /* dividers, input borders                */
--input               /* input field border                     */
--primary             /* #32A88D                                */
--primary-foreground  /* text on primary bg — white             */
--secondary           /* #1F6069                                */
--destructive         /* error red                              */
```

### Semantic / Status Colors

These are used as inline Tailwind classes (not CSS variables):

| Status | Background | Text |
|--------|-----------|------|
| Available / Success | `bg-emerald-400` | `text-[#0f3d35]` |
| Pending / Warning | `bg-amber-100` | `text-amber-600` |
| Frozen / Locked | `bg-purple-100` | `text-purple-600` |
| Total / Informational | `bg-blue-100` | `text-blue-600` |
| Destructive / Error | `bg-destructive` | `text-white` |

### Highlighted Card Gradient

The "Available Balance" card uses the brand gradient:

```
bg-gradient-to-br from-[#32A88D] to-[#1F6069]
```

### Backgrounds

| Surface | Class |
|---------|-------|
| Page background | `bg-gray-50` (profile/dashboard pages) |
| Card / panel | `bg-white` or `bg-card` |
| Muted section | `bg-muted` |
| Navbar | `bg-card` |
| Footer | `bg-gradient-to-br from-[#32A88D]/10 via-white to-blue-50/30` |

---

## 3. Typography

### Font Family

**Cairo** is the single font for the entire app (Arabic-optimized, covers Latin too).

```tsx
// src/app/layout.tsx
const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-cairo",
});
```

Applied to the `<body>` via `cairo.variable`. Do **not** introduce other font families.

### Size Scale

| Class | Size | Typical Use |
|-------|------|-------------|
| `text-[10px]` | 10px | Chart axis labels |
| `text-[11px]` | 11px | Balance card sub-labels |
| `text-xs` | 12px | Badges, metadata, tab labels |
| `text-sm` | 14px | Form labels, descriptions, button text |
| `text-base` | 16px | Input field values |
| `text-lg` | 18px | Dialog titles |
| `text-xl` | 20px | Card titles |
| `text-2xl` | 24px | Page section headings (e.g. wallet balance) |
| `text-3xl` | 30px | Top-level page headings |

### Font Weights

| Class | Weight | Use |
|-------|--------|-----|
| `font-medium` | 500 | Normal emphasis, labels |
| `font-semibold` | 600 | Card titles, section titles |
| `font-bold` | 700 | Numeric values (balances, stats) |

### Text Color Conventions

- Primary text: `text-foreground` (or `text-gray-900` inline)
- Secondary / helper: `text-muted-foreground`
- Brand link: `text-[#32A88D]`
- Error: `text-destructive`

---

## 4. Spacing & Layout

### Common Padding

| Class | Value | Use |
|-------|-------|-----|
| `p-2` | 8px | Icon containers, tight elements |
| `p-2.5` | 10px | Small icon wrappers |
| `p-5` | 20px | Compact card content |
| `p-6` | 24px | Standard card padding (**default**) |
| `px-3` | 12px | Small buttons, tags |
| `px-4` | 16px | Medium buttons |
| `px-6` | 24px | Large buttons, container horizontal padding |
| `py-1` | 4px | Badge vertical |
| `py-2` | 8px | Small vertical rhythm |
| `py-3` | 12px | Medium vertical rhythm |
| `py-6` | 24px | Section vertical rhythm |
| `py-8` | 32px | Page top/bottom padding |

### Common Gap

| Class | Value | Use |
|-------|-------|-----|
| `gap-1` | 4px | Tightest spacing (icon + tiny label) |
| `gap-1.5` | 6px | Button icon-to-text gap |
| `gap-2` | 8px | Standard inline gap |
| `gap-3` | 12px | Component-level spacing |
| `gap-4` | 16px | Section spacing (**most common**) |
| `gap-6` | 24px | Major section separation |
| `gap-8` | 32px | Footer grid columns |

### Container Patterns

```html
<!-- Standard page content -->
<div class="container mx-auto px-6 py-8">

<!-- Financial / wallet page -->
<div class="max-w-5xl mx-auto px-4 sm:px-8">

<!-- Full-width footer -->
<div class="container mx-auto px-6">
```

### Page Layout Structure

The profile/dashboard shell (from `src/app/[locale]/profile/layout.tsx`):

```
min-h-screen bg-gray-50
└── flex (column on mobile, row on desktop)
    ├── Sidebar — fixed, h-16 on mobile / w-70 on desktop (lg:w-70)
    └── Main content — flex-1, pb-20 lg:pb-0 lg:mr-80
        └── container mx-auto px-6 py-8
```

### Responsive Breakpoints Used

| Prefix | Breakpoint |
|--------|-----------|
| `sm:` | 640px |
| `md:` | 768px |
| `lg:` | 1024px (primary desktop threshold) |

### Elevation / Shadow

| Class | Use |
|-------|-----|
| `shadow-xs` | Inputs, buttons |
| `shadow-sm` | Cards (default) |
| `shadow-md` | Dropdown menus |
| `shadow-lg` | Dialogs, modals, shared cards |
| `shadow-xl` | Hover state on shared cards |

---

## 5. Component Guidelines

### Buttons

Source: `src/components/ui/button.tsx`

**Variants:**

```tsx
// Primary action — use for the main CTA on a page
<Button variant="default">  {/* bg-[#32A88D] hover:bg-[#32A88D]/90 text-white */}

// Danger action
<Button variant="destructive">  {/* bg-destructive text-white */}

// Secondary bordered
<Button variant="outline">  {/* border bg-background hover:bg-accent */}

// Subtle text button
<Button variant="ghost">  {/* hover:bg-accent */}

// Text link style
<Button variant="link">  {/* text-primary underline on hover */}
```

**Sizes:**

```tsx
<Button size="sm">    {/* h-8  px-3  */}
<Button size="default"> {/* h-9  px-4  */}  ← default
<Button size="lg">    {/* h-12 px-6 w-full */}
<Button size="icon">  {/* size-9 (square) */}
<Button size="icon-sm"> {/* size-8 */}
<Button size="icon-lg"> {/* size-10 */}
```

**Rules:**
- Use `size="lg"` for full-width form submit buttons.
- Use `size="icon"` for toolbar/icon-only actions.
- Never hardcode custom button styles — always use the `Button` component with its variants.
- Gradient buttons (e.g. ProgramCard CTA) use: `from-[#32A88D] to-[#2a8a7a]` — reserve for marketing/card CTAs only.

---

### Cards

Source: `src/components/ui/card.tsx`, `src/shared/ui/components/cards/BaseCard.tsx`

**shadcn Card (data / dashboard panels):**

```tsx
<Card>                        {/* rounded-xl border shadow-sm py-6 */}
  <CardHeader>                {/* px-6 gap-2 */}
    <CardTitle />             {/* font-semibold leading-none */}
    <CardDescription />      {/* text-sm text-muted-foreground */}
  </CardHeader>
  <CardContent>               {/* px-6 */}
    ...
  </CardContent>
  <CardFooter>                {/* px-6 flex items-center */}
    ...
  </CardFooter>
</Card>
```

**BaseCard (listing / marketing cards):**

```tsx
// src/shared/ui/components/cards/BaseCard.tsx
className="bg-white rounded-2xl shadow-lg border border-gray-100
           hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 p-6"
```

Use `Card` for dashboard/data panels. Use `BaseCard` for listing pages and content cards.

---

### Tables

Source: `src/components/ui/table.tsx`

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead />   {/* text-muted-foreground font-medium text-sm */}
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>        {/* hover:bg-muted/50 transition-colors */}
      <TableCell />   {/* text-sm */}
    </TableRow>
  </TableBody>
</Table>
```

**Rules:**
- Wrap in a `Card` or a `rounded-xl border bg-white` container.
- Use `TableHead` for headers; never style raw `<th>` elements.
- Use status `Badge` components inside `TableCell` for status columns.
- For empty states, render a centered message inside `TableBody` spanning all columns.

---

### Badges

Source: `src/components/ui/badge.tsx`

**Built-in variants:**

```tsx
<Badge variant="default">      {/* bg-primary text-primary-foreground */}
<Badge variant="secondary">    {/* bg-secondary text-secondary-foreground */}
<Badge variant="destructive">  {/* bg-destructive text-white */}
<Badge variant="outline">      {/* border text-foreground */}
```

**Custom status badges (financial/program):**

```tsx
// Available / Active
<Badge className="bg-emerald-400 text-[#0f3d35]">متاح</Badge>

// Pending
<Badge className="bg-amber-100 text-amber-600">معلق</Badge>

// Frozen
<Badge className="bg-purple-100 text-purple-600">مجمد</Badge>

// Informational
<Badge className="bg-blue-100 text-blue-600">إجمالي</Badge>
```

Base layout classes (always present): `inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap`

---

### Inputs & Forms

Sources: `src/components/ui/input.tsx`, `src/components/ui/form.tsx`

**Input:**

```tsx
<Input />
// h-9 w-full rounded-md border border-input bg-transparent
// px-3 py-1 text-base md:text-sm
// placeholder:text-muted-foreground
// focus-visible:border-[#32A88D] focus-visible:ring-[3px]
```

**Textarea:**

```tsx
<Textarea />
// Same border/focus pattern as Input
// min-h-16 px-3 py-2
```

**Form structure (React Hook Form + shadcn):**

```tsx
<Form>
  <FormField name="..." control={...} render={({ field }) => (
    <FormItem>          {/* grid gap-2 */}
      <FormLabel />     {/* text-sm font-medium leading-none mb-3 */}
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormDescription />  {/* text-sm text-muted-foreground */}
      <FormMessage />       {/* text-sm text-destructive */}
    </FormItem>
  )} />
</Form>
```

**Custom search input (SearchFiltersBar):**

```
rounded-xl border-gray-200 focus:border-[#32A88D] focus:ring-[#32A88D] h-12
```

---

### Modals / Dialogs

Source: `src/components/ui/dialog.tsx`

```tsx
<Dialog>
  <DialogTrigger />
  <DialogContent>       {/* max-w-lg rounded-lg p-6 shadow-lg bg-background */}
    <DialogHeader>
      <DialogTitle />   {/* text-lg font-semibold leading-none */}
      <DialogDescription />  {/* text-sm text-muted-foreground */}
    </DialogHeader>
    {/* content */}
    <DialogFooter>
      <Button variant="outline">إلغاء</Button>
      <Button>تأكيد</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Rules:**
- Default max width is `sm:max-w-lg`.
- Overlay: `bg-black/50`.
- Always include a `DialogTitle` for accessibility.
- Confirm/cancel buttons go in `DialogFooter`; primary action on the right (LTR) / left (RTL).

---

### Tabs

Used in the financial wallet view:

```tsx
<Tabs defaultValue="...">
  <TabsList className="bg-gray-100 rounded-xl">
    <TabsTrigger
      className="text-xs h-7 px-3 rounded-lg
                 data-[state=active]:bg-[#32A88D] data-[state=active]:text-white"
    />
  </TabsList>
  <TabsContent />
</Tabs>
```

---

## 6. Financial UI Guidelines

Source: `src/features/financial/ui/wallet-overview/`

### Balance Cards Layout

Four cards in a responsive grid:

```html
<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
```

| Card | Icon BG | Text Color | Special |
|------|---------|-----------|---------|
| Total Balance | `bg-blue-100` | `text-blue-600` | — |
| Frozen Balance | `bg-purple-100` | `text-purple-600` | — |
| Pending Balance | `bg-amber-100` | `text-amber-600` | — |
| Available Balance | gradient bg | `text-white` | Highlighted card — `from-[#32A88D] to-[#1F6069]` |

### Balance Value Display

```tsx
// Balance amounts: large, bold, prominent
<p className="text-2xl font-bold">1,250.500</p>
<p className="text-[11px] text-muted-foreground">OMR</p>
```

- Always show **3 decimal places** for OMR (e.g. `1,250.500`).
- Currency label `OMR` is placed below or after the value in smaller text.
- Use `font-bold text-2xl` for the primary amount; `text-[11px] text-muted-foreground` for the currency label.

### Positive vs. Negative Amounts

```tsx
// Positive (credit / income)
<span className="text-emerald-600 font-medium">+250.000 OMR</span>

// Negative (debit / expense)
<span className="text-destructive font-medium">-75.000 OMR</span>
```

Always prefix with `+` or `-` sign. Never leave amounts sign-neutral in transaction lists.

### Status Display

| Status (AR) | Status (EN) | Badge |
|-------------|------------|-------|
| متاح | Available | `bg-emerald-400 text-[#0f3d35]` |
| معلق | Pending | `bg-amber-100 text-amber-600` |
| مجمد | Frozen | `bg-purple-100 text-purple-600` |

### Stat Chips

Small inline stats (e.g. "monthly income", "total withdrawals"):

```tsx
// src/features/financial/ui/wallet-overview/components/StatChip.tsx
className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-sm border text-xs"
```

### Empty States

```tsx
<div className="flex flex-col items-center justify-center py-12 text-center">
  <Icon className="w-12 h-12 text-muted-foreground mb-4" />
  <p className="text-muted-foreground text-sm">لا توجد معاملات بعد</p>
</div>
```

### Loading States

Use shadcn `Skeleton` component inside card layouts, matching the shape of the real content.

---

## 7. RTL Rules

### Direction Setup

The `[locale]` layout sets direction on the outermost wrapper:

```tsx
// src/app/[locale]/layout.tsx
const dir = locale === "ar" ? "rtl" : "ltr";
<div dir={dir} className="min-h-screen">
```

Arabic (`ar`) is the **default** locale and is RTL. All layouts must be designed RTL-first.

### Alignment Rules

| Scenario | RTL (Arabic) | LTR (English) |
|----------|-------------|--------------|
| Text alignment | `text-right` | `text-left` |
| Flex direction | natural (LTR row becomes RTL automatically) | — |
| Absolute position | `right-0` | `left-0` |
| Space/gap reversal | `rtl:space-x-reverse` | — |

### Icon Placement

- In RTL, icons that indicate direction (arrows, chevrons) must be flipped.
- Use `rtl:rotate-180` or `scale-x-[-1]` on directional icons.
- Non-directional icons (settings, user, bell) do **not** need flipping.

### Conditional RTL Classes

```tsx
// Positional
className="rtl:right-0 ltr:left-0"

// Gap reversal
className="flex gap-3 rtl:space-x-reverse"

// Using useLocale() for logic
const locale = useLocale();
const isRTL = locale === "ar";
```

### Typography

- Arabic text in Cairo renders correctly at all weights; no special override needed.
- Avoid mixing `text-left` globally — let `dir` handle alignment naturally.
- Numbers and currency (`OMR`, amounts) render LTR inside RTL context automatically via Unicode bidirectional algorithm; no extra class needed.

---

## 8. Reusability Rules

### Use existing components first

Before writing any UI, check in this order:

1. `src/components/ui/` — shadcn base components (Button, Badge, Card, Input, Dialog, Table, Tabs, etc.)
2. `src/shared/ui/components/` — shared app-level components (BaseCard, Footer, Navbar, SearchFiltersBar, FiltersSidebar)
3. `src/features/<feature>/ui/` — feature-specific components

### When to reuse

- Any element that appears in **2 or more places** must be extracted into a shared component.
- Status badges for the same statuses must use the **same color classes** everywhere (see Section 5 Badges).
- Balance display format must always use the pattern from Section 6.

### When to create a new component

- A pattern is genuinely new and not covered by existing components.
- A feature-specific variant that would complicate a shared component with too many props.
- Keep feature-specific components inside `src/features/<feature>/ui/`; promote to `src/shared/ui/` only when used across features.

### Avoid

- Hardcoding color hex values in new components — use CSS variables (`bg-primary`, `text-destructive`) or the documented status classes.
- Creating wrapper components that add no abstraction (single-use, trivial styling).
- Mixing shadcn `Card` and `BaseCard` for the same type of content in the same page.
- Duplicating button styles — always use `<Button variant="...">` rather than a raw `<button>` with custom classes.
- Adding `dir="rtl"` hardcoded in feature components — direction is set by the locale layout. Exception: isolated widgets that render outside `[locale]` layout scope.

---

## Quick Reference — Key Classes

```
Brand primary:       bg-[#32A88D]   text-[#32A88D]   border-[#32A88D]
Brand gradient:      from-[#32A88D] to-[#1F6069]
Card:                bg-white rounded-2xl shadow-lg border border-gray-100 p-6
Dashboard card:      rounded-xl border shadow-sm py-6  (via <Card>)
Page container:      container mx-auto px-6 py-8
Financial container: max-w-5xl mx-auto px-4 sm:px-8
Sidebar width:       w-70 (lg)
Navbar height:       h-20
Input:               h-9 rounded-md border border-input px-3
Focus ring:          focus-visible:ring-[3px] focus-visible:border-[#32A88D]
```
