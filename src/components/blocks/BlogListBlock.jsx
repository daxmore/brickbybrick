import React from 'react';
import { motion } from 'framer-motion';
import { useProject } from '../../context/ProjectContext';
import { ArrowRight, Calendar, User } from 'lucide-react';

const BlogListBlock = ({ id, props, editMode }) => {
  const { updateBlockProps, selectedBlockId, setSelectedBlockId } = useProject();
  const isSelected = selectedBlockId === id;

  const defaultItems = [
    {
      title: 'The Future of Visual Web Building',
      excerpt: 'Exploring how AI and low-code tools are reshaping the digital landscape in 2026.',
      author: 'Alex River',
      date: 'April 12, 2026',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
      category: 'Innovation'
    },
    {
      title: 'Design Systems That Scale',
      excerpt: 'A deep dive into creating robust, flexible design tokens for enterprise applications.',
      author: 'Sarah Chen',
      date: 'April 15, 2026',
      image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800&q=80',
      category: 'Design'
    },
    {
      title: 'Mastering Framer Motion',
      excerpt: 'Learn the secrets of high-performance web animations and micro-interactions.',
      author: 'Marcus Wright',
      date: 'April 18, 2026',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      category: 'Development'
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
      onClick={() => editMode && setSelectedBlockId(id)}
      className={`py-24 px-8 transition-all cursor-pointer ${isSelected ? 'ring-2 ring-[#5b76fe] ring-inset' : ''}`}
      style={{ backgroundColor: 'var(--bg-color)' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black mb-6"
              style={{ color: 'var(--text-color)' }}
              contentEditable={editMode}
              onBlur={(e) => updateBlockProps(id, { title: e.target.innerText })}
              suppressContentEditableWarning
            >
              {props.title || 'Latest Insights'}
            </motion.h2>
            <p 
              className="text-lg opacity-70 max-w-xl"
              style={{ color: 'var(--text-color)' }}
              contentEditable={editMode}
              onBlur={(e) => updateBlockProps(id, { subtitle: e.target.innerText })}
              suppressContentEditableWarning
            >
              {props.subtitle || 'Stay updated with the latest trends and techniques in the ever-evolving world of digital creation.'}
            </p>
          </div>
          <button 
            className="px-6 py-3 rounded-full font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
          >
            View All Posts <ArrowRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((post, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group flex flex-col h-full bg-white rounded-[2rem] overflow-hidden border border-[#e9eaef] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span 
                    className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm"
                    style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
                  >
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-4 mb-4 text-xs font-bold opacity-50">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} /> {post.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <User size={14} /> {post.author}
                  </div>
                </div>

                <h3 
                  contentEditable={editMode}
                  onBlur={(e) => handleBlur(i, 'title', e)}
                  className="text-xl font-bold mb-4 group-hover:text-[#5b76fe] transition-colors outline-none line-clamp-2"
                  style={{ color: 'var(--text-color)' }}
                  suppressContentEditableWarning
                >
                  {post.title}
                </h3>

                <p 
                  contentEditable={editMode}
                  onBlur={(e) => handleBlur(i, 'excerpt', e)}
                  className="text-sm opacity-60 leading-relaxed mb-8 outline-none line-clamp-3"
                  style={{ color: 'var(--text-color)' }}
                  suppressContentEditableWarning
                >
                  {post.excerpt}
                </p>

                <div className="mt-auto pt-6 border-t border-[#f1f2f6] flex justify-between items-center">
                  <button className="text-sm font-black flex items-center gap-2 group/btn">
                    READ MORE 
                    <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogListBlock;
