import React, { useState, useEffect } from 'react';
import { ViewType } from '../types/platform';
import { Opportunity, Project, Course, Company, Profile } from '../types';
import { OpportunityService } from '../services/opportunityService';
import { ProjectService } from '../services/projectService';
import { LearningService } from '../services/learningService';
import { supabase } from '../services/supabase';
import { FaIcon } from '../components/FaIcon';
import { 
  faBriefcase, 
  faFolderOpen, 
  faUsers, 
  faBuilding, 
  faGraduationCap, 
  faSearch, 
  faHeart,
  faComment,
  faExternalLinkAlt,
  faMapMarkerAlt,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import { UserAvatar } from '../components/UserAvatar';

interface ExplorerViewProps {
  onNavigate: (view: ViewType) => void;
}

export const ExplorerView: React.FC<ExplorerViewProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'opportunites' | 'projets' | 'personnes' | 'entreprises' | 'formations'>('opportunites');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data states
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [talents, setTalents] = useState<Profile[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const tabs = [
    { id: 'opportunites', label: 'Opportunités', icon: faBriefcase },
    { id: 'projets', label: 'Projets', icon: faFolderOpen },
    { id: 'personnes', label: 'Talents & Mentors', icon: faUsers },
    { id: 'entreprises', label: 'Entreprises', icon: faBuilding },
    { id: 'formations', label: 'Formations', icon: faGraduationCap },
  ];

  useEffect(() => {
    const fetchExplorerData = async () => {
      setIsLoading(true);
      const [oppsRes, projsRes, compsRes, coursesRes, profilesRes] = await Promise.all([
        OpportunityService.getPublishedOpportunities(),
        ProjectService.getPublishedProjects(),
        OpportunityService.getCompanies(),
        LearningService.getPublishedCourses(),
        supabase.from('profiles').select('*').eq('profile_visibility', 'public').limit(20)
      ]);

      setOpportunities(oppsRes.data || []);
      setProjects(projsRes.data || []);
      setCompanies(compsRes.data || []);
      setCourses(coursesRes.data || []);
      setTalents((profilesRes.data as Profile[]) || []);
      setIsLoading(false);
    };

    fetchExplorerData();
  }, []);

  const query = searchQuery.toLowerCase().trim();

  const filteredOpportunities = opportunities.filter(o => 
    !query || o.title.toLowerCase().includes(query) || o.description.toLowerCase().includes(query) || o.required_skills.some(s => s.toLowerCase().includes(query))
  );

  const filteredProjects = projects.filter(p => 
    !query || p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query) || p.skills_used.some(s => s.toLowerCase().includes(query))
  );

  const filteredTalents = talents.filter(t => 
    !query || `${t.first_name} ${t.last_name}`.toLowerCase().includes(query) || (t.headline && t.headline.toLowerCase().includes(query)) || (t.location && t.location.toLowerCase().includes(query))
  );

  const filteredCompanies = companies.filter(c => 
    !query || c.name.toLowerCase().includes(query) || (c.industry && c.industry.toLowerCase().includes(query))
  );

  const filteredCourses = courses.filter(c => 
    !query || c.title.toLowerCase().includes(query) || c.description.toLowerCase().includes(query)
  );

  return (
    <div className="flex-1 w-full min-h-screen bg-[#F5F7F6] pb-24 lg:pb-8">
      {/* Search Header */}
      <div className="bg-white border-b border-[#E2E8E5] sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#101820]">Explorer l'Écosystème</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <FaIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher des opportunités, compétences, projets, talents..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E2E8E5] bg-[#F5F7F6] focus:bg-white focus:outline-none focus:border-[#59B83E] focus:ring-1 focus:ring-[#59B83E] transition-all text-sm"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto hide-scrollbar border-t border-[#E2E8E5]">
            <div className="flex space-x-6 min-w-max">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-[#59B83E] text-[#123B5D]'
                      : 'border-transparent text-stone-500 hover:text-stone-700'
                  }`}
                >
                  <FaIcon icon={tab.icon} className={activeTab === tab.id ? 'text-[#59B83E]' : 'text-stone-400'} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {isLoading ? (
          <div className="text-center py-20 text-stone-400">Chargement des données en direct...</div>
        ) : activeTab === 'opportunites' ? (
          filteredOpportunities.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#E2E8E5] p-8">
              <FaIcon icon={faBriefcase} className="text-4xl text-stone-300 mb-3" />
              <h3 className="font-bold text-[#101820] text-lg">Aucune opportunité trouvée</h3>
              <p className="text-stone-500 text-sm mt-1">Revenez bientôt ou modifiez vos critères de recherche.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOpportunities.map(opp => (
                <div key={opp.id} className="bg-white rounded-2xl border border-[#E2E8E5] p-6 shadow-xs flex flex-col justify-between hover:border-[#123B5D]/40 transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#EBF3F8] text-[#123B5D]">
                        {opp.type}
                      </span>
                      {opp.location && (
                        <span className="text-xs text-stone-400 flex items-center gap-1">
                          <FaIcon icon={faMapMarkerAlt} className="text-stone-400" />
                          {opp.location}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-base text-[#101820] leading-snug">{opp.title}</h3>
                    <p className="text-xs text-stone-500 line-clamp-3">{opp.description}</p>
                    
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {opp.required_skills.map((s, idx) => (
                        <span key={idx} className="text-[10px] font-semibold bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('opportunities')}
                    className="mt-5 w-full py-2.5 rounded-xl bg-[#123B5D] text-white text-xs font-bold hover:bg-[#0A2338] transition-colors text-center"
                  >
                    Voir et Postuler
                  </button>
                </div>
              ))}
            </div>
          )
        ) : activeTab === 'projets' ? (
          filteredProjects.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#E2E8E5] p-8">
              <FaIcon icon={faFolderOpen} className="text-4xl text-stone-300 mb-3" />
              <h3 className="font-bold text-[#101820] text-lg">Aucun projet publié pour l'instant</h3>
              <p className="text-stone-500 text-sm mt-1">Soyez le premier à publier votre projet dans l'écosystème !</p>
              <button onClick={() => onNavigate('project-publish')} className="mt-4 px-5 py-2.5 rounded-xl bg-[#123B5D] text-white font-bold text-xs">
                Publier un projet
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(proj => (
                <div key={proj.id} className="bg-white rounded-2xl border border-[#E2E8E5] p-6 shadow-xs flex flex-col justify-between hover:border-[#123B5D]/40 transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <UserAvatar 
                        avatarUrl={proj.author?.avatar_url}
                        name={`${proj.author?.first_name || ''} ${proj.author?.last_name || ''}`}
                        size="sm"
                      />
                      <div>
                        <h4 className="font-bold text-xs text-[#101820]">{proj.author?.first_name} {proj.author?.last_name}</h4>
                        <p className="text-[10px] text-stone-400">{proj.author?.headline || 'Créateur'}</p>
                      </div>
                    </div>

                    <h3 className="font-bold text-base text-[#101820]">{proj.title}</h3>
                    <p className="text-xs text-stone-500 line-clamp-3">{proj.description}</p>

                    <div className="flex flex-wrap gap-1.5">
                      {proj.technologies.map((t, idx) => (
                        <span key={idx} className="text-[10px] font-semibold bg-[#EBF3F8] text-[#123B5D] px-2 py-0.5 rounded-md">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-stone-100 text-xs text-stone-400">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1"><FaIcon icon={faHeart} className="text-rose-500" /> {proj.likes_count}</span>
                      <span className="flex items-center gap-1"><FaIcon icon={faComment} /> {proj.comments_count}</span>
                    </div>
                    {proj.live_url && (
                      <a href={proj.live_url} target="_blank" rel="noreferrer" className="text-[#123B5D] font-bold flex items-center gap-1 hover:underline">
                        Démo <FaIcon icon={faExternalLinkAlt} className="text-[10px]" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : activeTab === 'personnes' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTalents.map(talent => (
              <div 
                key={talent.id}
                onClick={() => onNavigate('talents')}
                className="bg-white p-6 rounded-2xl border border-[#E2E8E5] shadow-xs hover:border-[#123B5D]/40 transition-all cursor-pointer flex flex-col items-center text-center space-y-3"
              >
                <UserAvatar 
                  avatarUrl={talent.avatar_url}
                  name={`${talent.first_name} ${talent.last_name}`}
                  size="lg"
                />
                <div>
                  <h3 className="font-bold text-[#101820] text-base">{talent.first_name} {talent.last_name}</h3>
                  <p className="text-xs text-[#123B5D] font-medium mt-0.5">{talent.headline || 'Membre vérifié'}</p>
                  {talent.location && <p className="text-[11px] text-stone-400 mt-0.5">{talent.location}, {talent.country}</p>}
                </div>
                {talent.passport_id && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#ECFDF5] text-[#59B83E] rounded-md">
                    {talent.passport_id}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : activeTab === 'entreprises' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map(comp => (
              <div 
                key={comp.id}
                onClick={() => onNavigate('companies')}
                className="bg-white p-6 rounded-2xl border border-[#E2E8E5] shadow-xs hover:border-[#123B5D]/40 transition-all cursor-pointer flex flex-col items-center text-center space-y-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center font-bold text-lg text-[#123B5D]">
                  {comp.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-[#101820] text-base">{comp.name}</h3>
                  <p className="text-xs text-stone-500 mt-0.5">{comp.industry || 'Entreprise partenaire'}</p>
                  {comp.location && <p className="text-[11px] text-stone-400 mt-0.5">{comp.location}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Formations Tab */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <div 
                key={course.id}
                onClick={() => onNavigate('learn')}
                className="bg-white rounded-2xl border border-[#E2E8E5] p-6 shadow-xs flex flex-col justify-between hover:border-[#123B5D]/40 transition-all cursor-pointer"
              >
                <div className="space-y-3">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#ECFDF5] text-[#59B83E]">
                    {course.is_free ? 'GRATUIT' : `${course.price} XOF`}
                  </span>
                  <h3 className="font-bold text-base text-[#101820]">{course.title}</h3>
                  <p className="text-xs text-stone-500 line-clamp-2">{course.description}</p>
                </div>
                <div className="flex items-center justify-between text-xs text-stone-400 pt-4 mt-4 border-t border-stone-100">
                  <span className="flex items-center gap-1"><FaIcon icon={faClock} /> {course.total_duration_minutes} min</span>
                  <span className="font-bold text-[#123B5D]">{course.enrollments_count} inscrits</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
