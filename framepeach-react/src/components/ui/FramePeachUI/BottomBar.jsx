import React from 'react';
import { Folder, FileText, Clock, Database } from 'lucide-react';
import AssetsPanel from '../../panels/FramePeachPanels/AssetsPanel';
import TemplatesPanel from '../../panels/FramePeachPanels/TemplatesPanel';
import TimelinePanel from '../../panels/FramePeachPanels/TimelinePanel';
// Import other panels as needed

const BottomBar = ({ 
  activeBottomPanel, 
  setActiveBottomPanel,
  assets,
  templates,
  playbackState,
  setPlaybackState,
  height
}) => {
  const tabs = [
    { id: 'assets', label: 'Assets', icon: Folder },
    // { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    // { id: 'data', label: 'Data', icon: Database },
  ];

  const renderPanel = () => {
    switch (activeBottomPanel) {
      case 'assets':
        return <AssetsPanel assets={assets} />;
      case 'templates':
        return <TemplatesPanel templates={templates} />;
      case 'timeline':
        return (
          <TimelinePanel 
            playbackState={playbackState}
            setPlaybackState={setPlaybackState}
            height={height}
          />
        );
      case 'data':
        return (
          <div className="p-4">
            <h3 className="text-sm font-medium mb-2">Data Panel</h3>
            <p className="text-xs text-gray-400">Data management content goes here</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg-secondary)' }}>
      {/* Tab Navigation */}
      <div className="border-b" style={{ borderColor: 'var(--border-primary)' }}>
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveBottomPanel(tab.id)}
                className={` flex items-center justify-center gap-2 px-3 py-3 text-xs font-medium transition-all duration-150 ${
                  activeBottomPanel === tab.id
                    ? 'text-white'
                    : 'hover:text-white'
                }`}
                style={{
                  background: activeBottomPanel === tab.id ? 'var(--accent-blue)' : 'transparent',
                  color: activeBottomPanel === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                  borderBottom: activeBottomPanel === tab.id ? '2px solid var(--accent-blue)' : 'none'
                }}
              >
                <Icon size={14} />
                {tab.label}
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

export default BottomBar;