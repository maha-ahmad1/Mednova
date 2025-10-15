
import type React from "react";
import type { Metadata } from "next";
// import { Analytics } from "@vercel/analytics/next"
import "./globals.css";
import { Suspense } from "react";
import { Tajawal } from "next/font/google";
import { Providers } from './Providers';



const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: "MEDNOVA - Medical Innovation",
  description: "Medical Innovation",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}
>) 


{
  return (
    <html lang="ar" dir="rtl">
      <body className={tajawal.variable}>
        <Providers>
          <Suspense fallback={null}>
            <main className="min-h-screen">{children}</main>
          </Suspense>
          {/* <Analytics /> */}
        </Providers>
      </body>
    </html>
  );
}
