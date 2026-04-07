'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

// ─── Consent shape ───────────────────────────────────────────────────────────
export interface ConsentState {
  necessary: true;      // always true, not toggleable
  analytics: boolean;
  marketing: boolean;
}

const STORAGE_KEY = 'tradelia_cookie_consent';

function readConsent(): ConsentState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ConsentState;
  } catch {
    return null;
  }
}

function writeConsent(c: ConsentState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
  } catch { /* sandboxed iframe — silently ignore */ }
}

// ─── Component ───────────────────────────────────────────────────────────────
export function CookieBanner() {
  const t      = useTranslations('CookieBanner');
  const locale = useLocale();

  const [visible,  setVisible]  = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [prefs,    setPrefs]    = useState<Omit<ConsentState, 'necessary'>>({
    analytics: false,
    marketing: false,
  });

  // Show banner only if consent not yet recorded
  useEffect(() => {
    const saved = readConsent();
    if (!saved) setVisible(true);
    else applyConsent(saved);
  }, []);

  function applyConsent(c: ConsentState) {
    // ── Analytics: Vercel Analytics is loaded via next/font server-side.
    //    We use window.__va_disable to suppress event sending when rejected.
    if (!c.analytics && typeof window !== 'undefined') {
      (window as any).__va_disable = true;
    }

    // ── Marketing pixels — inject only after consent ──────────────────────
    // Each block is a self-contained script injection. Add your IDs below.
    // The guard `if (c.marketing && typeof window !== 'undefined')` ensures
    // pixels are NEVER loaded without explicit user consent (GDPR art. 6.1.a)

    if (c.marketing && typeof window !== 'undefined') {
      // ── Meta Pixel ───────────────────────────────────────────────────────
      // TODO: replace 'META_PIXEL_ID' with your actual Pixel ID
      // const META_PIXEL_ID = 'META_PIXEL_ID';
      // if (META_PIXEL_ID && !document.getElementById('meta-pixel')) {
      //   const s = document.createElement('script');
      //   s.id = 'meta-pixel';
      //   s.innerHTML = `!function(f,b,e,v,n,t,s){...}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`;
      //   document.head.appendChild(s);
      // }

      // ── Google Ads / gtag ────────────────────────────────────────────────
      // TODO: replace 'G-XXXXXXXXXX' with your Measurement ID
      // const GTAG_ID = 'G-XXXXXXXXXX';
      // if (GTAG_ID && !document.getElementById('gtag-script')) {
      //   const s = document.createElement('script');
      //   s.id = 'gtag-script';
      //   s.async = true;
      //   s.src = `https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`;
      //   document.head.appendChild(s);
      //   const i = document.createElement('script');
      //   i.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GTAG_ID}');`;
      //   document.head.appendChild(i);
      // }

      // ── Reddit Pixel ─────────────────────────────────────────────────────
      // TODO: replace 'REDDIT_PIXEL_ID' with your Pixel ID
      // const REDDIT_PIXEL_ID = 'REDDIT_PIXEL_ID';
      // if (REDDIT_PIXEL_ID && !document.getElementById('reddit-pixel')) {
      //   const s = document.createElement('script');
      //   s.id = 'reddit-pixel';
      //   s.innerHTML = `!function(w,d){...}(window,document);rdt('init','${REDDIT_PIXEL_ID}');rdt('track','PageVisit');`;
      //   document.head.appendChild(s);
      // }

      // ── X (Twitter) Pixel ────────────────────────────────────────────────
      // TODO: replace 'X_PIXEL_ID' with your Pixel ID
      // const X_PIXEL_ID = 'X_PIXEL_ID';
      // if (X_PIXEL_ID && !document.getElementById('x-pixel')) {
      //   const s = document.createElement('script');
      //   s.id = 'x-pixel';
      //   s.innerHTML = `!function(e,t,n,s,u,a){...}();twq('init','${X_PIXEL_ID}');twq('track','PageView');`;
      //   document.head.appendChild(s);
      // }
    }
  }

  function handleAcceptAll() {
    const c: ConsentState = { necessary: true, analytics: true, marketing: true };
    writeConsent(c);
    applyConsent(c);
    setVisible(false);
  }

  function handleNecessaryOnly() {
    const c: ConsentState = { necessary: true, analytics: false, marketing: false };
    writeConsent(c);
    applyConsent(c);
    setVisible(false);
  }

  function handleSave() {
    const c: ConsentState = { necessary: true, ...prefs };
    writeConsent(c);
    applyConsent(c);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={t('title')}
      className="fixed bottom-0 left-0 right-0 z-[9998] border-t border-border/60 bg-card/95 shadow-lg backdrop-blur-md"
    >
      <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">

        {/* Main row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <p className="mb-1 text-sm font-semibold text-foreground">{t('title')}</p>
            <p className="text-xs leading-6 text-muted-foreground">
              {t('description')}{' '}
              <Link
                href={`/${locale}/privacy-policy`}
                className="underline underline-offset-2 hover:text-primary transition-colors"
              >
                {t('privacy_link')}
              </Link>
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <button
              onClick={() => setExpanded(v => !v)}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {t('manage')}
            </button>
            <button
              onClick={handleNecessaryOnly}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {t('accept_necessary')}
            </button>
            <button
              onClick={handleAcceptAll}
              className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t('accept_all')}
            </button>
          </div>
        </div>

        {/* Expanded preferences panel */}
        {expanded && (
          <div className="mt-4 space-y-3 border-t border-border/40 pt-4">

            {/* Necessary — always on */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-foreground">{t('category_necessary')}</p>
                <p className="text-xs text-muted-foreground">{t('category_necessary_desc')}</p>
              </div>
              <div className="flex h-5 w-9 shrink-0 items-center justify-center rounded-full bg-primary/20">
                <span className="text-[10px] font-bold text-primary">ON</span>
              </div>
            </div>

            {/* Analytics */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-foreground">{t('category_analytics')}</p>
                <p className="text-xs text-muted-foreground">{t('category_analytics_desc')}</p>
              </div>
              <button
                role="switch"
                aria-checked={prefs.analytics}
                onClick={() => setPrefs(p => ({ ...p, analytics: !p.analytics }))}
                className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
                  prefs.analytics ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    prefs.analytics ? 'translate-x-4' : 'translate-x-0.5'
                  }`}
                />
                <span className="sr-only">{t('category_analytics')}</span>
              </button>
            </div>

            {/* Marketing */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-foreground">{t('category_marketing')}</p>
                <p className="text-xs text-muted-foreground">{t('category_marketing_desc')}</p>
              </div>
              <button
                role="switch"
                aria-checked={prefs.marketing}
                onClick={() => setPrefs(p => ({ ...p, marketing: !p.marketing }))}
                className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
                  prefs.marketing ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    prefs.marketing ? 'translate-x-4' : 'translate-x-0.5'
                  }`}
                />
                <span className="sr-only">{t('category_marketing')}</span>
              </button>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={handleSave}
                className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {t('save')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
