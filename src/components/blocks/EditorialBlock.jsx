import React from 'react';
import { useProject } from '../../context/ProjectContext';

const EditorialBlock = ({ id, props, editMode }) => {
  const { updateBlockProps, selectedBlockId, setSelectedBlockId } = useProject();
  const isSelected = selectedBlockId === id;

  return (
    <section 
      onClick={() => editMode && setSelectedBlockId(id)}
      className={`py-[var(--section-padding)] px-8 transition-all cursor-pointer ${isSelected ? 'ring-2 ring-[#5b76fe] ring-inset' : ''}`}
      style={{ backgroundColor: 'var(--bg-color)' }}
    >
      <div className="max-w-3xl mx-auto">
        <h2 
          contentEditable={editMode}
          onBlur={(e) => updateBlockProps(id, { title: e.target.innerText })}
          className="text-3xl md:text-5xl font-black mb-10 leading-tight outline-none"
          style={{ color: 'var(--text-color)' }}
          suppressContentEditableWarning
        >
          {props.title || 'Our commitment to excellence in digital design.'}
        </h2>
        
        <div 
          contentEditable={editMode}
          onBlur={(e) => updateBlockProps(id, { content: e.target.innerText })}
          className="text-lg md:text-xl opacity-70 leading-relaxed space-y-6 outline-none"
          style={{ color: 'var(--text-color)' }}
          suppressContentEditableWarning
        >
          {props.content || 'We believe that great design is not just about how things look, but how they work. Our team of experts is dedicated to pushing the boundaries of what is possible on the web, creating experiences that are both beautiful and functional.'}
        </div>
      </div>
    </section>
  );
};

export default EditorialBlock;
