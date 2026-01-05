import Logo from './Logo';
import LanguageSelector from './LanguageSelector';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 flex h-16 items-center justify-between">
        <Logo />
        
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-8">
            <a 
              href="#metodologia" 
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Metodologia
            </a>
            <a 
              href="#check" 
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Verifica
            </a>
          </nav>
          
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}