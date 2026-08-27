-- ============================================================================
-- SKILLBRIDGE — BACKEND COMPLET
-- PostgreSQL Schema v2.0 — Extension complète du socle existant
-- Supabase PostgreSQL + RLS + Edge Functions Ready
-- ============================================================================
-- Exécuter dans Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================================

-- ============================================================================
-- 0. EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. TYPES ÉNUMÉRÉS
-- ============================================================================

DO $$ BEGIN
  CREATE TYPE skill_stage_enum AS ENUM ('declared', 'learning', 'practicing', 'demonstrated', 'verified');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE skill_level_enum AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE passport_status_enum AS ENUM ('active', 'pending', 'expired', 'revoked');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE certificate_status_enum AS ENUM ('valid', 'revoked', 'expired');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE exchange_status_enum AS ENUM ('pending', 'accepted', 'declined', 'cancelled', 'completed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE opportunity_type_enum AS ENUM ('emploi', 'stage', 'freelance', 'collaboration', 'projet', 'challenge');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE opportunity_status_enum AS ENUM ('draft', 'published', 'closed', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE application_status_enum AS ENUM ('submitted', 'viewed', 'shortlisted', 'accepted', 'rejected', 'withdrawn');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE course_status_enum AS ENUM ('draft', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payment_status_enum AS ENUM ('pending', 'processing', 'success', 'failed', 'refunded', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE challenge_status_enum AS ENUM ('draft', 'active', 'closed', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE submission_status_enum AS ENUM ('submitted', 'under_review', 'accepted', 'rejected', 'winner');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE user_role_enum AS ENUM ('learner', 'mentor', 'company', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================================
-- 2. FONCTION UTILITAIRE : handle_updated_at (idempotente)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 3. FONCTION : Génération SBID unique (SB-YYYY-XXXXXX)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.generate_sbid()
RETURNS TEXT AS $$
DECLARE
  v_year TEXT;
  v_rand TEXT;
  v_candidate TEXT;
BEGIN
  v_year := EXTRACT(YEAR FROM now())::TEXT;
  LOOP
    v_rand := UPPER(SUBSTRING(MD5(gen_random_uuid()::TEXT), 1, 6));
    v_candidate := 'SB-' || v_year || '-' || v_rand;
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.skill_passports WHERE sbid = v_candidate);
  END LOOP;
  RETURN v_candidate;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 4. TABLE PROFILES (Extension — colonnes supplémentaires)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  headline TEXT DEFAULT NULL,
  avatar_url TEXT DEFAULT NULL,
  bio TEXT DEFAULT NULL,
  location TEXT DEFAULT NULL,
  country TEXT DEFAULT NULL,
  account_type TEXT NOT NULL DEFAULT 'talent' CHECK (
    account_type IN ('talent', 'learner', 'professional', 'mentor', 'company', 'institution')
  ),
  title TEXT DEFAULT NULL,
  domain TEXT DEFAULT NULL,
  languages TEXT[] DEFAULT '{}',
  website TEXT DEFAULT NULL,
  linkedin_url TEXT DEFAULT NULL,
  instagram_url TEXT DEFAULT NULL,
  tiktok_url TEXT DEFAULT NULL,
  github_url TEXT DEFAULT NULL,
  availability TEXT DEFAULT NULL,
  profile_visibility TEXT NOT NULL DEFAULT 'public' CHECK (
    profile_visibility IN ('public', 'private')
  ),
  -- Skill Passport (colonnes persistées)
  passport_id TEXT UNIQUE DEFAULT NULL,
  passport_score INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ajout des colonnes manquantes si elles n'existent pas (idempotent)
DO $$ BEGIN
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS headline TEXT DEFAULT NULL;
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS title TEXT DEFAULT NULL;
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS domain TEXT DEFAULT NULL;
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT '{}';
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS passport_id TEXT UNIQUE DEFAULT NULL;
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS passport_score INT NOT NULL DEFAULT 0;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_account_type ON public.profiles(account_type);
CREATE INDEX IF NOT EXISTS idx_profiles_passport_id ON public.profiles(passport_id);

