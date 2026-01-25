import { Clock, Mail } from 'lucide-react';
import type { Metadata } from 'next';

import { ContactForm } from '@/components/forms/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us - Tradelia',
  description: 'Get in touch with the Tradelia team',
};

export default function ContactPage() {
  return (
    <div className="container max-w-2xl py-12">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Contact Us</h1>
          <p className="text-muted-foreground">
            Have a question? We'd love to hear from you. Send us a message and
            we'll respond within 24 hours.
          </p>
        </div>

        {/* Contact info */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">
            Other ways to reach us
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <a
                  href="mailto:support@tradelia.com"
                  className="text-sm text-primary hover:underline"
                >
                  support@tradelia.com
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Response time</p>
                <p className="text-sm text-muted-foreground">
                  Within 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <ContactForm variant="landing" />
      </div>
    </div>
  );
}
