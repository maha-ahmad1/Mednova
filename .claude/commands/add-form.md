# Skill: Add a Form

Use this skill when adding a new form to any feature. Everything here is based on actual project code — no assumptions.

---

## When to use this skill

- Creating a new user-facing form (profile edit, booking, submission, etc.)
- Adding a form inside an existing page component
- Adding a multi-step form (see `FormStepCard`)

---

## Checklist

- [ ] `"use client"` at the top — forms use hooks (`useForm`, `useTranslations`, `useAxiosInstance`)
- [ ] `const t = useTranslations()` — no hardcoded strings
- [ ] Zod schema defined before the component
- [ ] `useForm` wired with `zodResolver`
- [ ] Submit handler calls `handleBackendFormError` from `@/lib/backendFormErrors`
- [ ] Field errors passed to `form.setError()` via the callback
- [ ] `FormSubmitButton` used (not a plain `<button type="submit">`)
- [ ] RTL: pass `rtl={locale === "ar"}` to all form components that accept it

---

## Zod schema + useForm wiring

```ts
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(1),
  phone: z.string().min(7),
  gender: z.enum(["male", "female"]),
});

type FormSchema = z.infer<typeof schema>;

// Inside the component:
const form = useForm<FormSchema>({
  resolver: zodResolver(schema),
  defaultValues: { name: "", phone: "", gender: "male" },
});
```

---

## backendFormErrors — import path and usage

**Import:**
```ts
import { handleBackendFormError } from "@/lib/backendFormErrors";
import axios from "axios";
```

**What it does:**
- **422**: fires a Sonner toast with an Arabic summary of all errors, then calls the optional `onValidationError` callback with a flat `Record<string, string>` (field → first error message)
- **401**: fires "session expired" toast
- **500+**: fires "server error" toast
- **other**: fires `errorData.message` or a generic fallback

**Usage in `onError`:**

```ts
onError: (error) => {
  if (axios.isAxiosError(error)) {
    handleBackendFormError(error, (fieldErrors) => {
      Object.entries(fieldErrors).forEach(([field, message]) => {
        form.setError(field as keyof FormSchema, { message });
      });
    });
  }
},
```

The backend may return nested field paths like `therapist_details.name` — `handleBackendFormError` strips known prefixes (`therapist_details.`, `center_details.`, `patient_details.`, `location_details.`) automatically, so `form.setError("name", ...)` will match the RHF field name.

---

## Error display pattern

**Inline field errors** — pass `error` prop directly from `formState.errors`:

```tsx
const { formState: { errors } } = form;

<FormInput
  {...form.register("name")}
  label={t("name")}
  error={errors.name?.message}
/>
```

**General / toast errors** — handled automatically by `handleBackendFormError`. No extra code needed.

---

## Available shared form components

All live in `src/shared/ui/forms/components/`. Import via:
```ts
import { FormInput } from "@/shared/ui/forms/components/FormInput";
// or from the barrel:
import { FormInput, FormSelect, ... } from "@/shared/ui/forms";
```

| Component | Key props | Notes |
|---|---|---|
| `FormInput` | `label`, `error`, `icon` (LucideIcon), `iconPosition`, `rtl`, `containerClassName` | Forwards all `<input>` attrs; shows error message inline |
| `FormPasswordInput` | same as FormInput | Pre-wired show/hide toggle |
| `FormSelect` | `label`, `error`, `options: {value,label}[]`, `value`, `onValueChange`, `placeholder`, `rtl`, `disabled` | Wraps shadcn Select; shows error inline |
| `FormPhoneInput` | `label`, `error`, `countryCodes`, `defaultCountryCode`, `onCountryCodeChange`, `countryCodeValue`, `rtl` | Country code selector + number input; default country `+968` |
| `FormCheckbox` | — | Standard checkbox with label |
| `CustomCheckbox` | — | Styled checkbox variant |
| `FormFileUpload` | — | File picker input |
| `ProfileImageUpload` | — | Avatar/profile photo upload |
| `FormSubmitButton` | `isLoading`, `loadingText`, `align` (`"left"` \| `"right"` \| `"center"`), `variant`, `size` | Default `align="right"`; disables during loading |
| `FormStepCard` | — | Card wrapper for multi-step form steps |
| `FormAccountTypeSelector` | — | Role/account-type radio group |
| `SocialLoginButton` | — | OAuth provider button (auth flows) |

---

## Full boilerplate example

```tsx
"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslations, useLocale } from "next-intl";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { handleBackendFormError } from "@/lib/backendFormErrors";
import { FormInput } from "@/shared/ui/forms/components/FormInput";
import { FormSelect } from "@/shared/ui/forms/components/FormSelect";
import { FormSubmitButton } from "@/shared/ui/forms/components/FormSubmitButton";
import { submitMyThing } from "@/features/myfeature/api/myfeature.api";
import axios from "axios";

const schema = z.object({
  name: z.string().min(1),
  type: z.enum(["a", "b"]),
});

type FormSchema = z.infer<typeof schema>;

export function MyForm() {
  const t = useTranslations("MyFeature");
  const locale = useLocale();
  const rtl = locale === "ar";
  const axiosInstance = useAxiosInstance();

  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", type: "a" },
  });

  const { formState: { errors } } = form;

  const mutation = useMutation({
    mutationFn: (data: FormSchema) => submitMyThing(axiosInstance, data),
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        handleBackendFormError(error, (fieldErrors) => {
          Object.entries(fieldErrors).forEach(([field, message]) => {
            form.setError(field as keyof FormSchema, { message });
          });
        });
      }
    },
  });

  const onSubmit = form.handleSubmit((data) => mutation.mutate(data));

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormInput
        {...form.register("name")}
        label={t("nameLabel")}
        error={errors.name?.message}
        rtl={rtl}
      />
      <FormSelect
        label={t("typeLabel")}
        error={errors.type?.message}
        rtl={rtl}
        options={[
          { value: "a", label: t("typeA") },
          { value: "b", label: t("typeB") },
        ]}
        value={form.watch("type")}
        onValueChange={(val) => form.setValue("type", val as FormSchema["type"])}
      />
      <FormSubmitButton isLoading={mutation.isPending}>
        {t("submit")}
      </FormSubmitButton>
    </form>
  );
}
```

> `FormSelect` is not a forwarded-ref input, so it can't use `form.register()`. Use `form.watch()` + `form.setValue()` instead, as shown above.
