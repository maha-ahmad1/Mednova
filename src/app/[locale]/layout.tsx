import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { IncompleteProfileBanner } from "@/shared/ui/components/IncompleteProfileBanner";
import { AccountStatusNotificationCard } from "@/shared/ui/components/AccountStatusNotificationCard";
import EchoProvider from "@/providers/ClientEchoWrapper";
// import * as Sentry from "@sentry/nextjs";
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages({ locale });
  const dir = locale === "ar" ? "rtl" : "ltr";
// Sentry.logger.info('User triggered test log', { log_source: 'sentry_test' });
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div dir={dir} className="min-h-screen">
        <EchoProvider>
          <IncompleteProfileBanner />
          <AccountStatusNotificationCard />
          {children}
        </EchoProvider>
      </div>
    </NextIntlClientProvider>
  );
}