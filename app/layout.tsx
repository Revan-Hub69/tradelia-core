import type { ReactNode } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { inter, ibmPlexSans } from "@/lib/fonts";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="it" className={`${inter.variable} ${ibmPlexSans.variable}`} suppressHydrationWarning>
      <body className="bg-muted/20 text-foreground antialiased font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
