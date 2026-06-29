import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/auth-context";
import SWRProvider from "@/components/providers/swr-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: {
    default: "CSDAC Internship Portal",
    template: "%s | CSDAC",
  },
  description: "Official Internship Portal of CSDAC - Work-Based Learning, Live Government Projects, and Mentorship.",
  openGraph: {
    title: "CSDAC Internship Portal",
    description: "Official Internship Portal of CSDAC - Work-Based Learning, Live Government Projects, and Mentorship.",
    url: "https://internships.csdac.in",
    siteName: "CSDAC Internships",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      }
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CSDAC Internship Portal",
    description: "Official Internship Portal of CSDAC",
    images: ["/og-image.jpg"],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} forcedTheme="light" disableTransitionOnChange>
          <SWRProvider>
            <AuthProvider>
              {children}
              <Toaster position="top-right" richColors />
            </AuthProvider>
          </SWRProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
