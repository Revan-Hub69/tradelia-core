-- Create support_tickets table for contact form ticketing system
-- Migration: 004
-- Created: 2026-01-26
-- Purpose: Track support tickets from contact form with follow-up automation

CREATE TABLE IF NOT EXISTS support_tickets (
  -- Primary key
  id TEXT PRIMARY KEY,              -- Format: "TKT-2026-123456"
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'pending', 'resolved', 'closed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  -- User information
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_phone TEXT,
  user_locale TEXT NOT NULL CHECK (user_locale IN ('it', 'en')),
  
  -- Ticket information
  inquiry_type TEXT NOT NULL CHECK (inquiry_type IN ('general', 'technical', 'account', 'billing', 'feedback', 'other')),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMP,
  closed_at TIMESTAMP,
  
  -- Assignment (for future use)
  assigned_to TEXT,
  
  -- Tracking metadata
  source TEXT NOT NULL DEFAULT 'contact_form' CHECK (source IN ('contact_form', 'email', 'chat')),
  user_agent TEXT,
  ip_address TEXT,
  
  -- Follow-up automation
  follow_up_sent_at TIMESTAMP,
  follow_up_count INTEGER NOT NULL DEFAULT 0,
  
  -- Feedback (for future use)
  feedback_rating INTEGER CHECK (feedback_rating BETWEEN 1 AND 5),
  feedback_comment TEXT
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON support_tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tickets_user_email ON support_tickets(user_email);
CREATE INDEX IF NOT EXISTS idx_tickets_follow_up ON support_tickets(status, follow_up_sent_at) WHERE status = 'open';

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_support_tickets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_support_tickets_updated_at
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_support_tickets_updated_at();

-- Comments for documentation
COMMENT ON TABLE support_tickets IS 'Support tickets from contact form with follow-up automation';
COMMENT ON COLUMN support_tickets.id IS 'Unique ticket ID in format TKT-YYYY-XXXXXX';
COMMENT ON COLUMN support_tickets.status IS 'Ticket status: open (new), pending (awaiting response), resolved (fixed), closed (archived)';
COMMENT ON COLUMN support_tickets.priority IS 'Ticket priority: low, medium, high, urgent';
COMMENT ON COLUMN support_tickets.user_locale IS 'User language preference for email responses';
COMMENT ON COLUMN support_tickets.follow_up_sent_at IS 'Timestamp of last follow-up email sent';
COMMENT ON COLUMN support_tickets.follow_up_count IS 'Number of follow-up emails sent';
