export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      billing_customers: {
        Row: {
          user_id: string;
          provider: string;
          provider_customer_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          provider?: string;
          provider_customer_id: string;
          created_at?: string;
        };
        Update: {
          provider_customer_id?: string;
        };
        Relationships: [];
      };
      billing_subscriptions: {
        Row: {
          user_id: string;
          provider: string;
          provider_subscription_id: string;
          status: "trialing" | "active" | "past_due" | "canceled" | "incomplete";
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          provider?: string;
          provider_subscription_id: string;
          status: "trialing" | "active" | "past_due" | "canceled" | "incomplete";
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: "trialing" | "active" | "past_due" | "canceled" | "incomplete";
          current_period_end?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      deleted_user_guards: {
        Row: {
          id: string;
          email_hash: string | null;
          user_id_hash: string | null;
          ip_hash: string | null;
          device_hash: string | null;
          free_generations_used: number;
          deleted_at: string;
          expires_at: string;
          reason: string;
        };
        Insert: {
          id?: string;
          email_hash?: string | null;
          user_id_hash?: string | null;
          ip_hash?: string | null;
          device_hash?: string | null;
          free_generations_used?: number;
          deleted_at?: string;
          expires_at: string;
          reason?: string;
        };
        Update: {
          email_hash?: string | null;
          user_id_hash?: string | null;
          ip_hash?: string | null;
          device_hash?: string | null;
          free_generations_used?: number;
          expires_at?: string;
          reason?: string;
        };
        Relationships: [];
      };
      usage_limits: {
        Row: {
          id: string;
          user_id: string | null;
          anonymous_id_hash: string | null;
          email_hash: string | null;
          ip_hash: string | null;
          free_generations_used: number;
          free_generations_limit: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          anonymous_id_hash?: string | null;
          email_hash?: string | null;
          ip_hash?: string | null;
          free_generations_used?: number;
          free_generations_limit: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string | null;
          anonymous_id_hash?: string | null;
          email_hash?: string | null;
          ip_hash?: string | null;
          free_generations_used?: number;
          free_generations_limit?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
