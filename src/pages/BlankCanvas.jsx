import React from 'react';
import { useProject } from '../context/ProjectContext';
import Sidebar from '../components/Sidebar';
import NodeRenderer from '../components/NodeRenderer';
import { 
  Plus, X, Eye, EyeOff, Monitor, Smartphone, Tablet, 
  Layout, Code, Menu, Image, MessageSquare, HelpCircle, 
  Users, BookOpen, Briefcase, Hash, Mail, FileText, 
  Square, Type, Grid as GridIcon
} from 'lucide-react';

const BlankCanvas = () => {
  const { 
    currentPage, 
    deviceView, 
    setDeviceView, 
    addNode, 
    previewMode, 
    setPreviewMode,
    undo,
    redo,
    selectedNodeId,
    deleteNode,
    duplicateNode,
    moveNode,
    savePage
  } = useProject();
  
  const [showLibrary, setShowLibrary] = React.useState(false);

  // Keyboard Shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (previewMode) return;

      // Check if user is typing in an input or contentEditable
      const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable;
      
      // Undo/Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }

      // Delete
      if ((e.key === 'Backspace' || e.key === 'Delete') && !isInput && selectedNodeId) {
        e.preventDefault();
        deleteNode(selectedNodeId);
      }

      // Duplicate
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedNodeId) {
        e.preventDefault();
        duplicateNode(selectedNodeId);
      }

      // Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        savePage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewMode, undo, redo, selectedNodeId, deleteNode, duplicateNode, savePage]);

  const deviceWidths = {
    desktop: 'max-w-full',
    tablet: 'max-w-[768px]',
    mobile: 'max-w-[375px]'
  };

  const handleAddClick = () => {
    setShowLibrary(true);
  };

  const onSelectNode = (type) => {
    // If a Box node is selected, add as child. Otherwise add to root.
    // For now, let's just add to root to maintain existing behavior 
    // until we implement the full Layers panel.
    addNode(type);
    setShowLibrary(false);
  };

  const handleRootDrop = (e) => {
    if (previewMode) return;
    e.preventDefault();
    const nodeType = e.dataTransfer.getData('nodeType');
    const existingNodeId = e.dataTransfer.getData('nodeId');

    if (nodeType) {
      addNode(nodeType, null);
    } else if (existingNodeId) {
      moveNode(existingNodeId, null);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f5f6f7]">
      {!previewMode && <Sidebar />}
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Responsive Toolbar */}
        <div className="h-14 border-b border-[#c7cad5] bg-white flex justify-between items-center px-4 shrink-0 z-50 shadow-sm">
          <div className="flex-1">
            {previewMode && (
              <button 
                onClick={() => setPreviewMode(false)}
                className="text-xs font-black text-[#5b76fe] hover:underline flex items-center gap-2"
              >
                ← BACK TO EDITOR
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setDeviceView('desktop')}
              className={`p-2 rounded transition-all ${deviceView === 'desktop' ? 'bg-[#5b76fe]/10 text-[#5b76fe] ring-1 ring-[#5b76fe]/20' : 'hover:bg-slate-50 text-slate-400'}`}
            >
              <Monitor size={20} />
            </button>
            <button 
              onClick={() => setDeviceView('tablet')}
              className={`p-2 rounded transition-all ${deviceView === 'tablet' ? 'bg-[#5b76fe]/10 text-[#5b76fe] ring-1 ring-[#5b76fe]/20' : 'hover:bg-slate-50 text-slate-400'}`}
            >
              <Tablet size={20} />
            </button>
            <button 
              onClick={() => setDeviceView('mobile')}
              className={`p-2 rounded transition-all ${deviceView === 'mobile' ? 'bg-[#5b76fe]/10 text-[#5b76fe] ring-1 ring-[#5b76fe]/20' : 'hover:bg-slate-50 text-slate-400'}`}
            >
              <Smartphone size={20} />
            </button>
          </div>

          <div className="flex-1 flex justify-end">
            <button 
              onClick={() => setPreviewMode(!previewMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${previewMode ? 'bg-[#5b76fe] text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {previewMode ? <EyeOff size={16} /> : <Eye size={16} />}
              {previewMode ? 'Exit Preview' : 'Preview'}
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div 
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleRootDrop}
          className={`flex-1 overflow-y-auto flex justify-center items-start scroll-smooth transition-all duration-500 ${previewMode ? 'p-0' : 'p-12'}`}
        >
          <div className={`bg-white shadow-[0_0_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden min-h-[85vh] transition-all duration-500 w-full ${deviceWidths[deviceView]} ${previewMode ? 'border-0' : 'border border-[#c7cad5]'}`}>
            
            <div className="w-full">
              {(currentPage.nodes || []).map((node) => (
                <NodeRenderer key={node.id} node={node} />
              ))}
            </div>
            
            {/* Add Section Button */}
            {!previewMode && (
              <div className="py-16 flex justify-center bg-slate-50/50 border-t border-dashed border-[#c7cad5] group/add">
                <button 
                  onClick={handleAddClick}
                  className="flex items-center gap-2 px-8 py-4 border-2 border-dashed border-[#c7cad5] rounded-2xl text-slate-400 font-bold hover:border-[#5b76fe] hover:text-[#5b76fe] hover:bg-white hover:shadow-xl transition-all"
                >
                  <Plus size={24} /> Add New Node
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Node Library Modal */}
        {showLibrary && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl border border-[#c7cad5]">
              <div className="p-6 border-b border-[#e9eaef] flex justify-between items-center bg-slate-50">
                <div>
                  <h2 className="text-2xl font-black text-slate-800">Add Node</h2>
                  <p className="text-sm text-slate-500">Choose a primitive or hybrid component</p>
                </div>
                <button 
                  onClick={() => setShowLibrary(false)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8">
                <div className="space-y-8">
                  {[
                    {
                      category: "Primitives (Webflow Style)",
                      blocks: [
                        { type: 'Box', label: 'Box / Div', desc: 'Container for other elements', icon: <Square /> },
                        { type: 'Text', label: 'Text Block', desc: 'Heading or paragraph text', icon: <Type /> },
                        { type: 'Box', label: 'Grid / Flex', desc: 'Layout container', icon: <GridIcon /> },
                      ]
                    },
                    {
                      category: "Core & Conversion",
                      blocks: [
                        { type: 'navbar', label: 'Navigation', desc: 'Logo and menu links', icon: <Menu /> },
                        { type: 'hero', label: 'Hero Header', desc: 'Main section with title and CTA', icon: <Monitor /> },
                        { type: 'newsletter', label: 'Newsletter', desc: 'Simple email capture section', icon: <Mail /> },
                        { type: 'footer', label: 'Footer Section', desc: 'Site map and copyright info', icon: <ArrowDown /> },
                      ]
                    },
                    {
                      category: "Content & Proof",
                      blocks: [
                        { type: 'features', label: 'Feature Grid', desc: 'Showcase your core benefits', icon: <Layout /> },
                        { type: 'stats', label: 'Impact Stats', desc: 'Social proof with big numbers', icon: <Hash /> },
                        { type: 'editorial', label: 'Editorial Text', desc: 'Clean column for long-form text', icon: <FileText /> },
                        { type: 'logos', label: 'Logo Cloud', desc: 'Display partner/client logos', icon: <Image /> },
                        { type: 'blogList', label: 'Blog List', desc: 'Showcase your latest articles', icon: <BookOpen /> },
                        { type: 'testimonials', label: 'Testimonials', desc: 'Social proof from your users', icon: <MessageSquare /> },
                        { type: 'team', label: 'Team Grid', desc: 'Introduce your amazing team', icon: <Users /> },
                        { type: 'gallery', label: 'Image Gallery', desc: 'Showcase your work or office', icon: <Image /> },
                      ]
                    },
                    {
                      category: "Creative & Cinematic",
                      blocks: [
                        { type: 'caseStudy', label: 'Case Study', desc: 'Cinematic scroll-driven project reveal', icon: <Briefcase /> },
                        { type: 'circularHero', label: 'Circular Hero', desc: 'Modern rotating gallery header', icon: <Monitor /> },
                        { type: 'terminalHero', label: 'Terminal Hero', desc: 'Developer-focused text header', icon: <Code /> },
                      ]
                    }
                  ].map(group => (
                    <div key={group.category}>
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">{group.category}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {group.blocks.map((item) => (
                          <button 
                            key={item.label}
                            onClick={() => onSelectNode(item.type)}
                            className="group p-6 border border-[#c7cad5] rounded-3xl text-left hover:border-[#5b76fe] hover:bg-[#5b76fe]/5 transition-all hover:-translate-y-1"
                          >
                            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-[#5b76fe] group-hover:text-white transition-colors">
                              {React.cloneElement(item.icon, { size: 24 })}
                            </div>
                            <h4 className="font-bold text-slate-800 mb-1">{item.label}</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BlankCanvas;
