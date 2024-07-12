import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.scss";
import { APP_CONFIG } from "@/static/app";
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from "@/@components/ui/sonner";
import { firebaseAuth } from "@/lib/firebase";
import { AuthContextProvider } from "@/context/AuthContext";

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
        <div className="min-h-screen flex flex-col relative">
          <AuthContextProvider>
            <QueryProvider>
              <Toaster />
              {children}
            </QueryProvider>
          </AuthContextProvider>
        </div>
      </body>
    </html>
  );
}
