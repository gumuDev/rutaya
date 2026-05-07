import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import { antdTheme } from "@/shared/theme/antd-theme";

export const metadata: Metadata = {
  title: "RutaYa — Reserva tu pasaje",
  description: "Reserva pasajes interprovinciales en Bolivia de forma rápida y segura",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RutaYa",
  },
  icons: {
    icon: "/icons/icon-192.svg",
    apple: "/icons/icon-192.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#F97316",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <meta name="application-name" content="RutaYa" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="RutaYa" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
      </head>
      <body style={{ margin: 0, background: '#F8FAFC' }}>
        <NextIntlClientProvider messages={messages}>
          <AntdRegistry>
            <ConfigProvider theme={antdTheme}>
              {children}
            </ConfigProvider>
          </AntdRegistry>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
