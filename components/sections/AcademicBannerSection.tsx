'use client';

import { useTranslations } from '@/hooks/useTranslations';

export default function AcademicBannerSection() {
  const { academicBanner } = useTranslations();

  return (
    <section className="section-sm bg-muted/30">
      <div className="max-w-2xl mx-auto px-6 sm:px-8">
        <div className="relative overflow-hidden rounded-lg border-l-4 border-primary bg-background p-6 sm:p-8 shadow-sm">
          {/* Pattern geometrico sottile */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -translate-y-8 translate-x-8" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-primary/5 rounded-full translate-y-6 -translate-x-6" />
          </div>
          
          {/* Content */}
          <div className="relative">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              {/* Text */}
              <p className="text-sm sm:text-base text-foreground font-medium leading-relaxed">
                "{academicBanner.text}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}