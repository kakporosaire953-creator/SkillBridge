import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Camera, Trash2, UploadCloud, Loader2, AlertCircle } from 'lucide-react';
import { StorageService } from '../services/storageService';

interface AvatarUploaderProps {
  currentAvatarUrl?: string | null;
  onSuccess?: () => void;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({ currentAvatarUrl, onSuccess }) => {
  const { uploadAvatar, deleteAvatar } = useAuth();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // Validate
    const validation = StorageService.validateAvatarFile(file);
    if (!validation.isValid) {
      setUploadError(validation.error || 'Fichier invalide.');
      return;
    }

    // Local preview during upload
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setIsUploading(true);

    try {
      const result = await uploadAvatar(file);
      if (!result.success) {
        setUploadError(result.error || 'Erreur lors du téléversement.');
        setPreviewUrl(null);
      } else {
        setPreviewUrl(null);
        if (onSuccess) onSuccess();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur inattendue.';
      setUploadError(msg);
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
      // Reset input value so same file can be re-selected if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    if (confirm('Voulez-vous vraiment supprimer votre photo de profil ?')) {
      setUploadError(null);
      setIsDeleting(true);
      try {
        const result = await deleteAvatar();
        if (!result.success) {
          setUploadError(result.error || 'Erreur lors de la suppression.');
        } else {
          setPreviewUrl(null);
          if (onSuccess) onSuccess();
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Erreur inattendue.';
        setUploadError(msg);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const displayedImage = previewUrl || currentAvatarUrl;

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
        id="avatar-file-input"
        disabled={isUploading || isDeleting}
      />

      {/* Avatar Container */}
      <div className="relative group">
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-stone-700/80 bg-stone-900 flex items-center justify-center shadow-lg transition-all">
          {displayedImage ? (
            <img
              src={displayedImage}
              alt="Photo de profil"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-3 text-center text-stone-500">
              <Camera className="w-8 h-8 mb-1.5 text-stone-600 group-hover:text-amber-500 transition-colors" />
              <span className="text-xs font-medium text-stone-400">Aucune photo</span>
            </div>
          )}

          {/* Loading overlay */}
          {(isUploading || isDeleting) && (
            <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
              <span className="text-[11px] font-medium text-stone-300">
                {isUploading ? 'Téléversement...' : 'Suppression...'}
              </span>
            </div>
          )}
        </div>

        {/* Quick action trigger over photo */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || isDeleting}
          className="absolute -bottom-2 -right-2 p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md transition-all disabled:opacity-50 cursor-pointer"
          title={displayedImage ? 'Modifier la photo' : 'Ajouter une photo'}
        >
          <Camera className="w-4 h-4" />
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || isDeleting}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-700 bg-stone-900 hover:bg-stone-800 text-xs font-medium text-stone-200 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <UploadCloud className="w-3.5 h-3.5 text-amber-400" />
          {displayedImage ? 'Changer la photo' : 'Ajouter une photo'}
        </button>

        {displayedImage && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isUploading || isDeleting}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-rose-900/60 bg-rose-950/40 hover:bg-rose-900/60 text-xs font-medium text-rose-300 transition-colors disabled:opacity-50 cursor-pointer"
            title="Supprimer la photo"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Supprimer
          </button>
        )}
      </div>

      <p className="text-[11px] text-stone-500 text-center max-w-[220px]">
        Formats acceptés : WEBP, PNG, JPEG. Taille max : 5 Mo.
      </p>

      {/* Error message */}
      {uploadError && (
        <div className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-950/50 border border-rose-900/60 px-3 py-1.5 rounded-lg">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
};
