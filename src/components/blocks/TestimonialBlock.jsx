import React from 'react';
import { useProject } from '../../context/ProjectContext';

const TestimonialBlock = ({ id, props, editMode }) => {
  const { updateBlockProps, selectedBlockId, setSelectedBlockId } = useProject();
  const isSelected = selectedBlockId === id;

  const handleBlur = (index, key, e) => {
    const newItems = [...(props.items || [])];
    newItems[index] = { ...newItems[index], [key]: e.target.innerText };
    updateBlockProps(id, { items: newItems });
  };

  const defaultItems = [
    { name: 'Alex River', role: 'Founder @ TechFlow', text: 'This builder completely changed how we prototype our landing pages. The Miro style is exactly what we needed.', avatar: 'AR' },
    { name: 'Sarah Chen', role: 'Design Lead', text: 'Clean, fast, and local storage powered. It is the perfect jugaad tool for rapid design iterations.', avatar: 'SC' }
  ];

  const items = props.items || defaultItems;

  return (
    <section 
      onClick={() => editMode && setSelectedBlockId(id)}
      className={`py-20 px-8 transition-all cursor-pointer ${isSelected ? 'ring-2 ring-[#5b76fe] ring-inset' : ''}`}
      style={{ backgroundColor: 'var(--bg-color)' }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {items.map((item, i) => (
          <div 
            key={i} 
            className="p-8 rounded-3xl bg-white border border-[#c7cad5] shadow-[0_0_0_1px_rgb(224,226,232)] flex flex-col gap-6 relative"
          >
            <p 
              contentEditable={editMode}
              onBlur={(e) => handleBlur(i, 'text', e)}
              className="text-lg leading-relaxed opacity-80 outline-none"
              style={{ color: 'var(--text-color)' }}
              suppressContentEditableWarning
            >
              "{item.text}"
            </p>
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-sm"
                style={{ backgroundColor: 'var(--primary-color)' }}
              >
                {item.avatar}
              </div>
              <div>
                <h4 
                  contentEditable={editMode}
                  onBlur={(e) => handleBlur(i, 'name', e)}
                  className="font-bold outline-none"
                  style={{ color: 'var(--text-color)' }}
                  suppressContentEditableWarning
                >
                  {item.name}
                </h4>
                <p 
                  contentEditable={editMode}
                  onBlur={(e) => handleBlur(i, 'role', e)}
                  className="text-sm opacity-50 outline-none"
                  style={{ color: 'var(--text-color)' }}
                  suppressContentEditableWarning
                >
                  {item.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialBlock;
