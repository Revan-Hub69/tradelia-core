/**
 * Utility to clean up orphaned OAuth identities
 *
 * This can happen when users are deleted but their OAuth identities remain,
 * causing "User not found" errors during OAuth login attempts.
 */

import { createClient } from './server';

export async function cleanupOrphanedIdentities() {
  const supabase = await createClient();

  try {
    // Find orphaned identities (identities without corresponding users)
    const { data: orphanedIdentities, error: findError } = await supabase
      .from('auth.identities')
      .select(`
        id,
        user_id,
        provider,
        identity_data
      `)
      .not('user_id', 'in', `(SELECT id FROM auth.users)`);

    if (findError) {
      console.error('Error finding orphaned identities:', findError);
      return { success: false, error: findError };
    }

    if (!orphanedIdentities || orphanedIdentities.length === 0) {
      return { success: true, cleaned: 0 };
    }

    // Delete orphaned identities
    const orphanedIds = orphanedIdentities.map(identity => identity.id);
    const { error: deleteError } = await supabase
      .from('auth.identities')
      .delete()
      .in('id', orphanedIds);

    if (deleteError) {
      console.error('Error deleting orphaned identities:', deleteError);
      return { success: false, error: deleteError };
    }

    return {
      success: true,
      cleaned: orphanedIdentities.length,
      identities: orphanedIdentities,
    };
  } catch (error) {
    console.error('Unexpected error during cleanup:', error);
    return { success: false, error };
  }
}

/**
 * Check if a specific email has orphaned identities
 */
export async function checkEmailForOrphanedIdentities(email: string) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('auth.identities')
      .select(`
        id,
        user_id,
        provider,
        identity_data
      `)
      .eq('identity_data->email', email)
      .not('user_id', 'in', `(SELECT id FROM auth.users)`);

    if (error) {
      console.error('Error checking for orphaned identities:', error);
      return { success: false, error };
    }

    return {
      success: true,
      hasOrphaned: data && data.length > 0,
      identities: data || [],
    };
  } catch (error) {
    console.error('Unexpected error during check:', error);
    return { success: false, error };
  }
}
