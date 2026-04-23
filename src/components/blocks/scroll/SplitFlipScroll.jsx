import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code, Layers, Shield } from 'lucide-react';
import { useProject } from '../../../context/ProjectContext';

const SplitFlipScroll = ({ id, props, editMode }) => {
  const { selectedBlockId, setSelectedBlockId } = useProject();
  const containerRef = useRef(null);
  const cardContainerRef = useRef(null);
  const gridRef = useRef(null);
  const isSelected = selectedBlockId === id;

  const defaultCards = [
    {
      icon: <Code className="w-full h-full" />,
      title: "Going Zero to One",
      description: "If you're navigating a new business unit, or a new venture entirely, or breaking into a new market",
      bgColor: "#b0b0b0",
      textColor: "#1a1a1a"
    },
    {
      icon: <Layers className="w-full h-full" />,
      title: "Scaling from One to N",
      description: "If you've achieved Product/Service Market Fit, and are looking to scale your business to new heights",
      bgColor: "#e52b20",
      textColor: "#ffffff"
    },
    {
      icon: <Shield className="w-full h-full" />,
      title: "Need Quick Solutions",
      description: "If you know exactly what you want and need a team that can step in and quickly help you with it",
      bgColor: "#151515",
      textColor: "#ffffff"
    }
  ];

  const image = props.image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop";
  const cards = props.cards || defaultCards;
  const animate = props.animate !== false;

  useEffect(() => {
    if (!animate) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=300%",
          scrub: 0.8,
          pin: true,
          anticipatePin: 1
        }
      });

      // Initial state
      gsap.set(cardContainerRef.current, { opacity: 0, y: 60 });

      tl.to(cardContainerRef.current, { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" }, 0)
        .to(cardContainerRef.current, { gap: "2rem", duration: 2, ease: "power1.inOut" }, 1)
        .to(".split-card", { borderRadius: "1.2rem", duration: 1.5, ease: "power1.inOut" }, 1)
        .to(gridRef.current, { scale: 3, duration: 6, ease: "none" }, 0)
        .to(".split-card-wrapper:nth-child(1)", { rotateZ: -8, x: -20, duration: 1.5, ease: "power2.out" }, 2.5)
        .to(".split-card-wrapper:nth-child(3)", { rotateZ: 8, x: 20, duration: 1.5, ease: "power2.out" }, 2.5)
        .to(".split-card", {
          rotateY: 180,
          duration: 2.5,
          stagger: 0.1,
          ease: "power2.inOut"
        }, 4);
    }, containerRef);

    return () => ctx.revert();
  }, [animate, id]);

  return (
    <div 
      ref={containerRef}
      onClick={() => editMode && setSelectedBlockId(id)}
      className={`split-flip-scroll bg-black text-white overflow-x-hidden relative ${isSelected ? 'ring-2 ring-[#5b76fe] ring-inset' : ''}`}
    >
      <style>{`
        .split-card-face {
          backface-visibility: hidden;
          transform-style: preserve-3d;
        }
        .split-card-back {
          transform: rotateY(180deg) translateZ(1px);
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E");
        }
      `}</style>

      <div ref={gridRef} className="fixed inset-0 z-[-1] opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }}></div>

      <section className="pinned-section h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        <div ref={cardContainerRef} className="card-container flex items-center justify-center gap-0 preserve-3d will-change-transform">
          {cards.map((card, i) => (
            <div key={i} className="split-card-wrapper w-[25vw] max-w-[300px] aspect-[5/7] perspective-[2000px]">
              <div className="split-card relative w-full h-full preserve-3d will-change-transform">
                {/* Front */}
                <div 
                  className="split-card-face absolute inset-0 overflow-hidden bg-cover bg-no-repeat rounded-inherit"
                  style={{ 
                    backgroundImage: `url(${image})`,
                    backgroundPosition: `${(i / (cards.length - 1)) * 100}% 50%`,
                    backgroundSize: `${cards.length * 100}% 100%`,
                    transform: 'scale(1.01) translateZ(1px)'
                  }}
                ></div>
                {/* Back */}
                <div 
                  className="split-card-face split-card-back absolute inset-0 flex flex-col p-8 md:p-10 text-left rounded-inherit overflow-hidden"
                  style={{ backgroundColor: card.bgColor, color: card.textColor }}
                >
                  <div className="w-8 h-8 mb-auto">
                    {card.icon}
                  </div>
                  <h3 className="text-3xl font-bold leading-tight mb-6 tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-sm md:text-base opacity-80 leading-relaxed font-normal">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SplitFlipScroll;
