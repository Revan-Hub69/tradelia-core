"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";

type LoginResponse = { ok: true; ttlSeconds: number } | { error: string };
type RequestOtpResponse = { ok: true; ttlSeconds: number; devCode?: string } | { error: string };

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function normalizeOtp(value: string) {
  return value.replaceAll(" ", "").trim();
}

function inferErrorMessage(value: unknown) {
  if (!value || typeof value !== "object") return "Login failed.";
  const obj = value as Record<string, unknown>;
  return typeof obj.error === "string" && obj.error.trim().length > 0 ? obj.error : "Login failed.";
}

export function TradingLoginClient() {
  const [email, setEmail] = useState("amministrazione@tradelia.org");
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return normalizeEmail(email).length > 0 && normalizeOtp(otp).length === 6 && !submitting;
  }, [email, otp, submitting]);

  const canRequestOtp = useMemo(() => {
    return normalizeEmail(email).length > 0 && !sendingOtp && !submitting;
  }, [email, sendingOtp, submitting]);

  async function requestOtp() {
    setError(null);
    setInfo(null);
    setSendingOtp(true);

    try {
      const res = await fetch("/api/trading/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizeEmail(email) }),
      });

      const data = (await res.json().catch(() => ({}))) as unknown;
      if (!res.ok) {
        throw new Error(inferErrorMessage(data));
      }

      const payload = data as RequestOtpResponse;
      if (typeof payload === "object" && payload && "devCode" in payload && typeof payload.devCode === "string") {
        setInfo(`DEV code: ${payload.devCode}`);
        setOtp(payload.devCode);
      } else {
        setInfo("Codice inviato via email (controlla la casella).");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invio OTP fallito.");
    } finally {
      setSendingOtp(false);
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/trading/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizeEmail(email),
          otp: normalizeOtp(otp),
        }),
      });

      const data = (await res.json().catch(() => ({}))) as unknown;
      if (!res.ok) {
        throw new Error(inferErrorMessage(data));
      }

      const payload = data as LoginResponse;
      if (!("ok" in payload) || payload.ok !== true) {
        throw new Error(inferErrorMessage(payload));
      }

      window.location.href = "/dashboard/trading";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
      setSubmitting(false);
    }
  }

  return (
    <section className="surface-card w-full max-w-md p-6">
      <div className="space-y-2">
        <h1 className="text-lg font-semibold text-foreground">Accesso Trading</h1>
        <p className="text-sm text-muted-foreground">
          Solo per amministrazione: inserisci email autorizzata + codice OTP via email.
        </p>
      </div>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <label className="block space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Email</span>
          <input
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
          />
        </label>

        <button
          type="button"
          className="btn-secondary w-full px-4 py-2 text-xs"
          onClick={() => void requestOtp()}
          disabled={!canRequestOtp}
        >
          {sendingOtp ? "Invio codice..." : "Invia codice OTP via email"}
        </button>

        <label className="block space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">OTP</span>
          <input
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="123456"
            maxLength={6}
            spellCheck={false}
          />
        </label>

        {info && (
          <div className="rounded-2xl border border-border bg-muted/30 p-4 text-sm text-foreground">{info}</div>
        )}
        {error && <div className="rounded-2xl border border-border bg-muted/30 p-4 text-sm text-foreground">{error}</div>}

        <button type="submit" className="btn-primary w-full px-4 py-2 text-xs" disabled={!canSubmit}>
          {submitting ? "Verifico..." : "Entra"}
        </button>
      </form>

      <details className="accordion mt-6">
        <summary>Setup richiesto</summary>
        <pre className="mt-4 overflow-auto rounded-2xl border border-border bg-background/60 p-4 text-xs text-foreground">{`TRADING_ADMIN_EMAILS=amministrazione@tradelia.org
TRADING_SESSION_SECRET=<random long secret>

# Email OTP (scegli uno)
BREVO_API_KEY=...
RESEND_API_KEY=...
TRADING_SMTP_URL=smtps://user:pass@smtp.example.com:465
TRADING_EMAIL_FROM=Tradelia <amministrazione@tradelia.org>  # sender (consigliato)

# Oppure TOTP (Authenticator) se vuoi:
TRADING_ADMIN_OTP_SECRET=<base32>`}</pre>
      </details>
    </section>
  );
}
