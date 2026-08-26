import { supabase, isSupabaseConfigured } from './supabase';

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
    if (!isSupabaseConfigured()) {
      return {
        url: '',
        error: 'Supabase n’est pas encore configuré avec des clés API valides.',
      };
    }

    const validation = this.validateAvatarFile(file);
    if (!validation.isValid) {
      return { url: '', error: validation.error || 'Fichier invalide.' };
    }

    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'webp';
      const fileName = `avatar_${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      // Upload file with upsert enabled
      const { error: uploadError } = await supabase.storage
        .from(AVATAR_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        return {
          url: '',
          error: `Échec du téléversement : ${uploadError.message}`,
        };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(AVATAR_BUCKET)
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        return {
          url: '',
          error: 'Impossible de récupérer l’adresse publique de l’image.',
        };
      }

      return { url: urlData.publicUrl, error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inattendue lors du téléversement.';
      return { url: '', error: message };
    }
  },

  /**
   * Delete an avatar from Supabase Storage
   */
  async deleteAvatar(userId: string, avatarUrl: string): Promise<{ success: boolean; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase non configuré.' };
    }

    try {
      // Parse file path from URL if it's a Supabase storage URL
      if (avatarUrl.includes(AVATAR_BUCKET)) {
        const parts = avatarUrl.split(`${AVATAR_BUCKET}/`);
        if (parts.length > 1) {
          const pathToDelete = parts[1].split('?')[0];
          // Ensure user can only delete within their own folder
          if (pathToDelete.startsWith(`${userId}/`)) {
            const { error } = await supabase.storage
              .from(AVATAR_BUCKET)
              .remove([pathToDelete]);

            if (error) {
              console.warn('Could not delete storage file:', error);
            }
          }
        }
      }

      return { success: true, error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la suppression de l’image.';
      return { success: false, error: message };
    }
  },
};
