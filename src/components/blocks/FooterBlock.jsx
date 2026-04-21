import React from 'react';
import { useProject } from '../../context/ProjectContext';

const FooterBlock = ({ id, props, editMode }) => {
  const { updateBlockProps, selectedBlockId, setSelectedBlockId } = useProject();
  const isSelected = selectedBlockId === id;

  const handleBlur = (key, e) => {
    updateBlockProps(id, { [key]: e.target.innerText });
  };

  return (
    <footer 
      onClick={() => editMode && setSelectedBlockId(id)}
      className={`relative group py-16 px-8 transition-all cursor-pointer ${isSelected ? 'ring-2 ring-[#5b76fe] ring-inset' : ''}`}
      style={{ 
        backgroundColor: 'var(--footer-bg)',
        color: 'white'
      }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <h2 
            contentEditable={editMode}
            onBlur={(e) => handleBlur('brandName', e)}
            className="text-2xl font-bold mb-4 outline-none"
            suppressContentEditableWarning
          >
            {props.brandName || 'Chameleon Builder'}
          </h2>
          <p 
            contentEditable={editMode}
            onBlur={(e) => handleBlur('brandTagline', e)}
            className="opacity-60 max-w-sm outline-none"
            suppressContentEditableWarning
          >
            {props.brandTagline || "The world's first frontend-only, Jugaad-powered landing page builder. Simple, fast, and Miro-inspired."}
          </p>
        </div>

        <div>
          <h4 className="font-bold mb-6">Product</h4>
          <ul className="space-y-4 opacity-60">
            <li>Features</li>
            <li>Integrations</li>
            <li>Templates</li>
            <li>Solutions</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6">Company</h4>
          <ul className="space-y-4 opacity-60">
            <li>About Us</li>
            <li>Careers</li>
            <li>Contact</li>
            <li>Privacy</li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-white/10 flex justify-between items-center opacity-40 text-sm">
        <p 
          contentEditable={editMode}
          onBlur={(e) => handleBlur('copyright', e)}
          className="outline-none"
          suppressContentEditableWarning
        >
          {props.copyright || '© 2026 Chameleon Inc. All rights reserved.'}
        </p>
        <div className="flex gap-6">
          <span>Twitter</span>
          <span>LinkedIn</span>
          <span>GitHub</span>
        </div>
      </div>
    </footer>
  );
};

export default FooterBlock;
