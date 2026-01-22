/**
 * Debug script to test user data provider behavior
 * Run this in browser console on dashboard page to debug user data issues
 */

console.log('=== USER DATA DEBUG ===');

// Check if user is authenticated with Supabase
const checkSupabaseAuth = async () => {
  try {
    const { createClient } = await import('/src/libs/supabase/client.js');
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    console.log('Supabase Auth User:', user);
    console.log('Supabase Auth Error:', error);
    
    if (user) {
      console.log('User ID:', user.id);
      console.log('User Email:', user.email);
      console.log('Email Verified:', user.email_confirmed_at ? 'Yes' : 'No');
      console.log('User Metadata:', user.user_metadata);
    }
    
    return user;
  } catch (error) {
    console.error('Error checking Supabase auth:', error);
    return null;
  }
};

// Check user progress API
const checkUserProgressAPI = async () => {
  try {
    console.log('Fetching user progress from API...');
    const response = await fetch('/api/user/progress');
    console.log('API Response Status:', response.status);
    console.log('API Response OK:', response.ok);
    
    if (response.ok) {
      const data = await response.json();
      console.log('API Response Data:', data);
    } else {
      const errorText = await response.text();
      console.log('API Error Response:', errorText);
    }
  } catch (error) {
    console.error('Error fetching user progress:', error);
  }
};

// Check React Query cache
const checkReactQueryCache = () => {
  try {
    // Look for React Query DevTools or cache in window
    if (window.__REACT_QUERY_DEVTOOLS_GLOBAL_HOOK__) {
      console.log('React Query DevTools found');
    }
    
    // Check if there's a query client in the DOM
    const queryCache = document.querySelector('[data-testid="query-cache"]');
    if (queryCache) {
      console.log('Query cache element found');
    }
  } catch (error) {
    console.error('Error checking React Query cache:', error);
  }
};

// Run all checks
const runDebug = async () => {
  console.log('Starting debug checks...');
  
  const user = await checkSupabaseAuth();
  await checkUserProgressAPI();
  checkReactQueryCache();
  
  console.log('=== DEBUG COMPLETE ===');
  
  if (user && !user.email_confirmed_at) {
    console.log('🔍 DIAGNOSIS: User is authenticated but email is not verified');
    console.log('💡 EXPECTED: UserDataProvider should return basic user data anyway');
    console.log('🎯 CHECK: Look at browser network tab for /api/user/progress request');
  }
};

// Auto-run
runDebug();