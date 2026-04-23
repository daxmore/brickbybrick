import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import useLocalFonts from '../hooks/useLocalFonts';
import UnsplashModal from './UnsplashModal';
import IconPickerModal from './IconPickerModal';
import LayersPanel from './LayersPanel';
import { 
  Settings, Layout, Palette, Download, 
  Check, Layers, Trash2,
  Square, Type as TypeIcon,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  ArrowRight, ArrowDown, Maximize, Minus, Plus,
  Bold, Italic, Link, Image, Monitor, Tablet, Smartphone
} from 'lucide-react';

// --- Sub-Components for Figma Style Panel ---

const ColorInput = ({ label, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</label>
    <div className="flex gap-2">
      <div 
        className="w-8 h-8 rounded-lg border border-[#c7cad5] cursor-pointer shadow-sm relative overflow-hidden"
        style={{ backgroundColor: value || 'transparent' }}
      >
        <input 
          type="color" 
          value={value || '#000000'} 
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
        />
      </div>
      <input 
        type="text" 
        value={value || ''} 
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-1 bg-slate-50 border border-[#c7cad5] rounded-lg text-xs font-mono focus:border-[#5b76fe] focus:bg-white transition-all outline-none"
        placeholder="Hex Code"
      />
    </div>
  </div>
);

const SectionHeader = ({ title }) => (
  <div className="py-2 mb-4 border-b border-[#e9eaef]">
    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</h4>
  </div>
);

const ControlGroup = ({ label, children }) => (
  <div className="mb-6">
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{label}</label>
    <div className="space-y-3">
      {children}
    </div>
  </div>
);

const LayoutPanel = ({ node, updateStyles }) => {
  const styles = node.styles || {};
  const isFlex = styles.display === 'flex';

  return (
    <ControlGroup label="Layout">
      <div className="grid grid-cols-2 gap-2 mb-3">
        <button 
          onClick={() => updateStyles({ display: 'block' })}
          className={`py-2 rounded-lg text-xs font-bold border transition-all ${styles.display !== 'flex' ? 'bg-white border-[#5b76fe] text-[#5b76fe] shadow-sm' : 'bg-slate-50 border-[#c7cad5] text-slate-400 hover:bg-slate-100'}`}
        >
          Block
        </button>
        <button 
          onClick={() => updateStyles({ display: 'flex' })}
          className={`py-2 rounded-lg text-xs font-bold border transition-all ${styles.display === 'flex' ? 'bg-white border-[#5b76fe] text-[#5b76fe] shadow-sm' : 'bg-slate-50 border-[#c7cad5] text-slate-400 hover:bg-slate-100'}`}
        >
          Flex
        </button>
      </div>

      {isFlex && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Direction</span>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button 
                onClick={() => updateStyles({ flexDirection: 'row' })}
                className={`p-1.5 rounded-md ${styles.flexDirection !== 'column' ? 'bg-white shadow-sm text-[#5b76fe]' : 'text-slate-400'}`}
              >
                <ArrowRight size={14} />
              </button>
              <button 
                onClick={() => updateStyles({ flexDirection: 'column' })}
                className={`p-1.5 rounded-md ${styles.flexDirection === 'column' ? 'bg-white shadow-sm text-[#5b76fe]' : 'text-slate-400'}`}
              >
                <ArrowDown size={14} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Align</span>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              {['flex-start', 'center', 'flex-end', 'stretch'].map(align => (
                <button 
                  key={align}
                  onClick={() => updateStyles({ alignItems: align })}
                  className={`p-1.5 rounded-md ${styles.alignItems === align ? 'bg-white shadow-sm text-[#5b76fe]' : 'text-slate-400'}`}
                >
                  <AlignLeft size={14} className={align === 'center' ? 'rotate-90' : (align === 'flex-end' ? 'rotate-180' : '')} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Justify</span>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              {['flex-start', 'center', 'flex-end', 'space-between'].map(justify => (
                <button 
                  key={justify}
                  onClick={() => updateStyles({ justifyContent: justify })}
                  className={`p-1.5 rounded-md ${styles.justifyContent === justify ? 'bg-white shadow-sm text-[#5b76fe]' : 'text-slate-400'}`}
                >
                  <AlignCenter size={14} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Gap</span>
            <input 
              type="text" 
              value={styles.gap || ''} 
              onChange={(e) => updateStyles({ gap: e.target.value })}
              className="w-16 px-2 py-1 bg-slate-50 border border-[#c7cad5] rounded-md text-[10px] font-bold outline-none"
              placeholder="0px"
            />
          </div>
        </div>
      )}
    </ControlGroup>
  );
};

const SpacingPanel = ({ node, updateStyles }) => {
  const styles = node.styles || {};
  
  return (
    <ControlGroup label="Spacing">
      <div className="relative aspect-square max-w-[140px] mx-auto p-4 bg-slate-50 rounded-2xl border border-[#e9eaef] flex items-center justify-center">
        <div className="absolute top-0 inset-x-0 h-4 flex items-center justify-center">
          <input 
            className="w-8 bg-transparent text-[8px] font-black text-center outline-none border-b border-transparent focus:border-[#5b76fe]" 
            value={styles.marginTop || ''} 
            placeholder="0"
            onChange={(e) => updateStyles({ marginTop: e.target.value })}
          />
        </div>
        <div className="absolute right-0 inset-y-0 w-4 flex items-center justify-center">
          <input 
            className="w-8 -rotate-90 bg-transparent text-[8px] font-black text-center outline-none border-b border-transparent focus:border-[#5b76fe]" 
            value={styles.marginRight || ''} 
            placeholder="0"
            onChange={(e) => updateStyles({ marginRight: e.target.value })}
          />
        </div>
        <div className="absolute bottom-0 inset-x-0 h-4 flex items-center justify-center">
          <input 
            className="w-8 bg-transparent text-[8px] font-black text-center outline-none border-b border-transparent focus:border-[#5b76fe]" 
            value={styles.marginBottom || ''} 
            placeholder="0"
            onChange={(e) => updateStyles({ marginBottom: e.target.value })}
          />
        </div>
        <div className="absolute left-0 inset-y-0 w-4 flex items-center justify-center">
          <input 
            className="w-8 rotate-90 bg-transparent text-[8px] font-black text-center outline-none border-b border-transparent focus:border-[#5b76fe]" 
            value={styles.marginLeft || ''} 
            placeholder="0"
            onChange={(e) => updateStyles({ marginLeft: e.target.value })}
          />
        </div>
        
        <div className="w-full h-full bg-white rounded-xl border border-[#c7cad5] relative shadow-sm flex items-center justify-center">
           <div className="absolute top-2 inset-x-0 h-4 flex items-center justify-center">
            <input 
              className="w-8 bg-transparent text-[8px] font-black text-center text-[#5b76fe] outline-none border-b border-transparent focus:border-[#5b76fe]" 
              value={styles.paddingTop || ''} 
              placeholder="0"
              onChange={(e) => updateStyles({ paddingTop: e.target.value })}
            />
          </div>
          <div className="absolute right-2 inset-y-0 w-4 flex items-center justify-center">
            <input 
              className="w-8 -rotate-90 bg-transparent text-[8px] font-black text-center text-[#5b76fe] outline-none border-b border-transparent focus:border-[#5b76fe]" 
              value={styles.paddingRight || ''} 
              placeholder="0"
              onChange={(e) => updateStyles({ paddingRight: e.target.value })}
            />
          </div>
          <div className="absolute bottom-2 inset-x-0 h-4 flex items-center justify-center">
            <input 
              className="w-8 bg-transparent text-[8px] font-black text-center text-[#5b76fe] outline-none border-b border-transparent focus:border-[#5b76fe]" 
              value={styles.paddingBottom || ''} 
              placeholder="0"
              onChange={(e) => updateStyles({ paddingBottom: e.target.value })}
            />
          </div>
          <div className="absolute left-2 inset-y-0 w-4 flex items-center justify-center">
            <input 
              className="w-8 rotate-90 bg-transparent text-[8px] font-black text-center text-[#5b76fe] outline-none border-b border-transparent focus:border-[#5b76fe]" 
              value={styles.paddingLeft || ''} 
              placeholder="0"
              onChange={(e) => updateStyles({ paddingLeft: e.target.value })}
            />
          </div>
          <Maximize size={12} className="text-slate-200" />
        </div>
      </div>
    </ControlGroup>
  );
};

const TypographyPanel = ({ node, updateStyles }) => {
  const styles = node.styles || {};
  const { fonts, requestFonts, loading: fontsLoading } = useLocalFonts();

  return (
    <ControlGroup label="Typography">
      <div className="space-y-4">
        <div>
          <button 
            onClick={requestFonts}
            className="w-full py-2 bg-slate-50 border border-[#c7cad5] rounded-lg text-[10px] font-bold text-slate-500 hover:bg-slate-100 mb-2 transition-all"
          >
            {fontsLoading ? 'Loading Fonts...' : (fonts.length > 0 ? 'Change Font' : 'Load Local Fonts')}
          </button>
          {fonts.length > 0 && (
            <select 
              className="w-full p-2 bg-white border border-[#c7cad5] rounded-lg text-xs font-bold outline-none mb-3"
              value={styles.fontFamily || ''}
              onChange={(e) => updateStyles({ fontFamily: e.target.value })}
            >
              <option value="">System Default</option>
              {fonts.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-[#e9eaef]">
            <span className="text-[10px] font-black text-slate-400">SIZE</span>
            <input 
              className="bg-transparent text-xs font-bold w-full outline-none"
              value={styles.fontSize || ''}
              onChange={(e) => updateStyles({ fontSize: e.target.value })}
              placeholder="16px"
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-[#e9eaef]">
            <span className="text-[10px] font-black text-slate-400">HT</span>
            <input 
              className="bg-transparent text-xs font-bold w-full outline-none"
              value={styles.lineHeight || ''}
              onChange={(e) => updateStyles({ lineHeight: e.target.value })}
              placeholder="1.5"
            />
          </div>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg w-full">
          {[
            { id: 'left', icon: <AlignLeft size={14} /> },
            { id: 'center', icon: <AlignCenter size={14} /> },
            { id: 'right', icon: <AlignRight size={14} /> },
            { id: 'justify', icon: <AlignJustify size={14} /> }
          ].map(align => (
            <button 
              key={align.id}
              onClick={() => updateStyles({ textAlign: align.id })}
              className={`flex-1 flex justify-center py-1.5 rounded-md ${styles.textAlign === align.id ? 'bg-white shadow-sm text-[#5b76fe]' : 'text-slate-400'}`}
            >
              {align.icon}
            </button>
          ))}
        </div>

        <ColorInput 
          label="Text Color" 
          value={styles.color} 
          onChange={(val) => updateStyles({ color: val })} 
        />
      </div>
    </ControlGroup>
  );
};

const AppearancePanel = ({ node, updateStyles }) => {
  const styles = node.styles || {};
  
  return (
    <ControlGroup label="Appearance">
      <div className="space-y-4">
        {node.type !== 'Text' && (
          <ColorInput 
            label="Background" 
            value={styles.backgroundColor} 
            onChange={(val) => updateStyles({ backgroundColor: val })} 
          />
        )}
        
        <div className="flex items-center justify-between gap-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Radius</span>
          <input 
            type="text" 
            value={styles.borderRadius || ''} 
            onChange={(e) => updateStyles({ borderRadius: e.target.value })}
            className="w-16 px-2 py-1 bg-slate-50 border border-[#c7cad5] rounded-md text-[10px] font-bold outline-none"
            placeholder="0px"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Opacity</span>
          <div className="flex items-center gap-2 flex-1">
            <input 
              type="range" 
              min="0" max="1" step="0.1"
              value={styles.opacity !== undefined ? styles.opacity : 1}
              onChange={(e) => updateStyles({ opacity: e.target.value })}
              className="flex-1 accent-[#5b76fe] h-1 bg-slate-200 rounded-lg appearance-none"
            />
            <span className="text-[10px] font-black text-slate-400 w-8">{Math.round((styles.opacity !== undefined ? styles.opacity : 1) * 100)}%</span>
          </div>
        </div>

        <div className="pt-2 border-t border-[#e9eaef] mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Border</span>
            <input 
              type="text" 
              value={styles.borderWidth || ''} 
              onChange={(e) => updateStyles({ borderWidth: e.target.value, borderStyle: 'solid' })}
              className="w-12 px-2 py-1 bg-slate-50 border border-[#c7cad5] rounded-md text-[10px] font-bold outline-none"
              placeholder="0px"
            />
          </div>
          <ColorInput 
            label="" 
            value={styles.borderColor} 
            onChange={(val) => updateStyles({ borderColor: val, borderStyle: 'solid' })} 
          />
        </div>
      </div>
    </ControlGroup>
  );
};

// --- Main Sidebar Component ---

const Sidebar = () => {
  const { 
    currentPage, 
    updateStyle, 
    savePage, 
    navigateTo,
    selectedNodeId,
    updateNodeStyles,
    addNode,
    deleteNode,
    deviceView
  } = useProject();

  const [activeTab, setActiveTab] = useState('styles'); // styles, layers, block, add
  const [saveStatus, setSaveStatus] = useState('idle');

  const findNodeById = (nodes, id) => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedNode = selectedNodeId ? findNodeById(currentPage.nodes, selectedNodeId) : null;
  
  // Compute Active Node Styles for the current view
  const activeNodeStyles = selectedNode ? {
    ...(selectedNode.styles || {}),
    ...(deviceView === 'tablet' || deviceView === 'mobile' ? (selectedNode.tabletStyles || {}) : {}),
    ...(deviceView === 'mobile' ? (selectedNode.mobileStyles || {}) : {})
  } : {};

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

  const handleUpdateNodeStyles = (newStyles) => {
    if (selectedNode) {
      updateNodeStyles(selectedNode.id, newStyles);
    }
  };

  return (
    <aside className="w-[320px] bg-white border-r border-[#c7cad5] h-screen overflow-hidden flex flex-col sticky top-0 z-40 shadow-2xl">
      {/* Top Navigation */}
      <div className="p-4 border-b border-[#e9eaef] flex justify-between items-center bg-slate-50 shrink-0">
        <button 
          onClick={() => navigateTo('dashboard')}
          className="text-[10px] font-black text-[#5b76fe] hover:underline uppercase tracking-widest"
        >
          ← HOME
        </button>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {[
            { id: 'styles', icon: <Palette size={18} /> },
            { id: 'layers', icon: <Layers size={18} /> },
            { id: 'block', icon: <Settings size={18} /> },
            { id: 'add', icon: <Plus size={18} /> }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-2 rounded-lg transition-all ${activeTab === tab.id ? 'bg-white shadow-md text-[#5b76fe]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'styles' && (
          <div className="p-6">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center gap-2">
              <Palette size={16} className="text-[#5b76fe]" /> Theme Settings
            </h3>
            <ColorInput label="Background" value={currentPage.styles.bgColor} onChange={(val) => handleStyleChange('bgColor', val)} />
            <ColorInput label="Primary Action" value={currentPage.styles.primaryColor} onChange={(val) => handleStyleChange('primaryColor', val)} />
            <ColorInput label="Text Color" value={currentPage.styles.textColor} onChange={(val) => handleStyleChange('textColor', val)} />
            
            <div className="mt-8 pt-8 border-t border-[#e9eaef]">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Responsive Check</label>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 bg-slate-50 rounded-xl flex flex-col items-center gap-2 border border-[#e9eaef]">
                  <Monitor size={16} className="text-slate-400" />
                  <span className="text-[8px] font-black text-slate-400 uppercase">DESK</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl flex flex-col items-center gap-2 border border-[#e9eaef]">
                  <Tablet size={16} className="text-slate-400" />
                  <span className="text-[8px] font-black text-slate-400 uppercase">TAB</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl flex flex-col items-center gap-2 border border-[#e9eaef]">
                  <Smartphone size={16} className="text-slate-400" />
                  <span className="text-[8px] font-black text-slate-400 uppercase">MOB</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'layers' && (
          <LayersPanel />
        )}

        {activeTab === 'block' && (
          <div className="p-6">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center gap-2">
              <Settings size={16} className="text-[#5b76fe]" /> Node Properties
            </h3>
            {selectedNode ? (
              <div className="animate-in fade-in duration-500">
                <div className="mb-8 p-4 bg-[#5b76fe]/5 rounded-2xl border border-[#5b76fe]/10">
                  <p className="text-[10px] font-black text-[#5b76fe] uppercase tracking-[0.2em] mb-1">Selected</p>
                  <p className="text-lg font-black text-slate-800 capitalize flex items-center gap-2">
                    {selectedNode.name || selectedNode.type}
                    <span className="px-2 py-0.5 bg-slate-200 rounded text-[9px] uppercase">{selectedNode.type}</span>
                  </p>
                </div>
                
                {/* Primitive Specific Panels */}
                {(selectedNode.type === 'Box' || selectedNode.type === 'Container') && (
                  <>
                    <LayoutPanel node={{...selectedNode, styles: activeNodeStyles}} updateStyles={handleUpdateNodeStyles} />
                    <SpacingPanel node={{...selectedNode, styles: activeNodeStyles}} updateStyles={handleUpdateNodeStyles} />
                    <AppearancePanel node={{...selectedNode, styles: activeNodeStyles}} updateStyles={handleUpdateNodeStyles} />
                  </>
                )}

                {selectedNode.type === 'Text' && (
                  <>
                    <TypographyPanel node={{...selectedNode, styles: activeNodeStyles}} updateStyles={handleUpdateNodeStyles} />
                    <SpacingPanel node={{...selectedNode, styles: activeNodeStyles}} updateStyles={handleUpdateNodeStyles} />
                    <AppearancePanel node={{...selectedNode, styles: activeNodeStyles}} updateStyles={handleUpdateNodeStyles} />
                  </>
                )}

                {/* Hybrid Block Specific Panels (Props) */}
                {!['Box', 'Text', 'Container'].includes(selectedNode.type) && (
                  <div className="space-y-6">
                    <ControlGroup label="Component Data">
                      <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center">
                        <p className="text-[10px] font-bold text-slate-400 italic">Editing {selectedNode.type} specific content...</p>
                        <p className="text-[9px] text-slate-400 mt-2">Use inline editing on canvas for text.</p>
                      </div>
                    </ControlGroup>
                    <LayoutPanel node={{...selectedNode, styles: activeNodeStyles}} updateStyles={handleUpdateNodeStyles} />
                    <SpacingPanel node={{...selectedNode, styles: activeNodeStyles}} updateStyles={handleUpdateNodeStyles} />
                  </div>
                )}

                <div className="pt-8 border-t border-[#e9eaef] mt-8">
                  <button 
                    onClick={() => deleteNode(selectedNode.id)}
                    className="w-full py-4 bg-red-50 text-red-500 font-black rounded-2xl border border-red-100 hover:bg-red-500 hover:text-white transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} /> Delete Node
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 animate-pulse">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl mx-auto flex items-center justify-center text-slate-300 mb-6">
                  <Monitor size={32} />
                </div>
                <p className="text-sm font-black text-slate-300 uppercase tracking-widest">Select an element</p>
                <p className="text-[10px] text-slate-400 font-bold mt-2">To start styling your canvas</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'add' && (
          <div className="p-6">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center gap-2">
              <Plus size={16} className="text-[#5b76fe]" /> Add Content
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <button 
                draggable
                onDragStart={(e) => { e.dataTransfer.setData('nodeType', 'Box'); e.dataTransfer.effectAllowed = 'move'; }}
                onClick={() => addNode('Box')}
                className="group flex items-center gap-4 p-5 bg-white border border-[#c7cad5] rounded-2xl hover:bg-[#5b76fe]/5 hover:border-[#5b76fe] transition-all hover:-translate-y-1 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing"
              >
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-[#5b76fe] group-hover:text-white transition-colors">
                  <Square size={20} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Box / Div</p>
                  <p className="text-[10px] font-bold text-slate-400">Structural container</p>
                </div>
              </button>
              
              <button 
                draggable
                onDragStart={(e) => { e.dataTransfer.setData('nodeType', 'Text'); e.dataTransfer.effectAllowed = 'move'; }}
                onClick={() => addNode('Text')}
                className="group flex items-center gap-4 p-5 bg-white border border-[#c7cad5] rounded-2xl hover:bg-[#5b76fe]/5 hover:border-[#5b76fe] transition-all hover:-translate-y-1 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing"
              >
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-[#5b76fe] group-hover:text-white transition-colors">
                  <TypeIcon size={20} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Text Block</p>
                  <p className="text-[10px] font-bold text-slate-400">Granular text element</p>
                </div>
              </button>

              <div className="pt-6 border-t border-[#e9eaef] mt-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Page Sections</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { type: 'hero', label: 'Hero', icon: <Monitor size={16} /> },
                    { type: 'navbar', label: 'Nav', icon: <ArrowDown size={16} className="rotate-180" /> },
                    { type: 'features', label: 'Feat', icon: <Layout size={16} /> },
                    { type: 'footer', label: 'Foot', icon: <ArrowDown size={16} /> }
                  ].map(block => (
                    <button 
                      key={block.type}
                      draggable
                      onDragStart={(e) => { e.dataTransfer.setData('nodeType', block.type); e.dataTransfer.effectAllowed = 'move'; }}
                      onClick={() => addNode(block.type)}
                      className="p-4 bg-slate-50 border border-[#c7cad5] rounded-xl text-center hover:bg-white hover:border-[#5b76fe] hover:shadow-sm transition-all group cursor-grab active:cursor-grabbing"
                    >
                      <div className="text-slate-400 group-hover:text-[#5b76fe] flex justify-center mb-2">
                        {block.icon}
                      </div>
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{block.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="p-6 border-t border-[#c7cad5] bg-white shrink-0">
        <button 
          onClick={handleSave}
          className={`w-full py-4 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl transform active:scale-95 ${saveStatus === 'saved' ? 'bg-green-500 shadow-green-500/20' : 'bg-[#5b76fe] shadow-[#5b76fe]/20 hover:shadow-[#5b76fe]/40'}`}
        >
          {saveStatus === 'saved' ? <Check size={20} /> : <Download size={20} />}
          {saveStatus === 'saving' ? 'UPDATING...' : (saveStatus === 'saved' ? 'PAGE SAVED' : 'PUBLISH CHANGES')}
        </button>
      </div>

      <UnsplashModal 
        isOpen={false} 
        onClose={() => {}} 
        onSelect={() => {}} 
      />

      <IconPickerModal
        isOpen={false}
        onClose={() => {}}
        onSelect={() => {}}
      />
    </aside>
  );
};

export default Sidebar;
