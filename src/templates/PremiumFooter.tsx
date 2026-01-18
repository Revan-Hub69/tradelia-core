'use client';

import { useEffect, useRef, useState } from 'react';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { AppConfig } from '@/utils/AppConfig';

import { Logo } from './Logo';

/**
 * Intersection Observer hook for scroll animations
 */
const useInView = (threshold = 0.1) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); // Animate only once
        }
      },
      { threshold },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
};

/**
 * Animated section component
 */
const AnimatedSection = ({ 
  children, 
  delay = 0, 
  className = '' 
}: { 
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isInView 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-8 opacity-0'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

/**
 * Social icon component with hover animations
 */
const SocialIcon = ({ 
  href, 
  children, 
  label 
}: { 
  href: string;
  children: React.ReactNode;
  label: string;
}) => (
  <Link
    href={href}
    className="group relative flex size-10 items-center justify-center rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/20"
    aria-label={label}
  >
    <div className="size-5 text-muted-foreground transition-colors duration-300 group-hover:text-primary [&>svg]:size-full [&>svg]:fill-current">
      {children}
    </div>
  </Link>
);

/**
 * Navigation link with premium styling
 */
const NavLink = ({ 
  href, 
  children 
}: { 
  href: string;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className="group relative text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground"
  >
    {children}
    <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-primary transition-all duration-300 group-hover:w-full" />
  </Link>
);

export const PremiumFooter = () => {
  const t = useTranslations('PremiumFooter' as any) as (key: string) => string;

  const footerSections = [
    {
      title: t('product_section'),
      links: [
        { label: t('features'), href: '/features' },
        { label: t('pricing'), href: '/pricing' },
        { label: t('roadmap'), href: '/roadmap' },
        { label: t('changelog'), href: '/changelog' },
      ],
    },
    {
      title: t('resources_section'),
      links: [
        { label: t('docs'), href: '/docs' },
        { label: t('blog'), href: '/blog' },
        { label: t('guides'), href: '/guides' },
        { label: t('api'), href: '/api' },
      ],
    },
    {
      title: t('community_section'),
      links: [
        { label: t('community'), href: '/community' },
        { label: t('discord'), href: '/discord' },
        { label: t('newsletter'), href: '/newsletter' },
        { label: t('events'), href: '/events' },
      ],
    },
    {
      title: t('company_section'),
      links: [
        { label: t('about'), href: '/about' },
        { label: t('careers'), href: '/careers' },
        { label: t('contact'), href: '/contact' },
        { label: t('press'), href: '/press' },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-border/50 bg-gradient-to-b from-background to-muted/30">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,rgba(120,119,198,0.05)_50%,transparent_100%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Brand section */}
          <AnimatedSection className="lg:col-span-4">
            <div className="space-y-6">
              <Logo />
              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                {t('brand_description')}
              </p>
              
              {/* Social links */}
              <div className="flex gap-3">
                <SocialIcon href="/github" label="GitHub">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                </SocialIcon>
                
                <SocialIcon href="/twitter" label="Twitter">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.954 4.569a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.691 8.094 4.066 6.13 1.64 3.161a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.061a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z" />
                  </svg>
                </SocialIcon>
                
                <SocialIcon href="/linkedin" label="LinkedIn">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </SocialIcon>
                
                <SocialIcon href="/discord" label="Discord">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </SocialIcon>
              </div>
            </div>
          </AnimatedSection>

          {/* Navigation sections */}
          <div className="lg:col-span-8">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {footerSections.map((section, index) => (
                <AnimatedSection key={section.title} delay={100 + index * 50}>
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-foreground">
                      {section.title}
                    </h3>
                    <ul className="space-y-3">
                      {section.links.map(link => (
                        <li key={link.href}>
                          <NavLink href={link.href}>
                            {link.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter section */}
        <AnimatedSection delay={400} className="mt-16">
          <div className="rounded-2xl border border-border/50 bg-card/50 p-8 backdrop-blur-sm">
            <div className="mx-auto max-w-2xl text-center">
              <h3 className="text-lg font-semibold text-foreground">
                {t('newsletter_title')}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {t('newsletter_desc')}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <input
                  type="email"
                  placeholder={t('newsletter_placeholder')}
                  className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:max-w-xs"
                />
                <button
                  type="button"
                  className="rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
                >
                  {t('newsletter_button')}
                </button>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Bottom section */}
        <AnimatedSection delay={500} className="mt-16">
          <div className="border-t border-border/50 pt-8">
            {/* Educational disclaimer */}
            <div className="mb-6 rounded-xl border border-warning/20 bg-warning/5 p-4">
              <p className="text-xs leading-relaxed text-muted-foreground">
                <strong className="text-warning">{t('disclaimer_title')}</strong>
                {' '}
                {t('disclaimer')}
              </p>
            </div>

            {/* Copyright and legal */}
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} {AppConfig.name}. {t('copyright')}
              </div>
              
              <div className="flex gap-6 text-sm">
                <NavLink href="/privacy">
                  {t('privacy_policy')}
                </NavLink>
                <NavLink href="/terms">
                  {t('terms_of_service')}
                </NavLink>
                <NavLink href="/cookies">
                  {t('cookies')}
                </NavLink>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </footer>
  );
};