DROP TRIGGER IF EXISTS tr_profiles_updated_at ON public.profiles;
CREATE TRIGGER tr_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 5. TRIGGER : Création automatique du profil à l'inscription
-- ============================================================================
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
  v_first_name := COALESCE(NEW.raw_user_meta_data->>'first_name', 'Utilisateur');
  v_last_name := COALESCE(NEW.raw_user_meta_data->>'last_name', '');
  v_account_type := COALESCE(NEW.raw_user_meta_data->>'account_type', 'talent');

  v_base_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    LOWER(REGEXP_REPLACE(SPLIT_PART(NEW.email, '@', 1), '[^a-zA-Z0-9_-]', '', 'g'))
  );

  IF v_base_username IS NULL OR LENGTH(v_base_username) < 3 THEN
    v_base_username := 'user_' || SUBSTRING(NEW.id::TEXT, 1, 8);
  END IF;

  v_final_username := v_base_username;
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = v_final_username) LOOP
    v_counter := v_counter + 1;
    v_final_username := v_base_username || v_counter::TEXT;
  END LOOP;

  INSERT INTO public.profiles (
    user_id, first_name, last_name, username, account_type,
    passport_score, created_at, updated_at
  ) VALUES (
    NEW.id, v_first_name, v_last_name, v_final_username, v_account_type,
    0, now(), now()
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 6. RÔLES UTILISATEURS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role_enum NOT NULL,
  granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

-- Fonction utilitaire : vérifier si l'utilisateur courant est admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 7. CATALOGUE DE COMPÉTENCES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.skill_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  subcategory TEXT DEFAULT NULL,
  icon TEXT DEFAULT NULL,
  is_verified BOOLEAN NOT NULL DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_skill_catalog_category ON public.skill_catalog(category);
CREATE INDEX IF NOT EXISTS idx_skill_catalog_name ON public.skill_catalog(name);

-- Données initiales du catalogue
INSERT INTO public.skill_catalog (name, category, subcategory) VALUES
  ('JavaScript', 'Technologie', 'Programmation'),
  ('TypeScript', 'Technologie', 'Programmation'),
  ('Python', 'Technologie', 'Programmation'),
  ('React', 'Technologie', 'Frontend'),
  ('Node.js', 'Technologie', 'Backend'),
  ('SQL', 'Technologie', 'Base de données'),
  ('PostgreSQL', 'Technologie', 'Base de données'),
  ('MongoDB', 'Technologie', 'Base de données'),
  ('Docker', 'Technologie', 'DevOps'),
  ('Git', 'Technologie', 'DevOps'),
  ('Figma', 'Design', 'UI/UX'),
  ('UI/UX Design', 'Design', 'Interface'),
  ('Graphic Design', 'Design', 'Visuel'),
  ('Motion Design', 'Design', 'Animation'),
  ('Product Design', 'Design', 'Produit'),
  ('Marketing Digital', 'Business', 'Marketing'),
  ('SEO', 'Business', 'Marketing'),
  ('Gestion de projet', 'Business', 'Management'),
  ('Entrepreneuriat', 'Business', 'Leadership'),
  ('Finance', 'Business', 'Finance'),
  ('Communication', 'Soft Skills', 'Interpersonnel'),
  ('Leadership', 'Soft Skills', 'Management'),
  ('Négociation', 'Soft Skills', 'Business'),
  ('Anglais', 'Langues', 'Communication'),
  ('Français', 'Langues', 'Communication'),
  ('Data Science', 'Technologie', 'Data'),
  ('Machine Learning', 'Technologie', 'IA'),
  ('Cybersécurité', 'Technologie', 'Sécurité'),
  ('Cloud AWS', 'Technologie', 'Cloud'),
  ('Mobile Android', 'Technologie', 'Mobile'),
  ('Mobile iOS', 'Technologie', 'Mobile'),
  ('Flutter', 'Technologie', 'Mobile'),
  ('React Native', 'Technologie', 'Mobile'),
  ('Photographie', 'Créatif', 'Visuel'),
  ('Vidéographie', 'Créatif', 'Audiovisuel'),
  ('Rédaction', 'Créatif', 'Contenu'),
  ('Comptabilité', 'Business', 'Finance'),
  ('Vente', 'Business', 'Commercial'),
  ('Ressources humaines', 'Business', 'Management'),
  ('Droit des affaires', 'Business', 'Juridique')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- 8. COMPÉTENCES UTILISATEURS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_catalog_id UUID REFERENCES public.skill_catalog(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Autre',
  stage skill_stage_enum NOT NULL DEFAULT 'declared',
  level INT NOT NULL DEFAULT 30 CHECK (level >= 0 AND level <= 100),
  can_teach BOOLEAN NOT NULL DEFAULT false,
  want_to_learn BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_skills_profile_id ON public.user_skills(profile_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON public.user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_stage ON public.user_skills(stage);
CREATE INDEX IF NOT EXISTS idx_user_skills_can_teach ON public.user_skills(can_teach);
CREATE INDEX IF NOT EXISTS idx_user_skills_want_to_learn ON public.user_skills(want_to_learn);

DROP TRIGGER IF EXISTS tr_user_skills_updated_at ON public.user_skills;
CREATE TRIGGER tr_user_skills_updated_at
  BEFORE UPDATE ON public.user_skills
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 9. PREUVES DE COMPÉTENCES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.skill_proofs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_skill_id UUID NOT NULL REFERENCES public.user_skills(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT DEFAULT NULL,
  type TEXT NOT NULL CHECK (type IN ('github', 'live', 'peer_review', 'certification')),
  proof_date DATE NOT NULL DEFAULT CURRENT_DATE,
  verified BOOLEAN NOT NULL DEFAULT false,
  verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_skill_proofs_user_skill_id ON public.skill_proofs(user_skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_proofs_user_id ON public.skill_proofs(user_id);

-- ============================================================================
-- 10. ÉCHANGES DE COMPÉTENCES (SKILL EXCHANGE)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.skill_exchanges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  responder_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  requester_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  responder_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Ce que le demandeur propose d'enseigner
  offer_skill_name TEXT NOT NULL,
  offer_skill_category TEXT DEFAULT NULL,
  -- Ce que le demandeur veut apprendre
  request_skill_name TEXT NOT NULL,
  request_skill_category TEXT DEFAULT NULL,
  status exchange_status_enum NOT NULL DEFAULT 'pending',
  message TEXT DEFAULT NULL,
  response_message TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (requester_id != responder_id)
);

CREATE INDEX IF NOT EXISTS idx_skill_exchanges_requester ON public.skill_exchanges(requester_id);
CREATE INDEX IF NOT EXISTS idx_skill_exchanges_responder ON public.skill_exchanges(responder_id);
CREATE INDEX IF NOT EXISTS idx_skill_exchanges_status ON public.skill_exchanges(status);

DROP TRIGGER IF EXISTS tr_skill_exchanges_updated_at ON public.skill_exchanges;
CREATE TRIGGER tr_skill_exchanges_updated_at
  BEFORE UPDATE ON public.skill_exchanges
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 11. PROJETS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT DEFAULT NULL,
  technologies TEXT[] DEFAULT '{}',
  skills_used TEXT[] DEFAULT '{}',
  role TEXT DEFAULT NULL,
  github_url TEXT DEFAULT NULL,
  live_url TEXT DEFAULT NULL,
  video_url TEXT DEFAULT NULL,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  verified BOOLEAN NOT NULL DEFAULT false,
  verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  project_date DATE DEFAULT NULL,
  likes_count INT NOT NULL DEFAULT 0,
  comments_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_projects_author_id ON public.projects(author_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);

DROP TRIGGER IF EXISTS tr_projects_updated_at ON public.projects;
CREATE TRIGGER tr_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 12. MÉDIAS DES PROJETS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.project_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_project_media_project_id ON public.project_media(project_id);

-- ============================================================================
-- 13. LIKES DES PROJETS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.project_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (project_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_project_likes_project_id ON public.project_likes(project_id);
CREATE INDEX IF NOT EXISTS idx_project_likes_user_id ON public.project_likes(user_id);

-- Trigger : sync likes_count sur projects
CREATE OR REPLACE FUNCTION public.sync_project_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.projects SET likes_count = likes_count + 1 WHERE id = NEW.project_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.projects SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.project_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_sync_project_likes ON public.project_likes;
CREATE TRIGGER tr_sync_project_likes
  AFTER INSERT OR DELETE ON public.project_likes
  FOR EACH ROW EXECUTE FUNCTION public.sync_project_likes_count();

-- ============================================================================
-- 14. COMMENTAIRES DES PROJETS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.project_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (LENGTH(content) > 0 AND LENGTH(content) <= 1000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_project_comments_project_id ON public.project_comments(project_id);
CREATE INDEX IF NOT EXISTS idx_project_comments_created_at ON public.project_comments(created_at DESC);

DROP TRIGGER IF EXISTS tr_project_comments_updated_at ON public.project_comments;
CREATE TRIGGER tr_project_comments_updated_at
  BEFORE UPDATE ON public.project_comments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger : sync comments_count sur projects
CREATE OR REPLACE FUNCTION public.sync_project_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.projects SET comments_count = comments_count + 1 WHERE id = NEW.project_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.projects SET comments_count = GREATEST(0, comments_count - 1) WHERE id = OLD.project_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_sync_project_comments ON public.project_comments;
CREATE TRIGGER tr_sync_project_comments
  AFTER INSERT OR DELETE ON public.project_comments
  FOR EACH ROW EXECUTE FUNCTION public.sync_project_comments_count();

-- ============================================================================
-- 15. SKILL PASSPORTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.skill_passports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  sbid TEXT NOT NULL UNIQUE DEFAULT public.generate_sbid(),
  status passport_status_enum NOT NULL DEFAULT 'active',
  score INT NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  public_visibility BOOLEAN NOT NULL DEFAULT true,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT NULL,
  revoked_at TIMESTAMPTZ DEFAULT NULL,
  revoked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  revocation_reason TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_skill_passports_sbid ON public.skill_passports(sbid);
CREATE INDEX IF NOT EXISTS idx_skill_passports_user_id ON public.skill_passports(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_passports_status ON public.skill_passports(status);

DROP TRIGGER IF EXISTS tr_skill_passports_updated_at ON public.skill_passports;
CREATE TRIGGER tr_skill_passports_updated_at
  BEFORE UPDATE ON public.skill_passports
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger : créer le passport automatiquement à la création du profil
CREATE OR REPLACE FUNCTION public.create_skill_passport_on_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.skill_passports (profile_id, user_id, sbid, status)
  VALUES (NEW.id, NEW.user_id, public.generate_sbid(), 'active')
  ON CONFLICT (profile_id) DO NOTHING;

  -- Mettre à jour passport_id dans profiles
  UPDATE public.profiles
  SET passport_id = (SELECT sbid FROM public.skill_passports WHERE profile_id = NEW.id)
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_create_passport_on_profile ON public.profiles;
CREATE TRIGGER tr_create_passport_on_profile
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.create_skill_passport_on_profile();

-- Fonction : Recalcul du passport score
CREATE OR REPLACE FUNCTION public.recalculate_passport_score(p_user_id UUID)
RETURNS INT AS $$
DECLARE
  v_score INT := 0;
  v_profile_complete INT := 0;
  v_skills_count INT := 0;
  v_verified_skills INT := 0;
  v_projects_count INT := 0;
  v_certs_count INT := 0;
  v_has_avatar BOOLEAN := false;
  v_has_bio BOOLEAN := false;
BEGIN
  -- Profil de base (0-30 pts)
  SELECT
    CASE WHEN avatar_url IS NOT NULL THEN 1 ELSE 0 END,
    CASE WHEN bio IS NOT NULL AND LENGTH(bio) > 20 THEN 1 ELSE 0 END
  INTO v_has_avatar, v_has_bio
  FROM public.profiles WHERE user_id = p_user_id;

  v_profile_complete := 10 + (CASE WHEN v_has_avatar THEN 10 ELSE 0 END) + (CASE WHEN v_has_bio THEN 10 ELSE 0 END);

  -- Compétences (0-35 pts)
  SELECT COUNT(*) INTO v_skills_count FROM public.user_skills WHERE user_id = p_user_id;
  SELECT COUNT(*) INTO v_verified_skills FROM public.user_skills WHERE user_id = p_user_id AND stage IN ('demonstrated', 'verified');

  -- Projets (0-20 pts)
  SELECT COUNT(*) INTO v_projects_count FROM public.projects WHERE user_id = p_user_id AND status = 'published';

  -- Certifications dans user_skills proofs (0-15 pts)
  SELECT COUNT(*) INTO v_certs_count FROM public.skill_proofs sp
  JOIN public.user_skills us ON sp.user_skill_id = us.id
  WHERE us.user_id = p_user_id AND sp.type = 'certification';

  v_score := v_profile_complete
    + LEAST(25, v_skills_count * 5)
    + LEAST(10, v_verified_skills * 5)
    + LEAST(20, v_projects_count * 5)
    + LEAST(15, v_certs_count * 5);

  RETURN LEAST(100, v_score);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 16. CERTIFICATS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cert_id TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID DEFAULT NULL,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL DEFAULT 'SkillBridge',
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT NULL,
  status certificate_status_enum NOT NULL DEFAULT 'valid',
  skills TEXT[] DEFAULT '{}',
  revoked_at TIMESTAMPTZ DEFAULT NULL,
  revoked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  revocation_reason TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_certificates_cert_id ON public.certificates(cert_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON public.certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_status ON public.certificates(status);

-- Fonction : génération cert_id unique
CREATE OR REPLACE FUNCTION public.generate_cert_id()
RETURNS TEXT AS $$
DECLARE
  v_candidate TEXT;
BEGIN
  LOOP
    v_candidate := 'SB-CERT-' || UPPER(SUBSTRING(MD5(gen_random_uuid()::TEXT), 1, 8));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.certificates WHERE cert_id = v_candidate);
  END LOOP;
  RETURN v_candidate;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 17. FORMATIONS (COURSES)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  cover_url TEXT DEFAULT NULL,
  category TEXT DEFAULT NULL,
  level TEXT NOT NULL DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  skills TEXT[] DEFAULT '{}',
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00 CHECK (price >= 0),
  is_free BOOLEAN NOT NULL DEFAULT true,
  status course_status_enum NOT NULL DEFAULT 'draft',
  total_lessons INT NOT NULL DEFAULT 0,
  total_duration_minutes INT NOT NULL DEFAULT 0,
  enrollments_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_courses_creator_id ON public.courses(creator_id);
CREATE INDEX IF NOT EXISTS idx_courses_status ON public.courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_is_free ON public.courses(is_free);

DROP TRIGGER IF EXISTS tr_courses_updated_at ON public.courses;
CREATE TRIGGER tr_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 18. MODULES DE COURS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_course_modules_course_id ON public.course_modules(course_id);

-- ============================================================================
-- 19. LEÇONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT DEFAULT NULL,
  video_url TEXT DEFAULT NULL,
  duration_minutes INT NOT NULL DEFAULT 0,
  display_order INT NOT NULL DEFAULT 0,
  type TEXT NOT NULL DEFAULT 'video' CHECK (type IN ('video', 'text', 'quiz', 'exercise')),
  is_free_preview BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON public.lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON public.lessons(course_id);

DROP TRIGGER IF EXISTS tr_lessons_updated_at ON public.lessons;
CREATE TRIGGER tr_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 20. INSCRIPTIONS AUX COURS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  progress_pct INT NOT NULL DEFAULT 0 CHECK (progress_pct >= 0 AND progress_pct <= 100),
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ DEFAULT NULL,
  payment_id UUID DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (course_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON public.course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON public.course_enrollments(user_id);

-- Trigger : sync enrollments_count
CREATE OR REPLACE FUNCTION public.sync_course_enrollments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.courses SET enrollments_count = enrollments_count + 1 WHERE id = NEW.course_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.courses SET enrollments_count = GREATEST(0, enrollments_count - 1) WHERE id = OLD.course_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_sync_enrollments_count ON public.course_enrollments;
CREATE TRIGGER tr_sync_enrollments_count
  AFTER INSERT OR DELETE ON public.course_enrollments
  FOR EACH ROW EXECUTE FUNCTION public.sync_course_enrollments_count();

-- ============================================================================
-- 21. PROGRESSION DES LEÇONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ DEFAULT NULL,
  time_spent_seconds INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON public.lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_course_id ON public.lesson_progress(course_id);

DROP TRIGGER IF EXISTS tr_lesson_progress_updated_at ON public.lesson_progress;
CREATE TRIGGER tr_lesson_progress_updated_at
  BEFORE UPDATE ON public.lesson_progress
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger : recalcul progression du cours après update leçon
CREATE OR REPLACE FUNCTION public.recalculate_course_progress()
RETURNS TRIGGER AS $$
DECLARE
  v_total INT;
  v_completed INT;
  v_progress INT;
BEGIN
  SELECT COUNT(*) INTO v_total FROM public.lessons WHERE course_id = NEW.course_id;
  SELECT COUNT(*) INTO v_completed FROM public.lesson_progress
    WHERE user_id = NEW.user_id AND course_id = NEW.course_id AND completed = true;

  IF v_total > 0 THEN
    v_progress := ROUND((v_completed::NUMERIC / v_total::NUMERIC) * 100);
  ELSE
    v_progress := 0;
  END IF;

  UPDATE public.course_enrollments
  SET
    progress_pct = v_progress,
    status = CASE WHEN v_progress = 100 THEN 'completed' ELSE status END,
    completed_at = CASE WHEN v_progress = 100 AND completed_at IS NULL THEN now() ELSE completed_at END
  WHERE user_id = NEW.user_id AND course_id = NEW.course_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_recalculate_course_progress ON public.lesson_progress;
CREATE TRIGGER tr_recalculate_course_progress
  AFTER INSERT OR UPDATE OF completed ON public.lesson_progress
  FOR EACH ROW EXECUTE FUNCTION public.recalculate_course_progress();

-- ============================================================================
-- 22. MASTERCLASSES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.masterclasses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  cover_url TEXT DEFAULT NULL,
  speaker_name TEXT DEFAULT NULL,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00 CHECK (price >= 0),
  is_free BOOLEAN NOT NULL DEFAULT true,
  scheduled_at TIMESTAMPTZ DEFAULT NULL,
  duration_minutes INT DEFAULT NULL,
  max_capacity INT DEFAULT NULL,
  registrations_count INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_masterclasses_status ON public.masterclasses(status);
CREATE INDEX IF NOT EXISTS idx_masterclasses_scheduled_at ON public.masterclasses(scheduled_at);

DROP TRIGGER IF EXISTS tr_masterclasses_updated_at ON public.masterclasses;
CREATE TRIGGER tr_masterclasses_updated_at
  BEFORE UPDATE ON public.masterclasses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 23. INSCRIPTIONS AUX MASTERCLASSES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.masterclass_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  masterclass_id UUID NOT NULL REFERENCES public.masterclasses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'confirmed', 'cancelled')),
  registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  payment_id UUID DEFAULT NULL,
  UNIQUE (masterclass_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_masterclass_reg_masterclass_id ON public.masterclass_registrations(masterclass_id);
CREATE INDEX IF NOT EXISTS idx_masterclass_reg_user_id ON public.masterclass_registrations(user_id);

-- ============================================================================
-- 24. PROFILS MENTORS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.mentor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ DEFAULT NULL,
  bio TEXT DEFAULT NULL,
  expertise TEXT[] DEFAULT '{}',
  domains TEXT[] DEFAULT '{}',
  experience_years INT DEFAULT NULL,
  hourly_rate DECIMAL(10, 2) DEFAULT NULL,
  availability TEXT DEFAULT NULL,
  sessions_count INT NOT NULL DEFAULT 0,
  rating DECIMAL(3, 2) NOT NULL DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mentor_profiles_profile_id ON public.mentor_profiles(profile_id);
CREATE INDEX IF NOT EXISTS idx_mentor_profiles_is_approved ON public.mentor_profiles(is_approved);

DROP TRIGGER IF EXISTS tr_mentor_profiles_updated_at ON public.mentor_profiles;
CREATE TRIGGER tr_mentor_profiles_updated_at
  BEFORE UPDATE ON public.mentor_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 25. ENTREPRISES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT NULL,
  logo_url TEXT DEFAULT NULL,
  website TEXT DEFAULT NULL,
  location TEXT DEFAULT NULL,
  country TEXT DEFAULT NULL,
  industry TEXT DEFAULT NULL,
  size TEXT DEFAULT NULL CHECK (size IN ('1-10', '11-50', '51-200', '201-1000', '1000+')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_companies_owner_id ON public.companies(owner_id);
CREATE INDEX IF NOT EXISTS idx_companies_status ON public.companies(status);

DROP TRIGGER IF EXISTS tr_companies_updated_at ON public.companies;
CREATE TRIGGER tr_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 26. OPPORTUNITÉS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type opportunity_type_enum NOT NULL DEFAULT 'emploi',
  location TEXT DEFAULT NULL,
  workplace_type TEXT DEFAULT 'onsite' CHECK (workplace_type IN ('remote', 'hybrid', 'onsite')),
  required_skills TEXT[] DEFAULT '{}',
  level TEXT DEFAULT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  salary_min INT DEFAULT NULL,
  salary_max INT DEFAULT NULL,
  currency TEXT NOT NULL DEFAULT 'XOF',
  deadline DATE DEFAULT NULL,
  status opportunity_status_enum NOT NULL DEFAULT 'draft',
  applications_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_opportunities_status ON public.opportunities(status);
CREATE INDEX IF NOT EXISTS idx_opportunities_type ON public.opportunities(type);
CREATE INDEX IF NOT EXISTS idx_opportunities_creator_id ON public.opportunities(creator_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_company_id ON public.opportunities(company_id);

DROP TRIGGER IF EXISTS tr_opportunities_updated_at ON public.opportunities;
CREATE TRIGGER tr_opportunities_updated_at
  BEFORE UPDATE ON public.opportunities
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 27. CANDIDATURES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cover_message TEXT DEFAULT NULL,
  passport_sbid TEXT DEFAULT NULL,
  status application_status_enum NOT NULL DEFAULT 'submitted',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (opportunity_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_applications_opportunity_id ON public.applications(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_applications_applicant_id ON public.applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);

DROP TRIGGER IF EXISTS tr_applications_updated_at ON public.applications;
CREATE TRIGGER tr_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger : sync applications_count
CREATE OR REPLACE FUNCTION public.sync_applications_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.opportunities SET applications_count = applications_count + 1 WHERE id = NEW.opportunity_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.opportunities SET applications_count = GREATEST(0, applications_count - 1) WHERE id = OLD.opportunity_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_sync_applications_count ON public.applications;
CREATE TRIGGER tr_sync_applications_count
  AFTER INSERT OR DELETE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.sync_applications_count();

-- ============================================================================
-- 28. MESSAGERIE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON public.conversations(last_message_at DESC);

CREATE TABLE IF NOT EXISTS public.conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_read_at TIMESTAMPTZ DEFAULT NULL,
  UNIQUE (conversation_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_conv_participants_user_id ON public.conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_conv_participants_conv_id ON public.conversation_participants(conversation_id);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (LENGTH(content) > 0 AND LENGTH(content) <= 4000),
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

-- Trigger : update last_message_at dans conversations
CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations SET last_message_at = now() WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_update_conversation_last_message ON public.messages;
CREATE TRIGGER tr_update_conversation_last_message
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.update_conversation_last_message();

-- ============================================================================
-- 29. NOTIFICATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT DEFAULT NULL,
  data JSONB DEFAULT '{}',
  action_url TEXT DEFAULT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- ============================================================================
-- 30. CHALLENGES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}',
  rules TEXT DEFAULT NULL,
  evaluation_criteria TEXT DEFAULT NULL,
  starts_at TIMESTAMPTZ DEFAULT NULL,
  deadline TIMESTAMPTZ DEFAULT NULL,
  status challenge_status_enum NOT NULL DEFAULT 'draft',
  submissions_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_challenges_status ON public.challenges(status);
CREATE INDEX IF NOT EXISTS idx_challenges_deadline ON public.challenges(deadline);

DROP TRIGGER IF EXISTS tr_challenges_updated_at ON public.challenges;
CREATE TRIGGER tr_challenges_updated_at
  BEFORE UPDATE ON public.challenges
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 31. SOUMISSIONS DE CHALLENGES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.challenge_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  submitter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  description TEXT DEFAULT NULL,
  submission_url TEXT DEFAULT NULL,
  status submission_status_enum NOT NULL DEFAULT 'submitted',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ DEFAULT NULL,
  review_notes TEXT DEFAULT NULL,
  UNIQUE (challenge_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_challenge_submissions_challenge_id ON public.challenge_submissions(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_submissions_submitter_id ON public.challenge_submissions(submitter_id);

-- Trigger : sync submissions_count
CREATE OR REPLACE FUNCTION public.sync_challenge_submissions_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.challenges SET submissions_count = submissions_count + 1 WHERE id = NEW.challenge_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.challenges SET submissions_count = GREATEST(0, submissions_count - 1) WHERE id = OLD.challenge_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_sync_challenge_submissions ON public.challenge_submissions;
CREATE TRIGGER tr_sync_challenge_submissions
  AFTER INSERT OR DELETE ON public.challenge_submissions
  FOR EACH ROW EXECUTE FUNCTION public.sync_challenge_submissions_count();

-- ============================================================================
-- 32. PAIEMENTS & TRANSACTIONS (Architecture)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('course', 'masterclass', 'mentoring', 'other')),
  entity_id UUID NOT NULL,
  gross_amount DECIMAL(10, 2) NOT NULL CHECK (gross_amount >= 0),
  platform_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00 CHECK (platform_fee >= 0),
  creator_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00 CHECK (creator_amount >= 0),
  payment_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00 CHECK (payment_fee >= 0),
  net_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00 CHECK (net_amount >= 0),
  currency TEXT NOT NULL DEFAULT 'XOF',
  status payment_status_enum NOT NULL DEFAULT 'pending',
  provider TEXT NOT NULL DEFAULT 'pending' CHECK (provider IN ('stripe', 'wave', 'orange_money', 'mtn', 'free', 'pending')),
  provider_transaction_id TEXT DEFAULT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_entity ON public.payments(entity_type, entity_id);

DROP TRIGGER IF EXISTS tr_payments_updated_at ON public.payments;
CREATE TRIGGER tr_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 33. CONFIGURATION PLATEFORME (Admin)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.platform_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT DEFAULT NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS tr_platform_config_updated_at ON public.platform_config;
CREATE TRIGGER tr_platform_config_updated_at
  BEFORE UPDATE ON public.platform_config
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Valeurs initiales de configuration
INSERT INTO public.platform_config (key, value, description) VALUES
  ('platform_fee_pct', '15', 'Commission plateforme en pourcentage sur les ventes mentors'),
  ('payment_fee_pct', '2.9', 'Frais de traitement paiement en pourcentage'),
  ('mentor_approval_required', 'true', 'Approbation admin requise pour devenir mentor'),
  ('max_file_size_mb', '50', 'Taille maximale des fichiers uploadés en MB'),
  ('passport_expiry_years', '0', 'Durée de validité du passport en années (0 = illimité)'),
  ('course_approval_required', 'false', 'Approbation admin requise pour publier un cours'),
  ('registration_open', 'true', 'Nouvelles inscriptions ouvertes')
ON CONFLICT (key) DO NOTHING;

-- ============================================================================
-- 34. ÉLÉMENTS SAUVEGARDÉS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.saved_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('project', 'opportunity', 'course', 'talent', 'masterclass')),
  entity_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, entity_type, entity_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_items_user_id ON public.saved_items(user_id);

-- ============================================================================
-- 35. LOGS D'AUDIT
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT DEFAULT NULL,
  old_values JSONB DEFAULT NULL,
  new_values JSONB DEFAULT NULL,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- ============================================================================
-- 36. ROW LEVEL SECURITY — TOUTES LES TABLES
-- ============================================================================

-- PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Profiles viewable by owner or if public" ON public.profiles;
CREATE POLICY "Profiles viewable by owner or if public" ON public.profiles FOR SELECT
  USING (auth.uid() = user_id OR profile_visibility = 'public');
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin());
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;
CREATE POLICY "Users can delete their own profile" ON public.profiles FOR DELETE
  USING (auth.uid() = user_id OR public.is_admin());

-- USER_ROLES
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());
DROP POLICY IF EXISTS "Only admins can manage roles" ON public.user_roles;
CREATE POLICY "Only admins can manage roles" ON public.user_roles FOR ALL
  USING (public.is_admin());

-- SKILL_CATALOG
ALTER TABLE public.skill_catalog ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Skill catalog is publicly readable" ON public.skill_catalog;
CREATE POLICY "Skill catalog is publicly readable" ON public.skill_catalog FOR SELECT USING (true);
DROP POLICY IF EXISTS "Only admins can modify skill catalog" ON public.skill_catalog;
CREATE POLICY "Only admins can modify skill catalog" ON public.skill_catalog FOR ALL
  USING (public.is_admin());

-- USER_SKILLS
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "User skills viewable if profile is public" ON public.user_skills;
CREATE POLICY "User skills viewable if profile is public" ON public.user_skills FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = profile_id AND profile_visibility = 'public')
  );
DROP POLICY IF EXISTS "Users can manage their own skills" ON public.user_skills;
CREATE POLICY "Users can manage their own skills" ON public.user_skills FOR ALL
  USING (auth.uid() = user_id);

-- SKILL_PROOFS
ALTER TABLE public.skill_proofs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Skill proofs viewable by owner or public profile" ON public.skill_proofs;
CREATE POLICY "Skill proofs viewable by owner or public profile" ON public.skill_proofs FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.user_skills us
      JOIN public.profiles p ON p.id = us.profile_id
      WHERE us.id = user_skill_id AND p.profile_visibility = 'public'
    )
  );
DROP POLICY IF EXISTS "Users can manage their own skill proofs" ON public.skill_proofs;
CREATE POLICY "Users can manage their own skill proofs" ON public.skill_proofs FOR ALL
  USING (auth.uid() = user_id);

-- SKILL_EXCHANGES
ALTER TABLE public.skill_exchanges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Participants can view their exchanges" ON public.skill_exchanges;
CREATE POLICY "Participants can view their exchanges" ON public.skill_exchanges FOR SELECT
  USING (auth.uid() = requester_user_id OR auth.uid() = responder_user_id OR public.is_admin());
DROP POLICY IF EXISTS "Auth users can create exchanges" ON public.skill_exchanges;
CREATE POLICY "Auth users can create exchanges" ON public.skill_exchanges FOR INSERT
  WITH CHECK (auth.uid() = requester_user_id);
DROP POLICY IF EXISTS "Participants can update exchanges" ON public.skill_exchanges;
CREATE POLICY "Participants can update exchanges" ON public.skill_exchanges FOR UPDATE
  USING (auth.uid() = requester_user_id OR auth.uid() = responder_user_id);

-- PROJECTS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Published projects are publicly readable" ON public.projects;
CREATE POLICY "Published projects are publicly readable" ON public.projects FOR SELECT
  USING (status = 'published' OR auth.uid() = user_id OR public.is_admin());
DROP POLICY IF EXISTS "Users can manage their own projects" ON public.projects;
CREATE POLICY "Users can manage their own projects" ON public.projects FOR ALL
  USING (auth.uid() = user_id);

-- PROJECT_MEDIA
ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Project media readable with project" ON public.project_media;
CREATE POLICY "Project media readable with project" ON public.project_media FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can manage their own project media" ON public.project_media;
CREATE POLICY "Users can manage their own project media" ON public.project_media FOR ALL
  USING (auth.uid() = user_id);

-- PROJECT_LIKES
ALTER TABLE public.project_likes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Project likes are publicly readable" ON public.project_likes;
CREATE POLICY "Project likes are publicly readable" ON public.project_likes FOR SELECT USING (true);
DROP POLICY IF EXISTS "Auth users can like projects" ON public.project_likes;
CREATE POLICY "Auth users can like projects" ON public.project_likes FOR ALL
  USING (auth.uid() = user_id);

-- PROJECT_COMMENTS
ALTER TABLE public.project_comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Project comments are publicly readable" ON public.project_comments;
CREATE POLICY "Project comments are publicly readable" ON public.project_comments FOR SELECT USING (true);
DROP POLICY IF EXISTS "Auth users can comment" ON public.project_comments;
CREATE POLICY "Auth users can comment" ON public.project_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can manage their own comments" ON public.project_comments;
CREATE POLICY "Users can manage their own comments" ON public.project_comments FOR ALL
  USING (auth.uid() = user_id OR public.is_admin());

-- SKILL_PASSPORTS
ALTER TABLE public.skill_passports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Passports are publicly readable if visible" ON public.skill_passports;
CREATE POLICY "Passports are publicly readable if visible" ON public.skill_passports FOR SELECT
  USING (public_visibility = true OR auth.uid() = user_id OR public.is_admin());
DROP POLICY IF EXISTS "Users can view their own passport" ON public.skill_passports;
CREATE POLICY "Users can view their own passport" ON public.skill_passports FOR UPDATE
  USING (public.is_admin());

-- CERTIFICATES
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Certificates viewable by owner or for verification" ON public.certificates;
CREATE POLICY "Certificates viewable by owner or for verification" ON public.certificates FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());
DROP POLICY IF EXISTS "Only system/admin can create certificates" ON public.certificates;
CREATE POLICY "Only system/admin can create certificates" ON public.certificates FOR INSERT
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- COURSES
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Published courses are publicly readable" ON public.courses;
CREATE POLICY "Published courses are publicly readable" ON public.courses FOR SELECT
  USING (status = 'published' OR auth.uid() = user_id OR public.is_admin());
DROP POLICY IF EXISTS "Users can manage their own courses" ON public.courses;
CREATE POLICY "Users can manage their own courses" ON public.courses FOR ALL
  USING (auth.uid() = user_id);

-- COURSE_MODULES
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Course modules readable with course" ON public.course_modules;
CREATE POLICY "Course modules readable with course" ON public.course_modules FOR SELECT USING (true);
DROP POLICY IF EXISTS "Course creators can manage modules" ON public.course_modules;
CREATE POLICY "Course creators can manage modules" ON public.course_modules FOR ALL
  USING (EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND user_id = auth.uid()));

-- LESSONS
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lessons readable by enrolled users or free preview" ON public.lessons;
CREATE POLICY "Lessons readable by enrolled users or free preview" ON public.lessons FOR SELECT
  USING (
    is_free_preview = true
    OR EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.course_enrollments WHERE course_id = lessons.course_id AND user_id = auth.uid())
    OR public.is_admin()
  );
DROP POLICY IF EXISTS "Course creators can manage lessons" ON public.lessons;
CREATE POLICY "Course creators can manage lessons" ON public.lessons FOR ALL
  USING (EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND user_id = auth.uid()));

