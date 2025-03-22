import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MantineProvider, createTheme, Input } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Report Tracker",
  description: "Simplifying report tracking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-mantine-color-scheme="light">
      <head>
        <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      </head>
      <body className={inter.className}>
        <MantineProvider>
          <Notifications />
          <ModalsProvider>
            {children}
          </ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
