import React from 'react';
import { useProject } from '../../context/ProjectContext';

const NavbarBlock = ({ id, props, editMode }) => {
  const { updateBlockProps, selectedBlockId, setSelectedBlockId } = useProject();
  const isSelected = selectedBlockId === id;

  const handleBlur = (key, e) => {
    updateBlockProps(id, { [key]: e.target.innerText });
  };

  return (
    <nav 
      onClick={() => editMode && setSelectedBlockId(id)}
      className={`py-4 px-8 flex justify-between items-center relative group transition-all cursor-pointer ${isSelected ? 'ring-2 ring-[#5b76fe] ring-inset' : ''}`}
      style={{ backgroundColor: 'var(--nav-bg)' }}
    >
      <div 
        contentEditable={editMode}
        onBlur={(e) => handleBlur('logo', e)}
        className="text-xl font-bold outline-none" 
        style={{ color: 'var(--text-color)' }}
        suppressContentEditableWarning
      >
        {props.logo || 'Logo'}
      </div>

      <div className="hidden md:flex gap-8">
        {(props.links || ['Product', 'Solutions', 'Pricing', 'Resources']).map((link, i) => (
          <a 
            key={i} 
            href="#" 
            className="font-medium hover:opacity-70 transition-opacity"
            style={{ color: 'var(--text-color)' }}
          >
            {link}
          </a>
        ))}
      </div>

      <div className="flex gap-4 items-center">
        <button 
          className="px-6 py-2 font-bold transition-all"
          style={{ 
            backgroundColor: 'var(--primary-color)', 
            color: 'white',
            borderRadius: 'var(--border-radius)'
          }}
        >
          {props.ctaText || 'Sign Up'}
        </button>
      </div>
    </nav>
  );
};

export default NavbarBlock;
