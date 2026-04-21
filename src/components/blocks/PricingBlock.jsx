import React from 'react';
import { useProject } from '../../context/ProjectContext';

const PricingBlock = ({ id, props, editMode }) => {
  const { updateBlockProps, selectedBlockId, setSelectedBlockId } = useProject();
  const isSelected = selectedBlockId === id;

  const handleBlur = (index, key, e) => {
    const newTiers = [...(props.tiers || [])];
    newTiers[index] = { ...newTiers[index], [key]: e.target.innerText };
    updateBlockProps(id, { tiers: newTiers });
  };

  const defaultTiers = [
    { name: 'Starter', price: '$0', features: ['1 Project', 'Basic Elements', 'Community Support'], button: 'Get Started' },
    { name: 'Pro', price: '$19', features: ['Unlimited Projects', 'Advanced Blocks', 'Priority Support'], button: 'Go Pro' },
    { name: 'Enterprise', price: '$49', features: ['Custom Branding', 'API Access', '24/7 Support'], button: 'Contact Us' }
  ];

  const tiers = props.tiers || defaultTiers;

  return (
    <section 
      onClick={() => editMode && setSelectedBlockId(id)}
      className={`py-20 px-8 transition-all cursor-pointer ${isSelected ? 'ring-2 ring-[#5b76fe] ring-inset' : ''}`}
      style={{ backgroundColor: 'var(--bg-color)' }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier, i) => (
          <div 
            key={i} 
            className={`p-8 rounded-2xl border flex flex-col items-center text-center transition-all ${i === 1 ? 'border-[#5b76fe] shadow-xl scale-105 z-10' : 'border-[#c7cad5] shadow-sm'}`}
            style={{ backgroundColor: i === 1 ? 'white' : 'transparent' }}
          >
            <h4 
              contentEditable={editMode}
              onBlur={(e) => handleBlur(i, 'name', e)}
              className="text-lg font-bold text-slate-500 uppercase tracking-widest mb-2 outline-none"
              suppressContentEditableWarning
            >
              {tier.name}
            </h4>
            <div className="flex items-baseline gap-1 mb-8">
              <span 
                contentEditable={editMode}
                onBlur={(e) => handleBlur(i, 'price', e)}
                className="text-5xl font-black outline-none"
                style={{ color: 'var(--text-color)' }}
                suppressContentEditableWarning
              >
                {tier.price}
              </span>
              <span className="text-slate-400">/mo</span>
            </div>
            
            <ul className="space-y-4 mb-10 text-slate-600 flex-1">
              {tier.features.map((f, fi) => (
                <li key={fi} className="flex items-center gap-2">
                  <svg size={16} className="text-[#00b473]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  {f}
                </li>
              ))}
            </ul>

            <button 
              className={`w-full py-3 font-bold rounded-xl transition-all ${i === 1 ? 'bg-[#5b76fe] text-white shadow-lg hover:shadow-xl' : 'border-2 border-[#5b76fe] text-[#5b76fe] hover:bg-[#5b76fe]/5'}`}
              style={i === 1 ? { borderRadius: 'var(--border-radius)' } : { borderRadius: 'var(--border-radius)' }}
            >
              {tier.button}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PricingBlock;
