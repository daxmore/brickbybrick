import React from 'react';
import { useProject } from '../../context/ProjectContext';

const StatsBlock = ({ id, props, editMode }) => {
  const { updateBlockProps, selectedBlockId, setSelectedBlockId } = useProject();
  const isSelected = selectedBlockId === id;

  const defaultItems = [
    { value: '10k+', label: 'Happy Customers' },
    { value: '24/7', label: 'Support Available' },
    { value: '99%', label: 'Uptime Guarantee' },
    { value: '150+', label: 'Global Partners' }
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
      className={`py-[var(--section-padding)] px-8 transition-all cursor-pointer ${isSelected ? 'ring-2 ring-[#5b76fe] ring-inset' : ''}`}
      style={{ backgroundColor: 'var(--bg-color)' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[var(--content-gap)]">
          {items.map((item, i) => (
            <div key={i} className="text-center">
              <h3 
                contentEditable={editMode}
                onBlur={(e) => handleBlur(i, 'value', e)}
                className="text-4xl md:text-5xl font-black mb-2 outline-none"
                style={{ color: 'var(--primary-color)' }}
                suppressContentEditableWarning
              >
                {item.value}
              </h3>
              <p 
                contentEditable={editMode}
                onBlur={(e) => handleBlur(i, 'label', e)}
                className="text-sm font-bold opacity-60 uppercase tracking-widest outline-none"
                style={{ color: 'var(--text-color)' }}
                suppressContentEditableWarning
              >
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBlock;