-- COURSE_ENROLLMENTS
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own enrollments" ON public.course_enrollments;
CREATE POLICY "Users can view their own enrollments" ON public.course_enrollments FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND user_id = auth.uid())
    OR public.is_admin()
  );
DROP POLICY IF EXISTS "Users can manage their own enrollments" ON public.course_enrollments;
CREATE POLICY "Users can manage their own enrollments" ON public.course_enrollments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- LESSON_PROGRESS
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own lesson progress" ON public.lesson_progress;
CREATE POLICY "Users can manage their own lesson progress" ON public.lesson_progress FOR ALL
  USING (auth.uid() = user_id);

-- MASTERCLASSES
ALTER TABLE public.masterclasses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Published masterclasses are publicly readable" ON public.masterclasses;
CREATE POLICY "Published masterclasses are publicly readable" ON public.masterclasses FOR SELECT
  USING (status = 'published' OR auth.uid() = user_id OR public.is_admin());
DROP POLICY IF EXISTS "Users can manage their own masterclasses" ON public.masterclasses;
CREATE POLICY "Users can manage their own masterclasses" ON public.masterclasses FOR ALL
  USING (auth.uid() = user_id);

-- MASTERCLASS_REGISTRATIONS
ALTER TABLE public.masterclass_registrations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own registrations" ON public.masterclass_registrations;
CREATE POLICY "Users can view their own registrations" ON public.masterclass_registrations FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());
DROP POLICY IF EXISTS "Users can register for masterclasses" ON public.masterclass_registrations;
CREATE POLICY "Users can register for masterclasses" ON public.masterclass_registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- MENTOR_PROFILES
ALTER TABLE public.mentor_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Approved mentor profiles are publicly readable" ON public.mentor_profiles;
CREATE POLICY "Approved mentor profiles are publicly readable" ON public.mentor_profiles FOR SELECT
  USING (is_approved = true OR auth.uid() = user_id OR public.is_admin());
