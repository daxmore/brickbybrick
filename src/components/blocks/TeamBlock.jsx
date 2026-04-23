import React from 'react';
import { useProject } from '../../context/ProjectContext';

const TeamBlock = ({ id, props, editMode }) => {
  const { updateBlockProps, selectedBlockId, setSelectedBlockId } = useProject();
  const isSelected = selectedBlockId === id;

  const handleBlur = (index, key, e) => {
    const newItems = [...(props.items || [])];
    newItems[index] = { ...newItems[index], [key]: e.target.innerText };
    updateBlockProps(id, { items: newItems });
  };

  const defaultItems = [
    { name: 'John Doe', role: 'CEO & Founder', image: '', bio: 'Visionary leader with 10+ years experience.' },
    { name: 'Jane Smith', role: 'Head of Design', image: '', bio: 'Award winning designer obsessed with details.' },
    { name: 'Mike Johnson', role: 'CTO', image: '', bio: 'Tech enthusiast and open source contributor.' }
  ];

  const items = props.items || defaultItems;

  return (
    <section 
      onClick={() => editMode && setSelectedBlockId(id)}
      className={`py-20 px-8 transition-all cursor-pointer ${isSelected ? 'ring-2 ring-[#5b76fe] ring-inset' : ''}`}
      style={{ backgroundColor: 'var(--bg-color)' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl font-bold mb-4 outline-none"
            style={{ color: 'var(--text-color)', fontFamily: 'var(--font-family)' }}
          >
            Meet Our Team
          </h2>
          <p className="opacity-60 max-w-2xl mx-auto">
            We are a group of passionate individuals dedicated to building the best products.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {items.map((item, i) => (
            <div key={i} className="group">
              <div 
                className="aspect-square rounded-3xl bg-slate-100 overflow-hidden mb-6 shadow-sm border border-[#e9eaef] transition-transform group-hover:-translate-y-2"
                style={{ borderRadius: 'calc(var(--border-radius) * 2)' }}
              >
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400 text-4xl font-black">
                    {item.name.charAt(0)}
                  </div>
                )}
              </div>
              <h3 
                contentEditable={editMode}
                onBlur={(e) => handleBlur(i, 'name', e)}
                className="text-xl font-bold mb-1 outline-none"
                style={{ color: 'var(--text-color)', fontFamily: 'var(--font-family)' }}
                suppressContentEditableWarning
              >
                {item.name}
              </h3>
              <p 
                contentEditable={editMode}
                onBlur={(e) => handleBlur(i, 'role', e)}
                className="text-[#5b76fe] font-bold text-sm mb-3 outline-none"
                suppressContentEditableWarning
              >
                {item.role}
              </p>
              <p 
                contentEditable={editMode}
                onBlur={(e) => handleBlur(i, 'bio', e)}
                className="text-sm opacity-60 leading-relaxed outline-none"
                style={{ color: 'var(--text-color)' }}
                suppressContentEditableWarning
              >
                {item.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamBlock;
