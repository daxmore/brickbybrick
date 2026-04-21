import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { Zap, Shield, Smartphone, Globe, Heart, Clock } from 'lucide-react';

const icons = { Zap, Shield, Smartphone, Globe, Heart, Clock };

const FeatureGridBlock = ({ id, props, editMode }) => {
  const { updateBlockProps, selectedBlockId, setSelectedBlockId } = useProject();
  const isSelected = selectedBlockId === id;

  const handleBlur = (index, key, e) => {
    const newItems = [...(props.items || [])];
    newItems[index] = { ...newItems[index], [key]: e.target.innerText };
    updateBlockProps(id, { items: newItems });
  };

  const defaultItems = [
    { icon: 'Zap', title: 'Fast Integration', desc: 'Deploy your projects in record time with our optimized workflow.' },
    { icon: 'Shield', title: 'Secure by Default', desc: 'Enterprise-grade security built into every layer of our platform.' },
    { icon: 'Smartphone', title: 'Mobile First', desc: 'Your designs look beautiful on every screen size automatically.' }
  ];

  const items = props.items || defaultItems;

  return (
    <section 
      onClick={() => editMode && setSelectedBlockId(id)}
      className={`py-20 px-8 transition-all cursor-pointer ${isSelected ? 'ring-2 ring-[#5b76fe] ring-inset' : ''}`}
      style={{ backgroundColor: 'var(--bg-color)' }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {items.map((item, i) => {
          const IconComp = icons[item.icon] || Zap;
          return (
            <div key={i} className="flex flex-col items-start">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-sm"
                style={{ backgroundColor: 'var(--accent-color)', color: 'var(--primary-color)' }}
              >
                <IconComp size={24} />
              </div>
              <h3 
                contentEditable={editMode}
                onBlur={(e) => handleBlur(i, 'title', e)}
                className="text-xl font-bold mb-4 outline-none"
                style={{ color: 'var(--text-color)' }}
                suppressContentEditableWarning
              >
                {item.title}
              </h3>
              <p 
                contentEditable={editMode}
                onBlur={(e) => handleBlur(i, 'desc', e)}
                className="opacity-70 leading-relaxed outline-none"
                style={{ color: 'var(--text-color)' }}
                suppressContentEditableWarning
              >
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeatureGridBlock;
