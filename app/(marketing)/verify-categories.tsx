"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

type Item = {
  label: string;
  tooltip: string;
};

type VerifyCategoriesProps = {
  items: Item[];
};

function InlineTooltip({ content, label }: { content: string; label: string }) {
  const tooltipId = useId();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node | null;
      if (!target) return;
      if (rootRef.current && !rootRef.current.contains(target)) {
        setOpen(false);
      }
    }

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className="relative" onMouseLeave={handleClose}>
      <button
        type="button"
        className="tooltip-trigger"
        aria-expanded={open}
        aria-label={`Informazioni su ${label}`}
        aria-describedby={open ? tooltipId : undefined}
        aria-controls={open ? tooltipId : undefined}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
      >
        i
      </button>
      {open && (
        <div id={tooltipId} className="tooltip-panel" role="tooltip">
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
        <div key={item.label} className="surface-card surface-card-hover flex items-start justify-between gap-4 p-5">
          <p className="text-sm font-semibold text-foreground">{item.label}</p>
          <InlineTooltip content={item.tooltip} label={item.label} />
        </div>
      ))}
    </div>
  );
}
