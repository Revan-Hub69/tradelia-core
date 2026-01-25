'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { ContactFormData } from '@/types/contact';
import { contactFormSchema } from '@/types/contact';

import { HoneypotField } from './HoneypotField';

interface ContactFormProps {
  onSuccess?: () => void;
}

export function ContactForm({ onSuccess }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

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

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }

      setSubmitStatus('success');
      reset();
      onSuccess?.();
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Something went wrong',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* Honeypot field (invisible) */}
      <HoneypotField />

      {/* Name field */}
      <div className="space-y-2">
        <Label htmlFor="name">
          Name <span className="text-destructive" aria-label="required">*</span>
        </Label>
        <Input
          id="name"
          type="text"
          autoComplete="name"
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          {...register('name')}
        />
        {errors.name && (
          <p id="name-error" className="text-sm text-destructive" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email field */}
      <div className="space-y-2">
        <Label htmlFor="email">
          Email <span className="text-destructive" aria-label="required">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
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

      {/* Subject field */}
      <div className="space-y-2">
        <Label htmlFor="subject">
          Subject <span className="text-destructive" aria-label="required">*</span>
        </Label>
        <Input
          id="subject"
          type="text"
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

      {/* Message field */}
      <div className="space-y-2">
        <Label htmlFor="message">
          Message <span className="text-destructive" aria-label="required">*</span>
        </Label>
        <Textarea
          id="message"
          rows={6}
          aria-required="true"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
          {...register('message')}
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

      {/* Submit button */}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>

      {/* Success message */}
      {submitStatus === 'success' && (
        <div
          className="rounded-lg bg-green-50 p-4 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400"
          role="status"
          aria-live="polite"
        >
          ✓ Message sent successfully! We'll reply within 24 hours.
        </div>
      )}

      {/* Error message */}
      {submitStatus === 'error' && (
        <div
          className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive"
          role="alert"
          aria-live="assertive"
        >
          ✗ {errorMessage}
        </div>
      )}
    </form>
  );
}
