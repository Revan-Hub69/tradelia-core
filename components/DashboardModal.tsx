'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from './LanguageSelector';
import { useDashboardModal } from '@/contexts/DashboardModalContext';
import Logo from './Logo';
import { 
  CloseIcon, 
  ArrowRightIcon, 
  ArrowLeftIcon,
  ShieldIcon,
  CheckIcon,
  UserIcon,
  CogIcon,
  TrendingUpIcon,
  DiamondIcon,
  DifficultyEasyIcon,
  DifficultyMediumIcon,
  DifficultyHardIcon
} from '@/components/icons/TradeliaIcons';

type CryptoObjective = 'investment' | 'emergency' | 'passive' | 'speculation';
type Experience = 'none' | 'basic' | 'traditional' | 'crypto';
type OtherTools = 'none' | 'pension' | 'diversified' | 'trading';
type StorageMode = 'register' | 'guest';

interface UserProfile {
  objective: CryptoObjective | null;
  experience: Experience | null;
  otherTools: OtherTools | null;
  storageMode: StorageMode | null;
}

export default function DashboardModal() {
  const { t } = useLanguage();
  const { isOpen, closeModal } = useDashboardModal();
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({
    objective: null,
    experience: null,
    otherTools: null,
    storageMode: null
  });

  const totalSteps = 5;

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setProfile({
        objective: null,
        experience: null,
        otherTools: null,
        storageMode: null
      });
    }
  }, [isOpen]);

  // Keyboard navigation and focus management
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
      
      // Tab trapping
      if (event.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements && focusableElements.length > 0) {
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
          
          if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // Focus first element when modal opens
    setTimeout(() => {
      firstFocusableRef.current?.focus();
    }, 100);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeModal]);

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFinish = async () => {
    // TODO: Save profile based on storage mode
    if (profile.storageMode === 'guest') {
      // Save to IndexedDB with encryption
      console.log('Saving to encrypted local storage:', profile);
    } else {
      // Handle registration flow
      console.log('Registration flow:', profile);
    }
    
    closeModal();
    // TODO: Navigate to dashboard
  };

  const canProceed = () => {
    switch (step) {
      case 1: return true; // Disclaimer
      case 2: return profile.objective !== null;
      case 3: return profile.experience !== null;
      case 4: return profile.otherTools !== null;
      case 5: return profile.storageMode !== null;
      default: return false;
    }
  };

  if (!isOpen) return null;

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <ShieldIcon className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">
                {t('modal.disclaimer.title')}
              </h3>
            </div>
            
            <div className="space-y-3">
              <div className="p-4 rounded border border-border/50 bg-muted/30">
                <p className="text-sm text-foreground/90 leading-relaxed">
                  <strong className="text-foreground">{t('modal.disclaimer.educational.title')}:</strong> {t('modal.disclaimer.educational.description')}
                </p>
              </div>
              
              <div className="p-3 rounded border border-border/50 bg-background">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Disclaimer:</strong> {t('modal.disclaimer.responsibility')}
                </p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t('modal.questions.objective.title')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('modal.questions.objective.subtitle')}
              </p>
            </div>
            
            <div className="space-y-2">
              {[
                { key: 'investment', icon: DiamondIcon, difficulty: DifficultyEasyIcon },
                { key: 'emergency', icon: ShieldIcon, difficulty: DifficultyMediumIcon },
                { key: 'passive', icon: CheckIcon, difficulty: DifficultyHardIcon },
                { key: 'speculation', icon: TrendingUpIcon, difficulty: DifficultyHardIcon }
              ].map(({ key, icon: Icon, difficulty: DifficultyIcon }) => (
                <button
                  key={key}
                  onClick={() => setProfile({ ...profile, objective: key as CryptoObjective })}
                  className={`w-full p-3 text-left rounded border transition-all ${
                    profile.objective === key
                      ? 'border-primary bg-primary/5 text-foreground'
                      : 'border-border/50 hover:border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium text-sm">
                          {t(`modal.questions.objective.options.${key}.title`)}
                        </div>
                        <DifficultyIcon className="w-4 h-4 text-muted-foreground/60" />
                      </div>
                      <div className="text-xs opacity-80">
                        {t(`modal.questions.objective.options.${key}.description`)}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t('modal.questions.experience.title')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('modal.questions.experience.subtitle')}
              </p>
            </div>
            
            <div className="space-y-2">
              {['none', 'basic', 'traditional', 'crypto'].map((key) => (
                <button
                  key={key}
                  onClick={() => setProfile({ ...profile, experience: key as Experience })}
                  className={`w-full p-3 text-left rounded border transition-all ${
                    profile.experience === key
                      ? 'border-primary bg-primary/5 text-foreground'
                      : 'border-border/50 hover:border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="font-medium text-sm mb-1">
                    {t(`modal.questions.experience.options.${key}.title`)}
                  </div>
                  <div className="text-xs opacity-80">
                    {t(`modal.questions.experience.options.${key}.description`)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t('modal.questions.tools.title')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('modal.questions.tools.subtitle')}
              </p>
            </div>
            
            <div className="space-y-2">
              {['none', 'pension', 'diversified', 'trading'].map((key) => (
                <button
                  key={key}
                  onClick={() => setProfile({ ...profile, otherTools: key as OtherTools })}
                  className={`w-full p-3 text-left rounded border transition-all ${
                    profile.otherTools === key
                      ? 'border-primary bg-primary/5 text-foreground'
                      : 'border-border/50 hover:border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="font-medium text-sm mb-1">
                    {t(`modal.questions.tools.options.${key}.title`)}
                  </div>
                  <div className="text-xs opacity-80">
                    {t(`modal.questions.tools.options.${key}.description`)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t('modal.questions.storage.title')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('modal.questions.storage.subtitle')}
              </p>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => setProfile({ ...profile, storageMode: 'register' })}
                className={`w-full p-3 text-left rounded border transition-all ${
                  profile.storageMode === 'register'
                    ? 'border-primary bg-primary/5 text-foreground'
                    : 'border-border/50 hover:border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-start gap-3">
                  <UserIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-sm mb-1">
                      {t('modal.questions.storage.options.register.title')}
                    </div>
                    <div className="text-xs opacity-80">
                      {t('modal.questions.storage.options.register.description')}
                    </div>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => setProfile({ ...profile, storageMode: 'guest' })}
                className={`w-full p-3 text-left rounded border transition-all ${
                  profile.storageMode === 'guest'
                    ? 'border-primary bg-primary/5 text-foreground'
                    : 'border-border/50 hover:border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-start gap-3">
                  <ShieldIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-sm mb-1">
                      {t('modal.questions.storage.options.guest.title')}
                    </div>
                    <div className="text-xs opacity-80">
                      {t('modal.questions.storage.options.guest.description')}
                    </div>
                  </div>
                </div>
              </button>
            </div>
            
            <div className="p-3 rounded border border-border/50 bg-muted/30">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t('modal.questions.storage.explanation')}
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={closeModal}
        aria-hidden="true"
      />
      
      {/* Modal Content */}
      <div 
        ref={modalRef}
        className="relative w-full max-w-lg max-h-[90vh] bg-background border border-border/50 rounded-lg shadow-lg animate-scale-in flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/30">
          <div className="flex items-center gap-3">
            <Logo />
            <div>
              <h2 
                id="modal-title"
                className="text-lg font-semibold text-foreground"
              >
                {t('modal.title')}
              </h2>
              <div className="text-xs text-muted-foreground mt-1">
                {t('modal.step')} {step} {t('modal.of')} {totalSteps}
              </div>
            </div>
          </div>
          <button
            ref={firstFocusableRef}
            onClick={closeModal}
            className="p-2 text-muted-foreground hover:text-foreground transition-subtle rounded focus:ring-2 focus:ring-primary/60 focus:ring-offset-2"
            aria-label="Chiudi modale"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="w-full bg-muted/50 rounded-full h-1">
            <div 
              className="bg-primary h-1 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="flex justify-between p-6 border-t border-border/30">
          <button
            onClick={step === 1 ? closeModal : prevStep}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border/50 rounded transition-subtle focus:ring-2 focus:ring-primary/60 focus:ring-offset-2"
          >
            {step === 1 ? (
              <>
                <CloseIcon className="w-4 h-4" />
                {t('modal.actions.cancel')}
              </>
            ) : (
              <>
                <ArrowLeftIcon className="w-4 h-4" />
                {t('modal.actions.back')}
              </>
            )}
          </button>
          
          <button
            onClick={step === totalSteps ? handleFinish : nextStep}
            disabled={!canProceed()}
            className="flex items-center gap-2 btn-tech disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === totalSteps ? (
              <>
                {t('modal.actions.finish')}
                <CheckIcon className="w-4 h-4" />
              </>
            ) : (
              <>
                {t('modal.actions.continue')}
                <ArrowRightIcon className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}