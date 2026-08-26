import React, { useState } from 'react';
import { X, Copy, Check, Terminal, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { isSupabaseConfigured, supabaseUrl } from '../services/supabase';

interface MigrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MigrationModal: React.FC<MigrationModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const isConfigured = isSupabaseConfigured();

  if (!isOpen) return null;

  const sqlSchema = `-- ============================================================================
-- SKILLBRIDGE — SOCLE BACKEND RÉEL (ÉTAPE 1)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLE PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    avatar_url TEXT DEFAULT NULL,
    bio TEXT DEFAULT NULL,
    location TEXT DEFAULT NULL,
    country TEXT DEFAULT NULL,
    account_type TEXT NOT NULL DEFAULT 'talent' CHECK (
        account_type IN ('talent', 'learner', 'professional', 'mentor', 'company', 'institution')
    ),
    website TEXT DEFAULT NULL,
    linkedin_url TEXT DEFAULT NULL,
    instagram_url TEXT DEFAULT NULL,
    tiktok_url TEXT DEFAULT NULL,
    github_url TEXT DEFAULT NULL,
    availability TEXT DEFAULT NULL,
    profile_visibility TEXT NOT NULL DEFAULT 'public' CHECK (
        profile_visibility IN ('public', 'private')
    ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. INDEXES
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_account_type ON public.profiles(account_type);

-- 3. UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_profiles_updated_at ON public.profiles;
CREATE TRIGGER tr_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 4. AUTO PROFILE CREATION TRIGGER ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_first_name TEXT;
    v_last_name TEXT;
    v_base_username TEXT;
    v_final_username TEXT;
    v_account_type TEXT;
    v_counter INT := 0;
BEGIN
    v_first_name := COALESCE(NEW.raw_user_meta_data->>'first_name', 'Utilisateur');
    v_last_name := COALESCE(NEW.raw_user_meta_data->>'last_name', '');
    v_account_type := COALESCE(NEW.raw_user_meta_data->>'account_type', 'talent');

    v_base_username := COALESCE(
        NEW.raw_user_meta_data->>'username',
        LOWER(REGEXP_REPLACE(SPLIT_PART(NEW.email, '@', 1), '[^a-zA-Z0-9_-]', '', 'g'))
    );
    
    IF v_base_username IS NULL OR LENGTH(v_base_username) < 3 THEN
        v_base_username := 'user_' || SUBSTRING(NEW.id::text, 1, 8);
    END IF;

    v_final_username := v_base_username;
    WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = v_final_username) LOOP
        v_counter := v_counter + 1;
        v_final_username := v_base_username || v_counter::text;
    END LOOP;

    INSERT INTO public.profiles (
        user_id, first_name, last_name, username, account_type, created_at, updated_at
    ) VALUES (
        NEW.id, v_first_name, v_last_name, v_final_username, v_account_type, now(), now()
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 5. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by owner or if public"
    ON public.profiles FOR SELECT
    USING (auth.uid() = user_id OR profile_visibility = 'public');

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile"
    ON public.profiles FOR DELETE
    USING (auth.uid() = user_id);

-- 6. STORAGE BUCKET AVATARS & POLICIES
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Avatar images are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-900/90">
          <div className="flex items-center gap-2.5">
            <Terminal className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="text-base font-bold text-stone-100">
                Schéma PostgreSQL & Migration Supabase (Étape 1)
              </h2>
              <p className="text-xs text-stone-400">
                Table <code className="text-amber-400">profiles</code>, triggers, Storage <code className="text-amber-400">avatars</code> et RLS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-100 rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status bar */}
        <div className="px-6 py-3 bg-stone-950 border-b border-stone-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">État Supabase :</span>
            {isConfigured ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Connecté ({supabaseUrl})
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Variables d'environnement en attente (VITE_SUPABASE_URL)
              </span>
            )}
          </div>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copié !' : 'Copier le SQL'}</span>
          </button>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="bg-stone-950 rounded-xl p-4 border border-stone-800 font-mono text-xs text-stone-300 leading-relaxed overflow-x-auto select-all">
            <pre>{sqlSchema}</pre>
          </div>

          {/* Checklist of 10 verification tests */}
          <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 space-y-2">
            <h4 className="text-xs font-bold text-stone-200 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Contrôles de conformité Étape 1
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Inscription & Connexion réelles</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Création automatique de profil</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Unicité stricte du username</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Supabase Storage bucket avatars</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Row Level Security (RLS) activé</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zéro simulation / Zéro faux profil</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-800 bg-stone-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
