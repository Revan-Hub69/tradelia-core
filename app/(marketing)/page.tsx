'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFadeInObserver } from '@/hooks/useFadeInObserver';
import { useTranslations } from '@/hooks/useTranslations';
import { supabase } from '@/lib/supabase';
import HeroSection from '@/components/sections/HeroSection';
import ResearchSection from '@/components/sections/ResearchSection';
import AcademicBannerSection from '@/components/sections/AcademicBannerSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import DifferentiatorSection from '@/components/sections/DifferentiatorSection';
import TrustSection from '@/components/sections/TrustSection';
import FinalCtaSection from '@/components/sections/FinalCtaSection';
import FaqSchema from '@/components/sections/FaqSchema';

export default function HomePage() {
  const { hero } = useTranslations();
  const router = useRouter();
  
  // Gestisce il token OAuth nel hash fragment (Google redirect)
  useEffect(() => {
    const handleOAuthRedirect = async () => {
      // Controlla se c'è un token nel hash
      if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
        // Supabase gestisce automaticamente il token
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Crea profilo se non esiste
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('id')
            .eq('id', session.user.id)
            .single();

          if (!profile) {
            await supabase.from('user_profiles').insert({
              id: session.user.id,
              email: session.user.email,
              full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
              avatar_url: session.user.user_metadata?.avatar_url,
              storage_preference: 'register',
              created_at: new Date().toISOString()
            });
          }

          // Pulisci l'URL e vai alla dashboard
          window.history.replaceState({}, document.title, '/');
          router.push('/dashboard');
        }
      }
    };

    handleOAuthRedirect();
  }, [router]);
  
  // Hook per gestire le animazioni fade-in
  useFadeInObserver({
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    triggerOnce: true
  });

  return (
    <>
      {/* SEO Meta - Dinamico basato su traduzioni + AI-optimized structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Tradelia",
            "description": hero.description,
            "url": "https://tradelia.com",
            "applicationCategory": "EducationalApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR"
            },
            "audience": {
              "@type": "Audience",
              "audienceType": "Cryptocurrency Beginners"
            },
            "educationalLevel": "Beginner",
            "teaches": [
              "Cryptocurrency Risk Assessment",
              "Investment Decision Making",
              "Behavioral Finance",
              "Financial Literacy"
            ],
            "isBasedOn": [
              {
                "@type": "ScholarlyArticle",
                "name": "Boys will be boys: Gender, overconfidence, and common stock investment",
                "author": "Barber, B. M., & Odean, T."
              }
            ],
            "provider": {
              "@type": "Organization",
              "name": "Tradelia",
              "url": "https://tradelia.com"
            }
          })
        }}
      />

      {/* Sezioni Modulari */}
      <HeroSection />
      <ResearchSection />
      <AcademicBannerSection />
      <HowItWorksSection />
      <DifferentiatorSection />
      <TrustSection />
      <FinalCtaSection />
      <FaqSchema />
    </>
  );
}