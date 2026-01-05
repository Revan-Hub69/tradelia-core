'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from './LanguageSelector';

interface InitialPopupProps {
  type?: 'disclaimer' | 'welcome' | 'language';
}

export default function InitialPopup({ type = 'disclaimer' }: InitialPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t, locale, setLocale } = useLanguage();

  useEffect(() => {
    // Controlla se il popup è già stato mostrato
    const hasSeenPopup = localStorage.getItem('tradelia-popup-seen');
    if (!hasSeenPopup) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('tradelia-popup-seen', 'true');
  };

  const handleLanguageSelect = (lang: 'it' | 'en') => {
    setLocale(lang);
    handleClose();
  };

  if (!isOpen) return null;

  const renderContent = () => {
    switch (type) {
      case 'welcome':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                {t('popup.welcome.title')}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('popup.welcome.description')}
              </p>
            </div>
            <button 
              onClick={handleClose}
              className="w-full btn-tech"
            >
              {t('popup.welcome.cta')}
            </button>
          </div>
        );

      case 'language':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                Scegli la lingua / Choose language
              </h2>
              <p className="text-sm text-muted-foreground">
                Seleziona la tua lingua preferita per continuare
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleLanguageSelect('it')}
                className="p-4 border border-border/60 rounded-lg hover:bg-muted/30 transition-subtle text-center"
              >
                <div className="text-2xl mb-2">🇮🇹</div>
                <div className="font-medium">Italiano</div>
              </button>
              <button 
                onClick={() => handleLanguageSelect('en')}
                className="p-4 border border-border/60 rounded-lg hover:bg-muted/30 transition-subtle text-center"
              >
                <div className="text-2xl mb-2">🇬🇧</div>
                <div className="font-medium">English</div>
              </button>
            </div>
          </div>
        );

      default: // disclaimer
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-2">
                    {t('popup.disclaimer.title')}
                  </h2>
                  <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                    <p>{t('popup.disclaimer.education')}</p>
                    <p>{t('popup.disclaimer.responsibility')}</p>
                    <p>{t('popup.disclaimer.affiliations')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleClose}
                className="flex-1 btn-tech"
              >
                {t('popup.disclaimer.accept')}
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50" />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-background border border-border/60 rounded-xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
          {renderContent()}
        </div>
      </div>
    </>
  );
}