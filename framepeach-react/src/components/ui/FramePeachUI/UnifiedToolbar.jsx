import React, { useState, useRef, useEffect } from 'react';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import {
    Move, RotateCcw, Scale, MousePointer, Hand,
    Undo, Redo, Save, Download, ChevronDown,
    Monitor, Tablet, Smartphone, Grid3X3, Eye,
    Play, Pause, SkipForward, RefreshCw,
    Menu, X, Settings, MoreVertical,
    Maximize, Minimize2, Maximize2
} from 'lucide-react';

const UnifiedToolbar = ({
    selectedTool,
    setSelectedTool,
    viewportMode,
    setViewportMode,
    performanceMetrics,
    showExportPanel,
    setShowExportPanel,
    playbackState,
    setPlaybackState,
    toggleLeftPanel,
    toggleRightPanel,
    toggleTimelinePanel,
    showLeftPanel,
    showRightPanel,
    showTimelinePanel,
    // New props for viewport layout
    currentLayout = 'single',
    onLayoutChange,
    isMaximized = false,
    onToggleMaximize,
    // New prop for object creation
    onAddObject,
    onClosePreviewPanel
}) => {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
    const [showLayoutMenu, setShowLayoutMenu] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState(null);
    const dropdownRef = useRef(null);
    const layoutMenuRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setActiveDropdown(null);
                setActiveSubmenu(null);
            }
            if (layoutMenuRef.current && !layoutMenuRef.current.contains(e.target)) {
                setShowLayoutMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const menuStructure = {
        File: {
            items: [
                { label: 'New Scene', shortcut: 'Ctrl+N', action: 'new' },
                { label: 'Open...', shortcut: 'Ctrl+O', action: 'open' },
                { label: 'Open Recent', submenu: true },
                { type: 'separator' },
                { label: 'Save', shortcut: 'Ctrl+S', icon: Save, action: 'save' },
                { label: 'Save As...', shortcut: 'Ctrl+Shift+S' },
                { type: 'separator' },
                { label: 'Export', icon: Download, submenu: true },
                { label: 'Import', submenu: true },
                { type: 'separator' },
                { label: 'Project Settings' },
                { type: 'separator' },
                { label: 'Exit', shortcut: 'Ctrl+Q' }
            ]
        },
        Edit: {
            items: [
                { label: 'Undo', shortcut: 'Ctrl+Z', icon: Undo, action: 'undo' },
                { label: 'Redo', shortcut: 'Ctrl+Y', icon: Redo, action: 'redo' },
                { type: 'separator' },
                { label: 'Cut', shortcut: 'Ctrl+X' },
                { label: 'Copy', shortcut: 'Ctrl+C' },
                { label: 'Paste', shortcut: 'Ctrl+V' },
                { label: 'Duplicate', shortcut: 'Ctrl+D' },
                { label: 'Delete', shortcut: 'Del' },
                { type: 'separator' },
                { label: 'Select All', shortcut: 'Ctrl+A' },
                { label: 'Deselect All', shortcut: 'Ctrl+Shift+A' }
            ]
        },
        View: {
            items: [
                { label: 'Wireframe', shortcut: 'Alt+Z', checkable: true },
                { label: 'Solid', shortcut: 'Z', checkable: true },
                { label: 'Material Preview', shortcut: 'Shift+Z', checkable: true },
                { label: 'Rendered', shortcut: 'Ctrl+Z', checkable: true },
                { type: 'separator' },
                { label: 'Show Grid', icon: Grid3X3, checkable: true },
                { label: 'Show Overlays', icon: Eye, checkable: true },
                { type: 'separator' },
                { label: 'Device Preview', submenu: true, icon: Monitor }
            ]
        },
        Windows: {
            items: [
                { label: 'Toggle Fullscreen', shortcut: 'F11' },
                { label: 'Duplicate Area' },
                { type: 'separator' },
                { label: 'Save Screenshot', shortcut: 'F12' },
                { type: 'separator' },
                { label: 'Hierarchy Panel' },
                { label: 'Properties Panel' },
                { label: 'Assets Panel' },
                { label: 'Materials Panel' },
                { label: 'Timeline Panel' },
                { label: 'Add Objects Panel' },
            ]
        },
        Add: {
            items: [
                { label: 'Mesh', submenu: [
                    { label: 'Box', action: 'add-object', objectType: 'box' },
                    { label: 'Sphere', action: 'add-object', objectType: 'sphere' },
                    { label: 'Cylinder', action: 'add-object', objectType: 'cylinder' }
                ]},
                { label: 'Light', submenu: [
                    { label: 'Point Light', action: 'add-object', objectType: 'light', lightType: 'point' },
                    { label: 'Directional Light', action: 'add-object', objectType: 'light', lightType: 'directional' },
                    { label: 'Spot Light', action: 'add-object', objectType: 'light', lightType: 'spot' }
                ]},
                { label: 'Camera', action: 'add-object', objectType: 'camera' },
                { type: 'separator' },
                { label: 'Empty Object' },
                { label: 'Reference Image' }
            ]
        },
        Help: {
            items: [
                { label: 'Manual' },
                { label: 'Tutorials' },
                { label: 'Community' },
                { type: 'separator' },
                { label: 'Keyboard Shortcuts', shortcut: 'F1' },
                { label: 'Tips & Tricks' },
                { type: 'separator' },
                { label: 'Report Bug' },
                { label: 'Request Feature' },
                { type: 'separator' },
                { label: 'About FramePeach' }
            ]
        }
    };

    const tools = [
        { id: 'select', icon: MousePointer, label: 'Select (Q)', hotkey: 'Q' },
        { id: 'move', icon: Move, label: 'Move (W)', hotkey: 'W' },
        { id: 'rotate', icon: RotateCcw, label: 'Rotate (E)', hotkey: 'E' },
        { id: 'scale', icon: Scale, label: 'Scale (R)', hotkey: 'R' },
        { id: 'hand', icon: Hand, label: 'Hand Tool (H)', hotkey: 'H' }
    ];

    const handleMenuItemClick = (item, menu) => {
        console.log('Menu action:', menu, item.action || item.label);
        setActiveDropdown(null);
        setActiveSubmenu(null);

        // Handle specific actions
        if (item.action === 'save') {
            // Trigger save
        } else if (item.action === 'undo') {
            // Trigger undo
        } else if (item.action === 'add-object') {
            // Handle object creation
            const objectData = {
                type: item.objectType,
                ...(item.lightType && { lightType: item.lightType })
            };
            console.log('Adding object:', objectData);
            // Call the prop function to handle object creation
            onAddObject && onAddObject(objectData);
        }
    };

    const renderDropdownMenu = (menu, items) => (
        <div
            className="absolute top-full left-0 mt-1 min-w-56 rounded-lg shadow-xl z-50"
            style={{
                background: 'rgba(30, 30, 35, 0.98)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
            }}
        >
            {items.map((item, idx) => {
                if (item.type === 'separator') {
                    return <div key={idx} className="h-px bg-gray-700 my-1 mx-2" />;
                }

                return (
                    <div key={idx} className="relative">
                        <div
                            className="flex items-center justify-between px-3 py-2 mx-1 my-0.5 rounded cursor-pointer transition-all duration-150 hover:bg-gray-700/50"
                            onClick={() => {
                                if (item.submenu && Array.isArray(item.submenu)) {
                                    setActiveSubmenu(activeSubmenu === `${menu}-${idx}` ? null : `${menu}-${idx}`);
                                } else if (item.submenu) {
                                    // Handle simple submenu indicator
                                    console.log('Submenu:', item.label);
                                } else {
                                    handleMenuItemClick(item, menu);
                                }
                            }}
                            onMouseEnter={() => {
                                if (item.submenu && Array.isArray(item.submenu)) {
                                    setActiveSubmenu(`${menu}-${idx}`);
                                }
                            }}
                        >
                            <div className="flex items-center gap-3">
                                {item.icon && <item.icon size={14} className="text-gray-400" />}
                                <span className="text-sm text-gray-200">{item.label}</span>
                                {item.submenu && <ChevronDown size={12} className="text-gray-500 -rotate-90" />}
                            </div>
                            {item.shortcut && (
                                <span className="text-xs text-gray-500 ml-8 font-mono">{item.shortcut}</span>
                            )}
                            {item.checkable && (
                                <div className="w-3 h-3 rounded-sm border border-gray-600 ml-8" />
                            )}
                        </div>

                        {/* Render submenu if it's an array and active */}
                        {item.submenu && Array.isArray(item.submenu) && activeSubmenu === `${menu}-${idx}` && (
                            <div
                                className="absolute top-0 left-full ml-1 min-w-48 rounded-lg shadow-xl z-50"
                                style={{
                                    background: 'rgba(30, 30, 35, 0.98)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                                }}
                            >
                                {item.submenu.map((subItem, subIdx) => (
                                    <div
                                        key={subIdx}
                                        className="flex items-center justify-between px-3 py-2 mx-1 my-0.5 rounded cursor-pointer transition-all duration-150 hover:bg-gray-700/50"
                                        onClick={() => handleMenuItemClick(subItem, menu)}
                                    >
                                        <div className="flex items-center gap-3">
                                            {subItem.icon && <subItem.icon size={14} className="text-gray-400" />}
                                            <span className="text-sm text-gray-200">{subItem.label}</span>
                                        </div>
                                        {subItem.shortcut && (
                                            <span className="text-xs text-gray-500 ml-8 font-mono">{subItem.shortcut}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );

    // Layout Menu Component
    const LayoutMenuDropdown = () => (
        <div className="absolute right-0 top-full mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-4 z-50">
            <h3 className="text-xs font-medium text-gray-400 uppercase mb-3">Viewport Layouts</h3>

            {/* One Pane */}
            <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">ONE PANE</p>
                <button
                    className={`w-12 h-12 border rounded flex items-center justify-center transition-colors ${currentLayout === 'single' ? 'border-blue-500 bg-blue-500/20' : 'border-gray-600 hover:border-gray-500'
                        }`}
                    onClick={() => {
                        onLayoutChange && onLayoutChange('single');
                        setShowLayoutMenu(false);
                    }}
                >
                    <div className="w-8 h-8 bg-gray-700 rounded"></div>
                </button>
            </div>

            {/* Two Panes */}
            <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">TWO PANES</p>
                <div className="flex gap-2">
                    <button
                        className={`w-12 h-12 border rounded flex items-center justify-center gap-1 transition-colors ${currentLayout === 'vertical' ? 'border-blue-500 bg-blue-500/20' : 'border-gray-600 hover:border-gray-500'
                            }`}
                        onClick={() => {
                            onLayoutChange && onLayoutChange('vertical');
                            setShowLayoutMenu(false);
                        }}
                    >
                        <div className="w-3 h-8 bg-gray-700 rounded-sm"></div>
                        <div className="w-3 h-8 bg-gray-700 rounded-sm"></div>
                    </button>
                    <button
                        className={`w-12 h-12 border rounded flex flex-col items-center justify-center gap-1 transition-colors ${currentLayout === 'horizontal' ? 'border-blue-500 bg-blue-500/20' : 'border-gray-600 hover:border-gray-500'
                            }`}
                        onClick={() => {
                            onLayoutChange && onLayoutChange('horizontal');
                            setShowLayoutMenu(false);
                        }}
                    >
                        <div className="w-8 h-3 bg-gray-700 rounded-sm"></div>
                        <div className="w-8 h-3 bg-gray-700 rounded-sm"></div>
                    </button>
                </div>
            </div>

            {/* Three Panes */}
            <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">THREE PANES</p>
                <div className="grid grid-cols-4 gap-2">
                    <button
                        className={`w-12 h-12 border rounded p-1 transition-colors ${currentLayout === 'triple_left' ? 'border-blue-500 bg-blue-500/20' : 'border-gray-600 hover:border-gray-500'
                            }`}
                        onClick={() => {
                            onLayoutChange && onLayoutChange('triple_left');
                            setShowLayoutMenu(false);
                        }}
                    >
                        <div className="w-full h-full grid grid-cols-2 gap-0.5">
                            <div className="bg-gray-700 rounded-sm row-span-2"></div>
                            <div className="bg-gray-700 rounded-sm"></div>
                            <div className="bg-gray-700 rounded-sm"></div>
                        </div>
                    </button>
                    <button
                        className={`w-12 h-12 border rounded p-1 transition-colors ${currentLayout === 'triple_right' ? 'border-blue-500 bg-blue-500/20' : 'border-gray-600 hover:border-gray-500'
                            }`}
                        onClick={() => {
                            onLayoutChange && onLayoutChange('triple_right');
                            setShowLayoutMenu(false);
                        }}
                    >
                        <div className="w-full h-full grid grid-cols-2 gap-0.5">
                            <div className="bg-gray-700 rounded-sm"></div>
                            <div className="bg-gray-700 rounded-sm row-span-2"></div>
                            <div className="bg-gray-700 rounded-sm"></div>
                        </div>
                    </button>
                    <button
                        className={`w-12 h-12 border rounded p-1 transition-colors ${currentLayout === 'triple_top' ? 'border-blue-500 bg-blue-500/20' : 'border-gray-600 hover:border-gray-500'
                            }`}
                        onClick={() => {
                            onLayoutChange && onLayoutChange('triple_top');
                            setShowLayoutMenu(false);
                        }}
                    >
                        <div className="w-full h-full grid grid-rows-2 gap-0.5">
                            <div className="bg-gray-700 rounded-sm"></div>
                            <div className="grid grid-cols-2 gap-0.5">
                                <div className="bg-gray-700 rounded-sm"></div>
                                <div className="bg-gray-700 rounded-sm"></div>
                            </div>
                        </div>
                    </button>
                    <button
                        className={`w-12 h-12 border rounded p-1 transition-colors ${currentLayout === 'triple_bottom' ? 'border-blue-500 bg-blue-500/20' : 'border-gray-600 hover:border-gray-500'
                            }`}
                        onClick={() => {
                            onLayoutChange && onLayoutChange('triple_bottom');
                            setShowLayoutMenu(false);
                        }}
                    >
                        <div className="w-full h-full grid grid-rows-2 gap-0.5">
                            <div className="grid grid-cols-2 gap-0.5">
                                <div className="bg-gray-700 rounded-sm"></div>
                                <div className="bg-gray-700 rounded-sm"></div>
                            </div>
                            <div className="bg-gray-700 rounded-sm"></div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Four Panes */}
            <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">FOUR PANES</p>
                <button
                    className={`w-12 h-12 border rounded p-1 transition-colors ${currentLayout === 'quad' ? 'border-blue-500 bg-blue-500/20' : 'border-gray-600 hover:border-gray-500'
                        }`}
                    onClick={() => {
                        onLayoutChange && onLayoutChange('quad');
                        setShowLayoutMenu(false);
                    }}
                >
                    <div className="w-full h-full grid grid-cols-2 gap-0.5">
                        <div className="bg-gray-700 rounded-sm"></div>
                        <div className="bg-gray-700 rounded-sm"></div>
                        <div className="bg-gray-700 rounded-sm"></div>
                        <div className="bg-gray-700 rounded-sm"></div>
                    </div>
                </button>
            </div>

            {/* Options */}
            <div className="border-t border-gray-700 pt-3">
                <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer hover:text-gray-100">
                    <input type="checkbox" className="rounded" />
                    <Maximize size={14} />
                    <span>Immersive View</span>
                    <span className="ml-auto text-gray-500">F11</span>
                </label>
            </div>
        </div>
    );

    return (
        <div className="toolbar-unified" ref={dropdownRef}>
            <div className="flex items-center h-10 px-2 border-b border-gray-800">
                {/* Logo & Menu Toggle */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-2">
                        <div className="w-5 h-5 bg-gradient-to-br from-orange-500 to-pink-600 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">F</span>
                        </div>
                    </div>
                </div>

                {/* Dropdown Menus */}
                {!isMenuCollapsed && (
                    <div className="flex items-center gap-1 ml-4">
                        {Object.entries(menuStructure).map(([menu, config]) => (
                            <div key={menu} className="relative">
                                <button
                                    className={`px-3 py-1.5 text-sm rounded transition-all duration-150 flex items-center gap-1.5 ${activeDropdown === menu
                                            ? 'bg-gray-700 text-white'
                                            : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                                        }`}
                                    onClick={() => setActiveDropdown(activeDropdown === menu ? null : menu)}
                                >
                                    {config.icon && <config.icon size={14} />}
                                    {menu}
                                </button>

                                {activeDropdown === menu && renderDropdownMenu(menu, config.items)}
                            </div>
                        ))}
                    </div>
                )}

                <div className="h-4 w-px bg-gray-700 mx-3" />
                <div className="flex items-center gap-1">
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Untitled Project</span>
                    <ChevronDown size={12} style={{ color: 'var(--text-muted)' }} />
                </div>
                <div className="h-4 w-px bg-gray-700 mx-3" />

                {/* Quick Tools */}
                <div className="flex items-center gap-1">
                    {tools.map(tool => (
                        <button
                            key={tool.id}
                            className={`p-2 rounded transition-all duration-150 ${selectedTool === tool.id
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                                }`}
                            onClick={() => setSelectedTool(tool.id)}
                            title={tool.label}
                        >
                            <tool.icon size={16} />
                        </button>
                    ))}
                    <button
                        className="p-2 rounded transition-all duration-150 text-gray-400 hover:bg-gray-700/50 hover:text-white"
                        title="Toggle Grid"
                    >
                        <Grid3X3 size={16} />
                    </button>
                    <button
                        className="p-2 rounded transition-all duration-150 text-gray-400 hover:bg-gray-700/50 hover:text-white"
                        title="Toggle Helpers"
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        className="p-2 rounded transition-all duration-150 text-gray-400 hover:bg-gray-700/50 hover:text-white"
                        title="Toggle Performance Stats"
                    >
                        <Settings size={16} />
                    </button>
                </div>

                <div className="h-4 w-px bg-gray-700 mx-3" />



                {/* Performance Monitor */}
                <div className="flex items-center gap-3 text-xs mr-4">
                    <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${performanceMetrics.fps >= 58 ? 'bg-green-400' :
                                performanceMetrics.fps >= 30 ? 'bg-yellow-400' : 'bg-red-400'
                            }`} />
                        <span className="text-gray-400">{performanceMetrics.fps} FPS</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${performanceMetrics.memoryUsage < 1.0 ? 'bg-green-400' :
                                performanceMetrics.memoryUsage < 2.0 ? 'bg-yellow-400' : 'bg-red-400'
                            }`} />
                        <span className="text-gray-400">{performanceMetrics.memoryUsage}GB</span>
                    </div>
                </div>

                {/* Device Preview */}
                <div className="flex items-center gap-1 mr-3">
                    {[
                        { id: 'desktop', icon: Monitor, active: true },
                        { id: 'tablet', icon: Tablet },
                        { id: 'mobile', icon: Smartphone }
                    ].map(device => (
                        <button
                            key={device.id}
                            className={`p-2 rounded transition-all duration-150 ${device.active
                                    ? 'bg-gray-700 text-white'
                                    : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                                }`}
                            title={device.id}
                        >
                            <device.icon size={16} />
                        </button>
                    ))}
                </div>

                {/* Panel Toggle Controls */}
                <div className="flex items-center space-x-2 px-4">
                    <div className="text-xs text-gray-400 mr-2">Panels:</div>

                    {/* Left Panel Toggle */}
                    <button
                        onClick={toggleLeftPanel}
                        className={`p-1.5 rounded text-xs font-medium transition-colors ${showLeftPanel
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        title={showLeftPanel ? 'Hide Left Panel' : 'Show Left Panel'}
                    >
                        <ChevronLeftIcon className="w-4 h-4" />
                    </button>

                    {/* Timeline Panel Toggle */}
                    <button
                        onClick={toggleTimelinePanel}
                        className={`p-1.5 rounded text-xs font-medium transition-colors ${showTimelinePanel
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        title={showTimelinePanel ? 'Hide Timeline Panel' : 'Show Timeline Panel'}
                    >
                        <ChevronDownIcon className="w-4 h-4" />
                    </button>

                    {/* Right Panel Toggle */}
                    <button
                        onClick={toggleRightPanel}
                        className={`p-1.5 rounded text-xs font-medium transition-colors ${showRightPanel
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        title={showRightPanel ? 'Hide Right Panel' : 'Show Right Panel'}
                    >
                        <ChevronRightIcon className="w-4 h-4" />
                    </button>
                </div>
                <div className="h-4 w-px bg-gray-700 mx-3" />
                {/* Viewport Layout Controls */}
                <div className="relative flex items-center gap-2" ref={layoutMenuRef}>
                    {/* Layout Menu */}
                    <button
                        className="p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
                        onClick={() => setShowLayoutMenu(!showLayoutMenu)}
                        title="Viewport Layouts"
                    >
                        <MoreVertical size={16} className="text-gray-300" />
                    </button>

                    {/* Maximize Toggle */}
                    <button
                        className="p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
                        onClick={() => onToggleMaximize && onToggleMaximize()}
                        title={isMaximized ? "Restore Layout" : "Maximize Viewport"}
                    >
                        {isMaximized ? (
                            <Minimize2 size={16} className="text-gray-300" />
                        ) : (
                            <Maximize2 size={16} className="text-gray-300" />
                        )}
                    </button>

                    {showLayoutMenu && <LayoutMenuDropdown />}
                </div>



                <div className="flex-1" />

                {/* Right Side - Actions */}
                <div className="flex items-center gap-3">
                    {/* Play Button */}
                    <button className="btn primary" onClick={() => onClosePreviewPanel(true)}>
                        <Play size={14} />
                        Preview
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UnifiedToolbar;