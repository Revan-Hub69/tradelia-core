-- Abilitare RLS per tutte le tabelle dashboard
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE start_flow_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE microlearning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_checks ENABLE ROW LEVEL SECURITY;

-- Abilitare RLS per tabelle esistenti
ALTER TABLE indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy per user_progress: accesso basato su session_id
CREATE POLICY "Users can access own progress" ON user_progress
  FOR ALL USING (true); -- Per ora permissivo, da raffinare con auth

-- Policy per start_flow_responses: accesso basato su session_id
CREATE POLICY "Users can access own start flow" ON start_flow_responses
  FOR ALL USING (true); -- Per ora permissivo, da raffinare con auth

-- Policy per microlearning_progress: accesso basato su session_id
CREATE POLICY "Users can access own microlearning progress" ON microlearning_progress
  FOR ALL USING (true); -- Per ora permissivo, da raffinare con auth

-- Policy per platform_checks: accesso basato su session_id
CREATE POLICY "Users can access own platform checks" ON platform_checks
  FOR ALL USING (true); -- Per ora permissivo, da raffinare con auth

-- Fix function search_path per sicurezza
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';;
