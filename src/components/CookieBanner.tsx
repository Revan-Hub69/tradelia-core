'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

// ─── Consent shape ────────────────────────────────────────────────────────────
export interface ConsentState {
  necessary: true;
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
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(c)); } catch { /* iframe sandbox — silently ignore */ }
}

function applyConsent(c: ConsentState) {
  // ── Analytics: suppress Vercel Analytics event sending when rejected
  if (!c.analytics && typeof window !== 'undefined') {
    (window as any).__va_disable = true;
  }

  // ── Marketing pixels — injected ONLY after explicit consent (GDPR art. 6.1.a)
  // Each block is self-contained. Uncomment + add your ID to activate.
  if (c.marketing && typeof window !== 'undefined') {

    // ── Meta Pixel ──────────────────────────────────────────────────────────
    // TODO: replace 'META_PIXEL_ID' with your actual Pixel ID from Meta Events Manager
    // const META_PIXEL_ID = 'META_PIXEL_ID';
    // if (META_PIXEL_ID && !document.getElementById('meta-pixel')) {
    //   const s = document.createElement('script'); s.id = 'meta-pixel';
    //   s.innerHTML = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`;
    //   document.head.appendChild(s);
    // }

    // ── Google Ads / gtag ────────────────────────────────────────────────────
    // TODO: replace 'G-XXXXXXXXXX' with your Measurement ID from Google Analytics
    // const GTAG_ID = 'G-XXXXXXXXXX';
    // if (GTAG_ID && !document.getElementById('gtag-script')) {
    //   const s = document.createElement('script'); s.id = 'gtag-script'; s.async = true;
    //   s.src = `https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`;
    //   document.head.appendChild(s);
    //   const i = document.createElement('script');
    //   i.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GTAG_ID}');`;
    //   document.head.appendChild(i);
    // }

    // ── Reddit Pixel ────────────────────────────────────────────────────────
    // TODO: replace 'REDDIT_PIXEL_ID' with your Pixel ID from Reddit Ads dashboard
    // const REDDIT_PIXEL_ID = 'REDDIT_PIXEL_ID';
    // if (REDDIT_PIXEL_ID && !document.getElementById('reddit-pixel')) {
    //   const s = document.createElement('script'); s.id = 'reddit-pixel';
    //   s.innerHTML = `!function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement('script');t.src='https://www.redditstatic.com/ads/v2/index.js';t.async=!0;var s=d.getElementsByTagName('script')[0];s.parentNode.insertBefore(t,s)}}(window,document);rdt('init','${REDDIT_PIXEL_ID}');rdt('track','PageVisit');`;
    //   document.head.appendChild(s);
    // }

    // ── X (Twitter) Pixel ───────────────────────────────────────────────────
    // TODO: replace 'X_PIXEL_ID' with your Pixel ID from X Ads dashboard
    // const X_PIXEL_ID = 'X_PIXEL_ID';
    // if (X_PIXEL_ID && !document.getElementById('x-pixel')) {
    //   const s = document.createElement('script'); s.id = 'x-pixel';
    //   s.innerHTML = `!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments)},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');twq('init','${X_PIXEL_ID}');twq('track','PageView');`;
    //   document.head.appendChild(s);
    // }
  }
}

