import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { 
  ChevronRight, ChevronDown, Eye, EyeOff, 
  Lock, Unlock, Trash2, Edit3, GripVertical 
} from 'lucide-react';

const LayerItem = ({ node, level = 0 }) => {
  const { 
    selectedNodeId, 
    setSelectedNodeId, 
    deleteNode, 
    updateNodeProps,
    moveNode 
  } = useProject();
  
  const [isOpen, setIsOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(node.name || node.type);
  
  const isSelected = selectedNodeId === node.id;
  const hasChildren = node.children && node.children.length > 0;

  const handleToggleVisibility = (e) => {
    e.stopPropagation();
    updateNodeProps(node.id, { isHidden: !node.isHidden });
  };

  const handleToggleLock = (e) => {
    e.stopPropagation();
    updateNodeProps(node.id, { isLocked: !node.isLocked });
  };

  const handleRename = () => {
    updateNodeProps(node.id, { name: tempName });
    setIsEditing(false);
  };

  // Drag and Drop handlers
  const onDragStart = (e) => {
    e.dataTransfer.setData('nodeId', node.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (e) => {
    e.preventDefault();
    const draggedNodeId = e.dataTransfer.getData('nodeId');
    if (draggedNodeId === node.id) return;
    
    // Logic: If drop on a container, add as child. 
    // For simplicity in this version, we'll implement "drop on node = add as first child"
    // and we'll need a way to drop "between" nodes later.
    if (node.type === 'Box' || node.type === 'Container') {
      moveNode(draggedNodeId, node.id, 0);
    }
  };

  return (
    <div 
      className="select-none"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div 
        draggable
        onDragStart={onDragStart}
        className={`flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer transition-colors group ${isSelected ? 'bg-[#5b76fe] text-white' : 'hover:bg-slate-100 text-slate-600'}`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => setSelectedNodeId(node.id)}
      >
        <div className="opacity-0 group-hover:opacity-50 cursor-grab active:cursor-grabbing">
          <GripVertical size={10} />
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
          className={`p-0.5 rounded hover:bg-white/20 ${!hasChildren ? 'invisible' : ''}`}
        >
          {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </button>

        <div className="flex-1 flex items-center min-w-0 gap-2">
          {isEditing ? (
            <input 
              autoFocus
              className="bg-white text-slate-800 text-xs px-1 rounded w-full outline-none"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => e.key === 'Enter' && handleRename()}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span 
              className={`text-xs font-bold truncate ${node.isHidden ? 'opacity-30' : ''}`}
              onDoubleClick={() => setIsEditing(true)}
            >
              {node.name || node.type}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={handleToggleVisibility}
            className={`p-1 rounded hover:bg-white/20 ${node.isHidden ? 'text-red-400 opacity-100' : ''}`}
          >
            {node.isHidden ? <EyeOff size={10} /> : <Eye size={10} />}
          </button>
          <button 
            onClick={handleToggleLock}
            className={`p-1 rounded hover:bg-white/20 ${node.isLocked ? 'text-orange-400 opacity-100' : ''}`}
          >
            {node.isLocked ? <Lock size={10} /> : <Unlock size={10} />}
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); deleteNode(node.id); }}
            className="p-1 rounded hover:bg-red-500 hover:text-white"
          >
            <Trash2 size={10} />
          </button>
        </div>
      </div>
      
      {isOpen && hasChildren && (
        <div className="mt-1">
          {node.children.map(child => (
            <LayerItem key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const LayersPanel = () => {
  const { currentPage, moveNode } = useProject();

  const onDropToRoot = (e) => {
    e.preventDefault();
    const nodeId = e.dataTransfer.getData('nodeId');
    moveNode(nodeId, null, null); // Move to end of root
  };

  return (
    <div 
      className="p-4 h-full flex flex-col"
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDropToRoot}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Layers</h3>
        <span className="text-[10px] font-bold text-slate-300 bg-slate-50 px-2 py-0.5 rounded-full">
          {countNodes(currentPage.nodes)} TOTAL
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-1">
        {(currentPage.nodes || []).map(node => (
          <LayerItem key={node.id} node={node} />
        ))}
        
        {(!currentPage.nodes || currentPage.nodes.length === 0) && (
          <div className="py-10 text-center opacity-20 italic text-xs">
            No layers yet
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200">
        <p className="text-[9px] text-slate-400 font-medium leading-relaxed">
          TIP: Drag layers to reorder. Drop onto a Box to nest. Double-click to rename.
        </p>
      </div>
    </div>
  );
};

const countNodes = (nodes) => {
  if (!nodes) return 0;
  let count = nodes.length;
  nodes.forEach(node => {
    if (node.children) count += countNodes(node.children);
  });
  return count;
};

export default LayersPanel;
