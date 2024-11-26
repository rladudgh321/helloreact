// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Supabase 프로젝트 URL과 API 키
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
console.log('supabasesupabase', supabase);