"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Option = {
  id: string;
  label: string;
  subtext: string;
};

type HeroInteractiveProps = {
  question: string;
  options: Option[];
  ctaLabel: string;
  microcopy: string;
};

function ChoiceCard({
  label,
  subtext,
  selected,
  onClick,
}: {
  label: string;
  subtext: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="choice-card w-full"
      data-selected={selected}
      aria-pressed={selected}
      aria-label={`${label}${selected ? " (selezionato)" : ""}`}
      onClick={onClick}
    >
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <p className="mt-2 text-xs text-muted-foreground">{subtext}</p>
    </button>
  );
}

function ProgressLine({ step, steps }: { step: number; steps: number }) {
  const width = useMemo(() => `${Math.round((step / steps) * 100)}%`, [step, steps]);

  return (
    <div className="space-y-2">
      <div className="progress-line">
        <span style={{ width }} />
      </div>
      <p className="text-xs text-muted-foreground">{step}/{steps}</p>
    </div>
  );
}

export function HeroInteractive({ question, options, ctaLabel, microcopy }: HeroInteractiveProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  const isReady = Boolean(selected);
  const helperText = isReady
    ? "Hai selezionato un obiettivo: puoi avviare il controllo."
    : "Scegli un obiettivo per attivare il controllo.";

  function handleStart() {
    if (!selected) return;
    router.push(`/verifica?objective=${selected}`);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-foreground">{question}</p>
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {helperText}
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => (
          <ChoiceCard
            key={option.id}
            label={option.label}
            subtext={option.subtext}
            selected={selected === option.id}
            onClick={() => setSelected(option.id)}
          />
        ))}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button type="button" className="btn-primary" onClick={handleStart} disabled={!isReady}>
          {ctaLabel}
        </button>
        {isReady && <ProgressLine step={1} steps={3} />}
      </div>

      <p className="text-xs text-muted-foreground">{microcopy}</p>
    </div>
  );
}
