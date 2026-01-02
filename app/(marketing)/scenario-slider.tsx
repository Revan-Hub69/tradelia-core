"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";

type Scenario = {
  id: string;
  situation: string;
  hiddenError: string;
  clarifies: string;
  doesNotMean: string;
};

type ScenarioSliderProps = {
  title: string;
  ctaSecondary: string;
  ctaSecondaryHref: string;
  items: Scenario[];
};

function clampIndex(index: number, length: number) {
  if (length <= 0) return 0;
  return (index % length + length) % length;
}

export function ScenarioSlider({ title, ctaSecondary, ctaSecondaryHref, items }: ScenarioSliderProps) {
  const [index, setIndex] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);

  const length = items.length;
  const current = useMemo(() => items[clampIndex(index, length)], [items, index, length]);
  const openScenario = useMemo(
    () => (openId ? items.find((item) => item.id === openId) ?? null : null),
    [items, openId]
  );

  function goNext() {
    setIndex((v) => clampIndex(v + 1, length));
  }

  function goPrev() {
    setIndex((v) => clampIndex(v - 1, length));
  }

  function openDetails(id: string) {
    lastActiveRef.current = document.activeElement as HTMLElement | null;
    setOpenId(id);
  }

  function closeDetails() {
    setOpenId(null);
    if (lastActiveRef.current) {
      lastActiveRef.current.focus();
    }
  }

  useEffect(() => {
    if (openScenario) {
      closeButtonRef.current?.focus();
    }
  }, [openScenario]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && openScenario) {
        event.preventDefault();
        closeDetails();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openScenario]);

  function onContainerKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (openScenario) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrev();
    }
  }

  if (items.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p className="text-xs text-muted-foreground" aria-live="polite">
            Scenario {clampIndex(index, length) + 1} di {length}
          </p>
        </div>
        <a href={ctaSecondaryHref} className="link-underline text-sm font-semibold">
          {ctaSecondary}
        </a>
      </div>

      <div
        ref={containerRef}
        className="surface-card rounded-2xl p-6 sm:p-8"
        tabIndex={0}
        onKeyDown={onContainerKeyDown}
        aria-label="Slider scenari. Usa frecce sinistra e destra."
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Situazione</p>
            <p className="text-base text-foreground">{current.situation}</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn-secondary px-3 py-2 text-xs"
              onClick={goPrev}
              aria-label="Scenario precedente"
            >
              Prev
            </button>
            <button
              type="button"
              className="btn-secondary px-3 py-2 text-xs"
              onClick={goNext}
              aria-label="Scenario successivo"
            >
              Next
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="surface-card rounded-2xl p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Errore invisibile</p>
            <p className="mt-2 text-sm text-muted-foreground">{current.hiddenError}</p>
          </div>
          <div className="surface-card rounded-2xl p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Cosa chiarisce</p>
            <p className="mt-2 text-sm text-muted-foreground">{current.clarifies}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            {items.map((item, i) => (
              <button
                key={item.id}
                type="button"
                className="h-2.5 w-2.5 rounded-full border border-border/80 transition-subtle"
                style={{
                  background: i === clampIndex(index, length) ? "hsl(var(--primary))" : "transparent",
                }}
                aria-label={`Vai allo scenario ${i + 1}`}
                aria-current={i === clampIndex(index, length)}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>

          <button
            type="button"
            className="btn-primary px-4 py-2 text-xs"
            onClick={() => openDetails(current.id)}
            aria-label="Apri dettagli scenario"
          >
            Dettagli
          </button>
        </div>
      </div>

      {openScenario && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-background/80 p-4 backdrop-blur sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label="Dettagli scenario"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeDetails();
          }}
        >
          <div className="surface-card w-full max-w-2xl rounded-2xl p-6 sm:p-8">
            <div className="flex items-start justify-between gap-6">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Scenario</p>
                <p className="text-base font-semibold text-foreground">{openScenario.situation}</p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                className="btn-secondary px-3 py-2 text-xs"
                onClick={closeDetails}
                aria-label="Chiudi dettagli"
              >
                Chiudi
              </button>
            </div>

            <div className="mt-6 space-y-4 text-sm text-muted-foreground">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Errore invisibile</p>
                <p className="mt-2">{openScenario.hiddenError}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Cosa chiarisce Tradelia</p>
                <p className="mt-2">{openScenario.clarifies}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Cosa non significa</p>
                <p className="mt-2">{openScenario.doesNotMean}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
