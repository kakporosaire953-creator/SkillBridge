import React, { useEffect, useState } from 'react';

export const PremiumGridBackground: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let animationFrameId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isHovering) setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    const animate = () => {
      // Smooth easing for the mouse follow effect
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;
      setMousePos({ x: currentX, y: currentY });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);
    animate();
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHovering]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#F5F7F6]">
      {/* 
        Base CSS Grid 
        Using pseudo-element approach conceptually with divs. 
        Very thin, light opacity lines representing the tech ecosystem.
      */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #123B5D 1px, transparent 1px),
            linear-gradient(to bottom, #123B5D 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          // Mask to fade out slightly towards the bottom for depth
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0.2) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0.2) 100%)',
        }}
      />
      
      {/* 
        Subtle Floating Halos / Soft Glows
        Adds depth without neon/cyberpunk feel.
      */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-[-15%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-[#59B83E]/10 to-transparent blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-[#123B5D]/10 to-transparent blur-[120px]" />
      </div>

      {/* 
        Interactive Cursor Glow (Desktop Only)
        Creates a premium interactive feel as requested.
      */}
      <div 
        className="hidden md:block absolute inset-0 transition-opacity duration-1000 ease-out mix-blend-multiply"
        style={{
          opacity: isHovering ? 0.6 : 0,
          background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(89, 184, 62, 0.04), transparent 40%)`
        }}
      />
    </div>
  );
};
