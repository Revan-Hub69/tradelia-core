-- Fix search_path security issue for cleanup function
CREATE OR REPLACE FUNCTION cleanup_expired_guest_data()
RETURNS void 
SET search_path = public
AS $$
BEGIN
  -- Delete guest data older than 30 days
  DELETE FROM public.start_flow_responses 
  WHERE session_id NOT LIKE '%-%-%-%-%' -- Guest sessions
    AND created_at < now() - interval '30 days';
    
  DELETE FROM public.microlearning_progress 
  WHERE session_id NOT LIKE '%-%-%-%-%' -- Guest sessions
    AND created_at < now() - interval '30 days';
    
  DELETE FROM public.platform_checks 
  WHERE session_id NOT LIKE '%-%-%-%-%' -- Guest sessions
    AND created_at < now() - interval '30 days';
    
  DELETE FROM public.cookie_preferences 
  WHERE session_id IS NOT NULL 
    AND user_id IS NULL 
    AND created_at < now() - interval '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;;
