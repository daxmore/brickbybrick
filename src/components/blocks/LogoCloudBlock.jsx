import React from 'react';
import { useProject } from '../../context/ProjectContext';

const LogoCloudBlock = ({ id, props, editMode }) => {
  const { updateBlockProps, selectedBlockId, setSelectedBlockId } = useProject();
  const isSelected = selectedBlockId === id;

  const handleBlur = (key, e) => {
    updateBlockProps(id, { [key]: e.target.innerText });
  };

  const logos = ['LOGO 1', 'LOGO 2', 'LOGO 3', 'LOGO 4', 'LOGO 5'];

  return (
    <section 
      onClick={() => editMode && setSelectedBlockId(id)}
      className={`py-12 px-8 transition-all cursor-pointer ${isSelected ? 'ring-2 ring-[#5b76fe] ring-inset' : ''}`}
      style={{ backgroundColor: 'var(--bg-color)' }}
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        <p 
          contentEditable={editMode}
          onBlur={(e) => handleBlur('title', e)}
          className="text-xs font-black text-slate-400 uppercase tracking-widest mb-10 outline-none"
          suppressContentEditableWarning
        >
          {props.title || 'TRUSTED BY INNOVATIVE TEAMS WORLDWIDE'}
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
          {logos.map((logo, i) => (
            <div key={i} className="text-xl md:text-2xl font-black italic tracking-tighter" style={{ color: 'var(--text-color)' }}>
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoCloudBlock;
