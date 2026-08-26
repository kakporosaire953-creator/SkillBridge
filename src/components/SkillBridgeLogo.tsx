import React from 'react';

interface SkillBridgeLogoProps {
  className?: string;
  isDark?: boolean;
  withTagline?: boolean;
}

export const SkillBridgeLogo: React.FC<SkillBridgeLogoProps> = ({ 
  className = '', 
  isDark = false,
  withTagline = false 
}) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* S-Bridge Geometric Mark */}
      <div className="relative w-9 h-9 shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Bridge structure arch & upper curve */}
          <path 
            d="M8 28C8 28 14 12 24 12C32 12 34 18 34 22C34 27 28 29 20 29C12 29 6 32 6 36" 
            stroke={isDark ? "#C8F169" : "#123B5D"} 
            strokeWidth="3.5" 
            strokeLinecap="round"
          />
          {/* S central connecting span */}
          <path 
            d="M12 16C12 16 18 8 26 8C33 8 36 12 36 16" 
            stroke="#59B83E" 
            strokeWidth="3.5" 
            strokeLinecap="round"
          />
          {/* Bridge baseline / suspension anchor point */}
          <circle cx="20" cy="20" r="2.5" fill="#59B83E" />
          <circle cx="34" cy="22" r="2" fill={isDark ? "#FFFFFF" : "#123B5D"} />
          <circle cx="8" cy="28" r="2" fill="#59B83E" />
        </svg>
      </div>

      {/* Brand Wordmark */}
      <div className="flex flex-col">
        <div className="flex items-center tracking-[-0.03em] font-extrabold text-lg sm:text-xl leading-none">
          <span className={isDark ? "text-white" : "text-[#123B5D]"}>SKILL</span>
          <span className="text-[#59B83E]">BRIDGE</span>
        </div>
        {withTagline && (
          <span className={`text-[10px] tracking-wider uppercase font-medium mt-0.5 ${isDark ? "text-stone-400" : "text-stone-500"}`}>
            The bridge between skills and opportunities
          </span>
        )}
      </div>
    </div>
  );
};
