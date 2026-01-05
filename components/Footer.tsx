'use client';

export default function Footer() {
  return (
    <footer 
      className="border-t py-8"
      style={{
        backgroundColor: 'hsl(var(--muted) / 0.3)',
        borderColor: 'hsl(var(--border) / 0.5)'
      }}
    >
      <div className="max-w-2xl mx-auto px-6 sm:px-8">
        <div className="text-center">
          <p className="small-text mb-2">
            © 2026 Tradelia. Strumento educativo per analisi di coerenza.
          </p>
          <p className="small-text">
            Non costituisce consulenza finanziaria. Basato su ricerche accademiche verificabili.
          </p>
        </div>
      </div>
    </footer>
  );
}