import React, { useState } from 'react';

export const HeroBridgeVisual: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    setMousePos({ x, y });
  };

  const resetMouse = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={resetMouse}
      className="relative w-full max-w-4xl mx-auto h-72 sm:h-96 rounded-3xl bg-white border border-[#E2E8E5] p-6 sm:p-10 shadow-xl overflow-hidden select-none flex items-center justify-center"
      style={{
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: `perspective(1000px) rotateY(${mousePos.x * 0.4}deg) rotateX(${-mousePos.y * 0.4}deg)`
      }}
    >
      {/* Background fine grid */}
      <div className="absolute inset-0 architectural-grid opacity-60 pointer-events-none" />

      <svg 
        viewBox="0 0 800 360" 
        className="w-full h-full relative z-10"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Bridge Catenary Curved Lines */}
        <path 
          d="M 60 90 Q 400 240 740 90" 
          stroke="#123B5D" 
          strokeWidth="1.5" 
          strokeDasharray="4 4"
          className="opacity-30"
        />
        <path 
          d="M 60 270 Q 400 120 740 270" 
          stroke="#123B5D" 
          strokeWidth="1.5" 
          strokeDasharray="4 4"
          className="opacity-30"
        />

        {/* Structural Bridge Truss Struts */}
        <line x1="120" y1="100" x2="400" y2="180" stroke="#123B5D" strokeWidth="2" strokeOpacity="0.4" />
        <line x1="680" y1="100" x2="400" y2="180" stroke="#123B5D" strokeWidth="2" strokeOpacity="0.4" />
        <line x1="120" y1="260" x2="400" y2="180" stroke="#123B5D" strokeWidth="2" strokeOpacity="0.4" />
        <line x1="680" y1="260" x2="400" y2="180" stroke="#123B5D" strokeWidth="2" strokeOpacity="0.4" />

        {/* Horizontal Bridge Deck Line */}
        <line x1="40" y1="180" x2="760" y2="180" stroke="#123B5D" strokeWidth="2" strokeOpacity="0.25" />
        
        {/* Dynamic Green Beam connecting to central hub */}
        <path 
          d="M 120 100 L 400 180 L 680 260" 
          stroke="#59B83E" 
          strokeWidth="2.5" 
          strokeLinecap="round"
          className="opacity-80"
        />
        <path 
          d="M 120 260 L 400 180 L 680 100" 
          stroke="#59B83E" 
          strokeWidth="2.5" 
          strokeLinecap="round"
          className="opacity-80"
        />

        {/* 1. NODE: SKILLS */}
        <g className="transition-transform duration-300 hover:scale-105 cursor-pointer">
          <circle cx="120" cy="100" r="28" fill="#FFFFFF" stroke="#123B5D" strokeWidth="2" />
          <circle cx="120" cy="100" r="6" fill="#59B83E" />
          <text x="120" y="145" textAnchor="middle" fill="#123B5D" fontSize="11" fontWeight="700" letterSpacing="0.1em">
            SKILLS
          </text>
        </g>

        {/* 2. NODE: EXPERIENCE */}
        <g className="transition-transform duration-300 hover:scale-105 cursor-pointer">
          <circle cx="120" cy="260" r="28" fill="#FFFFFF" stroke="#123B5D" strokeWidth="2" />
          <circle cx="120" cy="260" r="6" fill="#123B5D" />
          <text x="120" y="305" textAnchor="middle" fill="#123B5D" fontSize="11" fontWeight="700" letterSpacing="0.1em">
            EXPERIENCE
          </text>
        </g>

        {/* 3. NODE: TALENT */}
        <g className="transition-transform duration-300 hover:scale-105 cursor-pointer">
          <circle cx="680" cy="100" r="28" fill="#FFFFFF" stroke="#123B5D" strokeWidth="2" />
          <circle cx="680" cy="100" r="6" fill="#123B5D" />
          <text x="680" y="145" textAnchor="middle" fill="#123B5D" fontSize="11" fontWeight="700" letterSpacing="0.1em">
            TALENT
          </text>
        </g>

        {/* 4. NODE: OPPORTUNITIES */}
        <g className="transition-transform duration-300 hover:scale-105 cursor-pointer">
          <circle cx="680" cy="260" r="28" fill="#FFFFFF" stroke="#123B5D" strokeWidth="2" />
          <circle cx="680" cy="260" r="6" fill="#59B83E" />
          <text x="680" y="305" textAnchor="middle" fill="#123B5D" fontSize="11" fontWeight="700" letterSpacing="0.1em">
            OPPORTUNITIES
          </text>
        </g>

        {/* CENTRAL CONVERGENCE: SKILLBRIDGE */}
        <g className="transition-transform duration-300 hover:scale-110 cursor-pointer">
          {/* Outer ring */}
          <circle cx="400" cy="180" r="48" fill="#123B5D" stroke="#59B83E" strokeWidth="3" />
          <circle cx="400" cy="180" r="40" fill="#101820" />
          <circle cx="400" cy="180" r="8" fill="#C8F169" />
          <text x="400" y="248" textAnchor="middle" fill="#123B5D" fontSize="13" fontWeight="800" letterSpacing="0.15em">
            SKILLBRIDGE
          </text>
        </g>
      </svg>

      {/* Floating editorial caption */}
      <div className="absolute bottom-4 right-6 text-[10px] text-stone-400 font-mono tracking-wider uppercase">
        ARCHITECTURAL CONVERGENCE MODEL v1.0
      </div>
    </div>
  );
};
