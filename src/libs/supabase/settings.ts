/**
 * Supabase Settings Operations
 *
 * Database operations for user settings (UserSettingsV1).
 *
 * @module libs/supabase/settings
 * @version 1.0.0
 * @since 2026-01-21
 */

import type { UserSettingsV1 } from '@/types/settings';

import { createClient } from './client';

// ============================================================================
// Settings Operations
// ============================================================================

/**
 * Get user settings from database
 *
 * @param userId - User ID
 * @returns User settings or null if not found
 */
export const getUserSettings = async (userId: string): Promise<UserSettingsV1 | null> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('user_settings')
    .select('settings, updated_at')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows found - user has no settings yet
      return null;
    }
    throw error;
  }

  if (!data) {
    return null;
  }

  // Parse settings JSON and add server timestamp
  const settings = typeof data.settings === 'string'
    ? JSON.parse(data.settings)
    : data.settings;

  return {
    ...settings,
    updatedAt: data.updated_at, // Server-authoritative timestamp
  };
};

/**
 * Save user settings to database
 *
 * @param userId - User ID
 * @param settings - User settings to save
 * @returns Saved settings with server timestamp
 */
export const saveUserSettings = async (
  userId: string,
  settings: UserSettingsV1,
): Promise<UserSettingsV1> => {
  const supabase = createClient();

  // Remove dirty and pendingUpdatedAt (localStorage-only fields)
  const { dirty, pendingUpdatedAt, updatedAt, ...settingsToSave } = settings;

  // Upsert settings (insert or update)
  const { data, error } = await supabase
    .from('user_settings')
    .upsert({
      user_id: userId,
      settings: settingsToSave,
      updated_at: new Date().toISOString(), // Server sets timestamp
    }, {
      onConflict: 'user_id',
    })
    .select('settings, updated_at')
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('Failed to save settings: no data returned');
  }

  // Parse settings JSON and add server timestamp
  const savedSettings = typeof data.settings === 'string'
    ? JSON.parse(data.settings)
    : data.settings;

  return {
    ...savedSettings,
    updatedAt: data.updated_at, // Server-authoritative timestamp
  };
};

/**
 * Delete user settings from database
 *
 * @param userId - User ID
 */
export const deleteUserSettings = async (userId: string): Promise<void> => {
  const supabase = createClient();

  const { error } = await supabase
    .from('user_settings')
    .delete()
    .eq('user_id', userId);

  if (error) {
    throw error;
  }
};

// ============================================================================
// System Policy Operations (Enterprise)
// ============================================================================

/**
 * Get system policy for user (enterprise feature)
 *
 * System policies are admin-enforced settings that override user preferences.
 * This is typically used in enterprise/education environments.
 *
 * @param userId - User ID
 * @returns System policy or null if no policy applies
 */
export const getSystemPolicy = async (userId: string) => {
  const supabase = createClient();

  // Check if user has organization
  const { data: userOrg } = await supabase
    .from('user_profile')
    .select('organization_id')
    .eq('id', userId)
    .single();

  if (!userOrg?.organization_id) {
    return null; // No organization = no policy
  }

  // Get organization policy
  const { data: policy, error } = await supabase
    .from('organization_policies')
    .select('settings_policy')
    .eq('organization_id', userOrg.organization_id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // No policy defined
    }
    throw error;
  }

  return policy?.settings_policy || null;
};
