import React, { useState } from 'react';
import heroDiagram from '../assets/hero-diagram.jpg';

export const HeroBridgeVisual: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
    setMousePos({ x, y });
  };

  const resetMouse = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={resetMouse}
      className="relative w-full max-w-2xl sm:max-w-3xl mx-auto rounded-3xl bg-white/90 border border-[#E2E8E5] p-3 sm:p-5 shadow-xl hover:shadow-2xl overflow-hidden select-none transition-all duration-300 backdrop-blur-xs"
      style={{
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
        transform: `perspective(1000px) rotateY(${mousePos.x * 0.5}deg) rotateX(${-mousePos.y * 0.5}deg)`
      }}
    >
      <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-white to-[#F5F7F6] flex items-center justify-center">
        <img
          src={heroDiagram}
          alt="SkillBridge — Le pont entre les compétences et les opportunités (Skills, Talent, Experience, Opportunities)"
          className="w-full h-auto max-h-[420px] object-contain rounded-2xl transition-transform duration-500 hover:scale-[1.01]"
          draggable={false}
          loading="eager"
        />
      </div>
    </div>
  );
};
