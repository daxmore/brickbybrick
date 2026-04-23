import React, { useEffect, useRef } from 'react';

const TerminalScrambleHero = ({
  image = "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=1200",
  title = "TERMINAL_GRID",
  subtitle = "Interactive System V.02",
  config = {
    symbols: ['X', '0', '$', '>', '-', '+', '%', '*'],
    blockSize: 25,
    detectionRadius: 80,
    clusterSize: 2,
    blockLifetime: 400,
    emptyRatio: 0.7,
    scrambleRatio: 0.5,
    scrambleInterval: 50
  },
  editMode = false,
  animate = true,
}) => {
  const containerRef = useRef(null);
  const overlayRef = useRef(null);
  const blocksRef = useRef([]);
  const requestRef = useRef();

  useEffect(() => {
    if (!containerRef.current || !animate) return;

    const wrapper = containerRef.current;
    const overlay = overlayRef.current;
    overlay.innerHTML = '';
    blocksRef.current = [];

    const rect = wrapper.getBoundingClientRect();
    const cols = Math.ceil(rect.width / config.blockSize);
    const rows = Math.ceil(rect.height / config.blockSize);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const blockEl = document.createElement('div');
        blockEl.className = 'grid-block absolute flex items-center justify-center text-[8px] font-mono text-[--accent-color] opacity-0 transition-opacity duration-200 pointer-events-none bg-black/80';
        blockEl.style.width = `${config.blockSize}px`;
        blockEl.style.height = `${config.blockSize}px`;
        blockEl.style.left = `${x * config.blockSize}px`;
        blockEl.style.top = `${y * config.blockSize}px`;

        const isEmpty = Math.random() < config.emptyRatio;
        const shouldScramble = !isEmpty && Math.random() < config.scrambleRatio;
        
        if (!isEmpty) {
          blockEl.innerText = config.symbols[Math.floor(Math.random() * config.symbols.length)];
        }

        overlay.appendChild(blockEl);

        blocksRef.current.push({
          el: blockEl,
          centerX: (x * config.blockSize) + (config.blockSize / 2),
          centerY: (y * config.blockSize) + (config.blockSize / 2),
          gridX: x,
          gridY: y,
          highlightEndTime: 0,
          isEmpty: isEmpty,
          shouldScramble: shouldScramble,
          intervalId: null
        });
      }
    }

    const activateBlock = (block, additionalLifetime = 0) => {
      block.el.style.opacity = '1';
      block.highlightEndTime = Date.now() + config.blockLifetime + additionalLifetime;

      if (!block.isEmpty && block.shouldScramble && !block.intervalId) {
        block.intervalId = setInterval(() => {
          block.el.innerText = config.symbols[Math.floor(Math.random() * config.symbols.length)];
        }, config.scrambleInterval);
      }
    };

    const handleMouseMove = (e) => {
      const rect = wrapper.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      blocksRef.current.forEach(block => {
        const dx = mouseX - block.centerX;
        const dy = mouseY - block.centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < config.detectionRadius) {
          activateBlock(block);

          // Clustering
          const neighbors = blocksRef.current.filter(b => 
            b !== block && 
            Math.abs(b.gridX - block.gridX) <= 1 && 
            Math.abs(b.gridY - block.gridY) <= 1
          );

          for (let i = 0; i < config.clusterSize; i++) {
            const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
            if (randomNeighbor) {
              activateBlock(randomNeighbor, 100);
            }
          }
        }
      });
    };

    const updateHighlights = () => {
      const now = Date.now();
      blocksRef.current.forEach(block => {
        if (block.highlightEndTime > 0 && now > block.highlightEndTime) {
          block.el.style.opacity = '0';
          if (block.intervalId) {
            clearInterval(block.intervalId);
            block.intervalId = null;
          }
          block.highlightEndTime = 0;
          if (!block.isEmpty) {
            block.el.innerText = config.symbols[Math.floor(Math.random() * config.symbols.length)];
          }
        }
      });
      requestRef.current = requestAnimationFrame(updateHighlights);
    };

    wrapper.addEventListener('mousemove', handleMouseMove);
    requestRef.current = requestAnimationFrame(updateHighlights);

    return () => {
      wrapper.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(requestRef.current);
      blocksRef.current.forEach(b => {
        if (b.intervalId) clearInterval(b.intervalId);
      });
    };
  }, [animate, config]);

  return (
    <section className="relative w-full h-screen bg-black flex flex-col items-center justify-center p-8">
      <style>{`
        :root {
          --accent-color: var(--primary-color, #00ffcc);
          --text-color: var(--secondary-color, #ffffff);
        }
      `}</style>

      <div className="relative group overflow-hidden shadow-2xl bg-zinc-900 w-full max-w-[800px] aspect-[4/5] md:aspect-square" ref={containerRef}>
        <img src={image} alt="Hero" className="w-full h-full object-cover filter brightness-75 transition-transform duration-700 group-hover:scale-105" />
        <div ref={overlayRef} className="grid-overlay absolute inset-0 pointer-events-none z-10"></div>
        
        {/* UI Overlays */}
        <div className="absolute top-6 left-6 z-20 font-mono text-[10px] text-[--accent-color] uppercase tracking-widest bg-black/50 p-2 backdrop-blur-sm">
           <div className="flex items-center gap-2">
             <span className="w-2 h-2 bg-[--accent-color] animate-pulse"></span>
             <span contentEditable={editMode} suppressContentEditableWarning={true}>{title}</span>
           </div>
        </div>

        <div className="absolute bottom-6 right-6 z-20 font-mono text-[10px] text-white/50 uppercase tracking-[0.3em] bg-black/50 p-2 backdrop-blur-sm">
           <span contentEditable={editMode} suppressContentEditableWarning={true}>{subtitle}</span>
        </div>
      </div>

      <div className="mt-8 text-center max-w-xl">
         <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-4" contentEditable={editMode} suppressContentEditableWarning={true}>
           Surgical Precision.
         </h1>
         <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
           System Status: <span className="text-[--accent-color]">Operational</span> // Mode: Interaction
         </p>
      </div>
    </section>
  );
};

export default TerminalScrambleHero;
