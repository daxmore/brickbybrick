import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useProject } from '../../../context/ProjectContext';

const CONFIG = {
  slideWidth: 600,
  slideHeight: 400,
  gap: 650,
  arcDepth: 250,
  scrollEase: 0.05,
  numSlides: 15
};

const ArcSlider = ({ id, props, editMode }) => {
  const { selectedBlockId, setSelectedBlockId } = useProject();
  const containerRef = useRef(null);
  const [activeTitle, setActiveTitle] = useState('');
  const isSelected = selectedBlockId === id;

  useEffect(() => {
    const slider = containerRef.current;
    if (!slider || props.animate === false) return;

    const slides = Array.from(slider.querySelectorAll('.slide-item'));
    let currentScroll = 0;
    let targetScroll = 0;
    const trackWidth = CONFIG.gap * CONFIG.numSlides;

    const wrap = (value, max) => ((value % max) + max) % max;
    const lerp = (start, end, factor) => start + (end - start) * factor;

    const update = () => {
      currentScroll = lerp(currentScroll, targetScroll, CONFIG.scrollEase);
      
      let closestIndex = 0;
      let minDistance = Infinity;
      const halfTrack = trackWidth / 2;
      const windowHalf = window.innerWidth / 2;

      slides.forEach((el, i) => {
        let rawPos = i * CONFIG.gap - currentScroll;
        let wrappedPos = wrap(rawPos + halfTrack, trackWidth) - halfTrack;
        
        if (Math.abs(wrappedPos) < minDistance) {
          minDistance = Math.abs(wrappedPos);
          closestIndex = i;
        }

        let normalizedDist = wrappedPos / windowHalf;
        normalizedDist = Math.max(-1.5, Math.min(1.5, normalizedDist));

        const cosValue = Math.cos(normalizedDist * Math.PI / 3); 
        const x = wrappedPos;
        const y = (1 - cosValue) * CONFIG.arcDepth;
        const scale = 0.5 + 0.5 * cosValue;
        const rotation = normalizedDist * 12;
        const opacity = 0.2 + 0.8 * cosValue;
        const zIndex = Math.round(cosValue * 100);

        gsap.set(el, {
          x: x,
          y: y,
          scale: scale,
          rotationZ: rotation,
          zIndex: zIndex,
          opacity: opacity
        });
      });

      setActiveTitle(`VISTA ${String(closestIndex + 1).padStart(2, '0')}`);
      requestAnimationFrame(update);
    };

    const onWheel = (e) => {
      targetScroll += e.deltaY * 1.5;
    };

    let isDragging = false;
    let startX = 0;

    const onPointerDown = (e) => {
      isDragging = true;
      startX = e.clientX;
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const deltaX = startX - e.clientX;
      targetScroll += deltaX * 2.0; 
      startX = e.clientX;
    };

    const onPointerUp = () => { isDragging = false; };

    window.addEventListener('wheel', onWheel);
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    const animReq = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animReq);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [props.animate]);

  return (
    <div 
      ref={containerRef}
      onClick={() => editMode && setSelectedBlockId(id)}
      className={`relative h-screen w-full overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing bg-black ${isSelected ? 'ring-2 ring-[#5b76fe] ring-inset' : ''}`}
    >
      <div className="absolute inset-0 bg-radial-at-center from-[#2a2a35] to-[#0d0d12]" />
      
      {[...Array(CONFIG.numSlides)].map((_, i) => (
        <div 
          key={i} 
          className="slide-item absolute w-[600px] h-[400px] -ml-[300px] -mt-[200px] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        >
          <img 
            src={`https://picsum.photos/seed/${i + 150}/800/533`} 
            alt="Slide"
            className="w-full h-full object-cover brightness-75 hover:brightness-100 transition-all duration-500"
          />
        </div>
      ))}

      <div className="absolute bottom-[8%] w-full text-center pointer-events-none z-50">
        <h2 className="text-5xl font-light tracking-[12px] uppercase text-white drop-shadow-2xl">
          {activeTitle}
        </h2>
      </div>
    </div>
  );
};

export default ArcSlider;
