export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      agent_runs: {
        Row: {
          ai_count: number
          auto_count: number
          client_id: string
          created_at: string
          error_count: number
          error_message: string | null
          finished_at: string | null
          id: string
          model: string | null
          period: string
          review_count: number
          started_at: string
          status: string
          tier1_count: number
          total_count: number
          triggered_by: string | null
        }
        Insert: {
          ai_count?: number
          auto_count?: number
          client_id: string
          created_at?: string
          error_count?: number
          error_message?: string | null
          finished_at?: string | null
          id?: string
          model?: string | null
          period: string
          review_count?: number
          started_at?: string
          status?: string
          tier1_count?: number
          total_count?: number
          triggered_by?: string | null
        }
        Update: {
          ai_count?: number
          auto_count?: number
          client_id?: string
          created_at?: string
          error_count?: number
          error_message?: string | null
          finished_at?: string | null
          id?: string
          model?: string | null
          period?: string
          review_count?: number
          started_at?: string
          status?: string
          tier1_count?: number
          total_count?: number
          triggered_by?: string | null
        }
        Relationships: []
      }
      billing_customers: {
        Row: {
          address: string | null
          client_id: string
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          client_id: string
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          client_id?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      chart_accounts: {
        Row: {
          client_id: string
          code: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          client_id: string
          code: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          metadata: Json | null
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      client_context: {
        Row: {
          categorization_rules: Json
          client_id: string
          created_at: string
          entity_type: string | null
          id: string
          industry: string | null
          notes: string | null
          updated_at: string
          vendor_mappings: Json
        }
        Insert: {
          categorization_rules?: Json
          client_id: string
          created_at?: string
          entity_type?: string | null
          id?: string
          industry?: string | null
          notes?: string | null
          updated_at?: string
          vendor_mappings?: Json
        }
        Update: {
          categorization_rules?: Json
          client_id?: string
          created_at?: string
          entity_type?: string | null
          id?: string
          industry?: string | null
          notes?: string | null
          updated_at?: string
          vendor_mappings?: Json
        }
        Relationships: []
      }
      client_credentials: {
        Row: {
          client_id: string
          client_name: string
          created_at: string | null
          ein: string | null
          id: string
          is_active: boolean | null
          password_hash: string
          updated_at: string | null
          username: string
        }
        Insert: {
          client_id: string
          client_name: string
          created_at?: string | null
          ein?: string | null
          id?: string
          is_active?: boolean | null
          password_hash: string
          updated_at?: string | null
          username: string
        }
        Update: {
          client_id?: string
          client_name?: string
          created_at?: string | null
          ein?: string | null
          id?: string
          is_active?: boolean | null
          password_hash?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      client_identity_links: {
        Row: {
          client_id: string
          client_name: string
          created_at: string
          id: string
          linked_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id: string
          client_name: string
          created_at?: string
          id?: string
          linked_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string
          client_name?: string
          created_at?: string
          id?: string
          linked_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      client_invoice_items: {
        Row: {
          account_code: string | null
          amount: number
          created_at: string
          description: string
          id: string
          invoice_id: string
          quantity: number
          rate: number
          sort_order: number
        }
        Insert: {
          account_code?: string | null
          amount?: number
          created_at?: string
          description: string
          id?: string
          invoice_id: string
          quantity?: number
          rate?: number
          sort_order?: number
        }
        Update: {
          account_code?: string | null
          amount?: number
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          quantity?: number
          rate?: number
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "client_invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "client_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      client_invoices: {
        Row: {
          amount_paid: number
          bill_to_address: string | null
          bill_to_email: string | null
          bill_to_name: string | null
          client_id: string
          created_at: string
          created_by: string | null
          created_via: string
          currency: string
          customer_id: string | null
          due_date: string | null
          id: string
          invoice_number: string
          issue_date: string
          notes: string | null
          paid_at: string | null
          sent_at: string | null
          status: string
          subtotal: number
          tax_amount: number
          tax_rate: number
          terms: string | null
          total: number
          updated_at: string
        }
        Insert: {
          amount_paid?: number
          bill_to_address?: string | null
          bill_to_email?: string | null
          bill_to_name?: string | null
          client_id: string
          created_at?: string
          created_by?: string | null
          created_via?: string
          currency?: string
          customer_id?: string | null
          due_date?: string | null
          id?: string
          invoice_number: string
          issue_date?: string
          notes?: string | null
          paid_at?: string | null
          sent_at?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          tax_rate?: number
          terms?: string | null
          total?: number
          updated_at?: string
        }
        Update: {
          amount_paid?: number
          bill_to_address?: string | null
          bill_to_email?: string | null
          bill_to_name?: string | null
          client_id?: string
          created_at?: string
          created_by?: string | null
          created_via?: string
          currency?: string
          customer_id?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          issue_date?: string
          notes?: string | null
          paid_at?: string | null
          sent_at?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          tax_rate?: number
          terms?: string | null
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "billing_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      client_link_attempts: {
        Row: {
          created_at: string
          email: string | null
          id: string
          matched_client_id: string | null
          success: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          matched_client_id?: string | null
          success?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          matched_client_id?: string | null
          success?: boolean
          user_id?: string
        }
        Relationships: []
      }
      client_login_attempts: {
        Row: {
          created_at: string
          id: string
          ip_hash: string | null
          success: boolean
          username: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_hash?: string | null
          success?: boolean
          username?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_hash?: string | null
          success?: boolean
          username?: string | null
        }
        Relationships: []
      }
      client_sessions: {
        Row: {
          client_id: string
          created_at: string | null
          expires_at: string
          id: string
          session_token: string
        }
        Insert: {
          client_id: string
          created_at?: string | null
          expires_at: string
          id?: string
          session_token: string
        }
        Update: {
          client_id?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          session_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_sessions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_credentials"
            referencedColumns: ["client_id"]
          },
        ]
      }
      conversations: {
        Row: {
          client_id: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      financial_sheets: {
        Row: {
          client_id: string
          created_at: string
          created_by: string | null
          data: Json
          id: string
          is_published: boolean
          name: string
          period: string | null
          published_at: string | null
          sheet_type: string
          thread_id: string | null
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          created_by?: string | null
          data?: Json
          id?: string
          is_published?: boolean
          name: string
          period?: string | null
          published_at?: string | null
          sheet_type: string
          thread_id?: string | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          created_by?: string | null
          data?: Json
          id?: string
          is_published?: boolean
          name?: string
          period?: string | null
          published_at?: string | null
          sheet_type?: string
          thread_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_sheets_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "workspace_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      import_profiles: {
        Row: {
          client_id: string
          created_at: string
          id: string
          mapping: Json
          name: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          mapping?: Json
          name?: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          mapping?: Json
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      quote_attempts: {
        Row: {
          accepted: boolean
          created_at: string
          id: string
          ip_hash: string
        }
        Insert: {
          accepted?: boolean
          created_at?: string
          id?: string
          ip_hash: string
        }
        Update: {
          accepted?: boolean
          created_at?: string
          id?: string
          ip_hash?: string
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          business_name: string | null
          created_at: string
          email: string
          handled_at: string | null
          handled_by: string | null
          id: string
          industry: string
          message: string | null
          name: string
          phone: string | null
          situation: string | null
          status: string
          updated_at: string
        }
        Insert: {
          business_name?: string | null
          created_at?: string
          email: string
          handled_at?: string | null
          handled_by?: string | null
          id?: string
          industry: string
          message?: string | null
          name: string
          phone?: string | null
          situation?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          business_name?: string | null
          created_at?: string
          email?: string
          handled_at?: string | null
          handled_by?: string | null
          id?: string
          industry?: string
          message?: string | null
          name?: string
          phone?: string | null
          situation?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          agent_run_id: string | null
          amount: number
          approved_account_id: string | null
          client_id: string
          created_at: string
          dedupe_hash: string
          description: string
          direction: string
          id: string
          is_demo: boolean
          payee: string | null
          period: string
          raw_row: Json
          reviewed_at: string | null
          reviewed_by: string | null
          source: string
          status: string
          suggested_account_id: string | null
          suggested_confidence: number | null
          suggested_rationale: string | null
          suggested_tier: string | null
          txn_date: string
          updated_at: string
        }
        Insert: {
          agent_run_id?: string | null
          amount: number
          approved_account_id?: string | null
          client_id: string
          created_at?: string
          dedupe_hash: string
          description: string
          direction: string
          id?: string
          is_demo?: boolean
          payee?: string | null
          period: string
          raw_row?: Json
          reviewed_at?: string | null
          reviewed_by?: string | null
          source?: string
          status?: string
          suggested_account_id?: string | null
          suggested_confidence?: number | null
          suggested_rationale?: string | null
          suggested_tier?: string | null
          txn_date: string
          updated_at?: string
        }
        Update: {
          agent_run_id?: string | null
          amount?: number
          approved_account_id?: string | null
          client_id?: string
          created_at?: string
          dedupe_hash?: string
          description?: string
          direction?: string
          id?: string
          is_demo?: boolean
          payee?: string | null
          period?: string
          raw_row?: Json
          reviewed_at?: string | null
          reviewed_by?: string | null
          source?: string
          status?: string
          suggested_account_id?: string | null
          suggested_confidence?: number | null
          suggested_rationale?: string | null
          suggested_tier?: string | null
          txn_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_agent_run_id_fkey"
            columns: ["agent_run_id"]
            isOneToOne: false
            referencedRelation: "agent_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_approved_account_id_fkey"
            columns: ["approved_account_id"]
            isOneToOne: false
            referencedRelation: "chart_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_suggested_account_id_fkey"
            columns: ["suggested_account_id"]
            isOneToOne: false
            referencedRelation: "chart_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      uploaded_documents: {
        Row: {
          client_id: string
          created_at: string
          file_name: string
          file_type: string
          file_url: string
          id: string
          parsed_data: Json | null
          status: string
          user_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          file_name: string
          file_type: string
          file_url: string
          id?: string
          parsed_data?: Json | null
          status?: string
          user_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          file_name?: string
          file_type?: string
          file_url?: string
          id?: string
          parsed_data?: Json | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      workspace_messages: {
        Row: {
          actions: Json
          attachments: Json
          content: string
          created_at: string
          id: string
          role: string
          thread_id: string
        }
        Insert: {
          actions?: Json
          attachments?: Json
          content?: string
          created_at?: string
          id?: string
          role: string
          thread_id: string
        }
        Update: {
          actions?: Json
          attachments?: Json
          content?: string
          created_at?: string
          id?: string
          role?: string
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "workspace_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_threads: {
        Row: {
          client_id: string
          created_at: string
          created_by: string | null
          id: string
          period: string | null
          title: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          period?: string | null
          title?: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          period?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_mizan_accountant: { Args: never; Returns: boolean }
      is_mizan_lead_owner: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
