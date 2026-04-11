'use client';

export function SimulatoreSkeleton({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="sim-skeleton sim-skeleton--card" aria-hidden="true" />
      ))}
    </>
  );
}
