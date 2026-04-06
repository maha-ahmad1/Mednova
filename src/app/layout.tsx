import './globals.css';
// Accept locale, dir, and messages as props from child layout
export default function RootLayout({
  children,
  locale = 'en',
  dir = 'ltr',
  messages
}: {
  children: React.ReactNode;
  locale?: string;
  dir?: string;
  messages: Record<string, string>
}) {
  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body dir={dir} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
