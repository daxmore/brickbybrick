import React from 'react';
import { useProject } from '../context/ProjectContext';
import { Reorder, useDragControls } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import NavbarBlock from '../components/blocks/NavbarBlock';
import HeroBlock from '../components/blocks/HeroBlock';
import FooterBlock from '../components/blocks/FooterBlock';
import FeatureGridBlock from '../components/blocks/FeatureGridBlock';
import PricingBlock from '../components/blocks/PricingBlock';
import TestimonialBlock from '../components/blocks/TestimonialBlock';
import FAQBlock from '../components/blocks/FAQBlock';
import ContactBlock from '../components/blocks/ContactBlock';
import LogoCloudBlock from '../components/blocks/LogoCloudBlock';
import TeamBlock from '../components/blocks/TeamBlock';
import GalleryBlock from '../components/blocks/GalleryBlock';
import BlogListBlock from '../components/blocks/BlogListBlock';
import InteractiveCaseStudyBlock from '../components/blocks/InteractiveCaseStudyBlock';
import StatsBlock from '../components/blocks/StatsBlock';
import NewsletterBlock from '../components/blocks/NewsletterBlock';
import EditorialBlock from '../components/blocks/EditorialBlock';
import { Trash2, ArrowUp, ArrowDown, Copy, Plus, X, Eye, EyeOff, Monitor, Smartphone, Tablet, Layout, Code, GripVertical, Menu, Image, MessageSquare, HelpCircle, Users, BookOpen, Briefcase, Hash, Mail, FileText } from 'lucide-react';

const BLOCK_MAP = {
  navbar: NavbarBlock,
  hero: HeroBlock,
  footer: FooterBlock,
  features: FeatureGridBlock,
  pricing: PricingBlock,
  testimonials: TestimonialBlock,
  faq: FAQBlock,
  contact: ContactBlock,
  logos: LogoCloudBlock,
  team: TeamBlock,
  gallery: GalleryBlock,
  blogList: BlogListBlock,
  caseStudy: InteractiveCaseStudyBlock,
  stats: StatsBlock,
  newsletter: NewsletterBlock,
  editorial: EditorialBlock
};

const UnknownBlock = ({ type }) => (
  <div className="p-12 border-2 border-dashed border-[#c7cad5] text-center text-slate-400 bg-slate-50 font-bold">
    Unknown block: {type}
  </div>
);

const BlockWrapper = ({ block, index, total, editMode }) => {
  const { reorderBlocks, deleteBlock, duplicateBlock, addBlock, previewMode } = useProject();
  const controls = useDragControls();

  const BlockComponent = BLOCK_MAP[block.type] || UnknownBlock;

  if (previewMode) {
    return (
      <div className="relative group/block">
        <BlockComponent id={block.id} props={block.props || {}} editMode={false} />
      </div>
    );
  }

  return (
    <Reorder.Item 
      value={block} 
      id={block.id}
      dragListener={false}
      dragControls={controls}
      className="relative group/block bg-white"
    >
      {/* Insert Before */}
      {editMode && !previewMode && (
        <button 
          onClick={() => addBlock('hero', index)}
          className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5b76fe] text-white p-1 rounded-full opacity-0 group-hover/block:opacity-100 transition-opacity z-30 scale-75 hover:scale-100 shadow-lg"
          title="Insert block here"
        >
          <Plus size={16} />
        </button>
      )}

      {/* Block Controls */}
      {editMode && !previewMode && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/block:opacity-100 transition-opacity z-30 bg-white/95 p-1 rounded-lg border border-[#c7cad5] shadow-xl backdrop-blur-sm">
          <button
            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition-colors cursor-grab active:cursor-grabbing"
            onPointerDown={(e) => controls.start(e)}
            style={{ touchAction: "none" }}
            title="Drag to reorder"
          >
            <GripVertical size={14} />
          </button>
          <div className="w-[1px] bg-[#e9eaef] mx-0.5" />
          <button 
            disabled={index === 0}
            onClick={(e) => { e.stopPropagation(); reorderBlocks(index, index - 1); }}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 disabled:opacity-30 transition-colors"
          >
            <ArrowUp size={14} />
          </button>
          <button 
            disabled={index === total - 1}
            onClick={(e) => { e.stopPropagation(); reorderBlocks(index, index + 1); }}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 disabled:opacity-30 transition-colors"
          >
            <ArrowDown size={14} />
          </button>
          <div className="w-[1px] bg-[#e9eaef] mx-0.5" />
          <button 
            onClick={(e) => { e.stopPropagation(); duplicateBlock(block.id); }}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition-colors"
          >
            <Copy size={14} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }}
            className="p-1.5 hover:bg-red-50 rounded text-red-500 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}

      <div className="animate-entry">
        <BlockComponent id={block.id} props={block.props || {}} editMode={editMode && !previewMode} />
      </div>
    </Reorder.Item>
  );
};

