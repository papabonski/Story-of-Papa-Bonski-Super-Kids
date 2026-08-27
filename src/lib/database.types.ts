/**
 * Database types matching Supabase migrations 0001 through 0005.
 * Hand-authored for the preview branch; production can later replace this
 * with `supabase gen types typescript` after migrations are applied.
 */

export type StoryStatus =
  | "pending"
  | "generating_text"
  | "generating_assets"
  | "ready"
  | "error";

export type SceneStatus =
  | "pending"
  | "image_ready"
  | "audio_ready"
  | "ready"
  | "error";

export type StoryJobPhase = "text" | "assets" | "audio";
export type StoryJobStatus =
  | "queued"
  | "running"
  | "waiting_review"
  | "completed"
  | "failed";
export type Gender = "male" | "female";

export type WordTiming = {
  word: string;
  startMs: number;
  endMs: number;
};

export type ChildRow = {
  id: string;
  user_id: string;
  name: string;
  age: number | null;
  gender: Gender | null;
  photo_path: string | null;
  character_description: string | null;
  created_at: string;
  updated_at: string;
};

export type StoryRow = {
  id: string;
  user_id: string;
  child_id: string;
  theme_id: string;
  theme_label: string | null;
  subtheme_id: string;
  subtheme_label: string | null;
  situation: string | null;
  length_id: string | null;
  language_level: string;
  illustration_style: string;
  language: string;
  status: StoryStatus;
  error_message: string | null;
  share_token: string | null;
  share_created_at: string | null;
  last_read_scene_index: number;
  total_read_ms: number;
  completed_at: string | null;
  is_favorite: boolean;
  title: string | null;
  opener_text: string | null;
  text_approved_at: string | null;
  moral_text: string | null;
  doa_arabic: string | null;
  doa_latin: string | null;
  doa_translation: string | null;
  parent_activity: string | null;
  parent_questions: string[];
  character_snapshot: string | null;
  opener_audio_path: string | null;
  opener_word_timings: WordTiming[];
  created_at: string;
  updated_at: string;
};

export type SceneRow = {
  id: string;
  story_id: string;
  index: number;
  narration_text: string | null;
  image_prompt: string | null;
  image_path: string | null;
  image_prompts: string[];
  image_paths: (string | null)[];
  audio_path: string | null;
  word_timings: WordTiming[];
  status: SceneStatus;
  created_at: string;
  updated_at: string;
};

export type StoryJobRow = {
  id: string;
  story_id: string;
  user_id: string;
  phase: StoryJobPhase;
  status: StoryJobStatus;
  attempts: number;
  max_attempts: number;
  available_at: string;
  locked_at: string | null;
  locked_by: string | null;
  last_error: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type WhiteLabelSettingsRow = {
  id: string;
  brand: Record<string, unknown>;
  providers: Record<string, unknown>;
  theme_catalog: unknown[];
  limits: Record<string, unknown>;
  pricing: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type ChildInsert = {
  name: string;
  id?: string;
  user_id?: string;
  age?: number | null;
  gender?: Gender | null;
  photo_path?: string | null;
  character_description?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type StoryInsert = {
  child_id: string;
  theme_id: string;
  subtheme_id: string;
  id?: string;
  user_id?: string;
  theme_label?: string | null;
  subtheme_label?: string | null;
  situation?: string | null;
  length_id?: string | null;
  language_level?: string;
  illustration_style?: string;
  language?: string;
  status?: StoryStatus;
  error_message?: string | null;
  share_token?: string | null;
  share_created_at?: string | null;
  last_read_scene_index?: number;
  total_read_ms?: number;
  completed_at?: string | null;
  is_favorite?: boolean;
  title?: string | null;
  opener_text?: string | null;
  text_approved_at?: string | null;
  moral_text?: string | null;
  doa_arabic?: string | null;
  doa_latin?: string | null;
  doa_translation?: string | null;
  parent_activity?: string | null;
  parent_questions?: string[];
  character_snapshot?: string | null;
  opener_audio_path?: string | null;
  opener_word_timings?: WordTiming[];
  created_at?: string;
  updated_at?: string;
};

export type SceneInsert = {
  story_id: string;
  index: number;
  id?: string;
  narration_text?: string | null;
  image_prompt?: string | null;
  image_path?: string | null;
  image_prompts?: string[];
  image_paths?: (string | null)[];
  audio_path?: string | null;
  word_timings?: WordTiming[];
  status?: SceneStatus;
  created_at?: string;
  updated_at?: string;
};

export type StoryJobInsert = {
  story_id: string;
  user_id: string;
  id?: string;
  phase?: StoryJobPhase;
  status?: StoryJobStatus;
  attempts?: number;
  max_attempts?: number;
  available_at?: string;
  locked_at?: string | null;
  locked_by?: string | null;
  last_error?: string | null;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
};

export type WhiteLabelSettingsInsert = {
  id?: string;
  brand?: Record<string, unknown>;
  providers?: Record<string, unknown>;
  theme_catalog?: unknown[];
  limits?: Record<string, unknown>;
  pricing?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
};

/**
 * V5 tables are intentionally permissive here so the preview can compile
 * before Supabase-generated types exist. The table names themselves are exact
 * and correspond to migrations 0002-0005. Once those migrations are applied,
 * regenerate types from Supabase for stricter per-column typing.
 */
export type V5CommerceRow = Record<string, any>;
export type V5CommerceTable = {
  Row: V5CommerceRow;
  Insert: Record<string, any>;
  Update: Record<string, any>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      children: {
        Row: ChildRow;
        Insert: ChildInsert;
        Update: Partial<ChildRow>;
        Relationships: [];
      };
      stories: {
        Row: StoryRow;
        Insert: StoryInsert;
        Update: Partial<StoryRow>;
        Relationships: [];
      };
      scenes: {
        Row: SceneRow;
        Insert: SceneInsert;
        Update: Partial<SceneRow>;
        Relationships: [];
      };
      story_jobs: {
        Row: StoryJobRow;
        Insert: StoryJobInsert;
        Update: Partial<StoryJobRow>;
        Relationships: [];
      };
      white_label_settings: {
        Row: WhiteLabelSettingsRow;
        Insert: WhiteLabelSettingsInsert;
        Update: Partial<WhiteLabelSettingsRow>;
        Relationships: [];
      };
      customers: V5CommerceTable;
      customer_users: V5CommerceTable;
      products: V5CommerceTable;
      plans: V5CommerceTable;
      orders: V5CommerceTable;
      subscriptions: V5CommerceTable;
      entitlements: V5CommerceTable;
      attributions: V5CommerceTable;
      webhook_events: V5CommerceTable;
      activations: V5CommerceTable;
      funnel_events: V5CommerceTable;
      orderhero_product_mappings: V5CommerceTable;
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: {
      story_status: StoryStatus;
      scene_status: SceneStatus;
    };
    CompositeTypes: { [_ in never]: never };
  };
};
