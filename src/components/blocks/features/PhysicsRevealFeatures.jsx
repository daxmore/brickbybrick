import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import Matter from 'matter-js';
import { useProject } from '../../../context/ProjectContext';

const ServiceRow = ({ index, title, tags, images, animate }) => {
  const rowRef = useRef(null);
  const contentRef = useRef(null);
  const stackRef = useRef(null);
  const containerRef = useRef(null);
  const charsRef = useRef([]);
  const [isOpen, setIsOpen] = useState(false);
  const engineRef = useRef(null);
  const runnerRef = useRef(null);
  const tagElementsRef = useRef([]);
  const tagBodiesRef = useRef([]);

  const stopPhysics = useCallback(() => {
    if (engineRef.current) {
      Matter.Runner.stop(runnerRef.current);
      Matter.World.clear(engineRef.current.world);
      Matter.Engine.clear(engineRef.current);
      engineRef.current = null;
      tagElementsRef.current.forEach(t => t.remove());
      tagElementsRef.current = [];
      tagBodiesRef.current = [];
    }
  }, []);

  const initPhysics = useCallback(() => {
    const { Engine, World, Bodies, Runner, Mouse, MouseConstraint, Body } = Matter;
    const w = contentRef.current.offsetWidth;
    const h = 550;

    const engine = Engine.create();
    engineRef.current = engine;
    engine.world.gravity.y = 1.5;

    const ground = Bodies.rectangle(w/2, h + 50, w * 4, 100, { isStatic: true });
    const left = Bodies.rectangle(-50, h/2, 100, h * 4, { isStatic: true });
    const right = Bodies.rectangle(w + 50, h/2, 100, h * 4, { isStatic: true });
    World.add(engine.world, [ground, left, right]);

    const mouse = Mouse.create(contentRef.current);
    const mc = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.3, render: { visible: false } }
    });
    World.add(engine.world, mc);

    const tagBodies = [];
    const tagElements = [];

    tags.forEach((name, i) => {
      const el = document.createElement('div');
      el.className = `absolute px-9 py-4 rounded-full font-black text-lg whitespace-nowrap pointer-events-auto select-none shadow-xl opacity-0 will-change-transform ${i % 2 === 0 ? 'bg-[--primary-color] text-white' : 'bg-white text-black'}`;
      el.style.setProperty('--primary-color', 'var(--primary-color)');
      el.textContent = name;
      containerRef.current.appendChild(el);
      tagElements.push(el);

      const spawnX = (w * 0.1) + (Math.random() * w * 0.8);
      const spawnY = -150 - (i * 150);
      
      const body = Bodies.rectangle(spawnX, spawnY, name.length * 14 + 60, 60, {
        chamfer: { radius: 30 },
        restitution: 0.8,
        frictionAir: 0.01,
        friction: 0.1,
        angle: (Math.random() - 0.5) * 2
      });

      Body.setVelocity(body, { x: (Math.random()-0.5)*10, y: 5 });
      Body.setAngularVelocity(body, (Math.random()-0.5)*0.2);

      tagBodies.push(body);
      World.add(engine.world, body);
    });

    tagBodiesRef.current = tagBodies;
    tagElementsRef.current = tagElements;

    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    const update = () => {
      if (!engineRef.current) return;
      tagBodies.forEach((body, i) => {
        const el = tagElements[i];
        if (el) {
          el.style.transform = `translate(${body.position.x - el.offsetWidth/2}px, ${body.position.y - el.offsetHeight/2}px) rotate(${body.angle}rad)`;
          el.style.opacity = '1';
        }
      });
      requestAnimationFrame(update);
    };
    update();
  }, [tags]);

  const openReveal = useCallback(() => {
    // Text Wave
    gsap.to(charsRef.current, {
      y: -15,
      color: 'var(--primary-color, #5b76fe)',
      stagger: { each: 0.02, from: "start" },
      duration: 0.4,
      ease: "power2.out"
    });

    gsap.to(contentRef.current, { height: 550, duration: 0.8, ease: "elastic.out(1, 0.8)" });
    gsap.to(stackRef.current, { bottom: "12%", duration: 1.2, ease: "power4.out", delay: 0.1 });
    
    initPhysics();
  }, [initPhysics]);

  const closeReveal = useCallback(() => {
    gsap.to(charsRef.current, {
      y: 0,
      color: 'var(--text-color, #ffffff)',
      stagger: 0.01,
      duration: 0.3
    });

    gsap.to(contentRef.current, { height: 0, duration: 0.5, ease: "power3.inOut" });
    gsap.to(stackRef.current, { bottom: "-100%", rotateX: 0, rotateY: 0, x: 0, xPercent: -50, duration: 0.5 });
    
    stopPhysics();
  }, [stopPhysics]);

  useEffect(() => {
    if (!animate) return;
    
    if (isOpen) {
      openReveal();
    } else {
      closeReveal();
    }
  }, [isOpen, animate, openReveal, closeReveal]);

  const handleParallax = (e) => {
    if (!isOpen || !animate) return;
    const rect = rowRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(stackRef.current, {
      rotateY: x * 45,
      rotateX: -y * 45,
      xPercent: -50,
      x: x * 100,
      y: y * 50,
      duration: 0.8,
      ease: "power2.out"
    });
  };

  return (
    <div 
      className="service-row relative w-full border-b border-[rgba(255,255,255,0.1)] cursor-pointer"
      ref={rowRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onMouseMove={handleParallax}
    >
      <div className="service-header flex justify-between items-center py-12 md:py-16 text-[clamp(2rem,7vw,4.5rem)] font-extrabold tracking-tighter z-10 relative bg-black select-none">
        <div className="text-wrapper flex text-white">
          {title.split('').map((char, i) => (
            <span 
              key={i} 
              ref={el => charsRef.current[i] = el}
              className="char inline-block will-change-transform"
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </div>
        <span className="service-number text-xl font-mono opacity-30 font-normal text-white">
          {index < 10 ? `0${index}` : index}
        </span>
      </div>
      <div className="reveal-content h-0 relative overflow-hidden bg-[#080808] will-change-[height] perspective-[1500px]" ref={contentRef}>
        <div className="image-stack absolute bottom-[-100%] left-1/2 -translate-x-1/2 flex gap-10 z-[2] pointer-events-none preserve-3d will-change-transform" ref={stackRef}>
          {images.map((src, i) => (
            <div key={i} className="image-wrapper rounded-3xl overflow-hidden shadow-2xl bg-[#111] preserve-3d">
              <img src={src} alt="Reveal" className="w-[280px] h-[380px] object-cover block opacity-80 select-none pointer-events-none" />
            </div>
          ))}
        </div>
        <div className="physics-tags-container absolute inset-0 pointer-events-none z-[100]" ref={containerRef}></div>
      </div>
    </div>
  );
};

const PhysicsRevealFeatures = ({ id, props, editMode }) => {
  const { selectedBlockId, setSelectedBlockId } = useProject();
  const isSelected = selectedBlockId === id;

  const defaultServices = [
    {
      title: "Visual Identity",
      tags: ["BRANDING", "STRATEGY", "MOTION", "IDENTITY", "WEB3"],
      images: [
        "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=800"
      ]
    },
    {
      title: "Product Design",
      tags: ["PRODUCT", "UI/UX", "MOBILE", "REACT", "SCALE"],
      images: [
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1550439062-609e1531270e?auto=format&fit=crop&q=80&w=800"
      ]
    }
  ];

  const services = props.services || defaultServices;
  const animate = props.animate !== false;

  return (
    <section 
      onClick={() => editMode && setSelectedBlockId(id)}
      className={`physics-reveal-features w-full py-24 bg-black relative ${isSelected ? 'ring-2 ring-[#5b76fe] ring-inset' : ''}`}
    >
      <style>{`
        .preserve-3d { transform-style: preserve-3d; }
      `}</style>
      <div className="max-w-[1200px] mx-auto px-10">
        {services.map((service, i) => (
          <ServiceRow 
            key={i}
            index={i + 1}
            {...service}
            editMode={editMode}
            animate={animate}
          />
        ))}
      </div>
    </section>
  );
};

export default PhysicsRevealFeatures;
