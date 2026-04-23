import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform } from 'framer-motion';
import { useProject } from '../../context/ProjectContext';
import { ExternalLink, ArrowRight } from 'lucide-react';

const InteractiveCaseStudyBlock = ({ id, props, editMode }) => {
  const { updateBlockProps, selectedBlockId, setSelectedBlockId } = useProject();
  const isSelected = selectedBlockId === id;
  const containerRef = React.useRef(null);

  // eslint-disable-next-line no-unused-vars
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const defaultItems = [
    {
      title: 'Neon Odyssey',
      category: 'Digital Experience',
      desc: 'A futuristic exploration of light and sound in the heart of Tokyo.',
      image: 'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&w=1200&q=80',
      year: '2026'
    },
    {
      title: 'Monolith Design',
      category: 'Brand Identity',
      desc: 'Rebranding the worlds leading architecture firm with a minimalist edge.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      year: '2025'
    },
    {
      title: 'Fluid Systems',
      category: 'UI/UX Design',
      desc: 'Creating an adaptive interface for the next generation of mobile computing.',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      year: '2026'
    }
  ];

  const items = props.items || defaultItems;

  const handleBlur = (index, key, e) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [key]: e.target.innerText };
    updateBlockProps(id, { items: newItems });
  };

  return (
    <section 
      ref={containerRef}
      onClick={() => editMode && setSelectedBlockId(id)}
      className={`relative min-h-screen py-32 px-8 transition-all cursor-pointer overflow-hidden ${isSelected ? 'ring-2 ring-[#5b76fe] ring-inset' : ''}`}
      style={{ backgroundColor: 'var(--bg-color)' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-24">
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-xs font-black uppercase tracking-[0.3em] mb-4"
            style={{ color: 'var(--primary-color)' }}
          >
            Featured Work
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black"
            style={{ color: 'var(--text-color)' }}
          >
            Selected Cases.
          </motion.h2>
        </div>

        <div className="space-y-[30vh]">
          {items.map((item, i) => {
            const isEven = i % 2 === 0;
            return (
              <div key={i} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-24`}>
                {/* Image Section with Parallax */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="flex-1 w-full"
                >
                  <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden group shadow-2xl">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
                    
                    {/* Floating Label */}
                    <div className="absolute bottom-8 left-8">
                      <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl text-white">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Year</p>
                        <p className="text-xl font-bold">{item.year}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Text Content */}
                <div className="flex-1 max-w-xl">
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <span 
                      className="inline-block px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6"
                      style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
                    >
                      {item.category}
                    </span>
                    
                    <h3 
                      contentEditable={editMode}
                      onBlur={(e) => handleBlur(i, 'title', e)}
                      className="text-4xl md:text-5xl font-black mb-6 outline-none"
                      style={{ color: 'var(--text-color)' }}
                      suppressContentEditableWarning
                    >
                      {item.title}
                    </h3>
                    
                    <p 
                      contentEditable={editMode}
                      onBlur={(e) => handleBlur(i, 'desc', e)}
                      className="text-lg opacity-60 leading-relaxed mb-10 outline-none"
                      style={{ color: 'var(--text-color)' }}
                      suppressContentEditableWarning
                    >
                      {item.desc}
                    </p>

                    <button 
                      className="group flex items-center gap-4 text-sm font-black tracking-widest uppercase py-2"
                      style={{ color: 'var(--primary-color)' }}
                    >
                      Explore Project 
                      <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all group-hover:bg-[#5b76fe] group-hover:border-[#5b76fe] group-hover:text-white" style={{ borderColor: 'var(--primary-color)' }}>
                        <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                      </div>
                    </button>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default InteractiveCaseStudyBlock;
