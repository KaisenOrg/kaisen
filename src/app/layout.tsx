import { Providers } from '@/providers';
import type { Metadata } from "next";
import "@nfid/identitykit/react/styles.css";
import "./globals.css";
import Header from '@/components/ui/header';
import Sidebar from '@/components/ui/sidebar';

export const metadata: Metadata = {
  title: "Kaizen",
  description: "Kaizen - A decentralized platform for learning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning={true}>
      <body>
        <Providers>
          <div className="flex flex-col h-screen">
            <Header />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <main className="flex-1 p-12 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}