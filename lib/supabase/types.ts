// Supabase Database Types - Updated for Tradelia schema
// Generated from migration: 001_initial_setup.sql

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          username: string | null
          display_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          display_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          display_name?: string | null
          updated_at?: string
        }
      }
      indicators: {
        Row: {
          id: string
          indicator_type: string
          value: number
          value_class: string | null
          metadata: Record<string, any>
          source: string
          updated_at: string
          created_at: string
        }
        Insert: {
          id?: string
          indicator_type: string
          value: number
          value_class?: string | null
          metadata?: Record<string, any>
          source?: string
          updated_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          indicator_type?: string
          value?: number
          value_class?: string | null
          metadata?: Record<string, any>
          source?: string
          updated_at?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']