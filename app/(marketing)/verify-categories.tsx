"use client";

import { useId, useState, type KeyboardEvent } from "react";

type Item = {
  label: string;
  tooltip: string;
};

type VerifyCategoriesProps = {
  items: Item[];
};

function InlineTooltip({ content }: { content: string }) {
  const tooltipId = useId();
  const [open, setOpen] = useState(false);

  function handleClose() {
    setOpen(false);
  }

  function handleToggle() {
    setOpen((prev) => !prev);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Escape") {
      handleClose();
    }
  }

  return (
    <div className="relative" onMouseLeave={handleClose}>
      <button
        type="button"
        className="tooltip-trigger"
        aria-expanded={open}
        aria-label="Informazioni"
        aria-controls={open ? tooltipId : undefined}
        onClick={handleToggle}
        onBlur={handleClose}
        onKeyDown={handleKeyDown}
      >
        i
      </button>
      {open && (
        <div id={tooltipId} className="tooltip-panel" role="status" aria-live="polite">
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
