import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';

const Dashboard = () => {
  const { 
    pages, 
    navigateTo, 
    setActiveProject, 
    setCurrentPage, 
    loadPage, 
    deletePage 
  } = useProject();
  
  const [showModal, setShowModal] = useState(false);
  const [newPageName, setNewPageName] = useState('');

  const projects = [
    {
      name: 'Startup',
      tagline: 'Modern solutions',
      colors: ['#0f172a', '#38bdf8', '#ffffff'],
      type: 'startup'
    },
    {
      name: 'Clothing',
      tagline: 'Clean aesthetics',
      colors: ['#fafaf9', '#1c1917', '#1c1917'],
      type: 'clothing'
    },
    {
      name: 'Hospital',
      tagline: 'Compassionate care',
      colors: ['#ffffff', '#0284c7', '#1e293b'],
      type: 'hospital'
    }
  ];

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
        primaryColor: "#0284c7",
        textColor: "#1e293b",
        accentColor: "#0284c7",
        borderRadius: "12px",
        fontSize: "16px",
        fontFamily: "'Open Sans', sans-serif",
        sectionPadding: "60px",
        navBg: "#ffffff",
        footerBg: "#f8fafc"
      }
    };

    const newPageId = `template_${project.type}_${Date.now()}`;
    const newPage = {
      id: newPageId,
      name: `My ${project.name} Page`,
      blocks: [
        { id: `b_${Date.now()}_1`, type: 'navbar', props: { logo: project.name } },
        { id: `b_${Date.now()}_2`, type: 'hero', props: { title: `Modern ${project.name} Solutions` } },
        { id: `b_${Date.now()}_3`, type: 'footer', props: { brandName: project.name } }
      ],
      styles: presets[project.type]
    };

    setActiveProject(project.type);
    setCurrentPage(newPage);
    navigateTo('canvas');
  }, [setActiveProject, setCurrentPage, navigateTo]);

  const handleCreateBlank = React.useCallback(() => {
    if (!newPageName) return;
    const newPageId = `page_${Date.now()}`;
    const newPage = {
      id: newPageId,
      name: newPageName,
      blocks: [
        { id: `b_${Date.now()}_1`, type: 'navbar', props: { logo: newPageName } },
        { id: `b_${Date.now()}_2`, type: 'hero', props: { title: `Welcome to ${newPageName}` } },
        { id: `b_${Date.now()}_3`, type: 'footer', props: { brandName: newPageName } }
      ],
      styles: {
        bgColor: "#ffffff",
        primaryColor: "#5b76fe",
        textColor: "#1c1c1e",
        accentColor: "#ffc6c6",
        borderRadius: "8px",
        fontSize: "16px",
        fontFamily: "'Noto Sans', sans-serif",
        sectionPadding: "60px",
        navBg: "#ffffff",
        footerBg: "#1c1c1e"
      }
    };
    setCurrentPage(newPage);
    navigateTo('canvas');
    setShowModal(false);
  }, [newPageName, setCurrentPage, navigateTo]);

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#1c1c1e] font-sans">
      {/* Top Navbar */}
      <nav className="border-b border-[#e9eaef] py-4 px-8 flex justify-between items-center bg-white sticky top-0 z-10">
        <h1 className="text-xl font-bold tracking-tight">Page Builder</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500">{pages.length} saved pages</span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto py-12 px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {projects.map((project) => (
            <div 
              key={project.name}
              className="group border border-[#c7cad5] rounded-xl p-6 hover:shadow-xl transition-all hover:-translate-y-1 bg-white"
            >
              <h3 className="text-2xl font-bold mb-2">{project.name}</h3>
              <p className="text-slate-500 mb-6">{project.tagline}</p>
              
              <div className="flex gap-2 mb-8">
                {project.colors.map((color, i) => (
                  <div 
                    key={i} 
                    className="w-4 h-4 rounded-full border border-slate-100" 
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <button 
                onClick={() => handleOpenTemplate(project)}
                className="w-full py-3 bg-[#5b76fe] text-white font-bold rounded-lg hover:bg-[#2a41b6] transition-colors"
              >
                Open Builder
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-center mb-16">
          <button 
            onClick={() => setShowModal(true)}
            className="px-8 py-4 border-2 border-dashed border-[#c7cad5] rounded-xl text-lg font-bold text-slate-400 hover:border-[#5b76fe] hover:text-[#5b76fe] transition-all"
          >
            + New Blank Page
          </button>
        </div>

        {/* Saved Pages Section */}
        {pages.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Saved Pages</h2>
            <div className="bg-white border border-[#c7cad5] rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-[#c7cad5]">
                  <tr>
                    <th className="px-6 py-4 font-bold">Name</th>
                    <th className="px-6 py-4 font-bold">Created</th>
                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e9eaef]">
                  {pages.map((page) => (
                    <tr key={page.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium">{page.name}</td>
                      <td className="px-6 py-4 text-slate-500 text-sm">
                        {page.createdAt ? new Date(page.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-3">
                        <button 
                          onClick={() => loadPage(page.id)}
                          className="px-4 py-2 text-[#5b76fe] font-bold hover:bg-[#5b76fe]/10 rounded-md transition-colors"
                        >
                          Load
                        </button>
                        <button 
                          onClick={() => deletePage(page.id)}
                          className="px-4 py-2 text-red-500 font-bold hover:bg-red-50 rounded-md transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {/* New Blank Page Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-[#c7cad5]">
            <h2 className="text-2xl font-bold mb-6">New Page</h2>
            <input 
              autoFocus
              type="text" 
              placeholder="Enter page name..." 
              className="w-full p-4 border border-[#c7cad5] rounded-lg mb-6 focus:ring-2 focus:ring-[#5b76fe] outline-none"
              value={newPageName}
              onChange={(e) => setNewPageName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateBlank()}
            />
            <div className="flex gap-4">
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateBlank}
                className="flex-1 py-3 bg-[#5b76fe] text-white font-bold rounded-lg hover:bg-[#2a41b6] transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
