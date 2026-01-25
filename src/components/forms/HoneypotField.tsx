'use client';

/**
 * Honeypot Field - Invisible spam trap
 *
 * How it works:
 * 1. Hidden from humans via CSS (position: absolute, opacity: 0)
 * 2. Bots fill it because they see it in HTML
 * 3. Server rejects if field is not empty
 *
 * IMPORTANT: Do NOT use display: none (bots detect it)
 */
export function HoneypotField() {
  return (
    <div
      className="absolute left-0 top-0 -z-10 h-0 w-0 opacity-0"
      aria-hidden="true"
      tabIndex={-1}
    >
      <label htmlFor="website">Website (leave blank)</label>
      <input
        type="text"
        id="website"
        name="website"
        autoComplete="off"
        tabIndex={-1}
      />
    </div>
  );
}
