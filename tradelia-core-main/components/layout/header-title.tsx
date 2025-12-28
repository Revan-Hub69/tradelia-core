"use client";

import { usePathname } from "next/navigation";

const titles: { test: RegExp; label: string }[] = [
  { test: /^\/$/, label: "Home" },
  { test: /^\/dashboard\/paths(\/|$)/, label: "Percorsi" },
  { test: /^\/library(\/|$)/, label: "Libreria" },
  { test: /^\/about$/, label: "Metodo & Compliance" },
];

export function HeaderTitle() {
  const pathname = usePathname();
  const match = titles.find((entry) => entry.test.test(pathname));
  return <span className="text-lg font-semibold">{match?.label ?? "Tradelia"}</span>;
}
