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
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          updated_at?: string;
        };
      };
      memberships: {
        Row: {
          id: string;
          organization_id: string;
          user_id: string;
          role: "owner" | "admin" | "member";
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          user_id: string;
          role?: "owner" | "admin" | "member";
          created_at?: string;
        };
        Update: {
          role?: "owner" | "admin" | "member";
        };
      };
      invitations: {
        Row: {
          id: string;
          organization_id: string;
          email: string;
          role: "admin" | "member";
          status: "pending" | "accepted" | "revoked" | "expired";
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          email: string;
          role?: "admin" | "member";
          status?: "pending" | "accepted" | "revoked" | "expired";
          expires_at: string;
          created_at?: string;
        };
        Update: {
          role?: "admin" | "member";
          status?: "pending" | "accepted" | "revoked" | "expired";
          expires_at?: string;
        };
      };
      billing_customers: {
        Row: {
          organization_id: string;
          provider: string;
          provider_customer_id: string;
          created_at: string;
        };
        Insert: {
          organization_id: string;
          provider: string;
          provider_customer_id: string;
          created_at?: string;
        };
        Update: {
          provider_customer_id?: string;
        };
      };
      billing_subscriptions: {
        Row: {
          organization_id: string;
          provider: string;
          provider_subscription_id: string;
          status: "trialing" | "active" | "past_due" | "canceled" | "incomplete";
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          organization_id: string;
          provider: string;
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
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
