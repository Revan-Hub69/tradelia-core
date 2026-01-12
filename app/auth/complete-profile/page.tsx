'use client';

import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/components/LanguageSelector';
import { getCountriesSortedByLocale } from '@/lib/countries';
import { validateNickname } from '@/src/shared/lib/validation';
import Logo from '@/components/Logo';
import { 
  UserIcon, 
  GlobeIcon, 
  SearchIcon,
  CheckIcon
} from '@/components/icons/TradeliaIcons';

export default function CompleteProfilePage() {
  const router = useRouter();
  const { t, locale } = useLanguage();
  const [nickname, setNickname] = useState('');
  const [country, setCountry] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Country dropdown state
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const countryRef = useRef<HTMLDivElement>(null);
  const countryInputRef = useRef<HTMLInputElement>(null);

  const validationLocale = (locale === 'it' || locale === 'en') ? locale : 'it';
  const countries = useMemo(() => getCountriesSortedByLocale(validationLocale), [validationLocale]);
  
  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return countries;
    const q = countrySearch.toLowerCase();
    return countries.filter(c => {
      const name = validationLocale === 'it' ? c.nameIt : c.name;
      return name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q);
    });
  }, [countries, countrySearch, validationLocale]);

  const selectedCountry = countries.find(c => c.code === country);

  // Check if user needs to complete profile
  useEffect(() => {
    const checkProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        router.push('/');
        return;
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('nickname, country_code')
        .eq('id', session.user.id)
        .single();

      // If profile is complete, redirect to dashboard
      if (profile?.nickname && profile?.country_code) {
        router.push(`/${locale}/dashboard`);
        return;
      }

      // Pre-fill nickname from Google name if available
      if (!profile?.nickname && session.user.user_metadata?.name) {
        const googleName = session.user.user_metadata.name as string;
        // Convert to valid nickname format (remove spaces, special chars)
        const suggestedNickname = googleName
          .replace(/[^a-zA-Z0-9_]/g, '')
          .substring(0, 20);
        if (suggestedNickname.length >= 3) {
          setNickname(suggestedNickname);
        }
      }

      setIsLoading(false);
    };

    checkProfile();
  }, [router, locale]);

  // Close country dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
        setIsCountryOpen(false);
      }
    }
    if (isCountryOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isCountryOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isCountryOpen && countryInputRef.current) {
      countryInputRef.current.focus();
    }
  }, [isCountryOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate nickname
    const nicknameResult = validateNickname(nickname);
    if (!nicknameResult.success) {
      const errorMessages: Record<string, string> = {
        minLength: validationLocale === 'it' 
          ? 'Il nickname deve avere almeno 3 caratteri' 
          : 'Nickname must be at least 3 characters',
        maxLength: validationLocale === 'it'
          ? 'Il nickname non può superare 20 caratteri'
          : 'Nickname cannot exceed 20 characters',
        invalid: validationLocale === 'it'
          ? 'Solo lettere, numeri e underscore'
          : 'Only letters, numbers and underscore allowed'
      };
      setErrors({ nickname: errorMessages[nicknameResult.error] || 'Invalid nickname' });
      return;
    }

    // Validate country
    if (!country || !/^[A-Z]{2}$/.test(country)) {
      setErrors({ country: validationLocale === 'it' 
        ? 'Seleziona il tuo paese' 
        : 'Please select your country' 
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push('/');
        return;
      }

      // Update profile with nickname and country
      const { error } = await supabase
        .from('user_profiles')
        .update({
          nickname,
          country_code: country,
          updated_at: new Date().toISOString()
        })
        .eq('id', session.user.id);

      if (error) throw error;

      router.push(`/${locale}/dashboard`);
    } catch (err) {
      console.error('Error updating profile:', err);
      setErrors({ 
        submit: validationLocale === 'it' 
          ? 'Errore nel salvataggio. Riprova.' 
          : 'Error saving. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md bg-background border border-border/50 rounded-lg shadow-lg p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <Logo />
          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-foreground">
              {validationLocale === 'it' ? 'Completa il tuo profilo' : 'Complete your profile'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {validationLocale === 'it' 
                ? 'Ancora un passo per iniziare!' 
                : 'One more step to get started!'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nickname */}
          <div className="space-y-2">
            <label htmlFor="nickname" className="block text-sm font-medium text-foreground">
              {validationLocale === 'it' ? 'Nickname' : 'Nickname'}
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80" />
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className={`w-full h-11 pl-10 pr-4 text-sm bg-background border rounded focus:outline-none focus:ring-2 focus:ring-primary ${errors.nickname ? 'border-error' : 'border-border'}`}
                placeholder={validationLocale === 'it' ? 'Il tuo nickname' : 'Your nickname'}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {validationLocale === 'it' 
                ? '3-20 caratteri, solo lettere, numeri e _' 
                : '3-20 characters, letters, numbers and _ only'}
            </p>
            {errors.nickname && <p className="text-xs text-error">{errors.nickname}</p>}
          </div>

          {/* Country */}
          <div className="space-y-2" ref={countryRef}>
            <label className="block text-sm font-medium text-foreground">
              {validationLocale === 'it' ? 'Paese di residenza' : 'Country of residence'}
            </label>
            <div className="relative">
              <GlobeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80 z-10" />
              <button
                type="button"
                onClick={() => { setIsCountryOpen(!isCountryOpen); setCountrySearch(''); }}
                className={`w-full h-11 pl-10 pr-10 text-sm bg-background border rounded text-left ${!country ? 'text-muted-foreground' : 'text-foreground'} ${errors.country ? 'border-error' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-primary`}
              >
                {selectedCountry 
                  ? (validationLocale === 'it' ? selectedCountry.nameIt : selectedCountry.name)
                  : (validationLocale === 'it' ? 'Seleziona paese' : 'Select country')}
              </button>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className={`w-4 h-4 text-muted-foreground transition-transform ${isCountryOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {isCountryOpen && (
                <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-60 overflow-hidden">
                  <div className="p-2 border-b border-border/50">
                    <div className="relative">
                      <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        ref={countryInputRef}
                        type="text"
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        placeholder={validationLocale === 'it' ? 'Cerca paese...' : 'Search country...'}
                        className="w-full h-9 pl-8 pr-3 text-sm bg-muted/30 border-0 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredCountries.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-muted-foreground text-center">
                        {validationLocale === 'it' ? 'Nessun paese trovato' : 'No country found'}
                      </div>
                    ) : (
                      filteredCountries.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => {
                            setCountry(c.code);
                            setIsCountryOpen(false);
                            setCountrySearch('');
                          }}
                          className={`w-full px-3 py-2 text-sm text-left hover:bg-muted/50 flex items-center gap-2 ${country === c.code ? 'bg-primary/10 text-primary' : 'text-foreground'}`}
                        >
                          <span className="text-xs text-muted-foreground w-6">{c.code}</span>
                          <span>{validationLocale === 'it' ? c.nameIt : c.name}</span>
                          {country === c.code && <CheckIcon className="w-4 h-4 ml-auto" />}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            {errors.country && <p className="text-xs text-error">{errors.country}</p>}
          </div>

          {/* Submit error */}
          {errors.submit && (
            <div className="p-3 rounded border border-error/20 bg-error/5 text-sm text-error">
              {errors.submit}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-primary text-white text-sm font-medium rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2"
          >
            {isSubmitting 
              ? (validationLocale === 'it' ? 'Salvataggio...' : 'Saving...') 
              : (validationLocale === 'it' ? 'Continua' : 'Continue')}
          </button>
        </form>
      </div>
    </div>
  );
}
