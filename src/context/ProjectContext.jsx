import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ProjectContext = createContext();

const DEFAULT_STYLES = {
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
};

const INITIAL_BLOCKS = [
  { id: 'b_1', type: 'navbar', props: { logo: 'Chameleon', links: ['Home', 'About', 'Pricing'] } },
  { id: 'b_2', type: 'hero', props: { title: 'Build the future of visual collaboration', subtitle: 'Create, collaborate, and centralize communication for your entire team.', showCta: true, ctaText: 'Get Started' } },
  { id: 'b_3', type: 'footer', props: { brandName: 'Chameleon Builder', copyright: '© 2026 Chameleon Inc.' } }
];

export const ProjectProvider = ({ children }) => {
  const [activeProject, setActiveProjectState] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [deviceView, setDeviceView] = useState('desktop'); // desktop, tablet, mobile
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  
  const [pages, setPages] = useState(() => {
    const saved = localStorage.getItem('builder_pages');
    const parsed = saved ? JSON.parse(saved) : [];
    // Migration logic for V1 pages
    return parsed.map(page => {
      if (page.components && !page.blocks) {
        return {
          ...page,
          blocks: page.components.map((type, i) => ({
            id: `b_${Date.now()}_${i}`,
            type,
            props: {} // Default props will be handled by components
          }))
        };
      }
      return page;
    });
  });
  
  const [currentPage, setCurrentPage] = useState({
    id: "",
    name: "",
    blocks: [...INITIAL_BLOCKS],
    styles: { ...DEFAULT_STYLES }
  });

  const savePage = useCallback(() => {
    if (!currentPage.id) return;
    
    setPages(prev => {
      const index = prev.findIndex(p => p.id === currentPage.id);
      let updatedPages;
      if (index > -1) {
        updatedPages = [...prev];
        updatedPages[index] = { ...currentPage, updatedAt: new Date().toISOString() };
      } else {
        updatedPages = [...prev, { ...currentPage, createdAt: new Date().toISOString() }];
      }
      localStorage.setItem('builder_pages', JSON.stringify(updatedPages));
      return updatedPages;
    });
  }, [currentPage]);

  // CSS Variable Injection
  useEffect(() => {
    const root = document.documentElement;
    const s = currentPage.styles;
    root.style.setProperty('--bg-color', s.bgColor);
    root.style.setProperty('--primary-color', s.primaryColor);
    root.style.setProperty('--text-color', s.textColor);
    root.style.setProperty('--accent-color', s.accentColor);
    root.style.setProperty('--border-radius', s.borderRadius);
    root.style.setProperty('--font-size', s.fontSize);
    root.style.setProperty('--font-family', s.fontFamily);
    root.style.setProperty('--font-weight', s.fontWeight || '400');
    root.style.setProperty('--section-padding', s.sectionPadding);
    root.style.setProperty('--nav-bg', s.navBg);
    root.style.setProperty('--footer-bg', s.footerBg);
  }, [currentPage.styles]);

  // AutoSave logic
  useEffect(() => {
    if (currentPage.id) {
      const timeoutId = setTimeout(() => {
        savePage();
      }, 1000); 
      return () => clearTimeout(timeoutId);
    }
  }, [currentPage, savePage]);

  const setActiveProject = (projectName) => {
    setActiveProjectState(projectName);
  };

  const updateStyle = (key, value) => {
    setCurrentPage(prev => ({
      ...prev,
      styles: { ...prev.styles, [key]: value }
    }));
  };

  const updateBlockProps = (blockId, newProps) => {
    setCurrentPage(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === blockId ? { ...b, props: { ...b.props, ...newProps } } : b)
    }));
  };

  const addBlock = (type, index = null) => {
    const newBlock = { id: `b_${Date.now()}`, type, props: {} };
    setCurrentPage(prev => {
      const newBlocks = [...prev.blocks];
      if (index !== null) {
        newBlocks.splice(index, 0, newBlock);
      } else {
        newBlocks.push(newBlock);
      }
      return { ...prev, blocks: newBlocks };
    });
    setSelectedBlockId(newBlock.id);
  };

  const deleteBlock = (blockId) => {
    setCurrentPage(prev => ({
      ...prev,
      blocks: prev.blocks.filter(b => b.id !== blockId)
    }));
    if (selectedBlockId === blockId) setSelectedBlockId(null);
  };

  const reorderBlocks = (fromIndex, toIndex) => {
    setCurrentPage(prev => {
      const newBlocks = [...prev.blocks];
      const [removed] = newBlocks.splice(fromIndex, 1);
      newBlocks.splice(toIndex, 0, removed);
      return { ...prev, blocks: newBlocks };
    });
  };

  const duplicateBlock = (blockId) => {
    setCurrentPage(prev => {
      const index = prev.blocks.findIndex(b => b.id === blockId);
      if (index === -1) return prev;
      const original = prev.blocks[index];
      const copy = { ...original, id: `b_${Date.now()}` };
      const newBlocks = [...prev.blocks];
      newBlocks.splice(index + 1, 0, copy);
      return { ...prev, blocks: newBlocks };
    });
  };

  const loadPage = (id) => {
    const page = pages.find(p => p.id === id);
    if (page) {
      setCurrentPage(page);
      setActiveView('canvas');
    }
  };

  const deletePage = (id) => {
    const updatedPages = pages.filter(p => p.id !== id);
    setPages(updatedPages);
    localStorage.setItem('builder_pages', JSON.stringify(updatedPages));
    if (currentPage.id === id) {
      setCurrentPage({
        id: "",
        name: "",
        blocks: [...INITIAL_BLOCKS],
        styles: { ...DEFAULT_STYLES }
      });
    }
  };

  const exportPageAsJSON = () => {
    const blob = new Blob(
      [JSON.stringify(currentPage, null, 2)],
      { type: 'application/json' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentPage.name || 'page'}.json`;
    a.click();
  };

  const importPageFromJSON = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        setCurrentPage(imported);
        setActiveView('canvas');
      } catch (err) {
        console.error("Failed to parse JSON file", err);
      }
    };
    reader.readAsText(file);
  };

  const navigateTo = (view) => {
    setActiveView(view);
  };

  return (
    <ProjectContext.Provider value={{
      activeProject,
      setActiveProject,
      activeView,
      navigateTo,
      pages,
      currentPage,
      setCurrentPage,
      updateStyle,
      savePage,
      loadPage,
      deletePage,
      exportPageAsJSON,
      importPageFromJSON,
      deviceView,
      setDeviceView,
      previewMode,
      setPreviewMode,
      selectedBlockId,
      setSelectedBlockId,
      updateBlockProps,
      addBlock,
      deleteBlock,
      reorderBlocks,
      duplicateBlock
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useProject = () => useContext(ProjectContext);
