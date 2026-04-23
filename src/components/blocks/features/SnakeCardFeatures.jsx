import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useProject } from '../../../context/ProjectContext';

const SnakeCard = ({ tag, title, image, revealColor = "#ffffff", dark = false, animate }) => {
  const cardRef = useRef(null);
  const pathRef = useRef(null);
  const wordsRef = useRef([]);
  const tagRef = useRef(null);
  const tl = useRef(null);

  useEffect(() => {
    if (!pathRef.current || !animate) return;

    const length = pathRef.current.getTotalLength();
    gsap.set(pathRef.current, {
      strokeDasharray: length,
      strokeDashoffset: length,
      strokeWidth: 0
    });
  }, [animate]);

  const handleMouseEnter = () => {
    if (!animate) return;
    if (tl.current) tl.current.kill();
    
    tl.current = gsap.timeline({ defaults: { ease: "power2.inOut" } });

    tl.current
      .to(pathRef.current, {
        strokeDashoffset: 0,
        strokeWidth: 1200,
        duration: 0.8
      })
      .to(wordsRef.current, {
        y: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: "expo.out"
      }, "-=0.4")
      .to(tagRef.current, {
        opacity: 0.6,
        duration: 0.4
      }, "-=0.6");
  };

  const handleMouseLeave = () => {
    if (!animate) return;
    if (tl.current) tl.current.kill();
    
    const length = pathRef.current.getTotalLength();
    gsap.to(pathRef.current, {
      strokeDashoffset: -length,
      strokeWidth: 0,
      duration: 0.6,
      ease: "power2.inOut"
    });

    gsap.to(wordsRef.current, {
      y: "100%",
      duration: 0.4,
      stagger: 0.02
    });

    gsap.to(tagRef.current, {
      opacity: 0,
      duration: 0.3
    });
  };

  const splitTitle = (text) => {
    return text.split(' ').map((word, i) => (
      <div key={i} className="inline-block overflow-hidden align-bottom mr-2">
        <span 
          ref={el => wordsRef.current[i] = el}
          className="inline-block translate-y-full will-change-transform"
        >
          {word}
        </span>
      </div>
    ));
  };

  return (
    <div 
      ref={cardRef}
      className={`group relative aspect-square overflow-hidden cursor-pointer ${dark ? 'bg-[--card-bg] text-white' : 'bg-white text-black'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {image && (
        <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105" />
      )}
      
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-[2]" viewBox="0 0 500 500" preserveAspectRatio="none">
        <path 
          ref={pathRef}
          className="fill-none stroke-linecap-round stroke-linejoin-round will-change-[stroke-dashoffset,stroke-width]" 
          d="M -100,600 Q 100,500 250,250 T 600,-100"
          stroke={revealColor}
        />
      </svg>

      <div className="absolute bottom-8 left-8 z-[3] pointer-events-none">
        <span 
          ref={tagRef}
          className="block text-[0.8rem] uppercase tracking-[0.1em] mb-2 opacity-0"
        >
          {tag}
        </span>
        <h2 className="text-[2.5rem] font-bold m-0 tracking-tight leading-none">
          {splitTitle(title)}
        </h2>
      </div>
    </div>
  );
};

const SnakeCardFeatures = ({ id, props, editMode }) => {
  const { selectedBlockId, setSelectedBlockId } = useProject();
  const isSelected = selectedBlockId === id;

  const defaultCards = [
    {
      tag: "Stellar",
      title: "Dark Matter",
      image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800",
      revealColor: "#ffffff",
      dark: true
    },
    {
      tag: "Brand",
      title: "Rubi Identity",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
      revealColor: "#0055ff",
      dark: false
    },
    {
      tag: "Platform",
      title: "System UI",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800",
      revealColor: "#ffffff",
      dark: true
    },
    {
      tag: "Motion",
      title: "Fluid Flow",
      image: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=800",
      revealColor: "#000000",
      dark: false
    }
  ];

  const cards = props.cards || defaultCards;
  const animate = props.animate !== false;

  return (
    <section 
      onClick={() => editMode && setSelectedBlockId(id)}
      className={`snake-card-features w-full max-w-[1200px] mx-auto py-12 px-4 relative ${isSelected ? 'ring-2 ring-[#5b76fe] ring-inset' : ''}`}
    >
      <style>{`
        :root {
          --card-bg: var(--primary-color, #000000);
        }
      `}</style>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] bg-[#ccc] border border-[#ccc]">
        {cards.map((card, i) => (
          <SnakeCard 
            key={i}
            {...card}
            animate={animate}
          />
        ))}
      </div>
    </section>
  );
};

export default SnakeCardFeatures;
