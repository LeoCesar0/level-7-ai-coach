import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.scss";
import { APP_CONFIG } from "@/static/app";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: APP_CONFIG.title,
  description: APP_CONFIG.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col relative">{children}</div>
      </body>
    </html>
  );
}
