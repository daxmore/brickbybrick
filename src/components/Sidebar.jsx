import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import useLocalFonts from '../hooks/useLocalFonts';
import { Settings, Layout, Type, Palette, Download, Code, Smartphone, Tablet, Monitor, X, Plus } from 'lucide-react';

const ColorInput = ({ label, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-bold text-slate-500 mb-1">{label}</label>
    <div className="flex gap-2">
      <input 
        type="color" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 rounded border border-[#c7cad5] cursor-pointer"
      />
      <input 
        type="text" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-2 border border-[#c7cad5] rounded-md text-sm font-mono"
      />
    </div>
  </div>
);

const Sidebar = () => {
  const { 
    currentPage, 
    updateStyle, 
    savePage, 
    exportPageAsJSON, 
    navigateTo,
    selectedBlockId,
    updateBlockProps,
    addBlock
  } = useProject();

  const [activeTab, setActiveTab] = useState('styles'); // styles, block, pages
  const { fonts, requestFonts, loading } = useLocalFonts();
  const [fontSearch, setFontSearch] = useState('');

  const selectedBlock = currentPage.blocks.find(b => b.id === selectedBlockId);

  const handleStyleChange = (key, value) => {
    updateStyle(key, value);
  };

  const filteredFonts = fonts.filter(f => f.toLowerCase().includes(fontSearch.toLowerCase()));

  const generateStandaloneHTML = () => {
    // Basic implementation for now
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${currentPage.name || 'My Landing Page'}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          :root {
            --bg-color: ${currentPage.styles.bgColor};
            --primary-color: ${currentPage.styles.primaryColor};
            --text-color: ${currentPage.styles.textColor};
            --accent-color: ${currentPage.styles.accentColor};
            --border-radius: ${currentPage.styles.borderRadius};
            --font-size: ${currentPage.styles.fontSize};
            --font-family: ${currentPage.styles.fontFamily};
            --section-padding: ${currentPage.styles.sectionPadding};
            --nav-bg: ${currentPage.styles.navBg};
            --footer-bg: ${currentPage.styles.footerBg};
          }
          body { background-color: var(--bg-color); color: var(--text-color); font-family: var(--font-family); }
        </style>
      </head>
      <body>
        ${document.querySelector('.min-h-\\[80vh\\]').innerHTML}
      </body>
      </html>
    `;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    a.click();
  };

  return (
    <aside className="w-[320px] bg-white border-r border-[#c7cad5] h-screen overflow-y-auto flex flex-col sticky top-0 z-40">
      <div className="p-4 border-b border-[#e9eaef] flex justify-between items-center bg-slate-50">
        <button 
          onClick={() => navigateTo('dashboard')}
          className="text-xs font-bold text-[#5b76fe] hover:underline"
        >
          ← DASHBOARD
        </button>
        <div className="flex gap-1">
          <button 
            onClick={() => setActiveTab('styles')}
            className={`p-2 rounded ${activeTab === 'styles' ? 'bg-white shadow-sm text-[#5b76fe]' : 'text-slate-400'}`}
            title="Global Styles"
          >
            <Palette size={18} />
          </button>
          <button 
            onClick={() => setActiveTab('block')}
            className={`p-2 rounded ${activeTab === 'block' ? 'bg-white shadow-sm text-[#5b76fe]' : 'text-slate-400'}`}
            title="Block Settings"
          >
            <Settings size={18} />
          </button>
          <button 
            onClick={() => setActiveTab('add')}
            className={`p-2 rounded ${activeTab === 'add' ? 'bg-white shadow-sm text-[#5b76fe]' : 'text-slate-400'}`}
            title="Add Block"
          >
            <Layout size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'styles' && (
          <div className="p-6 animate-in fade-in slide-in-from-left-2 duration-200">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Global Styles</h3>
            
            <section className="mb-8">
              <h4 className="text-xs font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Palette size={14} className="text-[#5b76fe]" /> COLORS
              </h4>
              <ColorInput label="Background" value={currentPage.styles.bgColor} onChange={(val) => handleStyleChange('bgColor', val)} />
              <ColorInput label="Primary" value={currentPage.styles.primaryColor} onChange={(val) => handleStyleChange('primaryColor', val)} />
              <ColorInput label="Text" value={currentPage.styles.textColor} onChange={(val) => handleStyleChange('textColor', val)} />
              <ColorInput label="Navbar BG" value={currentPage.styles.navBg} onChange={(val) => handleStyleChange('navBg', val)} />
              <ColorInput label="Footer BG" value={currentPage.styles.footerBg} onChange={(val) => handleStyleChange('footerBg', val)} />
            </section>

            <section className="mb-8">
              <h4 className="text-xs font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Type size={14} className="text-[#5b76fe]" /> TYPOGRAPHY
              </h4>
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-500 mb-2">Font Family</label>
                {fonts.length === 0 ? (
                  <button 
                    onClick={requestFonts}
                    className="w-full py-2 bg-slate-100 text-slate-600 text-sm font-bold rounded-lg hover:bg-slate-200 transition-colors"
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Load System Fonts'}
                  </button>
                ) : (
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      placeholder="Search fonts..." 
                      value={fontSearch}
                      onChange={(e) => setFontSearch(e.target.value)}
                      className="w-full p-2 border border-[#c7cad5] rounded-md text-sm outline-none focus:ring-1 focus:ring-[#5b76fe]"
                    />
                    <div className="max-h-40 overflow-y-auto border border-[#c7cad5] rounded-md divide-y divide-[#e9eaef]">
                      {filteredFonts.map(font => (
                        <button 
                          key={font}
                          onClick={() => handleStyleChange('fontFamily', font)}
                          className={`w-full text-left p-2 text-sm hover:bg-slate-50 transition-colors ${currentPage.styles.fontFamily === font ? 'bg-[#5b76fe]/5 text-[#5b76fe] font-bold' : ''}`}
                          style={{ fontFamily: font }}
                        >
                          {font}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold text-slate-500 mb-1">Font Weight</label>
                <select 
                  value={currentPage.styles.fontWeight || '400'} 
                  onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                  className="w-full p-2 border border-[#c7cad5] rounded-md text-sm"
                >
                  <option value="300">Light</option>
                  <option value="400">Regular</option>
                  <option value="500">Medium</option>
                  <option value="600">Semi-Bold</option>
                  <option value="700">Bold</option>
                  <option value="900">Black</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold text-slate-500 mb-1">Base Font Size</label>
                <input 
                  type="range" min="12" max="24" 
                  value={parseInt(currentPage.styles.fontSize)} 
                  onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`)}
                  className="w-full accent-[#5b76fe]"
                />
                <div className="text-right text-xs font-bold text-slate-400">{currentPage.styles.fontSize}</div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'block' && (
          <div className="p-6 animate-in fade-in slide-in-from-right-2 duration-200">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Block Settings</h3>
            {selectedBlock ? (
              <div className="space-y-6">
                <div className="p-3 bg-slate-50 rounded-lg border border-[#e9eaef]">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter mb-1">Type</p>
                  <p className="text-sm font-bold text-slate-800 capitalize">{selectedBlock.type}</p>
                </div>

                {selectedBlock.type === 'hero' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-500 mb-1">CTA Text</label>
                      <input 
                        type="text" 
                        value={selectedBlock.props.ctaText || ''} 
                        onChange={(e) => updateBlockProps(selectedBlock.id, { ctaText: e.target.value })}
                        className="w-full p-2 border border-[#c7cad5] rounded-md text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={selectedBlock.props.showCta !== false} 
                        onChange={(e) => updateBlockProps(selectedBlock.id, { showCta: e.target.checked })}
                        className="w-4 h-4 accent-[#5b76fe]"
                      />
                      <label className="text-sm font-bold text-slate-500">Show CTA Button</label>
                    </div>
                  </div>
                )}

                {selectedBlock.type === 'navbar' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-500 mb-1">CTA Button Text</label>
                      <input 
                        type="text" 
                        value={selectedBlock.props.ctaText || ''} 
                        onChange={(e) => updateBlockProps(selectedBlock.id, { ctaText: e.target.value })}
                        className="w-full p-2 border border-[#c7cad5] rounded-md text-sm"
                      />
                    </div>
                  </div>
                )}

                <p className="text-xs text-slate-400 italic mt-8">
                  Tip: You can edit text directly on the canvas!
                </p>
              </div>
            ) : (
              <div className="text-center py-20 opacity-30">
                <Layout size={40} className="mx-auto mb-4" />
                <p className="text-sm font-bold">Select a block to edit its properties</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'add' && (
          <div className="p-6 animate-in fade-in slide-in-from-top-2 duration-200">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Add Section</h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                { type: 'hero', label: 'Hero Header', icon: <Monitor size={16} /> },
                { type: 'features', label: 'Feature Grid', icon: <Smartphone size={16} /> },
                { type: 'testimonials', label: 'Testimonials', icon: <X size={16} /> },
                { type: 'pricing', label: 'Pricing Table', icon: <Code size={16} /> },
                { type: 'faq', label: 'FAQ Accordion', icon: <Plus size={16} /> },
                { type: 'logos', label: 'Logo Cloud', icon: <Layout size={16} /> },
                { type: 'contact', label: 'Contact Form', icon: <X size={16} /> },
                { type: 'navbar', label: 'Navigation', icon: <Layout size={16} /> },
                { type: 'footer', label: 'Footer Section', icon: <Layout size={16} /> },
              ].map(block => (
                <button 
                  key={block.type}
                  onClick={() => addBlock(block.type)}
                  className="w-full p-4 border border-[#c7cad5] rounded-xl hover:border-[#5b76fe] hover:bg-[#5b76fe]/5 text-left transition-all group flex items-start gap-4"
                >
                  <div className="mt-1 p-2 rounded-lg bg-slate-100 group-hover:bg-[#5b76fe] group-hover:text-white transition-colors">
                    {block.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold capitalize text-slate-800 group-hover:text-[#5b76fe]">{block.label}</p>
                    <p className="text-xs text-slate-400">Add a {block.type} section</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-slate-50 border-t border-[#c7cad5] space-y-3">
        <button 
          onClick={savePage}
          className="w-full py-3 bg-[#00b473] text-white font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
        >
          <Download size={18} /> Save Project
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={generateStandaloneHTML}
            className="py-2.5 bg-slate-800 text-white text-xs font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Code size={14} /> EXPORT HTML
          </button>
          <button 
            onClick={exportPageAsJSON}
            className="py-2.5 bg-[#5b76fe] text-white text-xs font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Download size={14} /> EXPORT JSON
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
