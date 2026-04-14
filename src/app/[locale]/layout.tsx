// import { Providers } from '@/providers/QueryClientProvider';
// import { SessionProviderWrapper } from '@/providers/SessionProviderWrapper';
// import { NextIntlClientProvider } from 'next-intl';

// export const dynamic = 'force-dynamic';

// interface LocaleLayoutProps {
//   children: React.ReactNode;
//   params: { locale: string };
// }

// export default async function LocaleLayout({
//   children,
//   params,
// }: LocaleLayoutProps) {

//   const { locale } = await params;

//   // ✅ هذا أهم سطر (الحل الحقيقي)
//   const messages = (await import(`@/messages/${locale}.json`)).default;

//   const dir = locale === 'ar' ? 'rtl' : 'ltr';

//   return (
//     <html lang={locale} dir={dir}>
//       <body>
//         <NextIntlClientProvider locale={locale} messages={messages}>
//           <SessionProviderWrapper>
//             <Providers>
//               {children}
//             </Providers>
//           </SessionProviderWrapper>
//         </NextIntlClientProvider>
//       </body>
//     </html>
//   );
// }



import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Providers } from '@/providers/QueryClientProvider';
import { SessionProviderWrapper } from '@/providers/SessionProviderWrapper';

const locales = ['en', 'ar'];

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // التحقق من صحة اللغة
  if (!locales.includes(locale)) {
    notFound();
  }

  // الحصول على الرسائل من نفس مصدر getRequestConfig
  const messages = await getMessages({locale} ); 

  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
  <NextIntlClientProvider locale={locale} messages={messages}>
    <SessionProviderWrapper>
      <Providers>{children}</Providers>
    </SessionProviderWrapper>
  </NextIntlClientProvider>
);
}