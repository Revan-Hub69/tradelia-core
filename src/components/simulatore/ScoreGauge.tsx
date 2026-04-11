'use client';

import { useEffect, useRef } from 'react';

const R = 14;
const CIRCUMFERENCE = 2 * Math.PI * R;

function scoreToColor(score: number): string {
  if (score >= 80) return 'var(--sim-accent)';
  if (score >= 60) return 'var(--sim-success)';
  if (score >= 40) return 'var(--sim-gold)';
  return 'var(--sim-warning)';
}

export function ScoreGauge({ score }: { score: number }) {
  const fillRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (!fillRef.current) return;
    fillRef.current.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - score / 100));
    fillRef.current.style.stroke = scoreToColor(score);
  }, [score]);

  return (
    <svg className="sim-card__gauge-svg" viewBox="0 0 32 32" aria-label={`Score ${score}/100`} role="img">
      <circle className="sim-card__gauge-track" cx="16" cy="16" r={R} />
      <circle
        ref={fillRef}
        className="sim-card__gauge-fill"
        cx="16" cy="16" r={R}
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={CIRCUMFERENCE}
        stroke={scoreToColor(score)}
      />
    </svg>
  );
}
