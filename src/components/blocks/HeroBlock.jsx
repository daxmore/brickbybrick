import React from 'react';
import { useProject } from '../../context/ProjectContext';

const StandardHero = ({ id, props, editMode }) => {
  const { updateBlockProps, selectedBlockId, setSelectedBlockId } = useProject();
  const isSelected = selectedBlockId === id;

  const handleBlur = (key, e) => {
    updateBlockProps(id, { [key]: e.target.innerText });
  };

  const layout = props.layout || 'centered'; // centered or split

  return (
    <section 
      onClick={() => editMode && setSelectedBlockId(id)}
      className={`relative group py-20 px-8 transition-all min-h-[70vh] cursor-pointer flex items-center justify-center ${isSelected ? 'ring-2 ring-[#5b76fe] ring-inset' : ''}`}
      style={{ 
        backgroundColor: 'var(--bg-color)',
        paddingTop: 'var(--section-padding)',
        paddingBottom: 'var(--section-padding)'
      }}
    >
      <div className={`max-w-7xl mx-auto w-full flex flex-col ${layout === 'split' ? 'lg:flex-row lg:items-center gap-16' : 'items-center text-center'}`}>
        <div className={layout === 'split' ? 'lg:w-1/2' : 'w-full'}>
          <h1 
            contentEditable={editMode}
            onBlur={(e) => handleBlur('title', e)}
            className="font-bold mb-6 transition-all outline-none"
            style={{ 
              color: 'var(--text-color)',
              fontSize: 'calc(var(--font-size) * 3.5)',
              lineHeight: '1.1',
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
            className="text-xl mb-10 opacity-80 outline-none leading-relaxed"
            style={{ 
              color: 'var(--text-color)',
              fontFamily: 'var(--font-family)'
            }}
            suppressContentEditableWarning
          >
            {props.subtitle || 'Create, collaborate, and centralize communication for your entire team in one scalable cross-functional platform.'}
          </p>

          {props.showCta !== false && (
            <div className={`flex gap-4 ${layout === 'centered' ? 'justify-center' : ''}`}>
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
        </div>

        {(layout === 'split' || props.image) && (
          <div className={`${layout === 'split' ? 'lg:w-1/2 w-full' : 'w-full mt-16 max-w-4xl'}`}>
            <div 
              className="relative rounded-2xl overflow-hidden shadow-2xl bg-slate-100 aspect-video group/img"
              style={{ borderRadius: 'calc(var(--border-radius) * 2)' }}
            >
              {props.image ? (
                <img src={props.image} alt="Hero" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                  <div className="text-center">
                    <div className="text-4xl font-black mb-2 opacity-20">IMAGE</div>
                    <p className="text-sm font-bold opacity-40">Paste image URL in settings</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const HeroBlock = (blockProps) => {
  return <StandardHero {...blockProps} />;
};

export default HeroBlock;
