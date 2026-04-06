"use client";
import { usePathname, useRouter } from 'next/navigation';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  // Extract the current locale from the pathname (assumes /[locale]/...)
  const match = pathname.match(/^\/(ar|en)(\/|$)/);
  const currentLocale = match ? match[1] : 'en';
  const otherLocale = currentLocale === 'ar' ? 'en' : 'ar';

  // Replace the locale in the pathname
  const switchLocalePath = pathname.replace(
    /^\/(ar|en)(\/|$)/,
    `/${otherLocale}$2`
  );

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <button
        onClick={() => router.replace(pathname.replace(/^\/(ar|en)(\/|$)/, '/ar$2'))}
        disabled={currentLocale === 'ar'}
        style={{ fontWeight: currentLocale === 'ar' ? 'bold' : 'normal' }}
      >
        العربية
      </button>
      <button
        onClick={() => router.replace(pathname.replace(/^\/(ar|en)(\/|$)/, '/en$2'))}
        disabled={currentLocale === 'en'}
        style={{ fontWeight: currentLocale === 'en' ? 'bold' : 'normal' }}
      >
        English
      </button>
    </div>
  );
}