// ─── Toggle component ─────────────────────────────────────────────────────────
function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={[
        'relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200',
        checked
          ? 'bg-emerald-500'
          : 'bg-white/20',
      ].join(' ')}
    >
      <span
        className={[
          'absolute top-0.5 h-4 w-4 rounded-full shadow-sm transition-transform duration-200',
          checked
            ? 'translate-x-[18px] bg-white'
            : 'translate-x-0.5 bg-white/70',
        ].join(' ')}
        aria-hidden="true"
      />
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function CookieBanner() {
  const t      = useTranslations('CookieBanner');
  const locale = useLocale();

  const [mounted,  setMounted]  = useState(false);
  const [visible,  setVisible]  = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [prefs,    setPrefs]    = useState({ analytics: false, marketing: false });
  const acceptBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
    const saved = readConsent();
    if (!saved) {
      // Small delay so the page renders first, then banner slides in
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    } else {
      applyConsent(saved);
    }
  }, []);

  // Focus the primary CTA when banner appears (a11y)
  useEffect(() => {
    if (visible) acceptBtnRef.current?.focus();
  }, [visible]);

  function handleAcceptAll() {
    const c: ConsentState = { necessary: true, analytics: true, marketing: true };
    writeConsent(c); applyConsent(c); setVisible(false);
  }

  function handleNecessaryOnly() {
    const c: ConsentState = { necessary: true, analytics: false, marketing: false };
    writeConsent(c); applyConsent(c); setVisible(false);
  }

  function handleSave() {
    const c: ConsentState = { necessary: true, ...prefs };
    writeConsent(c); applyConsent(c); setVisible(false);
  }

  if (!mounted || !visible) return null;

  return (
    <>
      {/* ── Slide-up animation keyframes ── */}
      <style>{`
        @keyframes cb-slidein {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cb-enter {
          animation: cb-slidein 320ms cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
        }
        @media (prefers-reduced-motion: reduce) {
          .cb-enter { animation: none; }
        }
      `}</style>

      {/*
        Banner card — always dark regardless of site theme.
        Dark surface guarantees contrast on any page background (light or dark).
        Bottom-left floating card: modern pattern (Vercel, Linear, Axeptio).
        On mobile: full-width bottom bar.
      */}
      <div
        role="dialog"
        aria-modal="false"
        aria-label={t('title')}
        aria-live="polite"
        className="cb-enter fixed bottom-4 left-4 right-4 z-[9998] sm:right-auto sm:w-[380px]"
      >
        <div
          className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
          style={{
            background: 'rgba(15, 20, 18, 0.96)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          {/* ── Header ── */}
          <div className="px-5 pt-5 pb-4">
            {/* Emerald dot + title */}
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
              <p className="text-sm font-semibold text-white">{t('title')}</p>
            </div>

            <p className="text-xs leading-[1.7] text-white/60">
              {t('description')}{' '}
              <Link
                href={`/${locale}/privacy-policy`}
                className="text-emerald-400 underline underline-offset-2 transition-colors hover:text-emerald-300"
                tabIndex={0}
              >
                {t('privacy_link')}
              </Link>
              .
            </p>
          </div>

          {/* ── Expanded preferences panel ── */}
          {expanded && (
            <div className="border-t border-white/8 px-5 py-4 space-y-4">

              {/* Necessary — always on, not toggleable */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white/90">{t('category_necessary')}</p>
                  <p className="text-[11px] leading-[1.6] text-white/40 mt-0.5">{t('category_necessary_desc')}</p>
                </div>
                <span className="mt-0.5 shrink-0 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-400">
                  ON
                </span>
              </div>

              {/* Analytics */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white/90">{t('category_analytics')}</p>
                  <p className="text-[11px] leading-[1.6] text-white/40 mt-0.5">{t('category_analytics_desc')}</p>
                </div>
                <Toggle
                  checked={prefs.analytics}
                  onChange={v => setPrefs(p => ({ ...p, analytics: v }))}
                  label={t('category_analytics')}
                />
              </div>

              {/* Marketing */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white/90">{t('category_marketing')}</p>
                  <p className="text-[11px] leading-[1.6] text-white/40 mt-0.5">{t('category_marketing_desc')}</p>
                </div>
                <Toggle
                  checked={prefs.marketing}
                  onChange={v => setPrefs(p => ({ ...p, marketing: v }))}
                  label={t('category_marketing')}
                />
              </div>
            </div>
          )}

          {/* ── Actions ── */}
          <div className="px-5 pb-5 pt-1 space-y-2">

            {/* Primary CTA — visually dominant */}
            {!expanded ? (
              <button
                ref={acceptBtnRef}
                onClick={handleAcceptAll}
                className="w-full rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-150 hover:bg-emerald-400 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
              >
                {t('accept_all')}
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="w-full rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-150 hover:bg-emerald-400 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
              >
                {t('save')}
              </button>
            )}

            {/* Secondary row — low visual weight */}
            <div className="flex items-center justify-between pt-0.5">
              <button
                onClick={() => setExpanded(v => !v)}
                className="text-[11px] text-white/40 underline underline-offset-2 transition-colors hover:text-white/70 focus-visible:outline-none focus-visible:text-white/70"
              >
                {expanded ? '← ' : ''}{t('manage')}
              </button>
              <button
                onClick={handleNecessaryOnly}
                className="text-[11px] text-white/40 underline underline-offset-2 transition-colors hover:text-white/70 focus-visible:outline-none focus-visible:text-white/70"
              >
                {t('accept_necessary')}
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
