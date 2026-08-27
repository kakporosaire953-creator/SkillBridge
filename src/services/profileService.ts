import { supabase, isSupabaseConfigured } from './supabase';
import { Profile, ProfileUpdateInput, ValidationResult } from '../types';

export const ProfileService = {
  /**
   * Validate username format
   */
  validateUsername(username: string): { isValid: boolean; error?: string } {
    if (!username || username.trim().length === 0) {
      return { isValid: false, error: 'Le nom d’utilisateur est obligatoire.' };
    }

    const cleanUsername = username.trim();

    if (cleanUsername.length < 3) {
      return { isValid: false, error: 'Le nom d’utilisateur doit comporter au moins 3 caractères.' };
    }

    if (cleanUsername.length > 30) {
      return { isValid: false, error: 'Le nom d’utilisateur ne peut pas dépasser 30 caractères.' };
    }

    // Alphanumeric, underscores, hyphens only
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(cleanUsername)) {
      return {
        isValid: false,
        error: 'Le nom d’utilisateur ne peut contenir que des lettres, chiffres, tirets et tirets bas.',
      };
    }

    return { isValid: true };
  },

  /**
   * Validate URL format if non-empty
   */
  validateUrl(url: string | null | undefined, fieldName: string): { isValid: boolean; error?: string } {
    if (!url || url.trim() === '') {
      return { isValid: true };
    }

    const trimmed = url.trim();
    try {
      const parsed = new URL(trimmed);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return { isValid: false, error: `Le lien ${fieldName} doit commencer par http:// ou https://` };
      }
      return { isValid: true };
    } catch {
      return { isValid: false, error: `Le lien ${fieldName} n’est pas une URL valide.` };
    }
  },

  /**
   * Validate all profile update fields
   */
  validateProfileInput(input: ProfileUpdateInput): ValidationResult {
    const errors: Record<string, string> = {};

    if (input.first_name !== undefined) {
      if (!input.first_name || input.first_name.trim().length === 0) {
        errors.first_name = 'Le prénom est obligatoire.';
      } else if (input.first_name.trim().length > 50) {
        errors.first_name = 'Le prénom ne peut pas dépasser 50 caractères.';
      }
    }

    if (input.last_name !== undefined) {
      if (input.last_name.trim().length > 50) {
        errors.last_name = 'Le nom ne peut pas dépasser 50 caractères.';
      }
    }

    if (input.username !== undefined) {
      const usernameVal = this.validateUsername(input.username);
      if (!usernameVal.isValid && usernameVal.error) {
        errors.username = usernameVal.error;
      }
    }

    if (input.bio !== undefined && input.bio !== null) {
      if (input.bio.length > 500) {
        errors.bio = 'La bio ne peut pas dépasser 500 caractères.';
      }
    }

    // URL validations
    const websiteVal = this.validateUrl(input.website, 'Site web');
    if (!websiteVal.isValid && websiteVal.error) errors.website = websiteVal.error;

    const linkedinVal = this.validateUrl(input.linkedin_url, 'LinkedIn');
    if (!linkedinVal.isValid && linkedinVal.error) errors.linkedin_url = linkedinVal.error;

    const githubVal = this.validateUrl(input.github_url, 'GitHub');
    if (!githubVal.isValid && githubVal.error) errors.github_url = githubVal.error;

    const instagramVal = this.validateUrl(input.instagram_url, 'Instagram');
    if (!instagramVal.isValid && instagramVal.error) errors.instagram_url = instagramVal.error;

    const tiktokVal = this.validateUrl(input.tiktok_url, 'TikTok');
    if (!tiktokVal.isValid && tiktokVal.error) errors.tiktok_url = tiktokVal.error;

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  /**
   * Check if username is available (unique in DB)
   */
  async checkUsernameAvailable(username: string, currentUserId?: string): Promise<{ available: boolean; error?: string }> {
    if (!isSupabaseConfigured()) {
      return { available: true };
    }

    const val = this.validateUsername(username);
    if (!val.isValid) {
      return { available: false, error: val.error };
    }

    try {
      const cleanUsername = username.trim().toLowerCase();
      const { data, error } = await supabase
        .from('profiles')
        .select('id, user_id, username')
        .ilike('username', cleanUsername);

      if (error) {
        console.error('Error checking username uniqueness:', error);
        return { available: false, error: 'Erreur lors de la vérification du nom d’utilisateur.' };
      }

      if (data && data.length > 0) {
        // If the found user is the current user, it's available for them
        const isCurrent = currentUserId && data.some((p) => p.user_id === currentUserId);
        if (!isCurrent) {
          return { available: false, error: 'Ce nom d’utilisateur est déjà utilisé.' };
        }
      }

      return { available: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur inattendue.';
      return { available: false, error: msg };
    }
  },

  /**
   * Fetch profile by user_id
   */
  async getProfileByUserId(userId: string): Promise<{ profile: Profile | null; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { profile: null, error: 'Supabase n’est pas configuré.' };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return { profile: null, error: error.message };
      }

      return { profile: data as Profile | null, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la récupération du profil.';
      return { profile: null, error: msg };
    }
  },

  /**
   * Update profile in Supabase PostgreSQL
   */
  async updateProfile(userId: string, input: ProfileUpdateInput): Promise<{ profile: Profile | null; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { profile: null, error: 'Supabase n’est pas configuré.' };
    }

    // 1. Client & business rule validation
    const validation = this.validateProfileInput(input);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      return { profile: null, error: firstError || 'Données invalides.' };
    }

    // 2. If username changed, check uniqueness
    if (input.username) {
      const cleanUsername = input.username.trim();
      const check = await this.checkUsernameAvailable(cleanUsername, userId);
      if (!check.available) {
        return { profile: null, error: check.error || 'Ce nom d’utilisateur est déjà utilisé.' };
      }
    }

    try {
      const payload: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };

      if (input.first_name !== undefined) payload.first_name = input.first_name.trim();
      if (input.last_name !== undefined) payload.last_name = input.last_name.trim();
      if (input.username !== undefined) payload.username = input.username.trim();
      if (input.headline !== undefined) payload.headline = input.headline ? input.headline.trim() : null;
      if (input.title !== undefined) payload.title = input.title ? input.title.trim() : null;
      if (input.domain !== undefined) payload.domain = input.domain ? input.domain.trim() : null;
      if (input.languages !== undefined) payload.languages = input.languages;
      if (input.bio !== undefined) payload.bio = input.bio ? input.bio.trim() : null;
      if (input.location !== undefined) payload.location = input.location ? input.location.trim() : null;
      if (input.country !== undefined) payload.country = input.country ? input.country.trim() : null;
      if (input.account_type !== undefined) payload.account_type = input.account_type;
      if (input.website !== undefined) payload.website = input.website ? input.website.trim() : null;
      if (input.linkedin_url !== undefined) payload.linkedin_url = input.linkedin_url ? input.linkedin_url.trim() : null;
      if (input.instagram_url !== undefined) payload.instagram_url = input.instagram_url ? input.instagram_url.trim() : null;
      if (input.tiktok_url !== undefined) payload.tiktok_url = input.tiktok_url ? input.tiktok_url.trim() : null;
      if (input.github_url !== undefined) payload.github_url = input.github_url ? input.github_url.trim() : null;
      if (input.availability !== undefined) payload.availability = input.availability ? input.availability.trim() : null;
      if (input.profile_visibility !== undefined) payload.profile_visibility = input.profile_visibility;
      if (input.avatar_url !== undefined) payload.avatar_url = input.avatar_url;

      const { data, error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile in DB:', error);
        return { profile: null, error: `Échec de la mise à jour : ${error.message}` };
      }

      return { profile: data as Profile, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur inattendue lors de la sauvegarde.';
      return { profile: null, error: msg };
    }
  },

  /**
   * Get or create profile for authenticated user
   */
  async getOrCreateProfile(
    userId: string,
    email: string,
    metadata?: {
      first_name?: string;
      last_name?: string;
      username?: string;
      account_type?: string;
    }
  ): Promise<{ profile: Profile | null; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { profile: null, error: 'Supabase non configuré.' };
    }

    // First try fetching
    const { profile } = await this.getProfileByUserId(userId);
    if (profile) {
      return { profile, error: null };
    }

    // If profile does not exist yet, create it cleanly
    try {
      const firstName = metadata?.first_name || 'Utilisateur';
      const lastName = metadata?.last_name || '';
      const baseUsername = metadata?.username || email.split('@')[0].replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase() || `user_${userId.slice(0, 6)}`;
      const accountType = (metadata?.account_type as Profile['account_type']) || 'talent';

      // Ensure unique username
      let finalUsername = baseUsername;
      let counter = 1;
      while (true) {
        const { available } = await this.checkUsernameAvailable(finalUsername);
        if (available) break;
        finalUsername = `${baseUsername}${counter}`;
        counter++;
      }

      const newProfile = {
        user_id: userId,
        first_name: firstName,
        last_name: lastName,
        username: finalUsername,
        account_type: accountType,
        profile_visibility: 'public' as const,
      };

      const { data, error: insertError } = await supabase
        .from('profiles')
        .insert(newProfile)
        .select()
        .single();

      if (insertError) {
        console.error('Error creating profile row:', insertError);
        return { profile: null, error: insertError.message };
      }

      return { profile: data as Profile, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la création du profil.';
      return { profile: null, error: msg };
    }
  },
};
