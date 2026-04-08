import {
  bigint,
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// This file defines the structure of your database tables using the Drizzle ORM.

// To modify the database schema:
// 1. Update this file with your desired changes.
// 2. Generate a new migration by running: `npm run db:generate`

// The generated migration file will reflect your schema changes.
// The migration is automatically applied during the next database interaction,
// so there's no need to run it manually or restart the Next.js server.

export const organizationSchema = pgTable(
  'organization',
  {
    id: text('id').primaryKey(),
    stripeCustomerId: text('stripe_customer_id'),
    stripeSubscriptionId: text('stripe_subscription_id'),
    stripeSubscriptionPriceId: text('stripe_subscription_price_id'),
    stripeSubscriptionStatus: text('stripe_subscription_status'),
    stripeSubscriptionCurrentPeriodEnd: bigint(
      'stripe_subscription_current_period_end',
      { mode: 'number' },
    ),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => {
    return {
      stripeCustomerIdIdx: uniqueIndex('stripe_customer_id_idx').on(
        table.stripeCustomerId,
      ),
    };
  },
);

export const todoSchema = pgTable('todo', {
  id: serial('id').primaryKey(),
  ownerId: text('owner_id').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// User Profile - stores basic user data and preferences
export const userProfileSchema = pgTable('user_profile', {
  id: text('id').primaryKey(), // Supabase auth.users.id
  email: text('email').notNull(),
  name: text('name'),
  avatar: text('avatar'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Support Tickets - tracks contact form submissions with follow-up automation
export const supportTicketsSchema = pgTable('support_tickets', {
  id: text('id').primaryKey(), // Format: TKT-2026-123456
  status: text('status').notNull().default('open'), // open|pending|resolved|closed
  priority: text('priority').notNull().default('medium'), // low|medium|high|urgent

  // User information
  userName: text('user_name').notNull(),
  userEmail: text('user_email').notNull(),
  userPhone: text('user_phone'),
  userLocale: text('user_locale').notNull(), // it|en

  // Ticket information
  inquiryType: text('inquiry_type').notNull(), // general|technical|account|billing|feedback|other
  subject: text('subject').notNull(),
  message: text('message').notNull(),

  // Timestamps
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  resolvedAt: timestamp('resolved_at', { mode: 'date' }),
  closedAt: timestamp('closed_at', { mode: 'date' }),

  // Assignment (for future use)
  assignedTo: text('assigned_to'),

  // Tracking metadata
  source: text('source').notNull().default('contact_form'), // contact_form|email|chat
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),

  // Follow-up automation
  followUpSentAt: timestamp('follow_up_sent_at', { mode: 'date' }),
  followUpCount: integer('follow_up_count').default(0).notNull(),

  // Feedback (for future use)
  feedbackRating: integer('feedback_rating'), // 1-5
  feedbackComment: text('feedback_comment'),
});
