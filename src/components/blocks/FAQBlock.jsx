import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { ChevronDown } from 'lucide-react';

const FAQItem = ({ item, i, editMode, onBlur, isExpanded, onToggle }) => {
  return (
    <div className="border-b border-[#e9eaef] last:border-0">
      <button 
        onClick={onToggle}
        className="w-full py-6 flex justify-between items-center text-left hover:text-[#5b76fe] transition-colors group"
      >
        <h4 
          contentEditable={editMode}
          onBlur={(e) => onBlur(i, 'q', e)}
          onClick={(e) => editMode && e.stopPropagation()}
          className="text-lg font-bold outline-none pr-8"
          suppressContentEditableWarning
        >
          {item.q}
        </h4>
        <ChevronDown 
          className={`shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-[#5b76fe]' : 'text-slate-400'}`} 
          size={20} 
        />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 pb-6' : 'max-h-0'}`}>
        <p 
          contentEditable={editMode}
          onBlur={(e) => onBlur(i, 'a', e)}
          className="opacity-70 leading-relaxed outline-none"
          suppressContentEditableWarning
        >
          {item.a}
        </p>
      </div>
    </div>
  );
};

const FAQBlock = ({ id, props, editMode }) => {
  const { updateBlockProps, selectedBlockId, setSelectedBlockId } = useProject();
  const [expandedIndex, setExpandedIndex] = useState(0);
  const isSelected = selectedBlockId === id;

  const handleBlur = (index, key, e) => {
    const newItems = [...(props.items || [])];
    newItems[index] = { ...newItems[index], [key]: e.target.innerText };
    updateBlockProps(id, { items: newItems });
  };

  const defaultItems = [
    { q: 'How does the builder work?', a: 'Everything is saved in your browser\'s local storage. No backend required.' },
    { q: 'Can I export my project?', a: 'Yes! You can export as JSON for editing later or as a standalone HTML file for hosting.' },
    { q: 'What about local fonts?', a: 'We use the modern Local Font Access API to let you use any font installed on your system.' }
  ];

  const items = props.items || defaultItems;

  return (
    <section 
      onClick={() => editMode && setSelectedBlockId(id)}
      className={`py-20 px-8 transition-all cursor-pointer ${isSelected ? 'ring-2 ring-[#5b76fe] ring-inset' : ''}`}
      style={{ backgroundColor: 'var(--bg-color)' }}
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-black text-center mb-12" style={{ color: 'var(--text-color)' }}>Frequently Asked Questions</h2>
        <div className="bg-white rounded-3xl border border-[#c7cad5] p-4 md:p-10 shadow-sm">
          {items.map((item, i) => (
            <FAQItem 
              key={i}
              i={i}
              item={item}
              editMode={editMode}
              onBlur={handleBlur}
              isExpanded={expandedIndex === i}
              onToggle={() => setExpandedIndex(expandedIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQBlock;
