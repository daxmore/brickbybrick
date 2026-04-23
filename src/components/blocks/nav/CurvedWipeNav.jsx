import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { Menu, X } from 'lucide-react';

const CurvedWipeNav = ({
  logo = "Studio RIU",
  links = [
    { label: "Work", href: "#", hasDot: true },
    { label: "Studio", href: "#" },
    { label: "Services", href: "#" },
    { label: "Journal", href: "#" },
    { label: "Contact", href: "#" },
  ],
  socials = [
    { label: "Instagram", href: "#" },
    { label: "Twitter / X", href: "#" },
    { label: "Dribbble", href: "#" },
  ],
  contact = {
    email: "hello@studio-riu.com",
    location: "Mumbai, India"
  },
  footer = {
    copyright: "© 2026 Studio RIU",
    tagline: "Creative Development"
  },
  editMode = false,
  animate = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);
  const menuRef = useRef(null);
  const pathRef = useRef(null);
  const contentRef = useRef(null);
  const footerRef = useRef(null);
  const infoRef = useRef(null);
  const activeTimeline = useRef(null);

  const CONFIG = React.useMemo(() => ({
    sweepDuration: 0.8,
    charDuration: 0.8,
    charStagger: 0.02,
    charEase: "power4.out",
    infoDuration: 0.5,
    infoStagger: 0.06,
    closeSweepDuration: 0.7,
  }), []);

  const PATHS = React.useMemo(() => ({
    openHidden: "M 0 0 L 100 0 L 100 0 Q 50 0 0 0 Z",
    openCurved: "M 0 0 L 100 0 L 100 40 Q 50 58 0 40 Z",
    openFull: "M 0 0 L 100 0 L 100 100 Q 50 100 0 100 Z",
    closeStart: "M 0 0 Q 50 0 100 0 L 100 100 L 0 100 Z",
    closeCurved: "M 0 60 Q 50 40 100 60 L 100 100 L 0 100 Z",
    closeHidden: "M 0 100 Q 50 100 100 100 L 100 100 L 0 100 Z",
  }), []);

  const openMenu = useCallback(() => {
    if (activeTimeline.current) activeTimeline.current.kill();

    const tl = gsap.timeline();
    activeTimeline.current = tl;

    tl.set(pathRef.current, { attr: { d: PATHS.openHidden } })
      .to(pathRef.current, {
        attr: { d: PATHS.openCurved },
        duration: CONFIG.sweepDuration * 0.4,
        ease: "power2.in",
      })
      .to(pathRef.current, {
        attr: { d: PATHS.openFull },
        duration: CONFIG.sweepDuration * 0.6,
        ease: "power2.out",
      })
      .set([contentRef.current, footerRef.current], { visibility: 'visible' })
      .to('.curved-nav-char', {
        y: 0,
        opacity: 1,
        duration: CONFIG.charDuration,
        stagger: CONFIG.charStagger,
        ease: CONFIG.charEase,
      }, "-=0.25")
      .to('.curved-nav-info-block', {
        y: 0,
        opacity: 1,
        duration: CONFIG.infoDuration,
        stagger: CONFIG.infoStagger,
        ease: "power3.out",
      }, "<0.08")
      .to(footerRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      }, "<0.15");
  }, [PATHS, CONFIG]);

  const closeMenu = useCallback(() => {
    if (activeTimeline.current) activeTimeline.current.kill();

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set('.curved-nav-char', { y: 60, opacity: 0 });
        gsap.set('.curved-nav-info-block', { y: 30, opacity: 0 });
        gsap.set(footerRef.current, { opacity: 0 });
        gsap.set([contentRef.current, footerRef.current], { visibility: 'hidden' });
      }
    });
    activeTimeline.current = tl;

    gsap.set(pathRef.current, { attr: { d: PATHS.closeStart } });

    tl.to('.curved-nav-char', {
      opacity: 0,
      y: -30,
      duration: 0.22,
      stagger: 0.006,
      ease: "power3.in",
    })
    .to('.curved-nav-info-block', {
      y: -20,
      opacity: 0,
      duration: 0.18,
      stagger: 0.04,
      ease: "power2.in",
    }, "<")
    .to(footerRef.current, {
      opacity: 0,
      duration: 0.12,
    }, "<")
    .to(pathRef.current, {
      attr: { d: PATHS.closeCurved },
      duration: CONFIG.closeSweepDuration * 0.45,
      ease: "power3.in",
    }, "-=0.08")
    .to(pathRef.current, {
      attr: { d: PATHS.closeHidden },
      duration: CONFIG.closeSweepDuration * 0.55,
      ease: "power2.out",
    });
  }, [PATHS, CONFIG]);

  useEffect(() => {
    if (!animate) return;

    // Initial state
    gsap.set(pathRef.current, { attr: { d: PATHS.openHidden } });
    gsap.set('.curved-nav-char', { y: 60, opacity: 0 });
    gsap.set('.curved-nav-info-block', { y: 30, opacity: 0 });
    gsap.set(footerRef.current, { opacity: 0 });
    gsap.set([contentRef.current, footerRef.current], { visibility: 'hidden' });

    return () => {
      if (activeTimeline.current) activeTimeline.current.kill();
    };
  }, [animate, PATHS.openHidden]);

  useEffect(() => {
    if (!animate) return;

    if (isOpen) {
      openMenu();
    } else {
      closeMenu();
    }
  }, [isOpen, animate, openMenu, closeMenu]);

  const splitText = (text) => {
    return text.split('').map((char, index) => (
      <span key={index} className="curved-nav-char inline-block">
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <div className="nav fixed inset-0 w-full h-screen z-[100] pointer-events-none" ref={navRef}>
      <style>{`
        :root {
          --color-bg: var(--bg-color, #F5F2E8);
          --color-menu-fill: var(--primary-color, #1a1a1a);
          --color-logo: var(--text-color, #1a1a1a);
          --color-link: var(--bg-color, #F0D9D1);
          --color-link-hover: var(--primary-color, #C8A8F5);
          --color-info-text: #B0ACA8;
          --color-info-label: #888888;
        }

        .nav-logo {
          mix-blend-mode: difference;
          color: #fff;
        }

        .nav-toggle span {
          mix-blend-mode: difference;
          color: #fff;
        }

        .nav-toggle-bars span {
          mix-blend-mode: difference;
          background: #fff;
        }
      `}</style>

      {/* Header */}
      <div className="nav-header absolute top-0 left-0 w-full flex items-center justify-between p-8 z-[200] pointer-events-none">
        <a 
          className="nav-logo text-xl font-bold tracking-wider uppercase pointer-events-auto cursor-pointer no-underline" 
          href="#"
          contentEditable={editMode}
          suppressContentEditableWarning={true}
        >
          {logo}
        </a>

        <div 
          className="nav-toggle relative flex flex-col items-end cursor-pointer pointer-events-auto z-[300]"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="nav-toggle-bars flex flex-col gap-[5px] mb-[6px] items-end">
            <span className={`block h-[2px] rounded-full transition-all duration-300 ${isOpen ? 'w-[18px]' : 'w-[28px]'}`}></span>
            <span className={`block h-[2px] rounded-full transition-all duration-300 ${isOpen ? 'w-[28px]' : 'w-[18px]'}`}></span>
          </div>
          <div className="relative h-4 overflow-hidden text-[0.85rem] font-semibold tracking-widest uppercase">
             <span className={`absolute right-0 transition-all duration-300 ${isOpen ? '-translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}`}>Menu</span>
             <span className={`absolute right-0 transition-all duration-300 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>Close</span>
          </div>
        </div>
      </div>

      {/* Menu Overlay */}
      <div 
        className={`menu absolute inset-0 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`} 
        ref={menuRef}
      >
        <svg className="menu-svg absolute inset-0 w-full h-full -z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path ref={pathRef} fill="var(--color-menu-fill)" />
        </svg>

        <div className="menu-content absolute inset-0 flex flex-col md:flex-row items-stretch p-12 md:p-28 gap-12 invisible" ref={contentRef}>
          {/* Info Side */}
          <aside className="menu-info flex-[0_0_260px] flex flex-col justify-end gap-10 pb-4 order-2 md:order-1" ref={infoRef}>
            <div className="curved-nav-info-block info-block">
              <p className="text-[0.78rem] font-semibold tracking-widest uppercase text-[--color-info-label] mb-2">Socials</p>
              {socials.map((social, i) => (
                <a key={i} href={social.href} className="block text-[0.95rem] text-[--color-info-text] no-underline leading-relaxed transition-colors hover:text-[--color-link-hover]">
                  {social.label}
                </a>
              ))}
            </div>

            <div className="curved-nav-info-block info-block">
              <p className="text-[0.78rem] font-semibold tracking-widest uppercase text-[--color-info-label] mb-2">Contact</p>
              <address className="not-italic">
                <a href={`mailto:${contact.email}`} className="block text-[0.95rem] text-[--color-info-text] no-underline leading-relaxed transition-colors hover:text-[--color-link-hover]">
                  {contact.email}
                </a>
              </address>
            </div>

            <div className="curved-nav-info-block info-block">
              <p className="text-[0.78rem] font-semibold tracking-widest uppercase text-[--color-info-label] mb-2">Location</p>
              <address className="not-italic text-[0.95rem] text-[--color-info-text] leading-relaxed">
                {contact.location}
              </address>
            </div>
          </aside>

          {/* Links Side */}
          <nav className="menu-links flex-1 flex flex-col justify-center items-start gap-1 order-1 md:order-2">
            {links.map((link, i) => (
              <div key={i} className="menu-link-item relative overflow-hidden">
                <a 
                  href={link.href} 
                  className="block text-[clamp(2rem,8vw,6.5rem)] font-black leading-[1.05] tracking-tighter text-[--color-link] no-underline uppercase transition-colors hover:text-[--color-link-hover]"
                  onClick={(e) => {
                    if (link.href === "#") e.preventDefault();
                    setIsOpen(false);
                  }}
                >
                  {splitText(link.label)}
                  {link.hasDot && <span className="inline-block w-[0.5em] h-[0.5em] rounded-full bg-[--color-link-hover] align-super ml-[0.1em] text-[0.4em] opacity-80"></span>}
                </a>
              </div>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="menu-footer absolute bottom-8 left-10 right-10 flex items-center justify-between border-t border-white/10 pt-4 invisible" ref={footerRef}>
          <span className="text-[0.75rem] text-white/25 tracking-widest uppercase">{footer.copyright}</span>
          <span className="text-[0.75rem] text-white/25 tracking-widest uppercase">{footer.tagline}</span>
        </div>
      </div>
    </div>
  );
};

export default CurvedWipeNav;
