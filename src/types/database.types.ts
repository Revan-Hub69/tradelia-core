export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      offers: {
        Row: {
          account_currency: string | null
          account_size: number | null
          badges: Json | null
          created_at: string | null
          current_participants: number | null
          display_order: number
          end_date: string | null
          entry_fee: number | null
          fee_currency: string | null
          first_prize: number | null
          frequency: Database["public"]["Enums"]["frequency_enum"]
          geo_list: Json | null
          geo_mode: Database["public"]["Enums"]["geo_mode_enum"] | null
          id: string
          is_featured: boolean
          is_hot: boolean
          kyc_required: boolean
          max_participants: number | null
          min_age: number | null
          next_edition_date: string | null
          offer_name: string | null
          prize_pool: number | null
          program_id: string
          recurring: boolean
          refund_conditions: string | null
          refundable: boolean
          registration_deadline: string | null
          scaling_conditions: string | null
          scaling_max: number | null
          start_date: string | null
          tags: Json | null
          time_limit_days: number | null
          updated_at: string | null
        }
        Insert: {
          account_currency?: string | null
          account_size?: number | null
          badges?: Json | null
          created_at?: string | null
          current_participants?: number | null
          display_order?: number
          end_date?: string | null
          entry_fee?: number | null
          fee_currency?: string | null
          first_prize?: number | null
          frequency?: Database["public"]["Enums"]["frequency_enum"]
          geo_list?: Json | null
          geo_mode?: Database["public"]["Enums"]["geo_mode_enum"] | null
          id: string
          is_featured?: boolean
          is_hot?: boolean
          kyc_required?: boolean
          max_participants?: number | null
          min_age?: number | null
          next_edition_date?: string | null
          offer_name?: string | null
          prize_pool?: number | null
          program_id: string
          recurring?: boolean
          refund_conditions?: string | null
          refundable?: boolean
          registration_deadline?: string | null
          scaling_conditions?: string | null
          scaling_max?: number | null
          start_date?: string | null
          tags?: Json | null
          time_limit_days?: number | null
          updated_at?: string | null
        }
        Update: {
          account_currency?: string | null
          account_size?: number | null
          badges?: Json | null
          created_at?: string | null
          current_participants?: number | null
          display_order?: number
          end_date?: string | null
          entry_fee?: number | null
          fee_currency?: string | null
          first_prize?: number | null
          frequency?: Database["public"]["Enums"]["frequency_enum"]
          geo_list?: Json | null
          geo_mode?: Database["public"]["Enums"]["geo_mode_enum"] | null
          id?: string
          is_featured?: boolean
          is_hot?: boolean
          kyc_required?: boolean
          max_participants?: number | null
          min_age?: number | null
          next_edition_date?: string | null
          offer_name?: string | null
          prize_pool?: number | null
          program_id?: string
          recurring?: boolean
          refund_conditions?: string | null
          refundable?: boolean
          registration_deadline?: string | null
          scaling_conditions?: string | null
          scaling_max?: number | null
          start_date?: string | null
          tags?: Json | null
          time_limit_days?: number | null
          updated_at?: string | null
        }
      }
      programs: {
        Row: {
          best_for: string | null
          category: Database["public"]["Enums"]["program_category_enum"]
          cons: Json | null
          created_at: string | null
          description: string | null
          faq_url: string | null
          free_trial_description: string | null
          free_trial_url: string | null
          has_free_trial: boolean
          id: string
          name: string
          not_recommended_for: string | null
          official_url: string
          organizer_id: string
          pros: Json | null
          ruleset_mode: Database["public"]["Enums"]["ruleset_mode_enum"] | null
          status: Database["public"]["Enums"]["program_status_enum"]
          subtype: string | null
          terms_url: string | null
          type: Database["public"]["Enums"]["program_type_enum"]
          updated_at: string | null
        }
        Insert: {
          best_for?: string | null
          category: Database["public"]["Enums"]["program_category_enum"]
          cons?: Json | null
          created_at?: string | null
          description?: string | null
          faq_url?: string | null
          free_trial_description?: string | null
          free_trial_url?: string | null
          has_free_trial?: boolean
          id: string
          name: string
          not_recommended_for?: string | null
          official_url: string
          organizer_id: string
          pros?: Json | null
          ruleset_mode?: Database["public"]["Enums"]["ruleset_mode_enum"] | null
          status?: Database["public"]["Enums"]["program_status_enum"]
          subtype?: string | null
          terms_url?: string | null
          type: Database["public"]["Enums"]["program_type_enum"]
          updated_at?: string | null
        }
        Update: {
          best_for?: string | null
          category?: Database["public"]["Enums"]["program_category_enum"]
          cons?: Json | null
          created_at?: string | null
          description?: string | null
          faq_url?: string | null
          free_trial_description?: string | null
          free_trial_url?: string | null
          has_free_trial?: boolean
          id?: string
          name?: string
          not_recommended_for?: string | null
          official_url?: string
          organizer_id?: string
          pros?: Json | null
          ruleset_mode?: Database["public"]["Enums"]["ruleset_mode_enum"] | null
          status?: Database["public"]["Enums"]["program_status_enum"]
          subtype?: string | null
          terms_url?: string | null
          type?: Database["public"]["Enums"]["program_type_enum"]
          updated_at?: string | null
        }
      }
    }
    Views: {
      dashboard_offers: {
        Row: {
          account_currency: string | null
          account_size: number | null
          badges: Json | null
          category: Database["public"]["Enums"]["program_category_enum"] | null
          cons: Json | null
          current_participants: number | null
          display_order: number | null
          end_date: string | null
          entry_fee: number | null
          fee_currency: string | null
          first_prize: number | null
          frequency: Database["public"]["Enums"]["frequency_enum"] | null
          geo_list: Json | null
          geo_mode: Database["public"]["Enums"]["geo_mode_enum"] | null
          has_free_trial: boolean | null
          is_featured: boolean | null
          is_hot: boolean | null
          logo_url: string | null
          max_participants: number | null
          next_edition_date: string | null
          offer_id: string | null
          offer_name: string | null
          official_url: string | null
          organizer_id: string | null
          organizer_name: string | null
          prize_pool: number | null
          program_id: string | null
          program_name: string | null
          pros: Json | null
          refundable: boolean | null
          registration_deadline: string | null
          reputation_score: number | null
          ruleset_mode: Database["public"]["Enums"]["ruleset_mode_enum"] | null
          start_date: string | null
          subtype: string | null
          tags: Json | null
          trustpilot_score: number | null
        }
      }
    }
    Enums: {
      frequency_enum:
        | "always_open"
        | "monthly"
        | "quarterly"
        | "annual"
        | "one_time"
      geo_mode_enum: "allow" | "block"
      program_category_enum:
        | "free_competition"
        | "paid_evaluation"
        | "instant_funding"
      program_status_enum: "active" | "upcoming" | "ended" | "paused"
      program_type_enum:
        | "paper_trading"
        | "demo_contest"
        | "prop_challenge"
        | "tournament"
      ruleset_mode_enum: "target_based" | "ranking_based"
    }
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"]
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T]
