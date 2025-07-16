import React from 'react';
import { Settings, Palette, Zap, Globe } from 'lucide-react';
import PropertiesPanel from '../../panels/FramePeachPanels/PropertiesPanel';
import MaterialsPanel from '../../panels/FramePeachPanels/MaterialsPanel';
import EffectsPanel from '../../panels/FramePeachPanels/EffectsPanel';
import DeployPanel from '../../panels/FramePeachPanels/DeployPanel';

const RightSidebar = ({ 
  rightPanel, 
  setRightPanel,
  materialNodes
}) => {
  const tabs = [
    { id: 'properties', label: 'Properties', icon: Settings },
    { id: 'materials', label: 'Materials', icon: Palette },
    { id: 'effects', label: 'Effects', icon: Zap },
    { id: 'deploy', label: 'Deploy', icon: Globe }
  ];

  const renderPanel = () => {
    switch (rightPanel) {
      case 'properties':
        return <PropertiesPanel />;
      case 'materials':
        return <MaterialsPanel materialNodes={materialNodes} />;
      case 'effects':
        return <EffectsPanel />;
      case 'deploy':        return <DeployPanel />;
      default:
        return null;
    }
  };  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg-secondary)'}}>
      {/* Tab Navigation */}
      <div className="border-b" style={{ borderColor: 'var(--border-primary)' }}>
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setRightPanel(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 text-xs font-medium transition-all duration-150 ${
                  rightPanel === tab.id
                    ? 'text-white'
                    : 'hover:text-white'
                }`}
                style={{
                  background: rightPanel === tab.id ? 'var(--accent-blue)' : 'transparent',
                  color: rightPanel === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                  borderBottom: rightPanel === tab.id ? '2px solid var(--accent-blue)' : 'none'
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

export default RightSidebar;
