-- Migration: Create exec_sql function for MCP server
-- Created: 2026-01-28
-- Description: Enables AI assistants to execute arbitrary SQL via MCP

-- ============================================================================
-- FUNCTION: Execute Arbitrary SQL
-- ============================================================================
-- WARNING: This function allows execution of any SQL query.
-- It should only be accessible to service role or highly trusted users.
-- RLS policies should restrict access appropriately.

CREATE OR REPLACE FUNCTION exec_sql(query text)
RETURNS json AS $$
DECLARE
    result json;
    affected_rows int;
BEGIN
    -- Execute the query
    EXECUTE query;
    
    -- Get row count for DML statements
    GET DIAGNOSTICS affected_rows = ROW_COUNT;
    
    -- Return success response
    result := json_build_object(
        'success', true,
        'affected_rows', affected_rows,
        'message', 'Query executed successfully'
    );
    
    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        -- Return error details
        result := json_build_object(
            'success', false,
            'error', SQLERRM,
            'detail', SQLSTATE
        );
        RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SECURITY: Restrict function access
-- ============================================================================

-- Only allow authenticated users to execute
REVOKE ALL ON FUNCTION exec_sql(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION exec_sql(text) TO authenticated;
GRANT EXECUTE ON FUNCTION exec_sql(text) TO service_role;

-- ============================================================================
-- COMMENT
-- ============================================================================
COMMENT ON FUNCTION exec_sql(text) IS 'Executes arbitrary SQL queries. Use with caution. Only accessible to authenticated users and service role.';