DROP POLICY IF EXISTS "Users can manage their own mentor profile" ON public.mentor_profiles;
CREATE POLICY "Users can manage their own mentor profile" ON public.mentor_profiles FOR ALL
  USING (auth.uid() = user_id OR public.is_admin());

-- COMPANIES
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Active companies are publicly readable" ON public.companies;
CREATE POLICY "Active companies are publicly readable" ON public.companies FOR SELECT
  USING (status = 'active' OR auth.uid() = user_id OR public.is_admin());
DROP POLICY IF EXISTS "Users can manage their own company" ON public.companies;
CREATE POLICY "Users can manage their own company" ON public.companies FOR ALL
  USING (auth.uid() = user_id);

-- OPPORTUNITIES
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Published opportunities are publicly readable" ON public.opportunities;
CREATE POLICY "Published opportunities are publicly readable" ON public.opportunities FOR SELECT
  USING (status = 'published' OR auth.uid() = user_id OR public.is_admin());
DROP POLICY IF EXISTS "Creators can manage their opportunities" ON public.opportunities;
CREATE POLICY "Creators can manage their opportunities" ON public.opportunities FOR ALL
  USING (auth.uid() = user_id);

-- APPLICATIONS
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own applications" ON public.applications;
CREATE POLICY "Users can view their own applications" ON public.applications FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM public.opportunities WHERE id = opportunity_id AND user_id = auth.uid())
    OR public.is_admin()
  );
