import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useProject } from '../../../context/ProjectContext';

const StickyScalingScroll = ({ id, props, editMode }) => {
  const { selectedBlockId, setSelectedBlockId } = useProject();
  const containerRef = useRef(null);
  const isSelected = selectedBlockId === id;

  const defaultItems = [
    { title: 'Sage Sanctuary', desc: 'Minimalist rolling hills', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2070' },
    { title: 'Lavender Drift', desc: 'Organic abstract composition', img: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=2070' },
    { title: 'Blush Structure', desc: 'Architectural geometric detail', img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=2070' }
  ];

  const items = props.items || defaultItems;

  useEffect(() => {
    if (props.animate === false) return;
    
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray(".pinned-section");
      
      sections.forEach((section, index) => {
        const card = section.querySelector(".card-wrapper");
        const image = section.querySelector("img");
        
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom top",
          pin: true,
          pinSpacing: false,
          id: `pin-${id}-${index}`
        });

        gsap.fromTo(card, 
          { scale: 1 }, 
          {
            scale: 0.5,
            opacity: 0.6,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: 0.5
            }
          }
        );

        gsap.to(image, {
          scale: 1.3,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [id, props.animate]);

  return (
    <div 
      ref={containerRef}
      onClick={() => editMode && setSelectedBlockId(id)}
      className={`relative ${isSelected ? 'ring-2 ring-[#5b76fe] ring-inset' : ''}`}
    >
      <section className="h-screen flex flex-col justify-center items-center text-center bg-white">
        <h1 className="text-8xl font-black uppercase tracking-tighter" style={{ color: 'var(--text-color)' }}>
          {props.title || 'Sticky Scape'}
        </h1>
        <p className="text-xl uppercase tracking-[0.3em] mt-8 opacity-50" style={{ color: 'var(--text-color)' }}>
          {props.subtitle || 'Motion Experiment'}
        </p>
      </section>

      {items.map((item, i) => (
        <section key={i} className="pinned-section h-screen w-full flex justify-center items-center relative overflow-hidden">
          <div className="card-wrapper w-[80vw] h-[80vh] relative rounded-[24px] overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 pointer-events-none" />
            <img src={item.img} alt={item.title} className="w-full h-120% object-cover scale-110" />
            <div className="absolute bottom-16 left-16 text-white z-20">
              <h2 className="text-5xl font-bold mb-2">{item.title}</h2>
              <p className="text-lg uppercase tracking-widest opacity-80">{item.desc}</p>
            </div>
          </div>
        </section>
      ))}

      <section className="h-screen flex flex-col justify-center items-center bg-white z-10 relative">
        <h2 className="text-6xl font-black uppercase">The End</h2>
      </section>
    </div>
  );
};

export default StickyScalingScroll;
