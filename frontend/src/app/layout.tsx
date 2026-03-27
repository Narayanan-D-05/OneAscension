import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OneAscension | The System",
  description: "High-concurrency GameFi RPG",
};

import { Sidebar } from "@/components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-row bg-[var(--color-background)] text-[var(--color-foreground)] selection:bg-[var(--color-primary)] selection:text-[var(--color-background)]">
        <Providers>
          <Sidebar />
          <main className="flex-1 md:ml-64 min-h-screen relative flex flex-col">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