DROP POLICY IF EXISTS "Users can create applications" ON public.applications;
CREATE POLICY "Users can create applications" ON public.applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can manage their own applications" ON public.applications;
CREATE POLICY "Users can manage their own applications" ON public.applications FOR UPDATE
  USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM public.opportunities WHERE id = opportunity_id AND user_id = auth.uid())
    OR public.is_admin()
  );

-- CONVERSATIONS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Participants can view their conversations" ON public.conversations;
CREATE POLICY "Participants can view their conversations" ON public.conversations FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = id AND user_id = auth.uid()));
DROP POLICY IF EXISTS "Auth users can create conversations" ON public.conversations;
CREATE POLICY "Auth users can create conversations" ON public.conversations FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- CONVERSATION_PARTICIPANTS
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Participants can view conversation members" ON public.conversation_participants;
CREATE POLICY "Participants can view conversation members" ON public.conversation_participants FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.conversation_participants cp WHERE cp.conversation_id = conversation_id AND cp.user_id = auth.uid()));
DROP POLICY IF EXISTS "System can add participants" ON public.conversation_participants;
CREATE POLICY "System can add participants" ON public.conversation_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.conversations WHERE id = conversation_id AND created_by = auth.uid()));

-- MESSAGES
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Participants can view messages" ON public.messages;
CREATE POLICY "Participants can view messages" ON public.messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()));
DROP POLICY IF EXISTS "Participants can send messages" ON public.messages;
CREATE POLICY "Participants can send messages" ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid())
  );

