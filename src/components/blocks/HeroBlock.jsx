import React from 'react';
import { useProject } from '../../context/ProjectContext';

const HeroBlock = ({ id, props, editMode }) => {
  const { updateBlockProps, selectedBlockId, setSelectedBlockId } = useProject();
  const isSelected = selectedBlockId === id;

  const handleBlur = (key, e) => {
    updateBlockProps(id, { [key]: e.target.innerText });
  };

  return (
    <section 
      onClick={() => editMode && setSelectedBlockId(id)}
      className={`relative group py-20 px-8 text-center flex flex-col items-center justify-center transition-all min-h-[60vh] cursor-pointer ${isSelected ? 'ring-2 ring-[#5b76fe] ring-inset' : ''}`}
      style={{ 
        backgroundColor: 'var(--bg-color)',
        paddingTop: 'var(--section-padding)',
        paddingBottom: 'var(--section-padding)'
      }}
    >
      <h1 
        contentEditable={editMode}
        onBlur={(e) => handleBlur('title', e)}
        className="max-w-4xl mx-auto font-bold mb-6 transition-all outline-none"
        style={{ 
          color: 'var(--text-color)',
          fontSize: 'calc(var(--font-size) * 3.5)',
          lineHeight: '1.15',
          letterSpacing: '-0.03em',
          fontFamily: 'var(--font-family)'
        }}
        suppressContentEditableWarning
      >
        {props.title || 'Build the future of visual collaboration'}
      </h1>

      <p 
        contentEditable={editMode}
        onBlur={(e) => handleBlur('subtitle', e)}
        className="max-w-2xl mx-auto text-xl mb-10 opacity-80 outline-none"
        style={{ 
          color: 'var(--text-color)',
          fontFamily: 'var(--font-family)'
        }}
        suppressContentEditableWarning
      >
        {props.subtitle || 'Create, collaborate, and centralize communication for your entire team in one scalable cross-functional platform.'}
      </p>

      {props.showCta !== false && (
        <div className="flex gap-4">
          <button 
            className="px-10 py-4 text-lg font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            style={{ 
              backgroundColor: 'var(--primary-color)', 
              color: 'white',
              borderRadius: 'var(--border-radius)'
            }}
          >
            {props.ctaText || 'Get Started'}
          </button>
        </div>
      )}
    </section>
  );
};

export default HeroBlock;
