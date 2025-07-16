import React from 'react';
import { 
  Move, RotateCcw, Scale, MousePointer, Hand, 
  Undo, Redo, Save, Download, ChevronDown,
  Monitor, Tablet, Smartphone, Grid3X3, Eye, EyeOff,
  Play, Pause, SkipForward, RefreshCw
} from 'lucide-react';

const MainToolbar = ({ 
  selectedTool, 
  setSelectedTool, 
  viewportMode, 
  setViewportMode, 
  performanceMetrics,
  showExportPanel,
  setShowExportPanel,
  playbackState,
  setPlaybackState 
}) => {
  const tools = [
    { id: 'select', icon: MousePointer, label: 'Select (Q)', hotkey: 'Q' },
    { id: 'move', icon: Move, label: 'Move (W)', hotkey: 'W' },
    { id: 'rotate', icon: RotateCcw, label: 'Rotate (E)', hotkey: 'E' },
    { id: 'scale', icon: Scale, label: 'Scale (R)', hotkey: 'R' },
    { id: 'hand', icon: Hand, label: 'Hand Tool (H)', hotkey: 'H' }
  ];

  const viewModes = [
    'Shaded',
    'Wireframe', 
    'Material Preview',
    'Rendered'
  ];

  return (
    <div className="toolbar">
      {/* Transform Tools */}
      <div className="toolbar-group">
        {tools.map(tool => (
          <button
            key={tool.id}
            className={`tool-button ${selectedTool === tool.id ? 'active' : ''}`}
            onClick={() => setSelectedTool(tool.id)}
            title={tool.label}
          >
            <tool.icon size={16} />
          </button>
        ))}
      </div>

      {/* Playback Controls */}
      <div className="toolbar-group">
        <button 
          className="tool-button"
          onClick={() => setPlaybackState('rewind')}
          title="Go to Start"
        >
          <SkipForward size={16} className="rotate-180" />
        </button>
        <button 
          className={`tool-button ${playbackState === 'playing' ? 'active' : ''}`}
          onClick={() => setPlaybackState(playbackState === 'playing' ? 'paused' : 'playing')}
          title={playbackState === 'playing' ? 'Pause' : 'Play'}
        >
          {playbackState === 'playing' ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button 
          className="tool-button"
          onClick={() => setPlaybackState('reset')}
          title="Reset"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* View Controls */}
      <div className="toolbar-group">
        <select 
          value={viewportMode}
          onChange={(e) => setViewportMode(e.target.value)}
          className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs"
        >
          {viewModes.map(mode => (
            <option key={mode} value={mode.toLowerCase().replace(' ', '-')}>
              {mode}
            </option>
          ))}
        </select>
        
        <button className="tool-button" title="Show Grid">
          <Grid3X3 size={16} />
        </button>
        
        <button className="tool-button" title="Toggle Visibility">
          <Eye size={16} />
        </button>
      </div>

      {/* Device Preview */}
      <div className="toolbar-group">
        {[
          { id: 'desktop', icon: Monitor, label: 'Desktop' },
          { id: 'tablet', icon: Tablet, label: 'Tablet' },
          { id: 'mobile', icon: Smartphone, label: 'Mobile' }
        ].map(device => (
          <button
            key={device.id}
            className="tool-button"
            title={device.label}
          >
            <device.icon size={16} />
          </button>
        ))}
      </div>

      {/* Performance Monitor */}
      <div className="toolbar-group">
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${
              performanceMetrics.fps >= 58 ? 'bg-green-400' : 
              performanceMetrics.fps >= 30 ? 'bg-yellow-400' : 'bg-red-400'
            }`}></div>
            <span className="text-gray-300">{performanceMetrics.fps} FPS</span>
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${
              performanceMetrics.memoryUsage < 1.0 ? 'bg-green-400' : 
              performanceMetrics.memoryUsage < 2.0 ? 'bg-yellow-400' : 'bg-red-400'
            }`}></div>
            <span className="text-gray-300">{performanceMetrics.memoryUsage}GB</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="toolbar-group">
        <button className="tool-button" title="Undo (Ctrl+Z)">
          <Undo size={16} />
        </button>
        <button className="tool-button" title="Redo (Ctrl+Y)">
          <Redo size={16} />
        </button>
        <button className="tool-button" title="Save (Ctrl+S)">
          <Save size={16} />
        </button>
      </div>

      <div className="flex-1"></div>

      {/* Export Button */}
      <div className="toolbar-group">
        <div className="relative">
          <button 
            className="btn primary"
            onClick={() => setShowExportPanel(!showExportPanel)}
          >
            <Download size={14} />
            <span>Export</span>
            <ChevronDown size={12} />
          </button>
          
          {showExportPanel && (
            <div className="absolute top-full right-0 mt-2 w-80 panel z-50">
              <div className="panel-header">
                <span>Export Configuration</span>
                <button 
                  onClick={() => setShowExportPanel(false)}
                  className="w-4 h-4 flex items-center justify-center hover:bg-gray-600 rounded"
                >
                  ×
                </button>
              </div>
              
              <div className="panel-content p-4">
                <div className="space-y-4">
                  <div>
                    <label className="property-label">Export Format</label>
                    <select className="w-full">
                      <option>Static HTML/CSS/JS</option>
                      <option>React Components</option>
                      <option>WordPress Theme</option>
                      <option>Single Page App</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="property-label">Optimization Level</label>
                    <div className="grid grid-cols-3 gap-1">
                      <button className="btn">Fast</button>
                      <button className="btn primary">Standard</button>
                      <button className="btn">Max</button>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-700">
                    <button className="btn primary w-full">
                      Generate Build
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainToolbar;