-- NOTIFICATIONS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- CHALLENGES
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Active challenges are publicly readable" ON public.challenges;
CREATE POLICY "Active challenges are publicly readable" ON public.challenges FOR SELECT
  USING (status IN ('active', 'closed') OR auth.uid() = user_id OR public.is_admin());
DROP POLICY IF EXISTS "Creators can manage their challenges" ON public.challenges;
CREATE POLICY "Creators can manage their challenges" ON public.challenges FOR ALL
  USING (auth.uid() = user_id OR public.is_admin());

-- CHALLENGE_SUBMISSIONS
ALTER TABLE public.challenge_submissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Submissions viewable by submitter or admin" ON public.challenge_submissions;
CREATE POLICY "Submissions viewable by submitter or admin" ON public.challenge_submissions FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());
DROP POLICY IF EXISTS "Auth users can submit to challenges" ON public.challenge_submissions;
CREATE POLICY "Auth users can submit to challenges" ON public.challenge_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- PAYMENTS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;
CREATE POLICY "Users can view their own payments" ON public.payments FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- PLATFORM_CONFIG
ALTER TABLE public.platform_config ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage platform config" ON public.platform_config;
CREATE POLICY "Admins can manage platform config" ON public.platform_config FOR ALL
  USING (public.is_admin());
