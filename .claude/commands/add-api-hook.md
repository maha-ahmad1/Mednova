# Skill: Add API Function + Hook

Use this skill when adding a new API endpoint call to the project. It covers the full chain from the raw axios function through the useFetcher or useMutation hook consumed by a component.

---

## Step 1 — Choose the axios pattern

There are exactly two patterns. Pick the right one before writing anything.

### Standalone axios (auth flows only)

Only used in `src/features/auth/api/authApi.tsx`. The axios instance there already bakes `/api` into its base URL — do not add it again.

```ts
// src/features/auth/api/authApi.tsx
export const loginUser = async (data: LoginData) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};
```

### Dependency-injected axios (everywhere else)

Every other feature receives `axios` as a parameter. The base URL is `https://api.mednovacare.com` (no `/api` suffix), so all paths must start with `/api/...`.

```ts
// src/features/<feature>/api/<feature>.api.ts
import type { AxiosInstance } from "axios";

export const getConsultantWallet = async (
  axios: AxiosInstance,
): Promise<ApiEnvelope<ConsultantWallet>> => {
  const res = await axios.get<ApiEnvelope<ConsultantWallet>>(
    "/api/financial/consultant/wallet",
  );
  return res.data;
};
```

`ApiEnvelope<T>` shape: `{ success: boolean; message?: string; data: T }`

---

## Step 2 — Write the hook (query / read)

`useFetcher` manages its own axios instance internally — do **not** pass axios to it.

```ts
// src/features/<feature>/hooks/use<Feature><Thing>.ts
import { useFetcher } from "@/hooks/useFetcher";
import type { ConsultantWallet } from "../types";

export const useConsultantWallet = () => {
  return useFetcher<ConsultantWallet>(
    ["consultant", "wallet"],         // QueryKey — must be unique across the app
    "/api/financial/consultant/wallet",
  );
};
```

**What `useFetcher` returns:** `response.data.data` — the inner `T`, not the full envelope. If you call the API function directly outside `useFetcher`, you get the full `{ success, data }` envelope. Never mix the two.

### With pagination params

```ts
export const useConsultantTransactions = (page: number) => {
  return useFetcher<PaginatedTransactions>(
    ["consultant", "transactions"],
    "/api/financial/consultant/transactions",
    { params: { page, per_page: 10 } },
  );
};
```

### Conditional fetching

```ts
export const usePatientProfile = (id: string | null) => {
  return useFetcher<PatientProfile>(
    ["patient", "profile", id],
    id ? `/api/patient/profile/${id}` : null,  // null endpoint disables the query
  );
};
```

---

## Step 3 — Write the hook (mutation / write)

Mutations need `useAxiosInstance()` — call it inside the hook, not inside `mutationFn`.

```ts
// src/features/<feature>/hooks/use<Feature>Submit.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { submitFeatureThing } from "../api/<feature>.api";
import { handleBackendFormError } from "@/lib/backendFormErrors";
import axios from "axios";

export const useFeatureThingSubmit = () => {
  const axiosInstance = useAxiosInstance();

  return useMutation({
    mutationFn: (data: FeatureThingPayload) =>
      submitFeatureThing(axiosInstance, data),
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        handleBackendFormError(error);
      }
    },
  });
};
```

### With field-level errors (for forms)

`handleBackendFormError` accepts an optional callback that receives a flat `Record<string, string>` of field → first error message. Use it to call `form.setError()`:

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

`handleBackendFormError` internally:
- **422**: fires a Sonner toast with a summary, then calls the callback with field errors
- **401**: fires "session expired" toast
- **500+**: fires "server error" toast
- **other**: fires `errorData.message` or a generic fallback toast

---

## Step 4 — Wire the API function (mutation side)

```ts
// src/features/<feature>/api/<feature>.api.ts
export const submitFeatureThing = async (
  axios: AxiosInstance,
  data: FeatureThingPayload,
): Promise<ApiEnvelope<FeatureThing>> => {
  const res = await axios.post<ApiEnvelope<FeatureThing>>(
    "/api/feature/thing",
    data,
  );
  return res.data;
};
```

For `FormData` payloads:

```ts
const res = await axios.post("/api/feature/upload", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});
```

---

## Checklist

- [ ] API function is in `src/features/<feature>/api/<feature>.api.ts`
- [ ] DI axios function takes `axios: AxiosInstance` as first param
- [ ] Path starts with `/api/...` (not double-prefixed)
- [ ] `ApiEnvelope<T>` is the return type for DI functions
- [ ] Hook is in `src/features/<feature>/hooks/use<Feature><Thing>.ts`
- [ ] `useFetcher` key is unique in the app
- [ ] Mutations import `useAxiosInstance` inside the hook, not inside `mutationFn`
- [ ] `handleBackendFormError` imported from `@/lib/backendFormErrors`
- [ ] Types added to `src/features/<feature>/types/`
