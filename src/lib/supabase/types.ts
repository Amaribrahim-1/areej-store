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
      categories: {
        Row: {
          created_at: string
          label: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          label: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          label?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          name: string
          phone: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          name: string
          phone: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          name?: string
          phone?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          line_total: number
          order_id: string
          product_id: string
          product_name: string
          quantity: number
          unit_price: number
          variant_id: string
          variant_label: string | null
        }
        Insert: {
          id?: string
          line_total: number
          order_id: string
          product_id: string
          product_name: string
          quantity: number
          unit_price: number
          variant_id: string
          variant_label?: string | null
        }
        Update: {
          id?: string
          line_total?: number
          order_id?: string
          product_id?: string
          product_name?: string
          quantity?: number
          unit_price?: number
          variant_id?: string
          variant_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "catalog_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "catalog_products"
            referencedColumns: ["display_variant_id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address_text: string
          created_at: string
          customer_name: string
          customer_phone: string
          governorate: string
          id: string
          markaz: string
          payment_method: string
          status: string
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          address_text: string
          created_at?: string
          customer_name: string
          customer_phone: string
          governorate: string
          id?: string
          markaz: string
          payment_method?: string
          status?: string
          total: number
          updated_at?: string
          user_id: string
        }
        Update: {
          address_text?: string
          created_at?: string
          customer_name?: string
          customer_phone?: string
          governorate?: string
          id?: string
          markaz?: string
          payment_method?: string
          status?: string
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          created_at: string
          current_price: number
          id: string
          original_price: number
          product_id: string
          sort_order: number
          updated_at: string
          volume_label: string | null
        }
        Insert: {
          created_at?: string
          current_price: number
          id?: string
          original_price: number
          product_id: string
          sort_order?: number
          updated_at?: string
          volume_label?: string | null
        }
        Update: {
          created_at?: string
          current_price?: number
          id?: string
          original_price?: number
          product_id?: string
          sort_order?: number
          updated_at?: string
          volume_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "catalog_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string
          name: string
          slug: string
          status: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          name: string
          slug: string
          status?: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          name?: string
          slug?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["slug"]
          },
        ]
      }
      profiles: {
        Row: {
          address_text: string | null
          created_at: string
          full_name: string | null
          governorate: string | null
          id: string
          markaz: string | null
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          address_text?: string | null
          created_at?: string
          full_name?: string | null
          governorate?: string | null
          id: string
          markaz?: string | null
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          address_text?: string | null
          created_at?: string
          full_name?: string | null
          governorate?: string | null
          id?: string
          markaz?: string | null
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          product_id: string
          rating: number
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          product_id: string
          rating: number
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          product_id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "catalog_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      catalog_products: {
        Row: {
          average_rating: number | null
          category: string | null
          category_label: string | null
          created_at: string | null
          description: string | null
          discount_depth: number | null
          display_current_price: number | null
          display_original_price: number | null
          display_variant_id: string | null
          has_discount: boolean | null
          id: string | null
          image_url: string | null
          name: string | null
          name_normalized: string | null
          review_count: number | null
          slug: string | null
          status: string | null
          updated_at: string | null
          variant_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["slug"]
          },
        ]
      }
    }
    Functions: {
      create_admin_product: {
        Args: {
          p_category: string
          p_description: string
          p_image_url: string
          p_name: string
          p_slug: string
          p_status: string
          p_variants: Json
        }
        Returns: string
      }
      get_admin_dashboard_kpis: {
        Args: never
        Returns: {
          pending_orders: number
          total_products: number
          total_sales: number
        }[]
      }
      get_admin_order: {
        Args: { p_order_id: string }
        Returns: {
          address_text: string
          created_at: string
          customer_name: string
          customer_phone: string
          governorate: string
          id: string
          items: Json
          markaz: string
          payment_method: string
          status: string
          total: number
        }[]
      }
      get_admin_product: {
        Args: { p_product_id: string }
        Returns: {
          category: string
          category_label: string
          description: string
          id: string
          image_url: string
          name: string
          slug: string
          status: string
          variants: Json
        }[]
      }
      list_admin_reviews: {
        Args: never
        Returns: {
          id: string
          product_id: string
          product_name: string
          rating: number
          comment: string | null
          author_name: string
          created_at: string
        }[]
      }
      list_admin_orders: {
        Args: never
        Returns: {
          address_text: string
          created_at: string
          customer_name: string
          customer_phone: string
          governorate: string
          id: string
          markaz: string
          status: string
          total: number
        }[]
      }
      list_admin_products: {
        Args: never
        Returns: {
          category: string
          category_label: string
          created_at: string
          current_price: number
          id: string
          name: string
          original_price: number
          slug: string
          status: string
        }[]
      }
      list_home_testimonials: {
        Args: { p_limit?: number }
        Returns: {
          author_name: string
          comment: string
          created_at: string
          id: string
          product_id: string
          product_name: string
          product_slug: string
          rating: number
        }[]
      }
      list_product_reviews: {
        Args: { p_limit?: number; p_product_slug: string }
        Returns: {
          author_name: string
          comment: string
          created_at: string
          id: string
          product_id: string
          rating: number
        }[]
      }
      place_order: {
        Args: {
          address_text: string
          customer_name: string
          customer_phone: string
          governorate: string
          items: Json
          markaz: string
        }
        Returns: string
      }
      submit_contact_message: {
        Args: { p_message: string; p_name: string; p_phone: string }
        Returns: string
      }
      update_admin_product: {
        Args: {
          p_category: string
          p_description: string
          p_id: string
          p_image_url: string
          p_name: string
          p_slug: string
          p_status: string
          p_variants: Json
        }
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
