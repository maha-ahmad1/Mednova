import Link from 'next/link';

import { useTranslations } from 'next-intl';
import LinkNext from 'next/link';

export default function NotFound() {
  const t = useTranslations('common');
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">{t('pageNotFound') || '404 - Page Not Found'}</h1>
      <p className="text-gray-600 mb-8">{t('pageNotFoundDesc') || "The page you're looking for doesn't exist."}</p>
      <LinkNext href="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        {t('goHome') || 'Go Home'}
      </LinkNext>
    </div>
  );
}
