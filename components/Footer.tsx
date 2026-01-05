export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-sm text-gray-600">
            © 2026 Tradelia. Questo strumento fornisce verifiche di coerenza, non consigli di investimento.
          </p>
          
          <nav className="flex items-center gap-6 text-sm" aria-label="Link footer">
            <div className="flex items-center gap-2 text-green-600">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span className="font-medium">SSL Secured</span>
            </div>
            
            <a href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">
              Privacy
            </a>
            <a href="/disclaimer" className="text-gray-600 hover:text-gray-900 transition-colors">
              Disclaimer
            </a>
            <a href="/contatti" className="text-gray-600 hover:text-gray-900 transition-colors">
              Contatti
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}