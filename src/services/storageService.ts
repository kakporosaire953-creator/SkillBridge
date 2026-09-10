const AVATAR_BUCKET = 'avatars';
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export interface StorageValidationResult {
  isValid: boolean;
  error?: string;
}

export const StorageService = {
  /**
   * Validate image file format and file size
   */
  validateAvatarFile(file: File): StorageValidationResult {
    if (!file) {
      return { isValid: false, error: 'Aucun fichier sélectionné.' };
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: 'Format non supporté. Veuillez utiliser une image JPEG, PNG ou WEBP.',
      };
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      return {
        isValid: false,
        error: `Fichier trop volumineux (${sizeMB} Mo). La taille maximale autorisée est de 5 Mo.`,
      };
    }

    return { isValid: true };
  },

  /**
   * Upload an avatar to Supabase Storage
   * Path format: avatars/{userId}/avatar_{timestamp}.{ext}
   */
  async uploadAvatar(userId: string, file: File): Promise<{ url: string; error: string | null }> {
      return {
              url: '',
              error: 'Supabase n’est pas encore configuré avec des clés API valides.',
            };
  },

  /**
   * Delete an avatar from Supabase Storage
   */
  async deleteAvatar(userId: string, avatarUrl: string): Promise<{ success: boolean; error: string | null }> {
      return { success: false, error: 'Supabase non configuré.' };
  },
};
