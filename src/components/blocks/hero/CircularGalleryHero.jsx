import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const CircularGalleryHero = ({
  text = "We build immersive experiences for global clients who seek meaningful digital motion and high-end aesthetics.",
  triggers = ["experiences", "clients", "meaningful", "aesthetics"],
  editMode = false,
  animate = true,
}) => {
  const galleryRef = useRef(null);
  const itemsRef = useRef([]);
  const mainRef = useRef(null);
  const [currentSeed, setCurrentSeed] = useState(10);

  const totalItems = 15;
  const radius = 220;

  useEffect(() => {
    if (!animate) return;

    // Set up mouse tracking
    const xSet = gsap.quickSetter(galleryRef.current, "x", "px");
    const ySet = gsap.quickSetter(galleryRef.current, "y", "px");

    const handleMouseMove = (e) => {
      xSet(e.clientX);
      ySet(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Infinite Rotation
    const rotationTl = gsap.to(galleryRef.current, {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: "none"
    });

    // Counter-rotation for items to stay upright
    const itemsRotationTl = itemsRef.current.map(item => 
      gsap.to(item, {
        rotation: -360,
        duration: 20,
        repeat: -1,
        ease: "none"
      })
    );

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      rotationTl.kill();
      itemsRotationTl.forEach(tl => tl.kill());
    };
  }, [animate]);

  const handleMouseEnter = () => {
    if (!animate) return;
    const newSeed = Math.floor(Math.random() * 1000);
    setCurrentSeed(newSeed);

    gsap.to(itemsRef.current, {
      opacity: 1,
      scale: 1,
      stagger: {
        each: 0.02,
        from: "random"
      },
      duration: 0.5,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    if (!animate) return;
    gsap.to(itemsRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
      ease: "power2.in"
    });
  };

  const renderText = () => {
    const parts = text.split(new RegExp(`(${triggers.join('|')})`, 'gi'));
    return parts.map((part, i) => {
      if (triggers.some(t => t.toLowerCase() === part.toLowerCase())) {
        return (
          <span
            key={i}
            className="trigger font-serif italic text-[--accent-color] cursor-pointer inline-block transition-colors duration-300 hover:text-white"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[--bg-color] flex justify-center items-center" ref={mainRef}>
      <style>{`
        :root {
          --bg-color: var(--primary-color, #0a0a0a);
          --text-color: var(--secondary-color, #ffffff);
          --accent-color: var(--accent, #00ffcc);
        }
      `}</style>

      <div className="z-10 p-12 text-center">
        <p className="copy text-[clamp(2rem,5vw,4.5rem)] leading-[1.1] tracking-tighter max-w-[1200px] pointer-events-none text-[--text-color]">
          <span className="pointer-events-auto" contentEditable={editMode} suppressContentEditableWarning={true}>
            {renderText()}
          </span>
        </p>
        <div className="instruction absolute bottom-10 left-1/2 -translate-x-1/2 text-[0.7rem] uppercase tracking-[0.3em] opacity-30 text-[--text-color]">
          Hover over highlighted words
        </div>
      </div>

      <div 
        ref={galleryRef}
        className="fixed top-0 left-0 w-0 h-0 pointer-events-none z-[5] will-change-transform"
      >
        {[...Array(totalItems)].map((_, i) => {
          const angle = (i / totalItems) * (Math.PI * 2);
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          return (
            <div
              key={i}
              ref={el => itemsRef.current[i] = el}
              className="absolute w-[100px] h-[100px] bg-[#222] rounded-xl overflow-hidden opacity-0 scale-75 shadow-2xl will-change-transform"
              style={{
                left: `${x - 50}px`,
                top: `${y - 50}px`
              }}
            >
              <img 
                src={`https://picsum.photos/seed/${currentSeed + i}/200/200`} 
                alt={`Gallery ${i}`} 
                className="w-full h-full object-cover"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CircularGalleryHero;
