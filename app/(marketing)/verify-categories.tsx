"use client";

import { useState } from "react";

type Item = {
  label: string;
  tooltip: string;
};

type VerifyCategoriesProps = {
  items: Item[];
};

function InlineTooltip({ content }: { content: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        className="tooltip-trigger"
        aria-expanded={open}
        aria-label="Informazioni"
        onClick={() => setOpen((prev) => !prev)}
      >
        i
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-xl border border-border bg-background p-3 text-xs text-muted-foreground shadow-sm">
          {content}
        </div>
      )}
    </div>
  );
}

export function VerifyCategories({ items }: VerifyCategoriesProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="surface-card surface-card-hover flex items-start justify-between gap-4 rounded-2xl p-5">
          <p className="text-sm font-semibold text-foreground">{item.label}</p>
          <InlineTooltip content={item.tooltip} />
        </div>
      ))}
    </div>
  );
}
