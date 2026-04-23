import React from 'react';
import { useProject } from '../../context/ProjectContext';

const GalleryBlock = ({ id, props, editMode }) => {
  const { selectedBlockId, setSelectedBlockId } = useProject();
  const isSelected = selectedBlockId === id;

  const defaultImages = [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80'
  ];

  const images = props.images || defaultImages;

  return (
    <section 
      onClick={() => editMode && setSelectedBlockId(id)}
      className={`py-20 px-8 transition-all cursor-pointer ${isSelected ? 'ring-2 ring-[#5b76fe] ring-inset' : ''}`}
      style={{ backgroundColor: 'var(--bg-color)' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
          {images.map((src, i) => (
            <div 
              key={i} 
              className="relative rounded-3xl overflow-hidden shadow-sm border border-[#e9eaef] transition-all hover:shadow-xl hover:-translate-y-1 group"
              style={{ borderRadius: 'calc(var(--border-radius) * 2)' }}
            >
              <img src={src} alt={`Gallery ${i}`} className="w-full h-auto block" />
              <div className="absolute inset-0 bg-[#5b76fe]/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GalleryBlock;
