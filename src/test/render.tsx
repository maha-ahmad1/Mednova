import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactElement, ReactNode } from "react";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

export type TestLocale = "ar" | "en";

const messagesByLocale = { ar: arMessages, en: enMessages };

interface ProvidersOptions {
  locale?: TestLocale;
  session?: Session | null;
  queryClient?: QueryClient;
}

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });

export function renderWithProviders(
  ui: ReactElement,
  {
    locale = "ar",
    session = null,
    queryClient = createTestQueryClient(),
    ...renderOptions
  }: ProvidersOptions & Omit<RenderOptions, "wrapper"> = {},
) {
  const dir = locale === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = locale;
  document.documentElement.dir = dir;

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <div dir={dir} data-testid="providers-root">
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <NextIntlClientProvider
            locale={locale}
            messages={messagesByLocale[locale]}
            timeZone="UTC"
          >
            {children}
          </NextIntlClientProvider>
        </QueryClientProvider>
      </SessionProvider>
    </div>
  );

  return {
    queryClient,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
