import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Toaster } from "sonner"
import Header from "@/components/ui/common/Header";

export const metadata: Metadata = {
  title: "DocumentAI - AI Powered Multi-tenant Document Analysis",
  description: "Analyze and collaboration on documents with Google Gemini AI",
};

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={`h-full antialiased`}
      >
        <body className={inter.className}>
          <div className="min-h-screen flex flex-col">
            {/* Header */}
            <Header />
            {/* Main */}
            <main className="flex-1">
              {children}
            </main>
            {/* Footer */}
            <footer />
            <Toaster />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
