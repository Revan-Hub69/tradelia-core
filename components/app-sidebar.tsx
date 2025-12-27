"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Home, BookOpen, Target, Lightbulb } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

const navItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Percorsi",
    icon: Target,
    items: [
      {
        title: "Lungo termine",
        href: "/dashboard/paths/long-term",
        icon: Target,
      },
      {
        title: "Medio termine",
        href: "/dashboard/paths/mid-term",
        icon: Target,
      },
      {
        title: "Breve termine",
        href: "/dashboard/paths/short-term",
        icon: Target,
      },
      {
        title: "Intraday",
        href: "/dashboard/paths/intraday",
        icon: Target,
      },
    ],
  },
  {
    title: "Libreria",
    href: "/dashboard/library",
    icon: BookOpen,
  },
  {
    title: "Metodo",
    href: "/dashboard/about",
    icon: Lightbulb,
  },
];

interface AppSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AppSidebar({ className, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  const [openItems, setOpenItems] = React.useState<string[]>([]);

  const toggleItem = (item: string) => {
    setOpenItems((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  return (
    <div className={cn("pb-12", className)} {...props}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Tradelia
          </h2>
          <div className="space-y-1">
            {navItems.map((item) => (
              <div key={item.title}>
                {item.items ? (
                  <Collapsible
                    open={openItems.includes(item.title)}
                    onOpenChange={() => toggleItem(item.title)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between"
                      >
                        <div className="flex items-center">
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.title}
                        </div>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-1">
                      {item.items.map((subItem) => (
                        <Button
                          key={subItem.title}
                          variant={
                            pathname === subItem.href ? "secondary" : "ghost"
                          }
                          className="w-full justify-start"
                          asChild
                        >
                          <Link href={subItem.href}>
                            <subItem.icon className="mr-2 h-4 w-4" />
                            {subItem.title}
                          </Link>
                        </Button>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <Button
                    variant={
                      pathname === item.href ? "secondary" : "ghost"
                    }
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href={item.href}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                    </Link>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="px-3 py-2">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
