-- ============================================================================
-- SKILLBRIDGE — SOCLE BACKEND RÉEL (ÉTAPE 1)
-- PostgreSQL Schema & Supabase Configuration
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLE PROFILES
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

-- 3. INDEXES
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_account_type ON public.profiles(account_type);

-- 4. FUNCTION & TRIGGER FOR UPDATED_AT
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

-- 5. FUNCTION & TRIGGER FOR AUTOMATIC PROFILE CREATION ON USER REGISTRATION
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_first_name TEXT;
    v_last_name TEXT;
    v_username TEXT;
    v_account_type TEXT;
    v_base_username TEXT;
    v_final_username TEXT;
    v_counter INT := 0;
BEGIN
    -- Extract values from user_metadata
    v_first_name := COALESCE(NEW.raw_user_meta_data->>'first_name', 'Utilisateur');
    v_last_name := COALESCE(NEW.raw_user_meta_data->>'last_name', '');
    v_account_type := COALESCE(NEW.raw_user_meta_data->>'account_type', 'talent');

    -- Generate base username if not provided
    v_base_username := COALESCE(
        NEW.raw_user_meta_data->>'username',
        LOWER(REGEXP_REPLACE(SPLIT_PART(NEW.email, '@', 1), '[^a-zA-Z0-9_-]', '', 'g'))
    );
    
    IF v_base_username IS NULL OR LENGTH(v_base_username) < 3 THEN
        v_base_username := 'user_' || SUBSTRING(NEW.id::text, 1, 8);
    END IF;

    -- Guarantee unique username
    v_final_username := v_base_username;
    WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = v_final_username) LOOP
        v_counter := v_counter + 1;
        v_final_username := v_base_username || v_counter::text;
    END LOOP;

    -- Insert new profile
    INSERT INTO public.profiles (
        user_id,
        first_name,
        last_name,
        username,
        account_type,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        v_first_name,
        v_last_name,
        v_final_username,
        v_account_type,
        now(),
        now()
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 6. ROW LEVEL SECURITY (RLS) FOR PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow reading own profile OR public profiles
CREATE POLICY "Profiles are viewable by owner or if public"
    ON public.profiles
    FOR SELECT
    USING (
        auth.uid() = user_id 
        OR profile_visibility = 'public'
    );

-- Allow authenticated user to insert their own profile
CREATE POLICY "Users can insert their own profile"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow authenticated user to update their own profile only
CREATE POLICY "Users can update their own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Allow authenticated user to delete their own profile only
CREATE POLICY "Users can delete their own profile"
    ON public.profiles
    FOR DELETE
    USING (auth.uid() = user_id);

-- 7. SUPABASE STORAGE BUCKET & POLICIES FOR AVATARS
-- Create avatars bucket (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Anyone can view avatar images
CREATE POLICY "Avatar images are publicly accessible"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'avatars');

-- Storage RLS: Users can upload avatars to their own folder (avatars/{user_id}/...)
CREATE POLICY "Users can upload their own avatar"
    ON storage.objects
    FOR INSERT
    WITH CHECK (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Storage RLS: Users can update their own avatar
CREATE POLICY "Users can update their own avatar"
    ON storage.objects
    FOR UPDATE
    USING (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Storage RLS: Users can delete their own avatar
CREATE POLICY "Users can delete their own avatar"
    ON storage.objects
    FOR DELETE
    USING (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );
