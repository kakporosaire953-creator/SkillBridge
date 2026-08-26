import React, { useState, useEffect } from 'react';
import { ViewType } from '../types/platform';
import { SkillBridgeLogo } from './SkillBridgeLogo';
import { useAuth } from '../context/AuthContext';
import { Menu, X, ArrowRight, User } from 'lucide-react';

interface NavbarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { label: string; view: ViewType }[] = [
    { label: 'Accueil', view: 'home' },
    { label: 'Apprendre', view: 'learn' },
    { label: 'Talents', view: 'talents' },
    { label: 'Mentors', view: 'mentors' },
    { label: 'Entreprises', view: 'companies' },
    { label: 'Ressources', view: 'resources' },
  ];

  const handleNav = (v: ViewType) => {
    onNavigate(v);
    setMobileMenuOpen(false);
  };

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#E2E8E5] py-3.5' 
          : 'bg-[#F5F7F6]/90 backdrop-blur-sm border-b border-stone-200/60 py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleNav('home')}
          className="cursor-pointer"
        >
          <SkillBridgeLogo size="md" />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#101820]/80">
          {navLinks.map((link) => {
            const isActive = currentView === link.view;
            return (
              <button
                key={link.view}
                type="button"
                onClick={() => handleNav(link.view)}
                className={`transition-colors cursor-pointer py-1 relative ${
                  isActive 
                    ? 'text-[#123B5D] font-bold' 
                    : 'hover:text-[#123B5D]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#59B83E] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleNav('passport')}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentView === 'passport'
                    ? 'bg-[#123B5D] text-white shadow-xs'
                    : 'bg-white border border-[#E2E8E5] text-[#123B5D] hover:bg-stone-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#59B83E]" />
                <span>Skill Passport</span>
              </button>

              <button
                type="button"
                onClick={() => handleNav('dashboard-talent')}
                className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-white border border-[#E2E8E5] text-xs font-bold text-[#123B5D] hover:border-[#123B5D] transition-colors cursor-pointer shadow-2xs"
              >
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.first_name}
                    className="w-6 h-6 rounded-full object-cover border border-[#59B83E]"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#123B5D] text-[#C8F169] text-[10px] font-bold flex items-center justify-center">
                    {(profile?.first_name?.[0] || 'T')}
                  </div>
                )}
                <span>{profile?.first_name || 'Mon Espace'}</span>
              </button>

              <button
                type="button"
                onClick={() => signOut()}
                className="text-xs text-stone-500 hover:text-rose-600 transition-colors cursor-pointer ml-1"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => handleNav('auth')}
                className="text-sm font-semibold text-[#123B5D] hover:text-[#59B83E] transition-colors cursor-pointer"
              >
                Se connecter
              </button>

              <button
                type="button"
                onClick={() => handleNav('onboarding')}
                className="px-5 py-2.5 rounded-xl bg-[#123B5D] hover:bg-[#101820] text-white text-xs sm:text-sm font-bold tracking-wide transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer group"
              >
                <span>Rejoindre SkillBridge</span>
                <ArrowRight className="w-4 h-4 text-[#C8F169] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => handleNav('onboarding')}
            className="px-3.5 py-2 rounded-xl bg-[#123B5D] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <span>Rejoindre</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C8F169]" />
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white border border-[#E2E8E5] text-[#101820] hover:bg-stone-100"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#E2E8E5] bg-white px-6 py-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => {
              const isActive = currentView === link.view;
              return (
                <button
                  key={link.view}
                  type="button"
                  onClick={() => handleNav(link.view)}
                  className={`text-left text-sm font-semibold py-2 px-3 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-[#F5F7F6] text-[#123B5D] font-bold' 
                      : 'text-[#101820]/80 hover:bg-stone-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-[#E2E8E5] flex flex-col gap-3">
            {user ? (
              <button
                type="button"
                onClick={() => handleNav('dashboard-talent')}
                className="w-full py-2.5 rounded-xl bg-[#123B5D] text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <User className="w-3.5 h-3.5 text-[#C8F169]" />
                <span>Mon Espace Personnel</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleNav('auth')}
                  className="w-full py-2.5 rounded-xl bg-white border border-[#E2E8E5] text-[#123B5D] font-bold text-xs"
                >
                  Se connecter
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('onboarding')}
                  className="w-full py-2.5 rounded-xl bg-[#123B5D] text-white font-bold text-xs flex items-center justify-center gap-2"
                >
                  <span>Rejoindre SkillBridge</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C8F169]" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