DROP POLICY IF EXISTS "Config is readable by authenticated users" ON public.platform_config;
CREATE POLICY "Config is readable by authenticated users" ON public.platform_config FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- SAVED_ITEMS
ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own saved items" ON public.saved_items;
CREATE POLICY "Users can manage their own saved items" ON public.saved_items FOR ALL
  USING (auth.uid() = user_id);

-- AUDIT_LOGS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Only admins can read audit logs" ON public.audit_logs;
CREATE POLICY "Only admins can read audit logs" ON public.audit_logs FOR SELECT
  USING (public.is_admin());

-- ============================================================================
-- 37. SUPABASE STORAGE — BUCKETS
-- ============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('projects', 'projects', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']),
  ('courses', 'courses', true, 524288000, ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'application/pdf']),
  ('companies', 'companies', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('masterclasses', 'masterclasses', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4'])
ON CONFLICT (id) DO NOTHING;

-- Policies Storage: Avatars
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
CREATE POLICY "Users can upload their own avatar" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::TEXT = (storage.foldername(name))[1]);
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
CREATE POLICY "Users can update their own avatar" ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::TEXT = (storage.foldername(name))[1]);
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
CREATE POLICY "Users can delete their own avatar" ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.uid()::TEXT = (storage.foldername(name))[1]);

