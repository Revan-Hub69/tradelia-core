import { createClient } from './client';

// User Profile Operations
export const createUserProfile = async (userData: {
  id: string;
  email: string;
  name?: string;
}) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('user_profile')
    .insert([userData])
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
};

export const getUserProfile = async (userId: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('user_profile')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  } // PGRST116 = no rows
  return data;
};

export const updateUserProfile = async (userId: string, updates: any) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('user_profile')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
};
