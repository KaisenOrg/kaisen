import { Providers } from '@/providers';
import type { Metadata } from "next";
import { Poppins } from 'next/font/google';

import "@nfid/identitykit/react/styles.css";
import "./globals.css";

import Header from '@/components/ui/header';
import Sidebar from '@/components/ui/sidebar';

export const metadata: Metadata = {
  title: "Kaizen",
  description: "Kaizen - A decentralized platform for learning",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className={poppins.className} suppressHydrationWarning={true}>
      <body>
        <Providers>
          <div className="flex flex-col h-screen">
            <Header />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <div className="flex-1 overflow-y-auto">
                {children}
              </div>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}