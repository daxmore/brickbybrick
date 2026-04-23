import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ProjectContext = createContext();

const DEFAULT_STYLES = {
  bgColor: "#ffffff",
  primaryColor: "#5b76fe",
  textColor: "#1c1c1e",
  accentColor: "#ffc6c6",
  borderRadius: "8px",
  fontSize: "16px",
  fontFamily: "'Inter', sans-serif",
  sectionPadding: "60px",
  contentGap: "32px",
  navBg: "#ffffff",
  footerBg: "#1c1c1e"
};

const INITIAL_NODES = [
  { 
    id: 'n_1', 
    type: 'navbar', 
    props: { logo: 'Chameleon', links: ['Home', 'About', 'Pricing'] },
    styles: {},
    children: [] 
  },
  { 
    id: 'n_2', 
    type: 'hero', 
    props: { title: 'Build the future of visual collaboration', subtitle: 'Create, collaborate, and centralize communication for your entire team.', showCta: true, ctaText: 'Get Started' },
    styles: {},
    children: [] 
  },
  { 
    id: 'n_3', 
    type: 'footer', 
    props: { brandName: 'Chameleon Builder', copyright: '© 2026 Chameleon Inc.' },
    styles: {},
    children: [] 
  }
];

export const ProjectProvider = ({ children }) => {
  const [activeProject, setActiveProjectState] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [deviceView, setDeviceView] = useState('desktop'); // desktop, tablet, mobile
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  
  // History State
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);

  const [pages, setPages] = useState(() => {
    const saved = localStorage.getItem('builder_pages');
    const parsed = saved ? JSON.parse(saved) : [];
    
    // Migration logic for V1/V2 pages (blocks -> nodes)
    return parsed.map(page => {
      if (page.blocks && !page.nodes) {
        return {
          ...page,
          nodes: page.blocks.map(block => ({
            ...block,
            id: block.id.replace('b_', 'n_'),
            styles: block.styles || {},
            children: block.children || []
          }))
        };
      }
      return page;
    });
  });
  
  const [currentPage, setCurrentPage] = useState({
    id: "",
    name: "",
    nodes: [...INITIAL_NODES],
    styles: { ...DEFAULT_STYLES }
  });

  const pushToHistory = useCallback(() => {
    setPast(prev => [...prev.slice(-19), currentPage.nodes]); // Keep last 20 states
    setFuture([]);
  }, [currentPage.nodes]);

  const undo = useCallback(() => {
    if (past.length === 0) return;
    
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    
    setFuture(prev => [currentPage.nodes, ...prev]);
    setPast(newPast);
    setCurrentPage(prev => ({ ...prev, nodes: previous }));
  }, [past, currentPage.nodes]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    
    const next = future[0];
    const newFuture = future.slice(1);
    
    setPast(prev => [...prev, currentPage.nodes]);
    setFuture(newFuture);
    setCurrentPage(prev => ({ ...prev, nodes: next }));
  }, [future, currentPage.nodes]);

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

  // --- Recursive Helper Functions ---

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

  const updateNodeInTree = (nodes, id, updateFn) => {
    return nodes.map(node => {
      if (node.id === id) {
        return updateFn(node);
      }
      if (node.children) {
        return { ...node, children: updateNodeInTree(node.children, id, updateFn) };
      }
      return node;
    });
  };

  const removeNodeAndReturn = (nodes, id) => {
    let removed = null;
    const filtered = nodes.filter(node => {
      if (node.id === id) {
        removed = node;
        return false;
      }
      if (node.children && node.children.length > 0) {
        const result = removeNodeAndReturn(node.children, id);
        if (result.removed) {
          removed = result.removed;
          node.children = result.nodes;
        }
      }
      return true;
    });
    return { nodes: filtered, removed };
  };

  // --- CRUD Operations ---

  const addNode = (type, parentId = null, index = null) => {
    pushToHistory();
    const newNode = { 
      id: `n_${Date.now()}`, 
      type, 
      name: type,
      props: {}, 
      styles: {}, 
      children: [],
      isHidden: false,
      isLocked: false
    };

    setCurrentPage(prev => {
      if (!parentId) {
        const newNodes = [...prev.nodes];
        if (index !== null) newNodes.splice(index, 0, newNode);
        else newNodes.push(newNode);
        return { ...prev, nodes: newNodes };
      } else {
        return {
          ...prev,
          nodes: updateNodeInTree(prev.nodes, parentId, (node) => {
            const newChildren = [...(node.children || [])];
            if (index !== null) newChildren.splice(index, 0, newNode);
            else newChildren.push(newNode);
            return { ...node, children: newChildren };
          })
        };
      }
    });
    setSelectedNodeId(newNode.id);
  };

  const moveNode = (nodeId, targetParentId, index) => {
    pushToHistory();
    setCurrentPage(prev => {
      const { nodes: nodesAfterRemoval, removedNode } = removeNodeAndReturn(prev.nodes, nodeId);
      if (!removedNode) return prev;

      if (!targetParentId) {
        const newNodes = [...nodesAfterRemoval];
        if (index !== null) newNodes.splice(index, 0, removedNode);
        else newNodes.push(removedNode);
        return { ...prev, nodes: newNodes };
      } else {
        const newNodes = updateNodeInTree(nodesAfterRemoval, targetParentId, (node) => {
          const newChildren = [...(node.children || [])];
          if (index !== null) newChildren.splice(index, 0, removedNode);
          else newChildren.push(removedNode);
          return { ...node, children: newChildren };
        });
        return { ...prev, nodes: newNodes };
      }
    });
  };

  const deleteNode = (id) => {
    pushToHistory();
    setCurrentPage(prev => ({
      ...prev,
      nodes: removeNodeAndReturn(prev.nodes, id).nodes
    }));
    if (selectedNodeId === id) setSelectedNodeId(null);
  };

  const updateNodeStyles = (id, newStyles) => {
    // Note: We don't push to history for every keystroke in styles 
    // to avoid bloating history. We could debunce this later.
    setCurrentPage(prev => ({
      ...prev,
      nodes: updateNodeInTree(prev.nodes, id, (node) => {
        const styleKey = deviceView === 'desktop' ? 'styles' : (deviceView === 'tablet' ? 'tabletStyles' : 'mobileStyles');
        return {
          ...node,
          [styleKey]: { ...(node[styleKey] || {}), ...newStyles }
        };
      })
    }));
  };

  const updateNodeProps = (id, newProps) => {
    pushToHistory();
    setCurrentPage(prev => ({
      ...prev,
      nodes: updateNodeInTree(prev.nodes, id, (node) => ({
        ...node,
        props: { ...node.props, ...newProps },
        ...newProps // For metadata like name, isHidden, isLocked
      }))
    }));
  };

  const duplicateNode = (id) => {
    pushToHistory();
    const nodeToDuplicate = findNodeById(currentPage.nodes, id);
    if (!nodeToDuplicate) return;

    const createCopy = (node) => ({
      ...node,
      id: `n_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      children: (node.children || []).map(createCopy)
    });

    const copy = createCopy(nodeToDuplicate);
    
    // Simple logic: insert after original in same parent
    setCurrentPage(prev => {
      const insertAfter = (nodes) => {
        const index = nodes.findIndex(n => n.id === id);
        if (index > -1) {
          const newNodes = [...nodes];
          newNodes.splice(index + 1, 0, copy);
          return newNodes;
        }
        return nodes.map(n => n.children ? { ...n, children: insertAfter(n.children) } : n);
      };
      return { ...prev, nodes: insertAfter(prev.nodes) };
    });
    setSelectedNodeId(copy.id);
  };

  // --- Navigation & Page Management ---

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
        nodes: [...INITIAL_NODES],
        styles: { ...DEFAULT_STYLES }
      });
    }
  };

  const renamePage = (id, newName) => {
    const updatedPages = pages.map(p => p.id === id ? { ...p, name: newName } : p);
    setPages(updatedPages);
    localStorage.setItem('builder_pages', JSON.stringify(updatedPages));
    if (currentPage.id === id) {
      setCurrentPage(prev => ({ ...prev, name: newName }));
    }
  };

  const duplicatePage = (id) => {
    const pageToDuplicate = pages.find(p => p.id === id);
    if (!pageToDuplicate) return;

    const newId = `page_${Date.now()}`;
    const duplicatedPage = {
      ...pageToDuplicate,
      id: newId,
      name: `${pageToDuplicate.name} (Copy)`,
      createdAt: new Date().toISOString()
    };

    const updatedPages = [...pages, duplicatedPage];
    setPages(updatedPages);
    localStorage.setItem('builder_pages', JSON.stringify(updatedPages));
  };

  const navigateTo = (view) => {
    setActiveView(view);
  };

  const updateStyle = (key, value) => {
    setCurrentPage(prev => ({
      ...prev,
      styles: { ...prev.styles, [key]: value }
    }));
  };

  return (
    <ProjectContext.Provider value={{
      activeProject,
      setActiveProject: setActiveProjectState,
      activeView,
      navigateTo,
      pages,
      currentPage,
      setCurrentPage,
      updateStyle,
      savePage,
      loadPage,
      deletePage,
      renamePage,
      duplicatePage,
      deviceView,
      setDeviceView,
      previewMode,
      setPreviewMode,
      selectedNodeId,
      setSelectedNodeId,
      hoveredNodeId,
      setHoveredNodeId,
      undo,
      redo,
      canUndo: past.length > 0,
      canRedo: future.length > 0,
      addNode,
      moveNode,
      deleteNode,
      updateNodeStyles,
      updateNodeProps,
      duplicateNode,
      setNodes: (nodes) => setCurrentPage(prev => ({ ...prev, nodes }))
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useProject = () => useContext(ProjectContext);
