import React, { useState, useRef, useCallback } from 'react';
import TopMenuBar from '../../components/ui/FramePeachUI/TopMenuBar';
import MainToolbar from '../../components/ui/FramePeachUI/MainToolbar';
import LeftSidebar from '../../components/ui/FramePeachUI/LeftSidebar';
import RightSidebar from '../../components/ui/FramePeachUI/RightSidebar';
import ViewportPanel from '../../components/panels/FramePeachPanels/ViewportPanel';
import TimelinePanel from '../../components/panels/FramePeachPanels/TimelinePanel';
import { Layers, Folder, Grid, FileText } from 'lucide-react';
import { Settings, Palette, Zap, Globe } from 'lucide-react';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ChevronUpIcon, 
  ChevronDownIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

import { 
  templates, 
  sceneHierarchy, 
  assets, 
  materialNodesData, 
  performanceMetricsData, 
  collaboratorsData 
} from '../../data/projectData';
import UnifiedToolbar from '../../components/ui/FramePeachUI/UnifiedToolbar';
import BottomBar from '../../components/ui/FramePeachUI/BottomBar';

const FramePeachUI = ({onClosePreviewPanel}) => {

  const [activeBottomPanel, setActiveBottomPanel] = useState('assets'); // or whatever default you want
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });

  // Core UI State Management
  const [activePanel, setActivePanel] = useState('hierarchy');
  const [rightPanel, setRightPanel] = useState('properties');
  const [selectedTool, setSelectedTool] = useState('select');
  const [playbackState, setPlaybackState] = useState('paused');
  const [viewportMode, setViewportMode] = useState('shaded');
  const [selectedObjects, setSelectedObjects] = useState(['hero-section']);
  const [expandedNodes, setExpandedNodes] = useState(['root', 'page-1']);
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [showCollabPanel, setShowCollabPanel] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [isDragging, setIsDragging] = useState(false);
  const [draggedComponent, setDraggedComponent] = useState(null);
  const [websiteComponents, setWebsiteComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [currentLayout, setCurrentLayout] = useState('single');
  const [isMaximized, setIsMaximized] = useState(false);
  // Panel Visibility State
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [showTimelinePanel, setShowTimelinePanel] = useState(true);
  
  // Panel Resize State
  const [leftPanelWidth, setLeftPanelWidth] = useState(320);
  const [rightPanelWidth, setRightPanelWidth] = useState(320);
  const [timelinePanelHeight, setTimelinePanelHeight] = useState(300);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);
  const [isResizingTimeline, setIsResizingTimeline] = useState(false);
  
  // Resize Refs
  const leftResizeRef = useRef(null);
  const rightResizeRef = useRef(null);
  const timelineResizeRef = useRef(null);
  const startXRef = useRef(null);
  const startYRef = useRef(null);
  const startWidthRef = useRef(null);
  const startHeightRef = useRef(null);

  // Data from imported files
  const [performanceMetrics] = useState(performanceMetricsData);
  const [collaborators] = useState(collaboratorsData);
  const [materialNodes] = useState(materialNodesData);
   
  const [previewPanel, setPreviewPanel] = useState(false);

  const tabs = [
    { id: 'properties', label: 'Properties', icon: Settings },
    { id: 'materials', label: 'Materials', icon: Palette },
    { id: 'effects', label: 'Effects', icon: Zap },
    { id: 'deploy', label: 'Deploy', icon: Globe }
  ];

  const tabsLeft = [
    { id: 'hierarchy', label: 'Hierarchy', icon: Layers },
    { id: 'assets', label: 'Assets', icon: Folder },
    { id: 'components', label: 'Components', icon: Grid },
    { id: 'templates', label: 'Templates', icon: FileText }
  ];


  // Event Handlers
  const toggleExpanded = (nodeId) => {
    setExpandedNodes(prev => 
      prev.includes(nodeId) 
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
    );
  };

  const toggleObjectSelection = (objectId) => {
    setSelectedObjects(prev => 
      prev.includes(objectId)
        ? prev.filter(id => id !== objectId)
        : [...prev, objectId]
    );
  };

  // Panel Toggle Functions
  const toggleLeftPanel = () => setShowLeftPanel(!showLeftPanel);
  const toggleRightPanel = () => setShowRightPanel(!showRightPanel);
  const toggleTimelinePanel = () => setShowTimelinePanel(!showTimelinePanel);

  // Left Panel Resize Handler
  const handleLeftPanelResizeStart = useCallback((e) => {
    e.preventDefault();
    setIsResizingLeft(true);
    startXRef.current = e.clientX;
    startWidthRef.current = leftPanelWidth;
    
    const handleMove = (moveEvent) => {
      if (startXRef.current === null || startWidthRef.current === null) return;
      
      const deltaX = moveEvent.clientX - startXRef.current;
      const newWidth = Math.max(200, Math.min(500, startWidthRef.current + deltaX));
      setLeftPanelWidth(newWidth);
    };

    const handleEnd = () => {
      setIsResizingLeft(false);
      startXRef.current = null;
      startWidthRef.current = null;
      
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  }, [leftPanelWidth]);

  // Right Panel Resize Handler
  const handleRightPanelResizeStart = useCallback((e) => {
    e.preventDefault();
    setIsResizingRight(true);
    startXRef.current = e.clientX;
    startWidthRef.current = rightPanelWidth;
    
    const handleMove = (moveEvent) => {
      if (startXRef.current === null || startWidthRef.current === null) return;
      
      const deltaX = startXRef.current - moveEvent.clientX;
      const newWidth = Math.max(200, Math.min(500, startWidthRef.current + deltaX));
      setRightPanelWidth(newWidth);
    };

    const handleEnd = () => {
      setIsResizingRight(false);
      startXRef.current = null;
      startWidthRef.current = null;
      
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  }, [rightPanelWidth]);

  // Timeline Panel Resize Handler
  const handleTimelinePanelResizeStart = useCallback((e) => {
    e.preventDefault();
    setIsResizingTimeline(true);
    startYRef.current = e.clientY;
    startHeightRef.current = timelinePanelHeight;
    
    const handleMove = (moveEvent) => {
      if (startYRef.current === null || startHeightRef.current === null) return;
      
      const deltaY = startYRef.current - moveEvent.clientY;
      const newHeight = Math.max(200, Math.min(600, startHeightRef.current + deltaY));
      setTimelinePanelHeight(newHeight);
    };

    const handleEnd = () => {
      setIsResizingTimeline(false);
      startYRef.current = null;
      startHeightRef.current = null;
      
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';
  }, [timelinePanelHeight]);

  return (
    
    <div className="h-screen text-white flex flex-col overflow-hidden" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Top Menu Bar */}
      <UnifiedToolbar 
        collaborators={collaborators}
        showCollabPanel={showCollabPanel}
        setShowCollabPanel={setShowCollabPanel}
        selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
          viewportMode={viewportMode}
          setViewportMode={setViewportMode}
          performanceMetrics={performanceMetrics}
          showExportPanel={showExportPanel}
          setShowExportPanel={setShowExportPanel}
          playbackState={playbackState}
          setPlaybackState={setPlaybackState}
          toggleLeftPanel={toggleLeftPanel}
          toggleRightPanel={toggleRightPanel}
          toggleTimelinePanel={toggleTimelinePanel}
          showLeftPanel={showLeftPanel}
          showRightPanel={showRightPanel}
          showTimelinePanel={showTimelinePanel}
            currentLayout={currentLayout}
  onLayoutChange={setCurrentLayout}
  isMaximized={isMaximized}
  onToggleMaximize={() => setIsMaximized(!isMaximized)}
           onClosePreviewPanel={onClosePreviewPanel}
      />

      

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Section: Left Sidebar | Viewport | Right Sidebar */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar with Collapse/Expand */}
          {showLeftPanel && (
            <div className="relative border-r border-gray-700" style={{ 
              borderColor: 'var(--border-primary)', 
              width: `${leftPanelWidth}px`, 
              background: 'var(--bg-secondary)' 
            }}>
              {/* Left Panel Header with Close Button */}
              <div className="flex items-center justify-between p-2 border-b" style={{ borderColor: 'var(--border-primary)' }}>
                <div className="text-sm font-medium text-gray-300">Left Panel</div>
                <button
                  onClick={toggleLeftPanel}
                  className="p-1 rounded hover:bg-gray-600 text-gray-400 hover:text-white transition-colors"
                  title="Close Left Panel"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
              
              <LeftSidebar
                activePanel={activePanel}
                setActivePanel={setActivePanel}
                sceneHierarchy={sceneHierarchy}
                expandedNodes={expandedNodes}
                selectedObjects={selectedObjects}
                toggleExpanded={toggleExpanded}
                toggleObjectSelection={toggleObjectSelection}
                assets={assets}
                templates={templates}
              />
              
              {/* Left Panel Resize Handle */}
              <div 
                className={`absolute top-0 right-0 bottom-0 w-1 cursor-ew-resize z-10 transition-colors ${
                  isResizingLeft ? 'bg-blue-500' : 'hover:bg-blue-400'
                }`}
                onMouseDown={handleLeftPanelResizeStart}
                title="Drag to resize left panel"
              >
                <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-1 h-12 bg-gray-400 hover:bg-blue-400 transition-colors" />
              </div>
            </div>
          )}

          {/* Left Panel Collapsed State */}
          {!showLeftPanel && (
            <div className="w-8 border-r border-gray-700 flex flex-col items-center justify-center" style={{ 
              borderColor: 'var(--border-primary)', 
              background: 'var(--bg-secondary)' 
            }}>
              <button
                onClick={toggleLeftPanel}
                className="p-2 rounded rotate-90"
                title="Show Left Panel"
              >
                <div className="border-b" style={{ borderColor: 'var(--border-primary)' }}>
                <div className="flex">
                  {tabsLeft.map((tab) => {
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
                      >
                <Icon size={14} />
                {/* {tab.label} */}
              </button>
            );
          })}
        </div>
      </div>
              </button>
            </div>
          )}

          {/* Main Viewport */}
          <div className="flex-1">
            <ViewportPanel performanceMetrics={performanceMetrics}   currentLayout={currentLayout}
  isMaximized={isMaximized}/>
          </div>

          {/* Right Panel Collapsed State */}
          {!showRightPanel && (
            <div className="w-8 border-l border-gray-700 flex flex-col items-center justify-center" style={{ 
              borderColor: 'var(--border-primary)', 
              background: 'var(--bg-secondary)' 
            }}>
              <button
                onClick={toggleRightPanel}
                className="p-2 rounded  rotate-90"
                title="Show Right Panel"
              >
               
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
             
              >
                <Icon size={14} />
                {/* {tab.label} */}
              </button>
            );
          })}
        </div>
      </div>
              </button>
            </div>
          )}

          {/* Right Sidebar with Collapse/Expand */}
          {showRightPanel && (
            <div className="relative border-l border-gray-700" style={{ 
              borderColor: 'var(--border-primary)', 
              width: `${rightPanelWidth}px`, 
              background: 'var(--bg-secondary)' 
            }}>
              {/* Right Panel Resize Handle */}
              <div 
                className={`absolute top-0 left-0 bottom-0 w-1 cursor-ew-resize z-10 transition-colors ${
                  isResizingRight ? 'bg-blue-500' : 'hover:bg-blue-400'
                }`}
                onMouseDown={handleRightPanelResizeStart}
                title="Drag to resize right panel"
              >
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-1 h-12 bg-gray-400 hover:bg-blue-400 transition-colors" />
              </div>
              
              {/* Right Panel Header with Close Button */}
              <div className="flex items-center justify-between p-2 border-b" style={{ borderColor: 'var(--border-primary)' }}>
                <div className="text-sm font-medium text-gray-300">Right Panel</div>
                <button
                  onClick={toggleRightPanel}
                  className="p-1 rounded hover:bg-gray-600 text-gray-400 hover:text-white transition-colors"
                  title="Close Right Panel"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
              
              <RightSidebar
                rightPanel={rightPanel}
                setRightPanel={setRightPanel}
                materialNodes={materialNodes}
              />
            </div>
          )}
        </div>

        {/* Bottom Timeline Panel */}
        {showTimelinePanel && (
  <div className="relative border-t border-gray-700" style={{ 
    borderColor: 'var(--border-primary)', 
    height: `${timelinePanelHeight}px` 
  }}>
    {/* Bottom Panel Header with Close Button */}
    <div className="absolute top-1 right-2 z-20">
      <button
        onClick={toggleTimelinePanel}
        className="p-1 rounded hover:bg-gray-600 text-gray-400 hover:text-white transition-colors"
        title="Close Bottom Panel"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
    
    {/* Timeline Resize Handle */}
    <div 
      className={`absolute top-0 left-0 right-0 h-1 cursor-ns-resize z-10 transition-colors ${
        isResizingTimeline ? 'bg-blue-500' : 'hover:bg-blue-400'
      }`}
      onMouseDown={handleTimelinePanelResizeStart}
      title="Drag to resize bottom panel"
    >
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-400 hover:bg-blue-400 transition-colors" />
    </div>
    
    {/* Use BottomBar instead of TimelinePanel */}
    <BottomBar 
      activeBottomPanel={activeBottomPanel}
      setActiveBottomPanel={setActiveBottomPanel}
      assets={assets}
      templates={templates}
      playbackState={playbackState}
      setPlaybackState={setPlaybackState}
      height={timelinePanelHeight}
    />
  </div>
)}

    {/* Bottom Panel Collapsed State */}
    {!showTimelinePanel && (
      <div className="h-8 border-t border-gray-700 flex items-center justify-center" style={{ 
        borderColor: 'var(--border-primary)', 
        background: 'var(--bg-secondary)' 
      }}>
        <button
          onClick={toggleTimelinePanel}
          className="px-4 py-1 rounded hover:bg-gray-600 text-gray-400 hover:text-white transition-colors"
          title="Show Bottom Panel"
        >
          <ChevronUpIcon className="w-4 h-4 inline mr-1" />
          <span className="text-xs">Bottom Panel</span>
        </button>
      </div>
    )}
      </div>
    </div>
  );
};

export default FramePeachUI;