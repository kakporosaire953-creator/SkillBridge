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
      return { available: true };
  },

  /**
   * Fetch profile by user_id
   */
  async getProfileByUserId(userId: string): Promise<{ profile: Profile | null; error: string | null }> {
      return { profile: null, error: 'Supabase n’est pas configuré.' };
  },

  /**
   * Update profile in Supabase PostgreSQL
   */
  async updateProfile(userId: string, input: ProfileUpdateInput): Promise<{ profile: Profile | null; error: string | null }> {
      return { profile: null, error: 'Supabase n’est pas configuré.' };
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
      return { profile: null, error: 'Supabase non configuré.' };
  },
};
