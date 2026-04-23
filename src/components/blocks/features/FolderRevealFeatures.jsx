import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useProject } from '../../../context/ProjectContext';

const FolderItem = ({ index, title, images, variant, isAnyHovered, onHover, onLeave, animate }) => {
  const folderRef = useRef(null);
  const wrapperRef = useRef(null);
  const imagesRef = useRef([]);
  const tl = useRef(null);

  useEffect(() => {
    if (!animate) return;

    tl.current = gsap.timeline({ paused: true });

    tl.current.to(wrapperRef.current, {
      y: -10,
      duration: 0.4,
      ease: "power2.out"
    })
    .to(imagesRef.current, {
      opacity: 1,
      scale: 1,
      y: (i) => -180 - (i * 40),
      rotation: (i) => -15 + (i * 15),
      x: (i) => (i - 1) * 60,
      stagger: 0.08,
      duration: 0.7,
      ease: "back.out(1.7)"
    }, "-=0.3");

    return () => {
      if (tl.current) tl.current.kill();
    };
  }, [animate]);

  const handleMouseEnter = () => {
    if (!animate) return;
    onHover();
    tl.current.play();
  };

  const handleMouseLeave = () => {
    if (!animate) return;
    onLeave();
    tl.current.reverse();
  };

  return (
    <div 
      ref={folderRef}
      className={`project-folder relative w-full h-[280px] cursor-pointer transition-all duration-500`}
      style={{ opacity: isAnyHovered !== null && isAnyHovered !== index ? 0.2 : 1, filter: isAnyHovered !== null && isAnyHovered !== index ? 'grayscale(1)' : 'none' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="preview-stack absolute inset-0 z-[1] pointer-events-none flex justify-center items-center">
        {images.map((src, i) => (
          <img 
            key={i}
            ref={el => imagesRef.current[i] = el}
            src={src} 
            alt="Preview" 
            className="preview-img absolute w-[300px] h-[220px] object-cover rounded-xl shadow-2xl opacity-0 scale-90 translate-y-[50px] will-change-transform"
          />
        ))}
      </div>
      <div 
        ref={wrapperRef}
        className={`folder-wrapper absolute inset-0 rounded-sm z-[2] flex flex-col justify-end p-8 md:p-10 transition-colors duration-400 ${index % 2 === 0 ? '-translate-x-5' : 'translate-x-5'}`}
        style={{ 
          background: 'var(--folder-gray)',
          clipPath: 'polygon(0% 0%, 75% 0%, 80% 15%, 100% 15%, 100% 100%, 0% 100%)',
          '--grad': `var(--grad-${variant})`
        }}
      >
        <span className="folder-number absolute top-8 left-10 text-[0.9rem] font-semibold opacity-40">0{index + 1}</span>
        <div className="folder-info pointer-events-none">
          <h2 
            className="folder-category font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-normal leading-none tracking-tight capitalize"
          >
            {title}
          </h2>
        </div>
      </div>
    </div>
  );
};

const FolderRevealFeatures = ({ id, props, editMode }) => {
  const { selectedBlockId, setSelectedBlockId } = useProject();
  const isSelected = selectedBlockId === id;
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const defaultProjects = [
    { title: "motion", variant: "warm", images: ["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800"] },
    { title: "branding", variant: "cool", images: ["https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800"] },
    { title: "editorial", variant: "dark", images: ["https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1550439062-609e1531270e?auto=format&fit=crop&q=80&w=800"] },
    { title: "photoworks", variant: "sunset", images: ["https://images.unsplash.com/photo-1515462277126-2dd0c162007a?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800"] }
  ];

  const projects = props.projects || defaultProjects;
  const animate = props.animate !== false;

  return (
    <section 
      onClick={() => editMode && setSelectedBlockId(id)}
      className={`folder-reveal-features w-full py-24 px-[4vw] bg-[--bg-color] text-[--text-color] relative ${isSelected ? 'ring-2 ring-[#5b76fe] ring-inset' : ''}`}
    >
      <style>{`
        :root {
          --bg-color: var(--bg-color, #f2f2f2);
          --text-color: var(--text-color, #1a1a1a);
          --grad-warm: linear-gradient(220.55deg, #FFF6EB 0%, #DFD1C5 100%);
          --grad-cool: linear-gradient(220.55deg, #DDE4FF 0%, #8DA2EE 100%);
          --grad-dark: linear-gradient(220.55deg, #565656 0%, #181818 100%);
          --grad-sunset: linear-gradient(220.55deg, #FFC328 0%, #E20000 100%);
          --folder-gray: #d1d1d1;
        }
        .project-folder:hover .folder-wrapper {
          background: var(--grad) !important;
        }
        .project-folder.editorial .folder-wrapper {
           color: #fff;
        }
      `}</style>
      
      <div className="section-header flex justify-between items-baseline mb-24 max-w-[1400px] mx-auto">
        <h1 className="font-serif text-[clamp(4rem,10vw,8rem)] font-medium tracking-tighter">{props.title || 'Works'}</h1>
        <span className="font-serif text-[clamp(3rem,8vw,6rem)] opacity-15 italic">{props.subtitle || 'Archive'}</span>
      </div>

      <div className="projects-grid grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-[120px] max-w-[1400px] mx-auto">
        {projects.map((project, i) => (
          <FolderItem 
            key={i}
            index={i}
            {...project}
            isAnyHovered={hoveredIndex}
            onHover={() => setHoveredIndex(i)}
            onLeave={() => setHoveredIndex(null)}
            editMode={editMode}
            animate={animate}
          />
        ))}
      </div>
    </section>
  );
};

export default FolderRevealFeatures;
