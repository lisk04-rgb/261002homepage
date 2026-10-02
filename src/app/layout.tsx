import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@/components/analytics";
import { AuthProvider } from "@/components/auth-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteConfig } from "@/lib/content";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const site = getSiteConfig();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${site.name} | ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: { type: "website", locale: "ko_KR", siteName: site.name },
};

export const viewport: Viewport = { themeColor: "#1f2a44" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-white"
        >
          본문 바로가기
        </a>
        <AuthProvider>
          <SiteHeader siteName={site.name} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter site={site} />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
