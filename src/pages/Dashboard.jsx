import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { 
  Plus, 
  Trash2, 
  ExternalLink, 
  Copy, 
  Edit3, 
  Clock, 
  Layout, 
  Search,
  ChevronRight,
  Monitor
} from 'lucide-react';

const Dashboard = () => {
  const { 
    pages, 
    navigateTo, 
    setCurrentPage, 
    loadPage, 
    deletePage,
    renamePage,
    duplicatePage
  } = useProject();
  
  const [showModal, setShowModal] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [searchQuery, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [tempName, setTempName] = useState('');

  const projects = [
    {
      name: 'Startup',
      tagline: 'SaaS & Tech',
      colors: ['#0f172a', '#38bdf8', '#ffffff'],
      type: 'startup'
    },
    {
      name: 'Portfolio',
      tagline: 'Creative & Clean',
      colors: ['#fafaf9', '#1c1917', '#1c1917'],
      type: 'clothing'
    },
    {
      name: 'Business',
      tagline: 'Professional & Bold',
      colors: ['#ffffff', '#5b76fe', '#1e293b'],
      type: 'hospital'
    }
  ];

  const filteredPages = pages.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  const handleOpenTemplate = React.useCallback((project) => {
    const presets = {
      startup: {
        bgColor: "#0f172a",
        primaryColor: "#38bdf8",
        textColor: "#ffffff",
        accentColor: "#38bdf8",
        borderRadius: "4px",
        fontSize: "16px",
        fontFamily: "'Inter', sans-serif",
        sectionPadding: "80px",
        navBg: "#0f172a",
        footerBg: "#1e293b"
      },
      clothing: {
        bgColor: "#fafaf9",
        primaryColor: "#1c1917",
        textColor: "#1c1917",
        accentColor: "#1c1917",
        borderRadius: "0px",
        fontSize: "18px",
        fontFamily: "'Georgia', serif",
        sectionPadding: "100px",
        navBg: "#fafaf9",
        footerBg: "#1c1917"
      },
      hospital: {
        bgColor: "#ffffff",
        primaryColor: "#5b76fe",
        textColor: "#1e293b",
        accentColor: "#5b76fe",
        borderRadius: "12px",
        fontSize: "16px",
        fontFamily: "'Inter', sans-serif",
        sectionPadding: "60px",
        navBg: "#ffffff",
        footerBg: "#f8fafc"
      }
    };

    const nodePresets = {
      startup: [
        { id: `n_${Date.now()}_1`, type: 'navbar', props: { logo: project.name }, styles: {}, children: [] },
        { id: `n_${Date.now()}_2`, type: 'hero', props: { title: `Modern ${project.name} Solutions` }, styles: {}, children: [] },
        { id: `n_${Date.now()}_3`, type: 'features', props: {}, styles: {}, children: [] },
        { id: `n_${Date.now()}_4`, type: 'blogList', props: { title: 'Engineering the Future' }, styles: {}, children: [] },
        { id: `n_${Date.now()}_5`, type: 'footer', props: { brandName: project.name }, styles: {}, children: [] }
      ],
      clothing: [
        { id: `n_${Date.now()}_1`, type: 'navbar', props: { logo: project.name }, styles: {}, children: [] },
        { id: `n_${Date.now()}_2`, type: 'hero', props: { title: `The ${project.name} Aesthetic` }, styles: {}, children: [] },
        { id: `n_${Date.now()}_3`, type: 'caseStudy', props: { title: 'Recent Collaborations' }, styles: {}, children: [] },
        { id: `n_${Date.now()}_4`, type: 'gallery', props: {}, styles: {}, children: [] },
        { id: `n_${Date.now()}_5`, type: 'footer', props: { brandName: project.name }, styles: {}, children: [] }
      ],
      hospital: [
        { id: `n_${Date.now()}_1`, type: 'navbar', props: { logo: project.name }, styles: {}, children: [] },
        { id: `n_${Date.now()}_2`, type: 'hero', props: { title: `${project.name} Excellence` }, styles: {}, children: [] },
        { id: `n_${Date.now()}_3`, type: 'features', props: {}, styles: {}, children: [] },
        { id: `n_${Date.now()}_4`, type: 'blogList', props: { title: 'Health & Wellness Hub' }, styles: {}, children: [] },
        { id: `n_${Date.now()}_5`, type: 'faq', props: {}, styles: {}, children: [] },
        { id: `n_${Date.now()}_6`, type: 'footer', props: { brandName: project.name }, styles: {}, children: [] }
      ]
    };

    const newPageId = `template_${project.type}_${Date.now()}`;
    const newPage = {
      id: newPageId,
      name: `My ${project.name} Page`,
      nodes: nodePresets[project.type],
      styles: presets[project.type]
    };

    setCurrentPage(newPage);
    navigateTo('canvas');
  }, [setCurrentPage, navigateTo]);

  const handleCreateBlank = React.useCallback(() => {
    if (!newPageName) return;
    const newPageId = `page_${Date.now()}`;
    const newPage = {
      id: newPageId,
      name: newPageName,
      nodes: [
        { id: `n_${Date.now()}_1`, type: 'navbar', props: { logo: newPageName }, styles: {}, children: [] },
        { id: `n_${Date.now()}_2`, type: 'hero', props: { title: `Welcome to ${newPageName}` }, styles: {}, children: [] },
        { id: `n_${Date.now()}_3`, type: 'footer', props: { brandName: newPageName }, styles: {}, children: [] }
      ],
      styles: {
        bgColor: "#ffffff",
        primaryColor: "#5b76fe",
        textColor: "#1c1c1e",
        accentColor: "#ffc6c6",
        borderRadius: "8px",
        fontSize: "16px",
        fontFamily: "'Inter', sans-serif",
        sectionPadding: "60px",
        navBg: "#ffffff",
        footerBg: "#1c1c1e"
      }
    };
    setCurrentPage(newPage);
    navigateTo('canvas');
    setShowModal(false);
    setNewPageName('');
  }, [newPageName, setCurrentPage, navigateTo]);

  const startRenaming = (page) => {
    setEditingId(page.id);
    setTempName(page.name);
  };

  const submitRename = (id) => {
    if (tempName.trim()) {
      renamePage(id, tempName.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1c1c1e] font-sans pb-20">
      {/* Top Navbar */}
      <nav className="border-b border-slate-200 py-4 px-10 flex justify-between items-center bg-white sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#5b76fe] rounded-xl flex items-center justify-center text-white">
            <Layout size={24} />
          </div>
          <h1 className="text-xl font-black tracking-tighter">CHAMELEON</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search pages..." 
              value={searchQuery}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-[#5b76fe] outline-none"
            />
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-[#5b76fe] text-white px-5 py-2.5 rounded-full font-bold text-sm hover:shadow-lg hover:shadow-[#5b76fe]/20 transition-all flex items-center gap-2"
          >
            <Plus size={18} /> New Page
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-10">
        {/* Templates Section */}
        <section className="mb-16">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-black tracking-tight mb-1">Start from a Template</h2>
              <p className="text-slate-500 font-medium">Quickly launch with a professionally designed layout</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div 
                key={project.name}
                onClick={() => handleOpenTemplate(project)}
                className="group relative cursor-pointer"
              >
                <div 
                  className="aspect-[4/3] rounded-3xl mb-4 overflow-hidden border-2 border-transparent group-hover:border-[#5b76fe] transition-all shadow-md group-hover:shadow-xl p-8 flex flex-col justify-between"
                  style={{ backgroundColor: project.colors[0] }}
                >
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white">
                      <Monitor size={24} />
                    </div>
                    <div className="flex -space-x-2">
                      {project.colors.map((c, i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white/20" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>
                  <div className="text-white">
                    <h3 className="text-2xl font-black mb-1">{project.name}</h3>
                    <p className="text-white/60 font-bold text-sm uppercase tracking-widest">{project.tagline}</p>
                  </div>
                  <div className="absolute inset-0 bg-[#5b76fe]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="bg-white text-[#5b76fe] px-6 py-3 rounded-2xl font-black flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      USE TEMPLATE <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Saved Pages Section */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-black tracking-tight mb-1">Your Pages</h2>
              <p className="text-slate-500 font-medium">Manage and edit your saved designs</p>
            </div>
            <div className="text-sm font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-lg">
              {filteredPages.length} TOTAL
            </div>
          </div>

          {filteredPages.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredPages.map((page) => (
                <div 
                  key={page.id} 
                  className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-[#5b76fe] transition-all group flex items-center gap-6"
                >
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-[#5b76fe]/10 group-hover:text-[#5b76fe] transition-colors shrink-0">
                    <Layout size={32} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {editingId === page.id ? (
                      <div className="flex items-center gap-2">
                        <input 
                          autoFocus
                          type="text" 
                          value={tempName}
                          onChange={(e) => setTempName(e.target.value)}
                          onBlur={() => submitRename(page.id)}
                          onKeyDown={(e) => e.key === 'Enter' && submitRename(page.id)}
                          className="text-lg font-bold text-slate-800 bg-slate-50 border-2 border-[#5b76fe] rounded-lg px-2 py-1 outline-none w-full max-w-md"
                        />
                      </div>
                    ) : (
                      <h4 className="text-lg font-bold text-slate-800 truncate mb-1 flex items-center gap-2">
                        {page.name}
                        <button 
                          onClick={() => startRenaming(page)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-[#5b76fe] transition-all"
                        >
                          <Edit3 size={14} />
                        </button>
                      </h4>
                    )}
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {page.updatedAt ? `Edited ${new Date(page.updatedAt).toLocaleDateString()}` : `Created ${new Date(page.createdAt || 0).toLocaleDateString()}`}
                      </span>
                      <span>•</span>
                      <span>{(page.nodes || page.blocks || []).length} Sections</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => loadPage(page.id)}
                      className="px-6 py-2.5 bg-slate-900 text-white font-black text-xs rounded-xl hover:bg-[#5b76fe] transition-all flex items-center gap-2"
                    >
                      EDIT <ExternalLink size={14} />
                    </button>
                    <div className="w-[1px] h-8 bg-slate-200 mx-2" />
                    <button 
                      onClick={() => duplicatePage(page.id)}
                      className="p-2.5 text-slate-400 hover:text-[#5b76fe] hover:bg-slate-50 rounded-xl transition-all"
                      title="Duplicate"
                    >
                      <Copy size={18} />
                    </button>
                    <button 
                      onClick={() => deletePage(page.id)}
                      className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                <Search size={40} />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">No pages found</h3>
              <p className="text-slate-500 font-bold mb-8">Start by creating a new blank page or use a template.</p>
              <button 
                onClick={() => setShowModal(true)}
                className="bg-[#5b76fe] text-white px-8 py-3 rounded-2xl font-black hover:shadow-xl transition-all"
              >
                CREATE YOUR FIRST PAGE
              </button>
            </div>
          )}
        </section>
      </main>

      {/* New Blank Page Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] p-10 max-w-md w-full shadow-2xl border border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-[#5b76fe]" />
            <h2 className="text-3xl font-black tracking-tight mb-2">New Page</h2>
            <p className="text-slate-500 font-bold text-sm mb-8 uppercase tracking-widest">GIVE YOUR PROJECT A NAME</p>
            
            <input 
              autoFocus
              type="text" 
              placeholder="e.g. Awesome SaaS Landing" 
              className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl mb-8 focus:border-[#5b76fe] focus:bg-white outline-none text-lg font-bold transition-all"
              value={newPageName}
              onChange={(e) => setNewPageName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateBlank()}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => { setShowModal(false); setNewPageName(''); }}
                className="py-4 text-slate-500 font-black hover:bg-slate-50 rounded-2xl transition-colors text-sm uppercase tracking-widest"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateBlank}
                disabled={!newPageName.trim()}
                className="py-4 bg-[#5b76fe] text-white font-black rounded-2xl hover:shadow-lg hover:shadow-[#5b76fe]/30 disabled:opacity-50 disabled:shadow-none transition-all text-sm uppercase tracking-widest"
              >
                Create Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