const BlankCanvas = () => {
  const { currentPage, deviceView, setDeviceView, addBlock, previewMode, setPreviewMode, setBlocks } = useProject();
  const [showLibrary, setShowLibrary] = React.useState(false);
  const [insertIndex, setInsertIndex] = React.useState(null);

  const deviceWidths = {
    desktop: 'max-w-full',
    tablet: 'max-w-[768px]',
    mobile: 'max-w-[375px]'
  };

  const handleAddClick = (index = null) => {
    setInsertIndex(index);
    setShowLibrary(true);
  };

  const onSelectBlock = (type) => {
    addBlock(type, insertIndex);
    setShowLibrary(false);
    setInsertIndex(null);
  };

  return (
    <div className="flex min-h-screen bg-[#f5f6f7]">
      {!previewMode && <Sidebar />}
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Responsive Toolbar */}
        <div className="h-14 border-b border-[#c7cad5] bg-white flex justify-between items-center px-4 shrink-0 z-10 shadow-sm">
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
              <Eye size={20} />
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
        <div className={`flex-1 overflow-y-auto flex justify-center items-start scroll-smooth transition-all duration-500 ${previewMode ? 'p-0' : 'p-12'}`}>
          <div className={`bg-white shadow-[0_0_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden min-h-[85vh] transition-all duration-500 w-full ${deviceWidths[deviceView]} ${previewMode ? 'border-0' : 'border border-[#c7cad5]'}`}>
            
            {!previewMode ? (
              <Reorder.Group axis="y" values={currentPage.blocks || []} onReorder={setBlocks} className="w-full">
                {(currentPage.blocks || []).map((block, i) => (
                  <BlockWrapper 
                    key={block.id} 
                    block={block} 
                    index={i} 
                    total={(currentPage.blocks || []).length} 
                    editMode={true} 
                  />
                ))}
              </Reorder.Group>
            ) : (
              (currentPage.blocks || []).map((block, i) => (
                <BlockWrapper 
                  key={block.id} 
                  block={block} 
                  index={i} 
                  total={(currentPage.blocks || []).length} 
                  editMode={false} 
                />
              ))
            )}
            
            {/* Add Section Button */}
            {!previewMode && (
              <div className="py-16 flex justify-center bg-slate-50/50 border-t border-dashed border-[#c7cad5] group/add">
                <button 
                  onClick={() => handleAddClick()}
                  className="flex items-center gap-2 px-8 py-4 border-2 border-dashed border-[#c7cad5] rounded-2xl text-slate-400 font-bold hover:border-[#5b76fe] hover:text-[#5b76fe] hover:bg-white hover:shadow-xl transition-all"
                >
                  <Plus size={24} /> Add New Section
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Block Library Modal */}
        {showLibrary && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl border border-[#c7cad5]">
              <div className="p-6 border-b border-[#e9eaef] flex justify-between items-center bg-slate-50">
                <div>
                  <h2 className="text-2xl font-black text-slate-800">Add Section</h2>
                  <p className="text-sm text-slate-500">Choose a component to add to your page</p>
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
                      ]
                    },
                    {
                      category: "Conversion & Support",
                      blocks: [
                        { type: 'pricing', label: 'Pricing Table', desc: 'Clear tiered subscription plans', icon: <Code /> },
                        { type: 'faq', label: 'FAQ Accordion', desc: 'Answer common questions', icon: <HelpCircle /> },
                        { type: 'contact', label: 'Contact Form', desc: 'Let users reach out to you', icon: <Users /> },
                      ]
                    }
                  ].map(group => (
                    <div key={group.category}>
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">{group.category}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {group.blocks.map((item) => (
                          <button 
                            key={item.type}
                            onClick={() => onSelectBlock(item.type)}
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
