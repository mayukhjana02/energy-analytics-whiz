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
      energy_incidents: {
        Row: {
          created_at: string
          description: string
          id: string
          machine_id: string
          resolved_at: string | null
          severity: string
          status: string
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          machine_id: string
          resolved_at?: string | null
          severity: string
          status: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          machine_id?: string
          resolved_at?: string | null
          severity?: string
          status?: string
          title?: string
        }
        Relationships: []
      }
      energy_metrics: {
        Row: {
          created_at: string
          id: string
          machine_id: string
          measurement_time: string
          tag_id: string
          unit: string
          value: number
        }
        Insert: {
          created_at?: string
          id?: string
          machine_id: string
          measurement_time?: string
          tag_id: string
          unit: string
          value: number
        }
        Update: {
          created_at?: string
          id?: string
          machine_id?: string
          measurement_time?: string
          tag_id?: string
          unit?: string
          value?: number
        }
        Relationships: []
      }
      exam_attempts: {
        Row: {
          created_at: string
          end_time: string | null
          exam_id: string
          id: string
          passed: boolean | null
          score: number | null
          start_time: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_time?: string | null
          exam_id: string
          id?: string
          passed?: boolean | null
          score?: number | null
          start_time?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_time?: string | null
          exam_id?: string
          id?: string
          passed?: boolean | null
          score?: number | null
          start_time?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_attempts_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          category: Database["public"]["Enums"]["exam_category"]
          created_at: string
          description: string | null
          duration_minutes: number
          full_name: string
          id: string
          is_active: boolean | null
          name: string
          passing_percentage: number
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["exam_category"]
          created_at?: string
          description?: string | null
          duration_minutes: number
          full_name: string
          id?: string
          is_active?: boolean | null
          name: string
          passing_percentage: number
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["exam_category"]
          created_at?: string
          description?: string | null
          duration_minutes?: number
          full_name?: string
          id?: string
          is_active?: boolean | null
          name?: string
          passing_percentage?: number
          updated_at?: string
        }
        Relationships: []
      }
      machine_optimizations: {
        Row: {
          applied_at: string | null
          created_at: string
          current_value: number
          id: string
          machine_id: string
          optimal_value: number
          parameter_name: string
          potential_savings: number | null
          unit: string
        }
        Insert: {
          applied_at?: string | null
          created_at?: string
          current_value: number
          id?: string
          machine_id: string
          optimal_value: number
          parameter_name: string
          potential_savings?: number | null
          unit: string
        }
        Update: {
          applied_at?: string | null
          created_at?: string
          current_value?: number
          id?: string
          machine_id?: string
          optimal_value?: number
          parameter_name?: string
          potential_savings?: number | null
          unit?: string
        }
        Relationships: []
      }
      mock_tests: {
        Row: {
          created_at: string
          description: string | null
          difficulty: string | null
          exam_id: string
          id: string
          is_premium: boolean | null
          question_paper_path: string | null
          solution_path: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          difficulty?: string | null
          exam_id: string
          id?: string
          is_premium?: boolean | null
          question_paper_path?: string | null
          solution_path?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          difficulty?: string | null
          exam_id?: string
          id?: string
          is_premium?: boolean | null
          question_paper_path?: string | null
          solution_path?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mock_tests_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          correct_option: string
          created_at: string
          exam_id: string
          explanation: string | null
          id: string
          marks: number
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          question_text: string
          updated_at: string
        }
        Insert: {
          correct_option: string
          created_at?: string
          exam_id: string
          explanation?: string | null
          id?: string
          marks?: number
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          question_text: string
          updated_at?: string
        }
        Update: {
          correct_option?: string
          created_at?: string
          exam_id?: string
          explanation?: string | null
          id?: string
          marks?: number
          option_a?: string
          option_b?: string
          option_c?: string
          option_d?: string
          question_text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          category: Database["public"]["Enums"]["exam_category"]
          created_at: string
          description: string | null
          exam_id: string | null
          id: string
          title: string
          type: string
          updated_at: string
          url: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["exam_category"]
          created_at?: string
          description?: string | null
          exam_id?: string | null
          id?: string
          title: string
          type: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["exam_category"]
          created_at?: string
          description?: string | null
          exam_id?: string | null
          id?: string
          title?: string
          type?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resources_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          createdAt: string
          createdBy: string
          creatorEmail: string | null
          machines: string
          name: string
          pages: string
          updatedAt: string
        }
        Insert: {
          createdAt: string
          createdBy: string
          creatorEmail?: string | null
          machines: string
          name: string
          pages: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          createdBy?: string
          creatorEmail?: string | null
          machines?: string
          name?: string
          pages?: string
          updatedAt?: string
        }
        Relationships: []
      }
      stopreportconfigs: {
        Row: {
          createdAt: string
          id: number
          machineId: string
          stopReportConfig: string
          updatedBy: string
        }
        Insert: {
          createdAt: string
          id?: never
          machineId: string
          stopReportConfig: string
          updatedBy: string
        }
        Update: {
          createdAt?: string
          id?: never
          machineId?: string
          stopReportConfig?: string
          updatedBy?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          createdAt: string
          dataType: string
          equipment: string | null
          id: number
          line: string | null
          others: string | null
          section: string | null
          tagId: string
          tagName: string
          type: string | null
          unit: string | null
          updatedAt: string
        }
        Insert: {
          createdAt: string
          dataType: string
          equipment?: string | null
          id?: never
          line?: string | null
          others?: string | null
          section?: string | null
          tagId: string
          tagName: string
          type?: string | null
          unit?: string | null
          updatedAt: string
        }
        Update: {
          createdAt?: string
          dataType?: string
          equipment?: string | null
          id?: never
          line?: string | null
          others?: string | null
          section?: string | null
          tagId?: string
          tagName?: string
          type?: string | null
          unit?: string | null
          updatedAt?: string
        }
        Relationships: []
      }
      user_answers: {
        Row: {
          attempt_id: string
          created_at: string
          id: string
          is_correct: boolean | null
          question_id: string
          selected_option: string | null
          updated_at: string
        }
        Insert: {
          attempt_id: string
          created_at?: string
          id?: string
          is_correct?: boolean | null
          question_id: string
          selected_option?: string | null
          updated_at?: string
        }
        Update: {
          attempt_id?: string
          created_at?: string
          id?: string
          is_correct?: boolean | null
          question_id?: string
          selected_option?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_answers_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "exam_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_latest_metrics: {
        Args: Record<PropertyKey, never>
        Returns: {
          machine_id: string
          tag_id: string
          value: number
          unit: string
          measurement_time: string
        }[]
      }
      is_admin: {
        Args: { uid: string }
        Returns: boolean
      }
    }
    Enums: {
      exam_category: "doctors" | "nursing" | "paramedical"
      user_role: "student" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      exam_category: ["doctors", "nursing", "paramedical"],
      user_role: ["student", "admin"],
    },
  },
} as const
