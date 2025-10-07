import type React from "react"
import type { Metadata } from "next"
import { Cairo } from "next/font/google"
// import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"
// import { GeistSans, GeistMono } from "geist/font/google";



const cairo = Cairo({
  subsets: ["latin", "arabic"],
  variable: "--font-cairo",
  display: "swap",
})

export const metadata: Metadata = {
  title: "MEDNOVA - Medical Innovation",
  description: "Register for MEDNOVA medical services",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Suspense fallback={null}>
          {children}
          {/* <Analytics /> */}
        </Suspense>
      </body>
    </html>
  )
}
