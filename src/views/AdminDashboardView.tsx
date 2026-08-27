import React, { useState, useEffect } from 'react';
import { ViewType } from '../types/platform';
import { AdminAnalytics } from '../types';
import { AdminService } from '../services/adminService';
import { FaIcon } from '../components/FaIcon';
import { 
  faShieldHalved, 
  faUsers, 
  faGraduationCap, 
  faBriefcase, 
  faFolderOpen, 
  faChartLine,
  faSignOutAlt,
  faMoneyBillWave,
  faIdCard,
  faCertificate,
  faBuilding
} from '@fortawesome/free-solid-svg-icons';

export const AdminDashboardView: React.FC<{ onNavigate: (view: ViewType) => void }> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const tabs = [
    { id: 'overview', label: 'Vue Globale', icon: faChartLine },
    { id: 'users', label: 'Utilisateurs & Profils', icon: faUsers },
    { id: 'learning', label: 'Formations', icon: faGraduationCap },
    { id: 'opportunities', label: 'Opportunités', icon: faBriefcase },
    { id: 'projects', label: 'Projets', icon: faFolderOpen },
  ];

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      const res = await AdminService.getAnalytics();
      if (res.data) {
        setAnalytics(res.data);
      }
      setIsLoading(false);
    };

    loadStats();
  }, []);

  return (
    <div className="flex-1 w-full min-h-screen bg-[#F5F7F6] flex flex-col md:flex-row">
      {/* Sidebar Admin */}
      <div className="w-full md:w-64 bg-[#101820] text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#59B83E] flex items-center justify-center">
              <FaIcon icon={faShieldHalved} className="text-white" />
            </div>
            <div>
              <div className="font-heading font-bold text-sm leading-tight">Admin Center</div>
              <div className="text-[10px] text-[#59B83E] font-mono tracking-widest uppercase">PostgreSQL Live</div>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-colors text-left ${
                activeTab === tab.id 
                  ? 'bg-white/10 text-white' 
                  : 'text-stone-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FaIcon icon={tab.icon} className={activeTab === tab.id ? 'text-[#59B83E]' : 'text-stone-500'} />
              {tab.label}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-stone-800">
          <button 
            onClick={() => onNavigate('home')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-stone-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <FaIcon icon={faSignOutAlt} className="text-rose-500" />
            Quitter l'Admin
          </button>
        </div>
      </div>

      {/* Main Content Admin */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <div className="p-8 space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-heading font-bold text-[#101820]">
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
            <span className="px-3 py-1 bg-[#ECFDF5] text-[#59B83E] rounded-full text-xs font-bold font-mono">
              PostgreSQL Connected
            </span>
          </div>

          {isLoading ? (
            <div className="text-center py-20 text-stone-400 text-xs">Chargement des analytics en direct...</div>
          ) : (
            <>
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-[#E2E8E5] shadow-xs">
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Profils Créés</span>
                    <FaIcon icon={faUsers} className="text-[#123B5D]" />
                  </div>
                  <div className="text-3xl font-heading font-bold text-[#101820]">
                    {analytics?.total_profiles || 0}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">
                    {analytics?.total_skills_declared || 0} compétences déclarées
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#E2E8E5] shadow-xs">
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Skill Passports</span>
                    <FaIcon icon={faIdCard} className="text-[#59B83E]" />
                  </div>
                  <div className="text-3xl font-heading font-bold text-[#101820]">
                    {analytics?.active_passports || 0}
                  </div>
                  <div className="text-[11px] text-[#59B83E] font-medium mt-1">
                    {analytics?.valid_certificates || 0} certificats émis
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#E2E8E5] shadow-xs">
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Projets Réels</span>
                    <FaIcon icon={faFolderOpen} className="text-amber-500" />
                  </div>
                  <div className="text-3xl font-heading font-bold text-[#101820]">
                    {analytics?.total_projects_published || 0}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">
                    Dans l'Explorer public
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#E2E8E5] shadow-xs">
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Opportunités</span>
                    <FaIcon icon={faBriefcase} className="text-indigo-500" />
                  </div>
                  <div className="text-3xl font-heading font-bold text-[#101820]">
                    {analytics?.total_opportunities_published || 0}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">
                    {analytics?.total_applications || 0} candidatures reçues
                  </div>
                </div>
              </div>

              {/* Secondary Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-[#E2E8E5] shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#59B83E] flex items-center justify-center text-xl">
                    <FaIcon icon={faMoneyBillWave} />
                  </div>
                  <div>
                    <span className="text-xs text-stone-400 font-medium">Volume de Transactions</span>
                    <div className="text-xl font-bold text-[#101820]">{analytics?.total_revenue || 0} XOF</div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#E2E8E5] shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#123B5D] flex items-center justify-center text-xl">
                    <FaIcon icon={faBuilding} />
                  </div>
                  <div>
                    <span className="text-xs text-stone-400 font-medium">Entreprises Actives</span>
                    <div className="text-xl font-bold text-[#101820]">{analytics?.active_companies || 0}</div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#E2E8E5] shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl">
                    <FaIcon icon={faCertificate} />
                  </div>
                  <div>
                    <span className="text-xs text-stone-400 font-medium">Formations & Inscriptions</span>
                    <div className="text-xl font-bold text-[#101820]">{analytics?.total_courses_published || 0} ({analytics?.total_enrollments || 0} inscrits)</div>
                  </div>
                </div>
              </div>

              {/* Server Security Status */}
              <div className="bg-white rounded-3xl border border-[#E2E8E5] p-8 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-[#101820] font-heading">
                  Architecture & Sécurité du Backend
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-100 space-y-1">
                    <span className="font-bold text-[#123B5D] block">Row Level Security (RLS)</span>
                    <p className="text-stone-500">Toutes les tables PostgreSQL appliquent des politiques RLS strictes garantissant l'étanchéité des données utilisateurs.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-100 space-y-1">
                    <span className="font-bold text-[#59B83E] block">Skill Passport Verifiable ID</span>
                    <p className="text-stone-500">Les identifiants SBID permanents (format SB-YYYY-XXXXXX) sont générés côté serveur PostgreSQL et non modifiables par les utilisateurs.</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
