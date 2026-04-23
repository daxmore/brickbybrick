import React from 'react';
import { useProject } from '../../context/ProjectContext';

const NewsletterBlock = ({ id, props, editMode }) => {
  const { updateBlockProps, selectedBlockId, setSelectedBlockId } = useProject();
  const isSelected = selectedBlockId === id;

  return (
    <section 
      onClick={() => editMode && setSelectedBlockId(id)}
      className={`py-[var(--section-padding)] px-8 transition-all cursor-pointer ${isSelected ? 'ring-2 ring-[#5b76fe] ring-inset' : ''}`}
      style={{ backgroundColor: 'var(--bg-color)' }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 
          contentEditable={editMode}
          onBlur={(e) => updateBlockProps(id, { title: e.target.innerText })}
          className="text-3xl md:text-4xl font-black mb-6 outline-none"
          style={{ color: 'var(--text-color)' }}
          suppressContentEditableWarning
        >
          {props.title || 'Join our newsletter'}
        </h2>
        <p 
          contentEditable={editMode}
          onBlur={(e) => updateBlockProps(id, { subtitle: e.target.innerText })}
          className="text-lg opacity-60 mb-10 outline-none max-w-2xl mx-auto"
          style={{ color: 'var(--text-color)' }}
          suppressContentEditableWarning
        >
          {props.subtitle || 'Get the latest updates, news and special offers delivered directly to your inbox.'}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="flex-1 px-6 py-4 rounded-xl border border-[#c7cad5] outline-none focus:ring-2 focus:ring-[#5b76fe] transition-all"
            disabled={editMode}
          />
          <button 
            className="px-8 py-4 rounded-xl font-bold text-white transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: 'var(--primary-color)' }}
          >
            {props.buttonText || 'Subscribe'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewsletterBlock;
