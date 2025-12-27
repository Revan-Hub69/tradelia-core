"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/site-header";

export default function ClientLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isDashboardPage = pathname?.startsWith('/dashboard');
  
  return (
    <div key={pathname}>
      {!isDashboardPage && <SiteHeader />}
      {children}
    </div>
  );
}