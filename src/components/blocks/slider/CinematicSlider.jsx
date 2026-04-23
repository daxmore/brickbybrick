import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useProject } from '../../../context/ProjectContext';

const CinematicSlider = ({ id, props, editMode }) => {
  const { selectedBlockId, setSelectedBlockId } = useProject();
  const containerRef = useRef(null);
  const isSelected = selectedBlockId === id;

  const slides = React.useMemo(() => [
    { title: "Geometric Voids", image: "https://images.unsplash.com/photo-1773332585956-2d0e8ac80cb6?auto=format&w=1920" },
    { title: "Ethereal Flow", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&w=1920" },
    { title: "Urban Monolith", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&w=1920" },
    { title: "Brutalist Core", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&w=1920" },
    { title: "Infinite Pulse", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&w=1920" }
  ], []);

  useEffect(() => {
    if (props.animate === false) return;
    
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      const pinDistance = window.innerHeight * slides.length;
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".slider-inner",
          start: "top top",
          end: () => "+=" + pinDistance,
          pin: true,
          scrub: 0.5,
          invalidateOnRefresh: true
        }
      });

      // Initial State
      gsap.set(".parallax-wrapper:nth-child(1)", { opacity: 1 });
      gsap.set(".slide-img-el:nth-child(1)", { yPercent: 10 });
      gsap.set(".slide-title-el:nth-child(1)", { opacity: 1 });
      gsap.set(".index-item:nth-child(1)", { opacity: 1 });

      slides.forEach((_, i) => {
        const pos = i;
        masterTl.fromTo(`.parallax-wrapper:nth-child(${i+1}) .slide-img-el`, 
          { yPercent: 10 }, { yPercent: -10, ease: "none", duration: 1 }, pos);

        masterTl.to(".progress-fill-inner", { scaleY: (i + 1) / slides.length, ease: "none", duration: 1 }, pos);

        if (i < slides.length - 1) {
          masterTl.to(`.slide-title-el:nth-child(${i+1})`, { y: -60, opacity: 0, duration: 0.4 }, pos + 0.6);
          masterTl.to(`.index-item:nth-child(${i+1})`, { opacity: 0.3, duration: 0.3 }, pos + 0.8);
          masterTl.to(`.parallax-wrapper:nth-child(${i+2})`, { opacity: 1, duration: 0.5 }, pos + 0.8);
          masterTl.fromTo(`.slide-title-el:nth-child(${i+2})`, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, pos + 0.9);
          masterTl.to(`.index-item:nth-child(${i+2})`, { opacity: 1, duration: 0.3 }, pos + 0.9);
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [id, props.animate, slides]);

  return (
    <div 
      ref={containerRef}
      onClick={() => editMode && setSelectedBlockId(id)}
      className={`relative h-screen bg-black ${isSelected ? 'ring-2 ring-[#5b76fe] ring-inset' : ''}`}
    >
      <div className="slider-inner h-screen w-full relative overflow-hidden">
        {/* Images */}
        <div className="absolute inset-0 z-0">
          {slides.map((slide, i) => (
            <div key={i} className="parallax-wrapper absolute inset-0 opacity-0 overflow-hidden">
              <div className="absolute inset-0 bg-black/40 z-10" />
              <img src={slide.image} className="slide-img-el absolute inset-0 w-full h-[120%] object-cover -top-[10%]" alt={slide.title} />
            </div>
          ))}
        </div>

        {/* Titles */}
        <div className="absolute left-[8%] top-1/2 -translate-y-1/2 z-20 w-[80%]">
          {slides.map((slide, i) => (
            <div key={i} className="slide-title-el absolute top-1/2 left-0 -translate-y-1/2 opacity-0 w-full">
              <h1 className="text-[clamp(3rem,10vw,8rem)] font-black uppercase tracking-tighter leading-[0.85] text-white">
                {slide.title}
              </h1>
            </div>
          ))}
        </div>

        {/* Indicators */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 z-30 flex items-center gap-8">
          <div className="flex flex-col gap-6 items-end font-mono text-xs text-white">
            {slides.map((_, i) => (
              <div key={i} className="index-item flex items-center gap-4 opacity-30 transition-opacity">
                <span>{(i + 1).toString().padStart(2, '0')}</span>
              </div>
            ))}
          </div>
          <div className="w-[1px] h-[200px] bg-white/10 relative">
            <div className="progress-fill-inner absolute top-0 left-0 w-full h-full bg-white scale-y-0 origin-top" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinematicSlider;
