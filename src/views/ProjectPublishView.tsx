import React, { useState } from 'react';
import { ViewType } from '../types/platform';
import { useAuth } from '../context/AuthContext';
import { ProjectService } from '../services/projectService';
import { FaIcon } from '../components/FaIcon';
import { faArrowLeft, faPaperPlane, faCheck } from '@fortawesome/free-solid-svg-icons';

export const ProjectPublishView: React.FC<{ onNavigate: (view: ViewType) => void }> = ({ onNavigate }) => {
  const { user, profile } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technologie');
  const [role, setRole] = useState('');
  const [techInput, setTechInput] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) {
      setErrorMsg('Vous devez être connecté pour publier un projet.');
      return;
    }

    if (!title.trim() || !description.trim()) {
      setErrorMsg('Le titre et la description détaillée sont obligatoires.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const techArray = techInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const res = await ProjectService.createProject(user.id, profile.id, {
      title,
      description,
      category,
      role: role.trim() || undefined,
      technologies: techArray,
      skills_used: techArray,
      github_url: githubUrl.trim() || undefined,
      live_url: liveUrl.trim() || undefined,
      video_url: videoUrl.trim() || undefined,
      status: 'published',
    });

    setIsSubmitting(false);

    if (res.error) {
      setErrorMsg(res.error);
    } else {
      setSuccessMsg('Projet publié avec succès dans l’Explorer !');
      setTimeout(() => {
        onNavigate('explorer');
      }, 1500);
    }
  };

  return (
    <div className="flex-1 w-full min-h-screen bg-[#F5F7F6] py-8 lg:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => onNavigate('dashboard-talent')} 
            className="p-2.5 rounded-xl border border-[#E2E8E5] bg-white text-stone-500 hover:text-[#101820] transition-colors"
          >
            <FaIcon icon={faArrowLeft} />
          </button>
          <div>
            <h1 className="text-2xl font-heading font-bold text-[#101820]">Publier un projet</h1>
            <p className="text-sm text-stone-500">Présentez votre travail réel et alimentez automatiquement vos preuves de compétences</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-sm font-medium">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-[#ECFDF5] border border-[#59B83E]/20 text-[#59B83E] text-sm font-medium flex items-center gap-2">
            <FaIcon icon={faCheck} />
            {successMsg}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#E2E8E5] p-6 sm:p-8 shadow-xs space-y-8">
          
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#101820] uppercase tracking-wider">Informations Principales</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Titre du projet *</label>
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Système de paiement Mobile Money & Microservices" 
                className="w-full p-3 rounded-xl border border-[#E2E8E5] focus:border-[#59B83E] focus:outline-none text-sm" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Catégorie</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#E2E8E5] focus:border-[#59B83E] focus:outline-none text-sm bg-white"
              >
                <option value="Technologie">Technologie / Développement</option>
                <option value="Design">Design / UI / UX</option>
                <option value="Business">Business & Management</option>
                <option value="Data">Data & Intelligence Artificielle</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Description détaillée *</label>
              <textarea 
                rows={5} 
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Expliquez le contexte, les défis techniques résolus et la valeur apportée..." 
                className="w-full p-3 rounded-xl border border-[#E2E8E5] focus:border-[#59B83E] focus:outline-none resize-none text-sm"
              />
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-[#E2E8E5]">
            <h3 className="text-sm font-bold text-[#101820] uppercase tracking-wider">Compétences & Rôle</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Votre rôle sur le projet</label>
                <input 
                  type="text" 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Ex: Lead Développeur Backend" 
                  className="w-full p-3 rounded-xl border border-[#E2E8E5] focus:border-[#59B83E] focus:outline-none text-sm" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Technologies / Compétences (séparées par des virgules)</label>
                <input 
                  type="text" 
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="Ex: React, Node.js, PostgreSQL, Docker" 
                  className="w-full p-3 rounded-xl border border-[#E2E8E5] focus:border-[#59B83E] focus:outline-none text-sm" 
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-[#E2E8E5]">
            <h3 className="text-sm font-bold text-[#101820] uppercase tracking-wider">Preuves & Liens</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Démo en direct (URL)</label>
                <input 
                  type="url" 
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="https://mon-projet.com" 
                  className="w-full p-3 rounded-xl border border-[#E2E8E5] focus:border-[#59B83E] focus:outline-none text-sm" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Dépôt GitHub / GitLab</label>
                <input 
                  type="url" 
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..." 
                  className="w-full p-3 rounded-xl border border-[#E2E8E5] focus:border-[#59B83E] focus:outline-none text-sm" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Vidéo de démonstration (Loom/YouTube)</label>
                <input 
                  type="url" 
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..." 
                  className="w-full p-3 rounded-xl border border-[#E2E8E5] focus:border-[#59B83E] focus:outline-none text-sm" 
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#E2E8E5] flex justify-end">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-xl bg-[#59B83E] text-white font-bold hover:bg-[#4ea834] transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <FaIcon icon={faPaperPlane} />
              <span>{isSubmitting ? 'Publication en cours...' : 'Publier le projet'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
