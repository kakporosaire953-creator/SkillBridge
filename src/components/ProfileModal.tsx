import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserAvatar } from './UserAvatar';
import { 
  X, 
  Camera, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Trash2,
  LogOut
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose
}) => {
  const { profile, updateProfile, uploadAvatar, deleteAvatar, signOut } = useAuth();

  const [firstName, setFirstName] = useState(profile?.first_name || '');
  const [lastName, setLastName] = useState(profile?.last_name || '');
  const [headline, setHeadline] = useState(profile?.headline || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [location, setLocation] = useState(profile?.location || '');
  const [country, setCountry] = useState(profile?.country || '');
  const [availability, setAvailability] = useState(profile?.availability || 'Disponible pour opportunités et projets');
  const [githubUrl, setGithubUrl] = useState(profile?.github_url || '');
  const [linkedinUrl, setLinkedinUrl] = useState(profile?.linkedin_url || '');
  const [website, setWebsite] = useState(profile?.website || '');

  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Sync with profile when opened
  React.useEffect(() => {
    if (profile && isOpen) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setHeadline(profile.headline || '');
      setBio(profile.bio || '');
      setLocation(profile.location || '');
      setCountry(profile.country || '');
      setAvailability(profile.availability || 'Disponible pour opportunités et projets');
      setGithubUrl(profile.github_url || '');
      setLinkedinUrl(profile.linkedin_url || '');
      setWebsite(profile.website || '');
      setStatusMessage(null);
    }
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsSaving(true);
      const res = await uploadAvatar(file);
      if (res.success) {
        setStatusMessage({ type: 'success', text: 'Photo de profil mise à jour !' });
      } else {
        setStatusMessage({ type: 'error', text: res.error || 'Erreur lors de l\'upload' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Impossible de charger l\'image.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setIsSaving(true);
      await deleteAvatar();
      setStatusMessage({ type: 'success', text: 'Photo supprimée.' });
    } catch {
      setStatusMessage({ type: 'error', text: 'Erreur lors de la suppression.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const res = await updateProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        headline: headline.trim() || null,
        bio: bio.trim() || null,
        location: location.trim() || null,
        country: country.trim() || null,
        availability: availability.trim(),
        github_url: githubUrl.trim() || null,
        linkedin_url: linkedinUrl.trim() || null,
        website: website.trim() || null,
      });

      if (res.success) {
        setStatusMessage({ type: 'success', text: 'Profil mis à jour avec succès.' });
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        setStatusMessage({ type: 'error', text: res.error || 'Erreur lors de la sauvegarde.' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Une erreur est survenue.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div>
            <h2 className="font-heading text-xl font-bold text-[#101820]">
              Mon Profil & Paramètres
            </h2>
            <p className="text-xs text-stone-500">
              Gérez votre identité souveraine et vos informations visibles
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {statusMessage && (
            <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-medium ${
              statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
            <UserAvatar profile={profile} size="2xl" showBorder />
            
            <div className="space-y-2 text-center sm:text-left flex-1">
              <h3 className="text-sm font-bold text-[#101820]">Photo de profil</h3>
              <p className="text-xs text-stone-500">
                Téléversez une photo réelle de vous ou conservez vos initiales souveraines.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 justify-center sm:justify-start">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-medium text-[#123B5D] hover:bg-stone-50 transition-colors shadow-2xs"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Changer la photo</span>
                </button>
                {profile?.avatar_url && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    disabled={isSaving}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Supprimer</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Identity Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 font-mono uppercase tracking-wider">
                Prénom *
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-sm text-[#101820] focus:outline-hidden focus:border-[#123B5D] focus:ring-1 focus:ring-[#123B5D]"
                placeholder="Ex: Kwame"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 font-mono uppercase tracking-wider">
                Nom
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-sm text-[#101820] focus:outline-hidden focus:border-[#123B5D] focus:ring-1 focus:ring-[#123B5D]"
                placeholder="Ex: Mensah"
              />
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 font-mono uppercase tracking-wider">
              Titre / Métier
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-sm text-[#101820] focus:outline-hidden focus:border-[#123B5D] focus:ring-1 focus:ring-[#123B5D]"
              placeholder="Ex: Ingénieur Logiciel & Architecture Distribuée"
            />
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 font-mono uppercase tracking-wider">
              Bio / Présentation
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-sm text-[#101820] focus:outline-hidden focus:border-[#123B5D] focus:ring-1 focus:ring-[#123B5D]"
              placeholder="Décrivez votre parcours, vos technologies de prédilection et vos aspirations..."
            />
          </div>

          {/* Location & Availability */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 font-mono uppercase tracking-wider">
                Ville
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-sm text-[#101820] focus:outline-hidden focus:border-[#123B5D] focus:ring-1 focus:ring-[#123B5D]"
                placeholder="Ex: Dakar"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 font-mono uppercase tracking-wider">
                Pays
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-sm text-[#101820] focus:outline-hidden focus:border-[#123B5D] focus:ring-1 focus:ring-[#123B5D]"
                placeholder="Ex: Sénégal"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 font-mono uppercase tracking-wider">
                Disponibilité
              </label>
              <input
                type="text"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-sm text-[#101820] focus:outline-hidden focus:border-[#123B5D] focus:ring-1 focus:ring-[#123B5D]"
                placeholder="Ex: Immédiate / Temps plein"
              />
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 font-mono uppercase tracking-wider">
                GitHub URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-sm text-[#101820] focus:outline-hidden focus:border-[#123B5D] focus:ring-1 focus:ring-[#123B5D]"
                placeholder="https://github.com/..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 font-mono uppercase tracking-wider">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-sm text-[#101820] focus:outline-hidden focus:border-[#123B5D] focus:ring-1 focus:ring-[#123B5D]"
                placeholder="https://linkedin.com/in/..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 font-mono uppercase tracking-wider">
                Site Web / Portfolio
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-sm text-[#101820] focus:outline-hidden focus:border-[#123B5D] focus:ring-1 focus:ring-[#123B5D]"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={async () => {
                await signOut();
                onClose();
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 font-medium text-xs hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Se déconnecter</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 font-medium text-xs hover:bg-stone-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#123B5D] hover:bg-[#0A2338] text-white font-medium text-xs transition-colors shadow-sm disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Enregistrement..." : "Enregistrer les modifications"}</span>
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
