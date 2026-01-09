'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from './LanguageSelector';
import { useDashboardModal } from '@/contexts/DashboardModalContext';
import Logo from './Logo';
import RegistrationForm from './RegistrationForm';
import { 
  CloseIcon, 
  ArrowRightIcon, 
  ArrowLeftIcon,
  ShieldIcon,
  CheckIcon,
  UserIcon,
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
  const { t, locale } = useLanguage();
  const { isOpen, closeModal } = useDashboardModal();
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const stepContentRef = useRef<HTMLDivElement>(null);
  
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({
    objective: null,
    experience: null,
    otherTools: null,
    storageMode: null
  });

  const totalSteps = 6; // Aggiunto step registrazione

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

  // Focus management for step changes
  useEffect(() => {
    if (isOpen && stepContentRef.current) {
      if (step === 1) {
        // For disclaimer step, focus the main content area
        setTimeout(() => {
          stepContentRef.current?.focus();
        }, 150);
      } else {
        // For other steps, focus the first interactive element
        const firstButton = stepContentRef.current.querySelector('button');
        if (firstButton) {
          setTimeout(() => {
            firstButton.focus();
          }, 150);
        }
      }
    }
  }, [step, isOpen]);

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
    try {
      if (profile.storageMode === 'guest') {
        // Save to encrypted local storage via Supabase
        const { GuestSessionManager } = await import('@/lib/guestSession');
        const guestManager = new GuestSessionManager();
        
        await guestManager.saveProfile({
          objective: profile.objective,
          experience: profile.experience,
          otherTools: profile.otherTools,
          completedAt: new Date().toISOString()
        });

        // Generate dashboard config based on selections
        const dashboardConfig = generateDashboardConfig(profile);
        await guestManager.saveDashboardConfig(dashboardConfig);
        
        console.log('Guest profile saved successfully');
        closeModal();
        // Navigate to dashboard with guest mode
        window.location.href = `/${locale}/dashboard?guest=true`;
      } else {
        // Show registration form
        setStep(6);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      // TODO: Show error message to user
    }
  };

  const handleRegistrationSuccess = () => {
    // Registration completed, save profile to user account
    console.log('Registration successful, saving profile to user account');
    closeModal();
    // Navigate to dashboard for registered users
    window.location.href = `/${locale}/dashboard`;
  };

  const handleRegistrationBack = () => {
    setStep(5); // Back to storage selection
  };

  // Generate dashboard configuration based on user selections
  const generateDashboardConfig = (userProfile: UserProfile) => {
    const configs = {
      investment: {
        objective_config: {
          title: 'Investimento a lungo termine',
          description: 'Strategia buy & hold con focus su crescita del capitale',
          timeHorizon: 'long-term',
          riskLevel: 'medium'
        },
        risk_warnings: {
          primary: 'Disposition Effect - Tendenza a vendere vincenti troppo presto',
          secondary: 'Volatilità a lungo termine',
          academicSource: 'Shefrin & Statman (1985)'
        },
        recommended_tools: {
          primary: ['DCA automatico', 'Wallet hardware', 'Staking sicuro'],
          avoid: ['Trading con leva', 'Day trading', 'Futures']
        }
      },
      emergency: {
        objective_config: {
          title: 'Asset di emergenza',
          description: 'Riserva di valore per situazioni impreviste',
          timeHorizon: 'variable',
          riskLevel: 'low'
        },
        risk_warnings: {
          primary: 'Volatilità a breve termine',
          secondary: 'Rischi di custodia',
          academicSource: 'Nakamoto (2008) - Store of value thesis'
        },
        recommended_tools: {
          primary: ['Cold storage', 'Hardware wallet', 'Stablecoin allocation'],
          avoid: ['Hot wallet per grandi somme', 'Exchange custody', 'Altcoin speculativi']
        }
      },
      passive: {
        objective_config: {
          title: 'Rendite passive',
          description: 'Generazione di reddito da crypto possedute',
          timeHorizon: 'medium-term',
          riskLevel: 'high'
        },
        risk_warnings: {
          primary: 'Smart contract risk',
          secondary: 'Impermanent loss in liquidity pools',
          academicSource: 'Gudgeon et al. (2020) - DeFi risks'
        },
        recommended_tools: {
          primary: ['Staking validato', 'Lending protocols verificati', 'Yield farming conservativo'],
          avoid: ['Yield farming ad alto rischio', 'Protocolli non auditati', 'Leverage farming']
        }
      },
      speculation: {
        objective_config: {
          title: 'Speculazione',
          description: 'Trading attivo su variazioni di prezzo',
          timeHorizon: 'short-term',
          riskLevel: 'very-high'
        },
        risk_warnings: {
          primary: 'Overconfidence Bias - 73% sovrastima le proprie capacità',
          secondary: 'Overtrading e costi di transazione',
          academicSource: 'Barber & Odean (2001)'
        },
        recommended_tools: {
          primary: ['Stop loss rigorosi', 'Position sizing', 'Analisi tecnica'],
          avoid: ['Leva eccessiva', 'FOMO trading', 'Revenge trading']
        }
      }
    };

    return configs[userProfile.objective as keyof typeof configs] || configs.investment;
  };

  const canProceed = () => {
    switch (step) {
      case 1: return true; // Disclaimer
      case 2: return profile.objective !== null;
      case 3: return profile.experience !== null;
      case 4: return profile.otherTools !== null;
      case 5: return profile.storageMode !== null;
      case 6: return false; // Registration step - handled by form
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

            {/* Legenda difficoltà */}
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground bg-muted/30 rounded p-2">
              <span className="font-medium">{t('modal.questions.difficulty.legend')}</span>
              <div className="flex items-center gap-1">
                <DifficultyEasyIcon className="w-3 h-3" />
                <span>{t('modal.questions.difficulty.easy')}</span>
              </div>
              <div className="flex items-center gap-1">
                <DifficultyMediumIcon className="w-3 h-3" />
                <span>{t('modal.questions.difficulty.medium')}</span>
              </div>
              <div className="flex items-center gap-1">
                <DifficultyHardIcon className="w-3 h-3" />
                <span>{t('modal.questions.difficulty.hard')}</span>
              </div>
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

      case 6:
        return (
          <RegistrationForm 
            onSuccess={handleRegistrationSuccess}
            onBack={handleRegistrationBack}
            profileData={{
              objective: profile.objective || '',
              experience: profile.experience || '',
              otherTools: profile.otherTools || ''
            }}
          />
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
        className="relative w-full max-w-lg max-h-[90vh] bg-background border border-border/50 rounded-lg shadow-lg animate-scale-in flex flex-col mx-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/70">
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
                {step <= 5 ? (
                  <>{t('modal.step')} {step} {t('modal.of')} 5</>
                ) : (
                  <>{t('auth.register.title')}</>
                )}
              </div>
            </div>
          </div>
          <button
            ref={firstFocusableRef}
            onClick={closeModal}
            className="p-2 text-muted-foreground hover:text-foreground transition-subtle rounded focus:ring-2 focus:ring-primary/60 focus:ring-offset-2"
            aria-label={t('auth.common.aria.closeModal')}
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="w-full bg-muted/50 rounded-full h-1">
            <div 
              className="bg-primary h-1 rounded-full transition-all duration-300"
              style={{ width: `${(Math.min(step, 5) / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div 
          className="p-6 overflow-y-auto flex-1" 
          ref={stepContentRef}
          tabIndex={-1}
          style={{ outline: 'none' }}
        >
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="flex justify-between p-6 border-t border-border/70">
          <button
            onClick={step === 1 ? closeModal : (step === 6 ? handleRegistrationBack : prevStep)}
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
          
          {step !== 6 && (
            <button
              onClick={step === 5 ? handleFinish : nextStep}
              disabled={!canProceed()}
              className="flex items-center gap-2 btn-tech disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step === 5 ? (
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
          )}
        </div>
      </div>
    </div>
  );
}
