// import { getRequestConfig } from 'next-intl/server';
// import { cookies } from 'next/headers';

// export default getRequestConfig(async ({locale: paramLocale}) => {
//   const cookieStore = await cookies();
//   const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;
//   const resolvedLocale = paramLocale || cookieLocale || 'en';

//   return {
//     locale: resolvedLocale,
//     messages: (await import(`../messages/${resolvedLocale}.json`)).default
//   };
// });


import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  const resolvedLocale = locale ?? 'en';

  return {
    locale: resolvedLocale,
    messages: (await import(`../messages/${resolvedLocale}.json`)).default
  };
});