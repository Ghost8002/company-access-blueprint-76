export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      collaborators: {
        Row: {
          active: boolean | null
          created_at: string
          email: string | null
          id: string
          name: string
          role: string | null
          sector: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          role?: string | null
          sector?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          role?: string | null
          sector?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          alerts: string[] | null
          classification: string | null
          client_class: string | null
          collaborator_ids: string[] | null
          company_group: string | null
          company_sector: string | null
          complexity_level: string | null
          contabil_responsible: string | null
          cpf: string | null
          created_at: string
          delinquency_end_date: string | null
          delinquency_start_date: string | null
          delinquency_status: string | null
          financeiro_responsible: string | null
          fiscal_responsible: string | null
          honorary_value: number | null
          id: string
          municipality: string | null
          name: string
          new_tax_regime: string | null
          pessoal_responsible: string | null
          segment: string | null
          situation: string | null
          tax_id: string | null
          tax_regime: string
          updated_at: string
        }
        Insert: {
          alerts?: string[] | null
          classification?: string | null
          client_class?: string | null
          collaborator_ids?: string[] | null
          company_group?: string | null
          company_sector?: string | null
          complexity_level?: string | null
          contabil_responsible?: string | null
          cpf?: string | null
          created_at?: string
          delinquency_end_date?: string | null
          delinquency_start_date?: string | null
          delinquency_status?: string | null
          financeiro_responsible?: string | null
          fiscal_responsible?: string | null
          honorary_value?: number | null
          id?: string
          municipality?: string | null
          name?: string
          new_tax_regime?: string | null
          pessoal_responsible?: string | null
          segment?: string | null
          situation?: string | null
          tax_id?: string | null
          tax_regime?: string
          updated_at?: string
        }
        Update: {
          alerts?: string[] | null
          classification?: string | null
          client_class?: string | null
          collaborator_ids?: string[] | null
          company_group?: string | null
          company_sector?: string | null
          complexity_level?: string | null
          contabil_responsible?: string | null
          cpf?: string | null
          created_at?: string
          delinquency_end_date?: string | null
          delinquency_start_date?: string | null
          delinquency_status?: string | null
          financeiro_responsible?: string | null
          fiscal_responsible?: string | null
          honorary_value?: number | null
          id?: string
          municipality?: string | null
          name?: string
          new_tax_regime?: string | null
          pessoal_responsible?: string | null
          segment?: string | null
          situation?: string | null
          tax_id?: string | null
          tax_regime?: string
          updated_at?: string
        }
        Relationships: []
      }
      company_collaborators: {
        Row: {
          collaborator_id: string
          company_id: string
          created_at: string
          id: string
        }
        Insert: {
          collaborator_id: string
          company_id: string
          created_at?: string
          id?: string
        }
        Update: {
          collaborator_id?: string
          company_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_collaborators_collaborator_id_fkey"
            columns: ["collaborator_id"]
            isOneToOne: false
            referencedRelation: "collaborators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_collaborators_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_groups: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      company_segments: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      delinquency_history: {
        Row: {
          company_id: string
          created_at: string
          end_date: string | null
          id: string
          notes: string | null
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          end_date?: string | null
          id?: string
          notes?: string | null
          start_date?: string
          status: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          end_date?: string | null
          id?: string
          notes?: string | null
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "delinquency_history_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_financial_reports: {
        Row: {
          created_at: string
          delinquent_companies: number
          id: string
          month: number
          revenue_without_delinquents: number
          total_companies: number
          total_revenue: number
          updated_at: string
          year: number
        }
        Insert: {
          created_at?: string
          delinquent_companies?: number
          id?: string
          month: number
          revenue_without_delinquents?: number
          total_companies?: number
          total_revenue?: number
          updated_at?: string
          year: number
        }
        Update: {
          created_at?: string
          delinquent_companies?: number
          id?: string
          month?: number
          revenue_without_delinquents?: number
          total_companies?: number
          total_revenue?: number
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          is_active: boolean | null
          last_login: string | null
          name: string
          role: string
          sector: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id: string
          is_active?: boolean | null
          last_login?: string | null
          name?: string
          role?: string
          sector?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          name?: string
          role?: string
          sector?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      system_alerts: {
        Row: {
          company_id: string | null
          created_at: string
          expires_at: string | null
          id: string
          is_read: boolean | null
          message: string
          severity: string | null
          title: string
          type: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          severity?: string | null
          title: string
          type: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          severity?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "system_alerts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          value: Json | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value?: Json | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      group_ranking: {
        Row: {
          avg_honorary: number | null
          company_count: number | null
          company_group: string | null
          delinquent_count: number | null
          total_honorary: number | null
        }
        Relationships: []
      }
      segment_ranking: {
        Row: {
          avg_honorary: number | null
          company_count: number | null
          delinquent_count: number | null
          segment: string | null
          total_honorary: number | null
        }
        Relationships: []
      }
      tax_regime_ranking: {
        Row: {
          avg_honorary: number | null
          company_count: number | null
          delinquent_count: number | null
          tax_regime: string | null
          total_honorary: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_delinquency_days: {
        Args: { company_id: string }
        Returns: number
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
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
