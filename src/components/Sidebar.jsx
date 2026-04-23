import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import useLocalFonts from '../hooks/useLocalFonts';
import { Reorder } from 'framer-motion';
import UnsplashModal from './UnsplashModal';
import IconPickerModal, { ICON_LIST } from './IconPickerModal';
import { Settings, Layout, Type, Palette, Download, Code, Smartphone, Tablet, Monitor, X, Plus, Menu, ArrowDown, Image, MessageSquare, HelpCircle, Users, Upload, Check, Layers, GripVertical, Trash2, Search, BookOpen, Briefcase } from 'lucide-react';


const IconInput = ({ label, value, onPickClick }) => {
  const Icon = ICON_LIST[value] || ICON_LIST['Zap'];
  return (
    <div className="mb-4">
      <label className="block text-sm font-bold text-slate-500 mb-1">{label}</label>
      <button 
        onClick={onPickClick}
        className="w-full flex items-center gap-3 p-3 border border-[#c7cad5] rounded-xl hover:border-[#5b76fe] hover:bg-[#5b76fe]/5 transition-all text-left"
      >
        <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-[#5b76fe]/10 group-hover:text-[#5b76fe]">
          <Icon size={20} />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-bold text-slate-800">{value || 'Zap'}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Click to change icon</p>
        </div>
      </button>
    </div>
  );
};

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

const ImageInput = ({ label, value, onChange, onSearchClick }) => (
  <div className="mb-4">
    <label className="block text-sm font-bold text-slate-500 mb-1">{label}</label>
    <div className="space-y-2">
      <div className="flex gap-2">
        <input 
          type="text" 
          value={value || ''} 
          placeholder="https://images.unsplash.com/..."
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-[#c7cad5] rounded-md text-sm truncate"
        />
        <button 
          onClick={onSearchClick}
          className="p-2 border border-[#c7cad5] rounded-md hover:bg-[#5b76fe]/10 hover:text-[#5b76fe] transition-colors"
          title="Search Unsplash"
        >
          <Search size={16} />
        </button>
        <button 
          onClick={() => onChange('')}
          className="p-2 border border-[#c7cad5] rounded-md hover:bg-red-50 hover:text-red-500 transition-colors"
          title="Clear image"
        >
          <X size={16} />
        </button>
      </div>
      {value && (
        <div className="relative aspect-video rounded-lg overflow-hidden border border-[#c7cad5] bg-slate-50">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  </div>
);

const Sidebar = () => {
  const { 
    currentPage, 
    updateStyle, 
    savePage, 
    exportPageAsJSON, 
    importPageFromJSON,
    navigateTo,
    selectedBlockId,
    setSelectedBlockId,
    updateBlockProps,
    addBlock,
    deleteBlock,
    setBlocks
  } = useProject();

  const [activeTab, setActiveTab] = useState('styles'); // styles, block, add, layers
  const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, saved
  const { fonts, requestFonts, loading } = useLocalFonts();
  const [fontSearch, setFontSearch] = useState('');
  const fileInputRef = React.useRef(null);

  // Typography Presets
  const typographyPresets = [
    { name: 'Modern Sans', family: "'Inter', sans-serif", weight: '400' },
    { name: 'Classic Serif', family: "'Georgia', serif", weight: '400' },
    { name: 'Techno Grotesk', family: "'Space Grotesk', sans-serif", weight: '600' },
    { name: 'Soft Rounded', family: "'Quicksand', sans-serif", weight: '500' },
    { name: 'Editorial Luxe', family: "'Playfair Display', serif", weight: '400' }
  ];

  // Unsplash State
  const [isUnsplashOpen, setIsUnsplashOpen] = useState(false);
  const [unsplashCallback, setUnsplashCallback] = useState(null);

  const openUnsplash = (callback) => {
    setUnsplashCallback(() => callback);
    setIsUnsplashOpen(true);
  };

  const handleUnsplashSelect = (url) => {
    if (unsplashCallback) unsplashCallback(url);
    setIsUnsplashOpen(false);
  };

  // Icon State
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [iconCallback, setIconCallback] = useState(null);

  const openIconPicker = (callback) => {
    setIconCallback(() => callback);
    setIsIconPickerOpen(true);
  };

  const handleIconSelect = (iconName) => {
    if (iconCallback) iconCallback(iconName);
    setIsIconPickerOpen(false);
  };

  const selectedBlock = currentPage.blocks.find(b => b.id === selectedBlockId);

  const handleStyleChange = (key, value) => {
    updateStyle(key, value);
  };

  const handleSave = () => {
    setSaveStatus('saving');
    savePage();
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      importPageFromJSON(file);
    }
  };

  const filteredFonts = fonts.filter(f => f.toLowerCase().includes(fontSearch.toLowerCase()));

  const generateStandaloneHTML = () => {
    // If not in preview mode, we might want to warn or temporarily hide UI
    // For now, we'll try to find the container accurately
    const canvasElement = document.querySelector('.min-h-\\[85vh\\]');
    if (!canvasElement) {
      alert("Canvas element not found. Please try again.");
      return;
    }

    // Clone it to manipulate without affecting live UI
    const clone = canvasElement.cloneNode(true);
    
    // Remove all editor-specific UI (buttons, handles, etc.)
    clone.querySelectorAll('button, .absolute.top-2.right-2').forEach(el => el.remove());
    
    const contentHtml = clone.innerHTML;

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${currentPage.name || 'My Landing Page'}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Noto+Sans:wght@400;700&family=Space+Grotesk:wght@400;700&display=swap" rel="stylesheet">
        <style>
          :root {
            --bg-color: ${currentPage.styles.bgColor};
            --primary-color: ${currentPage.styles.primaryColor};
            --text-color: ${currentPage.styles.textColor};
            --accent-color: ${currentPage.styles.accentColor};
            --border-radius: ${currentPage.styles.borderRadius};
            --font-size: ${currentPage.styles.fontSize};
            --font-family: ${currentPage.styles.fontFamily};
            --font-weight: ${currentPage.styles.fontWeight || '400'};
            --section-padding: ${currentPage.styles.sectionPadding};
            --nav-bg: ${currentPage.styles.navBg};
            --footer-bg: ${currentPage.styles.footerBg};
          }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            background-color: var(--bg-color); 
            color: var(--text-color); 
            font-family: var(--font-family);
            font-size: var(--font-size);
            font-weight: var(--font-weight);
            line-height: 1.5;
          }
          .animate-entry { animation: fadeIn 0.5s ease-out; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        </style>
      </head>
      <body>
        <div class="site-wrapper">
          ${contentHtml}
        </div>
      </body>
      </html>
    `;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentPage.name || 'index'}.html`;
    a.click();
    URL.revokeObjectURL(url);
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
            onClick={() => setActiveTab('layers')}
            className={`p-2 rounded ${activeTab === 'layers' ? 'bg-white shadow-sm text-[#5b76fe]' : 'text-slate-400'}`}
            title="Layers"
          >
            <Layers size={18} />
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

              <div className="mb-4 pt-4 border-t border-[#e9eaef]">
                <label className="block text-sm font-bold text-slate-500 mb-1">Section Padding</label>
                <input 
                  type="range" min="0" max="200" step="10"
                  value={parseInt(currentPage.styles.sectionPadding || '60px')} 
                  onChange={(e) => handleStyleChange('sectionPadding', `${e.target.value}px`)}
                  className="w-full accent-[#5b76fe]"
                />
                <div className="text-right text-xs font-bold text-slate-400">{currentPage.styles.sectionPadding || '60px'}</div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold text-slate-500 mb-1">Content Gap</label>
                <input 
                  type="range" min="0" max="100" step="4"
                  value={parseInt(currentPage.styles.contentGap || '32px')} 
                  onChange={(e) => handleStyleChange('contentGap', `${e.target.value}px`)}
                  className="w-full accent-[#5b76fe]"
                />
                <div className="text-right text-xs font-bold text-slate-400">{currentPage.styles.contentGap || '32px'}</div>
              </div>

              <div className="mb-4 pt-4 border-t border-[#e9eaef]">
                <label className="block text-sm font-bold text-slate-500 mb-1">Section Padding</label>
                <input 
                  type="range" min="0" max="200" step="10"
                  value={parseInt(currentPage.styles.sectionPadding)} 
                  onChange={(e) => handleStyleChange('sectionPadding', `${e.target.value}px`)}
                  className="w-full accent-[#5b76fe]"
                />
                <div className="text-right text-xs font-bold text-slate-400">{currentPage.styles.sectionPadding}</div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold text-slate-500 mb-1">Content Gap</label>
                <input 
                  type="range" min="0" max="100" step="4"
                  value={parseInt(currentPage.styles.contentGap || '32px')} 
                  onChange={(e) => handleStyleChange('contentGap', `${e.target.value}px`)}
                  className="w-full accent-[#5b76fe]"
                />
                <div className="text-right text-xs font-bold text-slate-400">{currentPage.styles.contentGap || '32px'}</div>
              </div>

              <div className="pt-6 border-t border-[#e9eaef]">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Typography Presets</label>
                <div className="grid grid-cols-1 gap-2">
                  {typographyPresets.map(preset => (
                    <button 
                      key={preset.name}
                      onClick={() => {
                        handleStyleChange('fontFamily', preset.family);
                        handleStyleChange('fontWeight', preset.weight);
                      }}
                      className="group flex items-center justify-between p-3 border border-[#c7cad5] rounded-xl hover:border-[#5b76fe] hover:bg-[#5b76fe]/5 transition-all text-left"
                    >
                      <div>
                        <p className="text-sm font-bold text-slate-800" style={{ fontFamily: preset.family }}>{preset.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{preset.family.split(',')[0].replace(/'/g, '')}</p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Check size={14} className="text-[#5b76fe]" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'layers' && (
          <div className="p-6 animate-in fade-in slide-in-from-left-2 duration-200">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Layers</h3>
            
            <Reorder.Group 
              axis="y" 
              values={currentPage.blocks || []} 
              onReorder={setBlocks} 
              className="space-y-2"
            >
              {(currentPage.blocks || []).map((block) => (
                <Reorder.Item
                  key={block.id}
                  value={block}
                  id={block.id}
                  className={`group flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedBlockId === block.id 
                      ? 'bg-[#5b76fe]/5 border-[#5b76fe] shadow-sm' 
                      : 'bg-white border-[#e9eaef] hover:border-[#c7cad5]'
                  }`}
                  onClick={() => setSelectedBlockId(block.id)}
                >
                  <div className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600">
                    <GripVertical size={14} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className={`text-sm font-bold capitalize truncate ${selectedBlockId === block.id ? 'text-[#5b76fe]' : 'text-slate-700'}`}>
                      {block.props?.title || block.props?.logo || block.type}
                    </p>
                    <p className="text-xs text-slate-400 capitalize">{block.type} Section</p>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete Layer"
                  >
                    <Trash2 size={14} />
                  </button>
                </Reorder.Item>
              ))}
            </Reorder.Group>
            
            {(currentPage.blocks || []).length === 0 && (
              <div className="text-center py-10 opacity-50">
                <Layers size={32} className="mx-auto mb-3" />
                <p className="text-sm font-bold">No layers yet</p>
              </div>
            )}
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
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-500 mb-2">Layout</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => updateBlockProps(selectedBlock.id, { layout: 'centered' })}
                          className={`p-2 text-xs font-bold rounded-md border transition-all ${selectedBlock.props.layout !== 'split' ? 'bg-[#5b76fe] text-white border-[#5b76fe]' : 'bg-white text-slate-600 border-[#c7cad5]'}`}
                        >
                          Centered
                        </button>
                        <button 
                          onClick={() => updateBlockProps(selectedBlock.id, { layout: 'split' })}
                          className={`p-2 text-xs font-bold rounded-md border transition-all ${selectedBlock.props.layout === 'split' ? 'bg-[#5b76fe] text-white border-[#5b76fe]' : 'bg-white text-slate-600 border-[#c7cad5]'}`}
                        >
                          Split
                        </button>
                      </div>
                    </div>

                    <ImageInput 
                      label="Hero Image" 
                      value={selectedBlock.props.image} 
                      onChange={(val) => updateBlockProps(selectedBlock.id, { image: val })} 
                      onSearchClick={() => openUnsplash((url) => updateBlockProps(selectedBlock.id, { image: url }))}
                    />

                    <div className="space-y-4 pt-4 border-t border-[#e9eaef]">
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={selectedBlock.props.animate !== false} 
                          onChange={(e) => updateBlockProps(selectedBlock.id, { animate: e.target.checked })}
                          className="w-4 h-4 accent-[#5b76fe]"
                        />
                        <label className="text-sm font-bold text-slate-500">Enable Animations</label>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-500 mb-1">CTA Text</label>
                        <input 
                          type="text" 
                          value={selectedBlock.props.ctaText || ''} 
                          onChange={(e) => updateBlockProps(selectedBlock.id, { ctaText: e.target.value })}
                          className="w-full p-2 border border-[#c7cad5] rounded-md text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedBlock.type === 'features' && (
                  <div className="space-y-6">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Feature Items</h4>
                    {(selectedBlock.props.items || [
                      { icon: 'Zap', title: 'Fast Integration', desc: '...' },
                      { icon: 'Shield', title: 'Secure by Default', desc: '...' },
                      { icon: 'Smartphone', title: 'Mobile First', desc: '...' }
                    ]).map((item, i) => (
                      <div key={i} className="p-4 bg-slate-50 rounded-xl border border-[#e9eaef] space-y-4">
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-black text-slate-400">#{i + 1}</p>
                        </div>
                        <IconInput 
                          label="Section Icon" 
                          value={item.icon} 
                          onPickClick={() => openIconPicker((iconName) => {
                            const newItems = [...(selectedBlock.props.items || [
                              { icon: 'Zap', title: 'Fast Integration', desc: '...' },
                              { icon: 'Shield', title: 'Secure by Default', desc: '...' },
                              { icon: 'Smartphone', title: 'Mobile First', desc: '...' }
                            ])];
                            newItems[i] = { ...newItems[i], icon: iconName };
                            updateBlockProps(selectedBlock.id, { items: newItems });
                          })}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {selectedBlock.type === 'team' && (
                  <div className="space-y-6">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Team Members</h4>
                    {(selectedBlock.props.items || [
                      { name: 'John Doe', role: 'CEO', bio: '...', image: '' },
                      { name: 'Jane Smith', role: 'Designer', bio: '...', image: '' },
                      { name: 'Mike Johnson', role: 'CTO', bio: '...', image: '' }
                    ]).map((item, i) => (
                      <div key={i} className="p-4 bg-slate-50 rounded-xl border border-[#e9eaef] space-y-4">
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-black text-slate-400">#{i + 1}</p>
                        </div>
                        <ImageInput 
                          label="Member Image" 
                          value={item.image} 
                          onChange={(val) => {
                            const newItems = [...(selectedBlock.props.items || [
                              { name: 'John Doe', role: 'CEO', bio: '...', image: '' },
                              { name: 'Jane Smith', role: 'Designer', bio: '...', image: '' },
                              { name: 'Mike Johnson', role: 'CTO', bio: '...', image: '' }
                            ])];
                            newItems[i] = { ...newItems[i], image: val };
                            updateBlockProps(selectedBlock.id, { items: newItems });
                          }} 
                          onSearchClick={() => openUnsplash((url) => {
                            const newItems = [...(selectedBlock.props.items || [])];
                            newItems[i] = { ...newItems[i], image: url };
                            updateBlockProps(selectedBlock.id, { items: newItems });
                          })}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {selectedBlock.type === 'gallery' && (
                  <div className="space-y-6">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Gallery Images</h4>
                    {(selectedBlock.props.images || [
                      '', '', '', '', '', ''
                    ]).map((img, i) => (
                      <div key={i} className="p-4 bg-slate-50 rounded-xl border border-[#e9eaef] space-y-4">
                        <ImageInput 
                          label={`Image #${i + 1}`} 
                          value={img} 
                          onChange={(val) => {
                            const newImgs = [...(selectedBlock.props.images || [
                              '', '', '', '', '', ''
                            ])];
                            newImgs[i] = val;
                            updateBlockProps(selectedBlock.id, { images: newImgs });
                          }} 
                          onSearchClick={() => openUnsplash((url) => {
                            const newImgs = [...(selectedBlock.props.images || [])];
                            newImgs[i] = url;
                            updateBlockProps(selectedBlock.id, { images: newImgs });
                          })}
                        />
                      </div>
                    ))}
                    <button 
                      onClick={() => {
                        const newImgs = [...(selectedBlock.props.images || ['', '', '', '', '', '']), ''];
                        updateBlockProps(selectedBlock.id, { images: newImgs });
                      }}
                      className="w-full py-2 border-2 border-dashed border-[#c7cad5] rounded-xl text-slate-400 font-bold hover:border-[#5b76fe] hover:text-[#5b76fe] transition-all"
                    >
                      + Add Image
                    </button>
                  </div>
                )}

                {selectedBlock.type === 'blogList' && (
                  <div className="space-y-6">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Blog Post Settings</h4>
                    {(selectedBlock.props.items || [
                      { title: '...', excerpt: '...', image: '', author: '', date: '', category: '' },
                      { title: '...', excerpt: '...', image: '', author: '', date: '', category: '' },
                      { title: '...', excerpt: '...', image: '', author: '', date: '', category: '' }
                    ]).map((item, i) => (
                      <div key={i} className="p-4 bg-slate-50 rounded-xl border border-[#e9eaef] space-y-4">
                        <p className="text-xs font-black text-slate-400">Post #{i + 1}</p>
                        <ImageInput 
                          label="Cover Image" 
                          value={item.image} 
                          onChange={(val) => {
                            const newItems = [...(selectedBlock.props.items || [])];
                            newItems[i] = { ...newItems[i], image: val };
                            updateBlockProps(selectedBlock.id, { items: newItems });
                          }} 
                          onSearchClick={() => openUnsplash((url) => {
                            const newItems = [...(selectedBlock.props.items || [])];
                            newItems[i] = { ...newItems[i], image: url };
                            updateBlockProps(selectedBlock.id, { items: newItems });
                          })}
                        />
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Category</label>
                          <input 
                            type="text" 
                            value={item.category || ''} 
                            onChange={(e) => {
                              const newItems = [...(selectedBlock.props.items || [])];
                              newItems[i] = { ...newItems[i], category: e.target.value };
                              updateBlockProps(selectedBlock.id, { items: newItems });
                            }}
                            className="w-full p-2 border border-[#c7cad5] rounded-md text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedBlock.type === 'caseStudy' && (
                  <div className="space-y-6">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Case Study Settings</h4>
                    {(selectedBlock.props.items || [
                      { title: '...', desc: '...', image: '', category: '', year: '' },
                      { title: '...', desc: '...', image: '', category: '', year: '' },
                      { title: '...', desc: '...', image: '', category: '', year: '' }
                    ]).map((item, i) => (
                      <div key={i} className="p-4 bg-slate-50 rounded-xl border border-[#e9eaef] space-y-4">
                        <p className="text-xs font-black text-slate-400">Project #{i + 1}</p>
                        <ImageInput 
                          label="Project Image" 
                          value={item.image} 
                          onChange={(val) => {
                            const newItems = [...(selectedBlock.props.items || [])];
                            newItems[i] = { ...newItems[i], image: val };
                            updateBlockProps(selectedBlock.id, { items: newItems });
                          }} 
                          onSearchClick={() => openUnsplash((url) => {
                            const newItems = [...(selectedBlock.props.items || [])];
                            newItems[i] = { ...newItems[i], image: url };
                            updateBlockProps(selectedBlock.id, { items: newItems });
                          })}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Category</label>
                            <input 
                              type="text" 
                              value={item.category || ''} 
                              onChange={(e) => {
                                const newItems = [...(selectedBlock.props.items || [])];
                                newItems[i] = { ...newItems[i], category: e.target.value };
                                updateBlockProps(selectedBlock.id, { items: newItems });
                              }}
                              className="w-full p-2 border border-[#c7cad5] rounded-md text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Year</label>
                            <input 
                              type="text" 
                              value={item.year || ''} 
                              onChange={(e) => {
                                const newItems = [...(selectedBlock.props.items || [])];
                                newItems[i] = { ...newItems[i], year: e.target.value };
                                updateBlockProps(selectedBlock.id, { items: newItems });
                              }}
                              className="w-full p-2 border border-[#c7cad5] rounded-md text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedBlock.type === 'stats' && (
                  <div className="space-y-6">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Statistic Items</h4>
                    {(selectedBlock.props.items || [
                      { value: '10k+', label: 'Customers' },
                      { value: '24/7', label: 'Support' },
                      { value: '99%', label: 'Uptime' },
                      { value: '150+', label: 'Partners' }
                    ]).map((item, i) => (
                      <div key={i} className="p-4 bg-slate-50 rounded-xl border border-[#e9eaef] space-y-4">
                        <p className="text-xs font-black text-slate-400">Stat #{i + 1}</p>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Value</label>
                            <input 
                              type="text" 
                              value={item.value || ''} 
                              onChange={(e) => {
                                const newItems = [...(selectedBlock.props.items || [])];
                                newItems[i] = { ...newItems[i], value: e.target.value };
                                updateBlockProps(selectedBlock.id, { items: newItems });
                              }}
                              className="w-full p-2 border border-[#c7cad5] rounded-md text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Label</label>
                            <input 
                              type="text" 
                              value={item.label || ''} 
                              onChange={(e) => {
                                const newItems = [...(selectedBlock.props.items || [])];
                                newItems[i] = { ...newItems[i], label: e.target.value };
                                updateBlockProps(selectedBlock.id, { items: newItems });
                              }}
                              className="w-full p-2 border border-[#c7cad5] rounded-md text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedBlock.type === 'newsletter' && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Newsletter Settings</h4>
                    <div>
                      <label className="block text-sm font-bold text-slate-500 mb-1">Button Text</label>
                      <input 
                        type="text" 
                        value={selectedBlock.props.buttonText || 'Subscribe'} 
                        onChange={(e) => updateBlockProps(selectedBlock.id, { buttonText: e.target.value })}
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
            <div className="space-y-6">
              {[
                {
                  category: "Core & Conversion",
                  blocks: [
                    { type: 'navbar', label: 'Navigation', icon: <Menu size={16} /> },
                    { type: 'hero', label: 'Hero Header', icon: <Monitor size={16} /> },
                    { type: 'newsletter', label: 'Newsletter', icon: <Mail size={16} /> },
                    { type: 'footer', label: 'Footer Section', icon: <ArrowDown size={16} /> },
                  ]
                },
                {
                  category: "Content & Proof",
                  blocks: [
                    { type: 'features', label: 'Feature Grid', icon: <Layout size={16} /> },
                    { type: 'stats', label: 'Impact Stats', icon: <Hash size={16} /> },
                    { type: 'editorial', label: 'Editorial Text', icon: <FileText size={16} /> },
                    { type: 'logos', label: 'Logo Cloud', icon: <Image size={16} /> },
                    { type: 'blogList', label: 'Blog List', icon: <BookOpen size={16} /> },
                    { type: 'testimonials', label: 'Testimonials', icon: <MessageSquare size={16} /> },
                    { type: 'team', label: 'Team Grid', icon: <Users size={16} /> },
                    { type: 'gallery', label: 'Image Gallery', icon: <Image size={16} /> },
                  ]
                },
                {
                  category: "Creative & Cinematic",
                  blocks: [
                    { type: 'caseStudy', label: 'Case Study', icon: <Briefcase size={16} /> },
                  ]
                },
                {
                  category: "Support & Legal",
                  blocks: [
                    { type: 'pricing', label: 'Pricing Table', icon: <Code size={16} /> },
                    { type: 'faq', label: 'FAQ Accordion', icon: <HelpCircle size={16} /> },
                    { type: 'contact', label: 'Contact Form', icon: <Users size={16} /> },
                  ]
                }
              ].map(group => (
                <div key={group.category}>
                  <h4 className="text-xs font-bold text-slate-500 mb-3">{group.category}</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {group.blocks.map(block => (
                      <button 
                        key={block.type}
                        onClick={() => addBlock(block.type)}
                        className="w-full p-4 border border-[#c7cad5] rounded-xl hover:border-[#5b76fe] hover:bg-[#5b76fe]/5 text-left transition-all group flex items-start gap-4 shadow-sm"
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
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-slate-50 border-t border-[#c7cad5] space-y-3">
        <button 
          onClick={handleSave}
          disabled={saveStatus !== 'idle'}
          className={`w-full py-3 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm ${
            saveStatus === 'saved' ? 'bg-[#00b473]' : 'bg-[#5b76fe] hover:opacity-90'
          }`}
        >
          {saveStatus === 'saved' ? <Check size={18} /> : <Download size={18} />}
          {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Project Saved!' : 'Save Project'}
        </button>

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".json" 
          className="hidden" 
        />
        
        <button 
          onClick={handleImportClick}
          className="w-full py-2.5 bg-white border border-[#c7cad5] text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <Upload size={14} /> IMPORT JSON
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
            className="py-2.5 bg-slate-600 text-white text-xs font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Download size={14} /> EXPORT JSON
          </button>
        </div>
      </div>

      <UnsplashModal 
        isOpen={isUnsplashOpen} 
        onClose={() => setIsUnsplashOpen(false)} 
        onSelect={handleUnsplashSelect} 
      />

      <IconPickerModal
        isOpen={isIconPickerOpen}
        onClose={() => setIsIconPickerOpen(false)}
        onSelect={handleIconSelect}
      />
    </aside>
  );
};

export default Sidebar;
            <div key={group.category}>
                  <h4 className="text-xs font-bold text-slate-500 mb-3">{group.category}</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {group.blocks.map(block => (
                      <button 
                        key={block.type}
                        onClick={() => addBlock(block.type)}
                        className="w-full p-4 border border-[#c7cad5] rounded-xl hover:border-[#5b76fe] hover:bg-[#5b76fe]/5 text-left transition-all group flex items-start gap-4 shadow-sm"
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
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-slate-50 border-t border-[#c7cad5] space-y-3">
        <button 
          onClick={handleSave}
          disabled={saveStatus !== 'idle'}
          className={`w-full py-3 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm ${
            saveStatus === 'saved' ? 'bg-[#00b473]' : 'bg-[#5b76fe] hover:opacity-90'
          }`}
        >
          {saveStatus === 'saved' ? <Check size={18} /> : <Download size={18} />}
          {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Project Saved!' : 'Save Project'}
        </button>

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".json" 
          className="hidden" 
        />
        
        <button 
          onClick={handleImportClick}
          className="w-full py-2.5 bg-white border border-[#c7cad5] text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <Upload size={14} /> IMPORT JSON
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
            className="py-2.5 bg-slate-600 text-white text-xs font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Download size={14} /> EXPORT JSON
          </button>
        </div>
      </div>

      <UnsplashModal 
        isOpen={isUnsplashOpen} 
        onClose={() => setIsUnsplashOpen(false)} 
        onSelect={handleUnsplashSelect} 
      />

      <IconPickerModal
        isOpen={isIconPickerOpen}
        onClose={() => setIsIconPickerOpen(false)}
        onSelect={handleIconSelect}
      />
    </aside>
  );
};

export default Sidebar;
