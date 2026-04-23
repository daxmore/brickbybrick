import React from 'react';
import { useProject } from '../context/ProjectContext';
import NavbarBlock from './blocks/NavbarBlock';
import HeroBlock from './blocks/HeroBlock';
import FooterBlock from './blocks/FooterBlock';
import FeatureGridBlock from './blocks/FeatureGridBlock';
import PricingBlock from './blocks/PricingBlock';
import TestimonialBlock from './blocks/TestimonialBlock';
import FAQBlock from './blocks/FAQBlock';
import ContactBlock from './blocks/ContactBlock';
import LogoCloudBlock from './blocks/LogoCloudBlock';
import TeamBlock from './blocks/TeamBlock';
import GalleryBlock from './blocks/GalleryBlock';
import BlogListBlock from './blocks/BlogListBlock';
import InteractiveCaseStudyBlock from './blocks/InteractiveCaseStudyBlock';
import StatsBlock from './blocks/StatsBlock';
import NewsletterBlock from './blocks/NewsletterBlock';
import EditorialBlock from './blocks/EditorialBlock';

// Cinematic Variants
import CircularGalleryHero from './blocks/hero/CircularGalleryHero';
import TerminalScrambleHero from './blocks/hero/TerminalScrambleHero';
import FolderRevealFeatures from './blocks/features/FolderRevealFeatures';
import PhysicsRevealFeatures from './blocks/features/PhysicsRevealFeatures';
import SnakeCardFeatures from './blocks/features/SnakeCardFeatures';

const HYBRID_MAP = {
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
  editorial: EditorialBlock,
  circularHero: CircularGalleryHero,
  terminalHero: TerminalScrambleHero,
  folderFeatures: FolderRevealFeatures,
  physicsFeatures: PhysicsRevealFeatures,
  snakeFeatures: SnakeCardFeatures
};

const PrimitiveBox = ({ node, children, isSelected, isHovered, editMode }) => {
  const { deviceView, addNode, moveNode } = useProject();
  
  // Compute Styles with inheritance
  const styles = {
    ...(node.styles || {}),
    ...(deviceView === 'tablet' || deviceView === 'mobile' ? (node.tabletStyles || {}) : {}),
    ...(deviceView === 'mobile' ? (node.mobileStyles || {}) : {})
  };

  const onDragOver = (e) => {
    if (!editMode) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (e) => {
    if (!editMode) return;
    e.preventDefault();
    e.stopPropagation();
    
    const nodeType = e.dataTransfer.getData('nodeType');
    const existingNodeId = e.dataTransfer.getData('nodeId');

    if (nodeType) {
      addNode(nodeType, node.id);
    } else if (existingNodeId && existingNodeId !== node.id) {
      moveNode(existingNodeId, node.id);
    }
  };
  
  return (
    <div
      onDragOver={onDragOver}
      onDrop={onDrop}
      style={{
        display: styles.display || 'block',
        flexDirection: styles.flexDirection || 'column',
        alignItems: styles.alignItems || 'stretch',
        justifyContent: styles.justifyContent || 'flex-start',
        gap: styles.gap || '0px',
        padding: styles.padding || (styles.paddingTop ? `${styles.paddingTop} ${styles.paddingRight} ${styles.paddingBottom} ${styles.paddingLeft}` : '0px'),
        margin: styles.margin || (styles.marginTop ? `${styles.marginTop} ${styles.marginRight} ${styles.marginBottom} ${styles.marginLeft}` : '0px'),
        backgroundColor: styles.backgroundColor || 'transparent',
        backgroundImage: styles.backgroundImage ? `url(${styles.backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: styles.width || 'auto',
        height: styles.height || 'auto',
        minHeight: styles.minHeight || '0px',
        borderRadius: styles.borderRadius || '0px',
        border: isSelected ? '2px solid #5b76fe' : (isHovered && editMode ? '2px solid #5b76fe55' : (styles.border || `${styles.borderWidth || '0px'} ${styles.borderStyle || 'none'} ${styles.borderColor || 'transparent'}`)),
        opacity: styles.opacity !== undefined ? styles.opacity : 1,
        position: 'relative',
        transition: 'all 0.2s ease'
      }}
    >
      {children}
    </div>
  );
};

const PrimitiveText = ({ node, isSelected, isHovered, editMode }) => {
  const { updateNodeProps, deviceView } = useProject();

  // Compute Styles with inheritance
  const styles = {
    ...(node.styles || {}),
    ...(deviceView === 'tablet' || deviceView === 'mobile' ? (node.tabletStyles || {}) : {}),
    ...(deviceView === 'mobile' ? (node.mobileStyles || {}) : {})
  };

  const handleBlur = (e) => {
    updateNodeProps(node.id, { text: e.target.innerText });
  };

  return (
    <div
      contentEditable={editMode}
      onBlur={handleBlur}
      suppressContentEditableWarning
      style={{
        fontSize: styles.fontSize || '16px',
        fontWeight: styles.fontWeight || '400',
        color: styles.color || 'inherit',
        textAlign: styles.textAlign || 'left',
        lineHeight: styles.lineHeight || '1.5',
        fontFamily: styles.fontFamily || 'inherit',
        margin: styles.margin || '0px',
        padding: styles.padding || '0px',
        outline: 'none',
        border: isSelected ? '2px solid #5b76fe' : (isHovered && editMode ? '2px solid #5b76fe55' : 'none'),
      }}
    >
      {node.props?.text || 'Type something...'}
    </div>
  );
};

const NodeRenderer = ({ node, editMode = true }) => {
  const { 
    selectedNodeId, 
    setSelectedNodeId, 
    hoveredNodeId, 
    setHoveredNodeId,
    previewMode
  } = useProject();

  if (!node || node.isHidden) return null;

  const isSelected = selectedNodeId === node.id;
  const isHovered = hoveredNodeId === node.id;
  const isHybrid = !!HYBRID_MAP[node.type];
  const isLocked = node.isLocked;
  const actualEditMode = editMode && !previewMode && !isLocked;

  const handleClick = (e) => {
    if (!editMode || previewMode || isLocked) return;
    e.stopPropagation();
    setSelectedNodeId(node.id);
  };

  const handleMouseEnter = (e) => {
    if (!editMode || previewMode || isLocked) return;
    e.stopPropagation();
    setHoveredNodeId(node.id);
  };

  const handleMouseLeave = () => {
    if (!actualEditMode) return;
    setHoveredNodeId(null);
  };

  // Render Hybrid Blocks
  if (isHybrid) {
    const Component = HYBRID_MAP[node.type];
    return (
      <div 
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative"
      >
        <Component id={node.id} props={node.props || {}} editMode={actualEditMode} />
        {isSelected && actualEditMode && (
          <div className="absolute inset-0 border-2 border-[#5b76fe] pointer-events-none z-10" />
        )}
      </div>
    );
  }

  // Render Primitives
  if (node.type === 'Box' || node.type === 'Container') {
    return (
      <div
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <PrimitiveBox node={node} isSelected={isSelected} isHovered={isHovered} editMode={actualEditMode}>
          {(node.children || []).map(child => (
            <NodeRenderer key={child.id} node={child} editMode={editMode} />
          ))}
        </PrimitiveBox>
      </div>
    );
  }

  if (node.type === 'Text') {
    return (
      <div
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <PrimitiveText node={node} isSelected={isSelected} isHovered={isHovered} editMode={actualEditMode} />
      </div>
    );
  }

  return (
    <div className="p-4 border-2 border-dashed border-red-200 text-red-400">
      Unknown Node Type: {node.type}
    </div>
  );
};

export default NodeRenderer;
