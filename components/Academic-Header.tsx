'use client';

import { useState } from 'react';

export const AcademicHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="container-academic">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo - Minimal and Academic */}
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors duration-200">
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none"
                className="text-primary"
              >
                <rect x="3" y="3" width="18" height="18" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              <span className="text-lg font-medium">Tradelia</span>
            </a>
          </div>

          {/* Navigation - Academic Style */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#methodology"
              className="text-body-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Metodologia
            </a>
            <a
              href="#bibliography"
              className="text-body-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Bibliografia
            </a>
            <a
              href="/dashboard"
              className="button-academic text-body-sm"
            >
              Framework
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="space-y-2">
              <a
                href="#methodology"
                className="block py-2 text-body-sm text-muted-foreground hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Metodologia
              </a>
              <a
                href="#bibliography"
                className="block py-2 text-body-sm text-muted-foreground hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Bibliografia
              </a>
              <a
                href="/dashboard"
                className="block py-2 text-body-sm text-primary hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Framework
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};