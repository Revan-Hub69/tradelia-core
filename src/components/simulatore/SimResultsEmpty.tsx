'use client';

export function SimResultsEmpty() {
  return (
    <div className="sim-results__empty" role="status">
      <svg
        className="sim-results__empty-icon"
        width="40" height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M3 3h18M3 9h18M3 15h12M3 21h8" />
      </svg>
      <p>Imposta un'esposizione e seleziona la categoria per vedere i risultati.</p>
    </div>
  );
}
