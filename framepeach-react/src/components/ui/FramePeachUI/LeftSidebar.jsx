import React from 'react';
import { Layers, Folder, Grid, FileText } from 'lucide-react';
import HierarchyPanel from '../../panels/FramePeachPanels/HierarchyPanel';
import AssetsPanel from '../../panels/FramePeachPanels/AssetsPanel';
import ComponentsPanel from '../../panels/FramePeachPanels/ComponentsPanel';
import TemplatesPanel from '../../panels/FramePeachPanels/TemplatesPanel';

const LeftSidebar = ({ 
  activePanel, 
  setActivePanel,
  sceneHierarchy,
  expandedNodes,
  selectedObjects,
  toggleExpanded,
  toggleObjectSelection,
  assets,
  templates
}) => {
  const tabs = [
    { id: 'hierarchy', label: 'Hierarchy', icon: Layers },
    // { id: 'assets', label: 'Assets', icon: Folder },
    { id: 'components', label: 'Components', icon: Grid },
    // { id: 'templates', label: 'Templates', icon: FileText }
  ];

  const renderPanel = () => {
    switch (activePanel) {
      case 'hierarchy':
        return (
          <HierarchyPanel
            sceneHierarchy={sceneHierarchy}
            expandedNodes={expandedNodes}
            selectedObjects={selectedObjects}
            toggleExpanded={toggleExpanded}
            toggleObjectSelection={toggleObjectSelection}
          />
        );
      
      case 'components':
        return <ComponentsPanel assets={assets} />;
      
      default:
        return null;
    }
  };  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg-secondary)' }}>
      {/* Tab Navigation */}
      <div className="border-b" style={{ borderColor: 'var(--border-primary)' }}>
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActivePanel(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 text-xs font-medium transition-all duration-150 ${
                  activePanel === tab.id
                    ? 'text-white'
                    : 'hover:text-white'
                }`}
                style={{
                  background: activePanel === tab.id ? 'var(--accent-blue)' : 'transparent',
                  color: activePanel === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                  borderBottom: activePanel === tab.id ? '2px solid var(--accent-blue)' : 'none'
                }}
              >
                <Icon size={14} />
                {/* {tab.label} */}
              </button>
            );
          })}
        </div>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-hidden">
        {renderPanel()}
      </div>
    </div>
  );
};

export default LeftSidebar;
