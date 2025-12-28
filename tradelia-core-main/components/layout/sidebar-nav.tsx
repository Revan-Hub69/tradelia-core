"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/dashboard/paths/long-term", label: "Percorsi" },
  { href: "/library", label: "Libreria" },
  { href: "/about", label: "Metodo" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2 px-4">
      {navItems.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === item.href
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({
                variant: isActive ? "default" : "ghost",
                size: "sm",
              }),
              "justify-start"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
