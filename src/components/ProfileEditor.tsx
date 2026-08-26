import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Profile, ProfileUpdateInput } from '../types';
import { Save, Globe, Globe as GlobeIcon, Video, User, FileText, Lock } from 'lucide-react';
import { StatusAlert } from './StatusAlert';

interface ProfileEditorProps {
  initialProfile: Profile;
  onUpdated?: () => void;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ initialProfile, onUpdated }) => {
  const { updateProfile } = useAuth();
  const [formData, setFormData] = useState<ProfileUpdateInput>({
    first_name: initialProfile.first_name || '',
    last_name: initialProfile.last_name || '',
    username: initialProfile.username || '',
    bio: initialProfile.bio || '',
    location: initialProfile.location || '',
    country: initialProfile.country || '',
    account_type: initialProfile.account_type || 'talent',
    website: initialProfile.website || '',
    linkedin_url: initialProfile.linkedin_url || '',
    instagram_url: initialProfile.instagram_url || '',
    tiktok_url: initialProfile.tiktok_url || '',
    github_url: initialProfile.github_url || '',
    availability: initialProfile.availability || '',
    profile_visibility: initialProfile.profile_visibility || 'public',
  });

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData({
      first_name: initialProfile.first_name || '',
      last_name: initialProfile.last_name || '',
      username: initialProfile.username || '',
      bio: initialProfile.bio || '',
      location: initialProfile.location || '',
      country: initialProfile.country || '',
      account_type: initialProfile.account_type || 'talent',
      website: initialProfile.website || '',
      linkedin_url: initialProfile.linkedin_url || '',
      instagram_url: initialProfile.instagram_url || '',
      tiktok_url: initialProfile.tiktok_url || '',
      github_url: initialProfile.github_url || '',
      availability: initialProfile.availability || '',
      profile_visibility: initialProfile.profile_visibility || 'public',
    });
  }, [initialProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccessMessage(null);
    setErrorMessage(null);
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);
    setValidationErrors({});
    setIsSaving(true);

    try {
      const result = await updateProfile(formData);
      if (!result.success) {
        setErrorMessage(result.error || 'Impossible d’enregistrer le profil.');
      } else {
        setSuccessMessage('Profil mis à jour.');
        if (onUpdated) onUpdated();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde.';
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {successMessage && (
        <StatusAlert
          type="success"
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}

      {errorMessage && (
        <StatusAlert
          type="error"
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}

      {/* Section 1: Identité */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-2">
          <User className="w-4 h-4" />
          Identité & Rôle
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              Prénom <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              name="first_name"
              required
              value={formData.first_name || ''}
              onChange={handleChange}
              placeholder="ex. Kwame"
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-hidden focus:border-amber-500 text-sm transition-colors"
            />
            {validationErrors.first_name && (
              <p className="text-xs text-rose-400 mt-1">{validationErrors.first_name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              Nom <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              name="last_name"
              required
              value={formData.last_name || ''}
              onChange={handleChange}
              placeholder="ex. Mensah"
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-hidden focus:border-amber-500 text-sm transition-colors"
            />
            {validationErrors.last_name && (
              <p className="text-xs text-rose-400 mt-1">{validationErrors.last_name}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              Nom d’utilisateur (unique) <span className="text-amber-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-stone-500 text-sm select-none">@</span>
              <input
                type="text"
                name="username"
                required
                value={formData.username || ''}
                onChange={handleChange}
                placeholder="kwame_m"
                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-hidden focus:border-amber-500 text-sm transition-colors"
              />
            </div>
            {validationErrors.username && (
              <p className="text-xs text-rose-400 mt-1">{validationErrors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              Type de compte <span className="text-amber-500">*</span>
            </label>
            <select
              name="account_type"
              value={formData.account_type}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 focus:outline-hidden focus:border-amber-500 text-sm transition-colors"
            >
              <option value="talent">Talent (Ingénieur / Développeur / Concepteur)</option>
              <option value="learner">Apprenant (En formation / Étudiant)</option>
              <option value="professional">Professionnel en activité</option>
              <option value="mentor">Mentor & Guide Technique</option>
              <option value="company">Entreprise / Recruteur</option>
              <option value="institution">Institution / Organisation</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 2: Bio & Localisation */}
      <div className="space-y-4 pt-2 border-t border-stone-800">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Présentation & Disponibilité
        </h3>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-medium text-stone-300">
              Biographie
            </label>
            <span className="text-[11px] text-stone-500">
              {(formData.bio || '').length}/500 caractères
            </span>
          </div>
          <textarea
            name="bio"
            rows={3}
            maxLength={500}
            value={formData.bio || ''}
            onChange={handleChange}
            placeholder="Décrivez brièvement votre parcours, vos domaines d’expertise et vos objectifs..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-hidden focus:border-amber-500 text-sm transition-colors resize-y"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              Ville / Région
            </label>
            <input
              type="text"
              name="location"
              value={formData.location || ''}
              onChange={handleChange}
              placeholder="ex. Cotonou / Dakar"
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-hidden focus:border-amber-500 text-sm transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              Pays
            </label>
            <input
              type="text"
              name="country"
              value={formData.country || ''}
              onChange={handleChange}
              placeholder="ex. Bénin / Sénégal / Côte d’Ivoire"
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-hidden focus:border-amber-500 text-sm transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              Disponibilité
            </label>
            <input
              type="text"
              name="availability"
              value={formData.availability || ''}
              onChange={handleChange}
              placeholder="ex. Disponible immédiatement"
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-hidden focus:border-amber-500 text-sm transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Liens professionnels */}
      <div className="space-y-4 pt-2 border-t border-stone-800">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Liens & Réseaux
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-stone-300 mb-1">
              <Globe className="w-3.5 h-3.5 text-stone-400" />
              Site Web
            </label>
            <input
              type="url"
              name="website"
              value={formData.website || ''}
              onChange={handleChange}
              placeholder="https://votresite.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-hidden focus:border-amber-500 text-sm transition-colors"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-stone-300 mb-1">
              <GlobeIcon className="w-3.5 h-3.5 text-[#0077b5]" />
              LinkedIn
            </label>
            <input
              type="url"
              name="linkedin_url"
              value={formData.linkedin_url || ''}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/votre-profil"
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-hidden focus:border-amber-500 text-sm transition-colors"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-stone-300 mb-1">
              <GlobeIcon className="w-3.5 h-3.5 text-stone-300" />
              GitHub
            </label>
            <input
              type="url"
              name="github_url"
              value={formData.github_url || ''}
              onChange={handleChange}
              placeholder="https://github.com/votre-profil"
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-hidden focus:border-amber-500 text-sm transition-colors"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-stone-300 mb-1">
              <GlobeIcon className="w-3.5 h-3.5 text-[#E1306C]" />
              Instagram
            </label>
            <input
              type="url"
              name="instagram_url"
              value={formData.instagram_url || ''}
              onChange={handleChange}
              placeholder="https://instagram.com/votre-profil"
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-hidden focus:border-amber-500 text-sm transition-colors"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-stone-300 mb-1">
              <Video className="w-3.5 h-3.5 text-stone-300" />
              TikTok
            </label>
            <input
              type="url"
              name="tiktok_url"
              value={formData.tiktok_url || ''}
              onChange={handleChange}
              placeholder="https://tiktok.com/@votre-profil"
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-hidden focus:border-amber-500 text-sm transition-colors"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-stone-300 mb-1">
              <Lock className="w-3.5 h-3.5 text-stone-400" />
              Visibilité du profil
            </label>
            <select
              name="profile_visibility"
              value={formData.profile_visibility}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 focus:outline-hidden focus:border-amber-500 text-sm transition-colors"
            >
              <option value="public">Public (Consultable)</option>
              <option value="private">Privé (Visible uniquement par moi)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action footer */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm shadow-md transition-all disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
              <span>Enregistrement...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Enregistrer les modifications</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
