"use client";

import { useEffect } from "react";

export function Drawer({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="absolute right-0 top-0 h-full w-full sm:w-[520px] bg-card border-l border-border/50 shadow-xl flex flex-col">
        <header className="p-4 border-b border-border/50 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <button
            onClick={onClose}
            className="px-2 py-1 rounded border border-border/50 hover:bg-muted/30 text-xs transition-subtle"
          >
            Chiudi
          </button>
        </header>
        <div className="flex-1 overflow-auto p-4">
          {children}
        </div>
      </aside>
    </div>
  );
}