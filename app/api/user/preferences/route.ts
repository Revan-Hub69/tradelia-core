/**
 * User Preferences API Route
 * 
 * Handles GET and POST requests for user preferences.
 * Stores in user_profiles.preferences JSONB column.
 */

import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create admin client for server-side operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Get from user_profiles.preferences
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .select('preferences')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching preferences:', error);
      return NextResponse.json(
        { error: 'Failed to fetch preferences' },
        { status: 500 }
      );
    }

    // Return preferences from JSONB or defaults
    const prefs = data?.preferences || {};
    return NextResponse.json({
      country: prefs.country || null,
      technicalLevel: prefs.technicalLevel || 'beginner',
      language: prefs.language || 'it',
    });
  } catch (error) {
    console.error('Preferences GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, country, technicalLevel, language } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Get current preferences
    const { data: current } = await supabaseAdmin
      .from('user_profiles')
      .select('preferences')
      .eq('id', userId)
      .single();

    // Merge with new preferences
    const newPrefs = {
      ...(current?.preferences || {}),
      ...(country !== undefined && { country }),
      ...(technicalLevel !== undefined && { technicalLevel }),
      ...(language !== undefined && { language }),
      updatedAt: new Date().toISOString(),
    };

    // Update user_profiles.preferences
    const { error } = await supabaseAdmin
      .from('user_profiles')
      .update({ 
        preferences: newPrefs,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error('Error saving preferences:', error);
      return NextResponse.json(
        { error: 'Failed to save preferences' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      country: newPrefs.country,
      technicalLevel: newPrefs.technicalLevel,
      language: newPrefs.language,
    });
  } catch (error) {
    console.error('Preferences POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
