import { redirect } from 'next/navigation';

// Redirect root path to default locale to avoid shadowing [locale] routes
export default function RootPage() {
  redirect('/en');
}

