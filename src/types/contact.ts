import { z } from 'zod';

// Inquiry types for categorization
export const INQUIRY_TYPES = [
  'general',
  'technical',
  'account',
  'billing',
  'feedback',
  'other',
] as const;

export type InquiryType = (typeof INQUIRY_TYPES)[number];

// Validation schema
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),

  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),

  phone: z
    .string()
    .regex(/^\+?\(?\d{1,4}\)?[-\s.]?\(?\d{1,4}\)?[-\s.]?\d{1,9}$/, {
      message: 'Please enter a valid phone number',
    })
    .optional()
    .or(z.literal('')),

  inquiryType: z.enum(INQUIRY_TYPES, {
    required_error: 'Please select an inquiry type',
  }),

  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must be less than 200 characters'),

  message: z
    .string()
    .min(20, 'Message must be at least 20 characters')
    .max(2000, 'Message must be less than 2000 characters'),

  privacyConsent: z.boolean().refine(val => val === true, {
    message: 'You must accept the privacy policy',
  }),

  // Honeypot field (must be empty)
  website: z.string().max(0).optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// API response types
export type ContactFormResponse = {
  success: boolean;
  message: string;
  error?: string;
};
