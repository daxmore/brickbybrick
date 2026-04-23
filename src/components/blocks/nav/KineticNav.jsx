import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const KineticNav = ({
  logo = "KINETIC.",
  links = [
    { label: "HOME", href: "#", src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200" },
    { label: "WORK", href: "#", src: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=1200" },
    { label: "INFO", href: "#", src: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200" },
    { label: "CONTACT", href: "#", src: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=1200" },
  ],
  editMode = false,
  animate = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(null);
  const overlayRef = useRef(null);
  const previewRef = useRef(null);
  const navLinksRef = useRef([]);
  const linesRef = useRef([]);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!animate) return;

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (isOpen && previewRef.current) {
        const offsetX = window.innerWidth * 0.15;
        gsap.to(previewRef.current, {
          x: e.clientX + offsetX,
          y: e.clientY,
          duration: 0.9,
          ease: "power3.out"
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isOpen, animate]);

  useEffect(() => {
    if (!animate) return;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const tl = gsap.timeline({ defaults: { ease: "expo.inOut", duration: 1.2 } });
      tl.to(overlayRef.current, { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' })
        .to(linesRef.current[0], { rotate: 45, y: 4, duration: 0.5 }, 0)
        .to(linesRef.current[1], { rotate: -45, y: -4, duration: 0.5 }, 0)
        .fromTo(navLinksRef.current, { x: -60, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.1, duration: 1 }, "-=0.6");
    } else {
      document.body.style.overflow = '';
      gsap.to(overlayRef.current, { clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)', duration: 1, ease: "expo.inOut" });
      gsap.to(linesRef.current, { rotate: 0, y: 0, duration: 0.5 });
    }
  }, [isOpen, animate]);

  const handleMouseEnter = (index, src) => {
    if (!animate) return;
    setActiveImg(src);
    gsap.to(navLinksRef.current[index], { skewX: -12, x: 30, duration: 0.4, ease: "power4.out" });
  };

  const handleMouseLeave = (index) => {
    if (!animate) return;
    setActiveImg(null);
    gsap.to(navLinksRef.current[index], { skewX: 0, x: 0, duration: 0.4, ease: "power4.out" });
  };

  return (
    <div className="kinetic-nav">
      <style>{`
        :root {
          --bg-menu: var(--bg-color, #f0f0f0);
          --bg-page: var(--primary-color, #0a0a0a);
        }
        .kinetic-nav .noise {
          position: fixed;
          inset: 0;
          background: url('https://grainy-gradients.vercel.app/noise.svg');
          opacity: 0.05;
          pointer-events: none;
          z-index: 3000;
        }
        .kinetic-nav .menu-overlay {
          clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
        }
        .kinetic-nav .img-wrapper {
          position: absolute;
          inset: 0;
          overflow: hidden;
          border-radius: 12px;
          box-shadow: 0 40px 80px rgba(0, 0, 0, 0.15);
        }
      `}</style>

      <div className="noise"></div>

      <header className="fixed top-0 left-0 w-full h-20 px-8 md:px-16 flex items-center justify-between z-[2000]">
        <div 
          className="logo text-xl font-black tracking-tighter text-white mix-blend-difference cursor-pointer"
          contentEditable={editMode}
          suppressContentEditableWarning={true}
        >
          {logo}
        </div>
        <div 
          className="menu-toggle flex items-center gap-4 cursor-pointer z-[2100] mix-blend-difference"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-white text-[0.7rem] font-bold tracking-[0.2em]">{isOpen ? 'CLOSE' : 'MENU'}</span>
          <div className="hamburger flex flex-col gap-[6px]">
            <div ref={el => linesRef.current[0] = el} className="line w-6 h-[2px] bg-white"></div>
            <div ref={el => linesRef.current[1] = el} className="line w-6 h-[2px] bg-white"></div>
          </div>
        </div>
      </header>

      <div 
        ref={overlayRef}
        className="menu-overlay fixed inset-0 w-full h-screen bg-[--bg-menu] z-[1500] flex items-center justify-start pl-[10vw]"
      >
        <div 
          ref={previewRef}
          className="menu-preview fixed top-0 left-0 w-[28vw] h-[40vh] z-[1] pointer-events-none -translate-x-1/2 -translate-y-1/2"
        >
          {activeImg && (
            <div className="img-wrapper animate-in fade-in zoom-in duration-500">
               <img src={activeImg} alt="Preview" className="w-full h-full object-cover scale-110" />
            </div>
          )}
        </div>

        <nav className="nav-links flex flex-col items-start z-10 mix-blend-difference">
          {links.map((link, i) => (
            <a 
              key={i}
              ref={el => navLinksRef.current[i] = el}
              href={link.href}
              className="nav-link relative text-[clamp(3rem,10vw,8rem)] font-black text-white no-underline tracking-tighter leading-[0.85] py-2 transition-transform will-change-transform"
              onMouseEnter={() => handleMouseEnter(i, link.src)}
              onMouseLeave={() => handleMouseLeave(i)}
              onClick={(e) => {
                if (link.href === "#") e.preventDefault();
                setIsOpen(false);
              }}
              contentEditable={editMode}
              suppressContentEditableWarning={true}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default KineticNav;
