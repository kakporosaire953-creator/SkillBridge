import { createClient, SupabaseClient } from '@supabase/supabase-js';

const FALLBACK_URL = 'https://placeholder-skillbridge.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder';

export const isValidHttpUrl = (urlString?: string): boolean => {
  if (!urlString || typeof urlString !== 'string') return false;
  try {
    const parsed = new URL(urlString.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

// Retrieve environment variables safely
export const getSupabaseConfig = () => {
  const metaEnv = import.meta.env as Record<string, string> | undefined;

  const rawUrl = 
    metaEnv?.VITE_SUPABASE_URL ||
    metaEnv?.NEXT_PUBLIC_SUPABASE_URL ||
    '';

  const rawKey = 
    metaEnv?.VITE_SUPABASE_ANON_KEY ||
    metaEnv?.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    '';

  return { url: rawUrl.trim(), key: rawKey.trim() };
};

export const isSupabaseConfigured = (): boolean => {
  const { url, key } = getSupabaseConfig();
  return Boolean(
    url &&
    key &&
    isValidHttpUrl(url) &&
    !url.includes('placeholder') &&
    !url.includes('your-project') &&
    key.length > 20 &&
    !key.includes('placeholder')
  );
};

const config = getSupabaseConfig();
export const supabaseUrl = isValidHttpUrl(config.url) ? config.url : FALLBACK_URL;
export const supabaseAnonKey = config.key || FALLBACK_KEY;

// Safe Supabase client instantiation that never throws at module load time
let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
  if (!clientInstance) {
    const { url, key } = getSupabaseConfig();
    const effectiveUrl = isValidHttpUrl(url) ? url : FALLBACK_URL;
    const effectiveKey = key && key.length > 10 ? key : FALLBACK_KEY;

    try {
      clientInstance = createClient(effectiveUrl, effectiveKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch (err) {
      console.warn('Fallback initializing Supabase client:', err);
      clientInstance = createClient(FALLBACK_URL, FALLBACK_KEY, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
    }
  }
  return clientInstance;
};

export const supabase = getSupabaseClient();
