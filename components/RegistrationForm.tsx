'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from './LanguageSelector';
import { 
  UserIcon, 
  MailIcon, 
  LockIcon, 
  ArrowRightIcon,
  CheckIcon 
} from '@/components/icons/TradeliaIcons';

interface RegistrationFormProps {
  onSuccess: () => void;
  onBack: () => void;
  profileData?: {
    objective: string;
    experience: string;
    otherTools: string;
  };
}

export default function RegistrationForm({ onSuccess, onBack, profileData }: RegistrationFormProps) {
  const { signUpWithEmail, signInWithGoogle, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email richiesta';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email non valida';
    }

    if (!formData.password) {
      newErrors.password = 'Password richiesta';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password deve essere di almeno 8 caratteri';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Le password non coincidono';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nome richiesto';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const result = await signUpWithEmail(formData.email, formData.password, formData.fullName);
      
      // If registration successful and we have profile data, save it
      if (result?.user && profileData) {
        const { supabase } = await import('@/lib/supabase');
        
        // Update user profile with onboarding data
        await supabase
          .from('user_profiles')
          .update({
            crypto_objective: profileData.objective,
            experience_level: profileData.experience,
            other_tools: profileData.otherTools,
            onboarding_completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', result.user.id);

        // Generate and save dashboard config
        const dashboardConfig = generateDashboardConfig(profileData);
        await supabase
          .from('dashboard_configs')
          .insert({
            user_id: result.user.id,
            objective_config: dashboardConfig.objective_config,
            risk_warnings: dashboardConfig.risk_warnings,
            recommended_tools: dashboardConfig.recommended_tools
          });
      }
      
      onSuccess();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Errore durante la registrazione';
      setErrors({ submit: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Note: Profile data will be saved in the auth callback
      onSuccess();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Errore durante l\'accesso con Google';
      setErrors({ submit: message });
    }
  };

  // Profile data type for dashboard config generation
  interface UserProfileData {
    objective: string;
    experience: string;
    otherTools: string;
  }

  // Generate dashboard configuration (same logic as in DashboardModal)
  const generateDashboardConfig = (userProfile: UserProfileData) => {
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Crea il tuo account
        </h3>
        <p className="text-sm text-muted-foreground">
          Sincronizza le tue preferenze su tutti i dispositivi
        </p>
      </div>

      {/* Google Sign In */}
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 p-3 border border-border/50 rounded hover:bg-muted/30 transition-all disabled:opacity-50"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continua con Google
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/30" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">oppure</span>
        </div>
      </div>

      {/* Email Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Nome completo
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-border/50 rounded focus:ring-2 focus:ring-primary/60 focus:border-primary text-sm"
              placeholder="Mario Rossi"
            />
          </div>
          {errors.fullName && (
            <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email
          </label>
          <div className="relative">
            <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-border/50 rounded focus:ring-2 focus:ring-primary/60 focus:border-primary text-sm"
              placeholder="mario@esempio.it"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-600 mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Password
          </label>
          <div className="relative">
            <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-border/50 rounded focus:ring-2 focus:ring-primary/60 focus:border-primary text-sm"
              placeholder="Minimo 8 caratteri"
            />
          </div>
          {errors.password && (
            <p className="text-xs text-red-600 mt-1">{errors.password}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Conferma password
          </label>
          <div className="relative">
            <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-border/50 rounded focus:ring-2 focus:ring-primary/60 focus:border-primary text-sm"
              placeholder="Ripeti la password"
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-tech disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            'Creazione account...'
          ) : (
            <>
              Crea account
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </>
          )}
        </button>
      </form>

      <div className="p-3 bg-muted/30 rounded text-xs text-muted-foreground">
        <div className="flex items-start gap-2">
          <CheckIcon className="w-3 h-3 mt-0.5 text-primary flex-shrink-0" />
          <span>
            Creando un account accetti i nostri termini di servizio e confermi di aver letto la privacy policy.
          </span>
        </div>
      </div>

      <div className="text-center">
        <a
          href="/auth/forgot-password"
          className="text-xs text-primary hover:text-primary/80 transition-subtle"
        >
          Password dimenticata?
        </a>
      </div>
    </div>
  );
}