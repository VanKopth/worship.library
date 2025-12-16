import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Типи для роботи з Storage
export type UploadResult = {
    path: string;
    fullPath: string;
    publicUrl: string;
};

export type UploadError = {
    message: string;
    statusCode?: number;
};