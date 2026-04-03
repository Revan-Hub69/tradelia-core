'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { ContactFormData } from '@/types/contact';
import { contactFormSchema, INQUIRY_TYPES } from '@/types/contact';
import { AppConfig } from '@/utils/AppConfig';

import { HoneypotField } from './HoneypotField';

type ContactFormProps = {
  variant?: 'landing' | 'dashboard';
  onSuccess?: () => void;
};

export function ContactForm({
  variant = 'landing',
  onSuccess,
}: ContactFormProps) {
  const t = useTranslations('Contact') as any;
  const genericErrorMessage = t('errorMessage', {
    supportEmail: AppConfig.supportEmail,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [messageLength, setMessageLength] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      privacyConsent: false,
    },
  });

  const privacyConsent = watch('privacyConsent');

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      // Check if response has content
      const contentType = response.headers.get('content-type');
      let result;

      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        // Response is not JSON (probably an error)
        const text = await response.text();
        throw new Error(text || 'Server error - no response');
      }

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }

      setSubmitStatus('success');
      reset();
      setMessageLength(0);
      onSuccess?.();
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
      const nextErrorMessage = error instanceof Error ? error.message : '';
      const shouldUseFallback
        = !nextErrorMessage
          || nextErrorMessage === 'Failed to send message'
          || nextErrorMessage === 'Server error - no response'
          || nextErrorMessage === 'Something went wrong';
      setErrorMessage(shouldUseFallback ? genericErrorMessage : nextErrorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Design system classes based on variant
  const containerClass =
    variant === 'landing'
      ? 'rounded-lg border bg-card/50 p-6 backdrop-blur-sm'
      : 'rounded-lg border bg-card p-6 shadow-sm';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* Honeypot field (invisible) */}
      <HoneypotField />

      <div className={containerClass}>
        <div className="space-y-6">
          {/* Name field */}
          <div className="space-y-2">
            <Label htmlFor="name">
              {t('name')}
{' '}
<span className="text-destructive" aria-label="required">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              placeholder={t('namePlaceholder')}
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
              {...register('name')}
            />
            {errors.name && (
              <p
                id="name-error"
                className="text-sm text-destructive"
                role="alert"
              >
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email field */}
          <div className="space-y-2">
            <Label htmlFor="email">
              {t('email')}
{' '}
<span className="text-destructive" aria-label="required">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder={t('emailPlaceholder')}
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              {...register('email')}
            />
            {errors.email && (
              <p
                id="email-error"
                className="text-sm text-destructive"
                role="alert"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone field (optional) */}
          <div className="space-y-2">
            <Label htmlFor="phone">
              {t('phone')}
{' '}
<span className="text-sm text-muted-foreground">
(
{t('optional')}
)
</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder={t('phonePlaceholder')}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              {...register('phone')}
            />
            {errors.phone && (
              <p
                id="phone-error"
                className="text-sm text-destructive"
                role="alert"
              >
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Inquiry Type dropdown */}
          <div className="space-y-2">
            <Label htmlFor="inquiryType">
              {t('inquiryType')}
{' '}
<span className="text-destructive" aria-label="required">*</span>
            </Label>
            <Select
              onValueChange={value =>
                setValue('inquiryType', value as ContactFormData['inquiryType'])}
            >
              <SelectTrigger
                id="inquiryType"
                aria-required="true"
                aria-invalid={!!errors.inquiryType}
                aria-describedby={
                  errors.inquiryType ? 'inquiryType-error' : undefined
                }
              >
                <SelectValue placeholder={t('inquiryTypePlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {INQUIRY_TYPES.map(type => (
                  <SelectItem key={type} value={type}>
                    {t(`inquiryTypes.${type}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.inquiryType && (
              <p
                id="inquiryType-error"
                className="text-sm text-destructive"
                role="alert"
              >
                {errors.inquiryType.message}
              </p>
            )}
          </div>

          {/* Subject field */}
          <div className="space-y-2">
            <Label htmlFor="subject">
              {t('subject')}
{' '}
<span className="text-destructive" aria-label="required">*</span>
            </Label>
            <Input
              id="subject"
              type="text"
              placeholder={t('subjectPlaceholder')}
              aria-required="true"
              aria-invalid={!!errors.subject}
              aria-describedby={errors.subject ? 'subject-error' : undefined}
              {...register('subject')}
            />
            {errors.subject && (
              <p
                id="subject-error"
                className="text-sm text-destructive"
                role="alert"
              >
                {errors.subject.message}
              </p>
            )}
          </div>

          {/* Message field with character counter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="message">
                {t('message')}
{' '}
<span className="text-destructive" aria-label="required">*</span>
              </Label>
              <span
                className={`text-xs ${
                  messageLength > 2000
                    ? 'text-destructive'
                    : 'text-muted-foreground'
                }`}
                aria-live="polite"
              >
                {messageLength}
/2000
              </span>
            </div>
            <Textarea
              id="message"
              rows={6}
              placeholder={t('messagePlaceholder')}
              aria-required="true"
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'message-error' : undefined}
              {...register('message', {
                onChange: e => setMessageLength(e.target.value.length),
              })}
            />
            {errors.message && (
              <p
                id="message-error"
                className="text-sm text-destructive"
                role="alert"
              >
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Privacy consent checkbox */}
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="privacyConsent"
                checked={privacyConsent}
                onCheckedChange={checked =>
                  setValue('privacyConsent', checked as boolean)}
                aria-required="true"
                aria-invalid={!!errors.privacyConsent}
                aria-describedby={
                  errors.privacyConsent ? 'privacy-error' : undefined
                }
              />
              <Label
                htmlFor="privacyConsent"
                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t('privacyConsent')}
{' '}
                <Link
                  href={AppConfig.routes.privacyPolicy}
                  className="text-primary hover:underline"
                  target="_blank"
                >
                  {t('privacyPolicy')}
                </Link>
                <span className="text-destructive"> *</span>
              </Label>
            </div>
            {errors.privacyConsent && (
              <p
                id="privacy-error"
                className="text-sm text-destructive"
                role="alert"
              >
                {errors.privacyConsent.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Submit button */}
      <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
        {isSubmitting ? t('sending') : t('submit')}
      </Button>

      {/* Success message */}
      {submitStatus === 'success' && (
        <div
          className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-900/20"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            <svg
              className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-green-800 dark:text-green-400">
                {t('successTitle')}
              </h3>
              <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                {t('successMessage')}
              </p>
              <p className="mt-2 text-xs text-green-600 dark:text-green-400">
                {t('successNextSteps')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {submitStatus === 'error' && (
        <div
          className="rounded-lg border border-destructive/50 bg-destructive/10 p-4"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-start gap-3">
            <svg
              className="mt-0.5 size-5 shrink-0 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-destructive">
                {t('errorTitle')}
              </h3>
              <p className="mt-1 text-sm text-destructive/90">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