-- Policies Storage: Projects
CREATE POLICY "Project media is publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'projects');
CREATE POLICY "Users can upload project media" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'projects' AND auth.uid()::TEXT = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their project media" ON storage.objects FOR DELETE
  USING (bucket_id = 'projects' AND auth.uid()::TEXT = (storage.foldername(name))[1]);

-- Policies Storage: Courses
CREATE POLICY "Course media is publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'courses');
CREATE POLICY "Creators can upload course media" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'courses' AND auth.uid()::TEXT = (storage.foldername(name))[1]);
CREATE POLICY "Creators can delete their course media" ON storage.objects FOR DELETE
  USING (bucket_id = 'courses' AND auth.uid()::TEXT = (storage.foldername(name))[1]);

-- Policies Storage: Companies
CREATE POLICY "Company media is publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'companies');
CREATE POLICY "Company owners can upload media" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'companies' AND auth.uid()::TEXT = (storage.foldername(name))[1]);

-- Policies Storage: Masterclasses
CREATE POLICY "Masterclass media is publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'masterclasses');
CREATE POLICY "Creators can upload masterclass media" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'masterclasses' AND auth.uid()::TEXT = (storage.foldername(name))[1]);

-- ============================================================================
-- 38. VUE : PASSPORT COMPLET (pour l'affichage public)
-- ============================================================================
CREATE OR REPLACE VIEW public.v_passport_full AS
SELECT
  sp.id,
  sp.sbid,
  sp.status,
  sp.score,
  sp.public_visibility,
  sp.issued_at,
  sp.expires_at,
  p.first_name,
  p.last_name,
  p.username,
  p.headline,
  p.avatar_url,
  p.location,
  p.country,
  p.title,
  p.domain,
  p.bio,
  p.account_type,
  p.linkedin_url,
  p.github_url,
  p.website,
  (SELECT COUNT(*) FROM public.user_skills us WHERE us.profile_id = p.id) AS skills_count,
  (SELECT COUNT(*) FROM public.user_skills us WHERE us.profile_id = p.id AND us.stage IN ('demonstrated', 'verified')) AS verified_skills_count,
  (SELECT COUNT(*) FROM public.projects pr WHERE pr.author_id = p.id AND pr.status = 'published') AS projects_count,
  (SELECT COUNT(*) FROM public.challenge_submissions cs WHERE cs.submitter_id = p.id AND cs.status IN ('accepted', 'winner')) AS challenges_won,
  (SELECT COUNT(*) FROM public.certificates c WHERE c.profile_id = p.id AND c.status = 'valid') AS certificates_count
FROM public.skill_passports sp
JOIN public.profiles p ON p.id = sp.profile_id;

-- ============================================================================
-- 39. VUE : ANALYTICS ADMIN
-- ============================================================================
CREATE OR REPLACE VIEW public.v_admin_analytics AS
SELECT
  (SELECT COUNT(*) FROM auth.users) AS total_users,
  (SELECT COUNT(*) FROM public.profiles) AS total_profiles,
  (SELECT COUNT(*) FROM public.user_skills) AS total_skills_declared,
  (SELECT COUNT(*) FROM public.projects WHERE status = 'published') AS total_projects_published,
  (SELECT COUNT(*) FROM public.courses WHERE status = 'published') AS total_courses_published,
  (SELECT COUNT(*) FROM public.course_enrollments) AS total_enrollments,
  (SELECT COUNT(*) FROM public.opportunities WHERE status = 'published') AS total_opportunities_published,
  (SELECT COUNT(*) FROM public.applications) AS total_applications,
  (SELECT COUNT(*) FROM public.mentor_profiles WHERE is_approved = true) AS approved_mentors,
  (SELECT COUNT(*) FROM public.companies WHERE status = 'active') AS active_companies,
  (SELECT COUNT(*) FROM public.certificates WHERE status = 'valid') AS valid_certificates,
  (SELECT COUNT(*) FROM public.skill_passports WHERE status = 'active') AS active_passports,
  (SELECT COALESCE(SUM(gross_amount), 0) FROM public.payments WHERE status = 'success') AS total_revenue,
  (SELECT COUNT(*) FROM public.payments WHERE status = 'success') AS successful_payments;

-- ============================================================================
-- FIN DU SCHEMA SKILLBRIDGE v2.0
-- ============================================================================
