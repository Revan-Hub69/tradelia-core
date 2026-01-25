import { Mail } from 'lucide-react';
import type { Metadata } from 'next';

import { FAQSection } from '@/components/faq/FAQSection';
import { ContactForm } from '@/components/forms/ContactForm';

export const metadata: Metadata = {
  title: 'Help & Support - Tradelia Dashboard',
  description: 'Get help with Tradelia - FAQ and contact support',
};

export default function DashboardHelpPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Help & Support</h1>
        <p className="mt-2 text-muted-foreground">
          Find answers to common questions or contact our support team
        </p>
      </div>

      {/* Support Info Card */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-primary/10 p-3">
            <Mail className="size-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">Need Help?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Our support team is here to help. Email us at
{' '}
              <a
                href="mailto:support@tradelia.org"
                className="text-primary hover:underline"
              >
                support@tradelia.org
              </a>
{' '}
              or use the contact form below.
            </p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              <div>
                <span className="font-medium">Response Time:</span>
{' '}
                <span className="text-muted-foreground">Within 24 hours</span>
              </div>
              <div>
                <span className="font-medium">Availability:</span>
{' '}
                <span className="text-muted-foreground">Monday - Friday, 9AM - 6PM CET</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQSection variant="dashboard" />

      {/* Contact Form */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Contact Support</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Can't find what you're looking for? Send us a message and we'll get back to you.
          </p>
        </div>
        <ContactForm variant="dashboard" />
      </section>
    </div>
  );
}
