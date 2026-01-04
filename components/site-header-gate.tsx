"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/site-header";

export function SiteHeaderGate() {
  const pathname = usePathname() || "";
  const isDashboard =
    pathname.startsWith("/dashboard") || pathname.startsWith("/darboard");

  // Lock body scroll SOLO in dashboard (evita doppia scrollbar)
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (isDashboard) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isDashboard]);

  if (isDashboard) return null;
  return <SiteHeader />;
}