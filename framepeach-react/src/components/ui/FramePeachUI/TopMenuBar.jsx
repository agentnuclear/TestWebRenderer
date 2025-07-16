import React, { useState } from 'react';
import { Users, ChevronDown, Share2, Play } from 'lucide-react';

const TopMenuBar = ({ 
  collaborators, 
  showCollabPanel, 
  setShowCollabPanel 
}) => {
  const [activeMenu, setActiveMenu] = useState(null);

  const menuItems = {
    File: [
      { label: 'New Scene', shortcut: 'Ctrl+N' },
      { label: 'Open...', shortcut: 'Ctrl+O' },
      { label: 'Open Recent', submenu: true },
      { label: 'Save', shortcut: 'Ctrl+S' },
      { label: 'Save As...', shortcut: 'Ctrl+Shift+S' },
      { label: 'Export', submenu: true },
      { label: 'Import', submenu: true },
      { type: 'separator' },
      { label: 'Project Settings' },
      { type: 'separator' },
      { label: 'Exit', shortcut: 'Ctrl+Q' }
    ],
    Edit: [
      { label: 'Undo', shortcut: 'Ctrl+Z' },
      { label: 'Redo', shortcut: 'Ctrl+Y' },
      { type: 'separator' },
      { label: 'Cut', shortcut: 'Ctrl+X' },
      { label: 'Copy', shortcut: 'Ctrl+C' },
      { label: 'Paste', shortcut: 'Ctrl+V' },
      { label: 'Duplicate', shortcut: 'Ctrl+D' },
      { label: 'Delete', shortcut: 'Del' },
      { type: 'separator' },
      { label: 'Select All', shortcut: 'Ctrl+A' },
      { label: 'Deselect All', shortcut: 'Ctrl+Shift+A' },
      { type: 'separator' },
      { label: 'Preferences' }
    ],
    View: [
      { label: 'Reset Layout' },
      { type: 'separator' },
      { label: 'Wireframe', shortcut: 'Alt+Z' },
      { label: 'Solid', shortcut: 'Z' },
      { label: 'Material Preview', shortcut: 'Shift+Z' },
      { label: 'Rendered', shortcut: 'Ctrl+Z' },
      { type: 'separator' },
      { label: 'Front View', shortcut: 'Num1' },
      { label: 'Right View', shortcut: 'Num3' },
      { label: 'Top View', shortcut: 'Num7' },
      { label: 'Camera View', shortcut: 'Num0' },
      { type: 'separator' },
      { label: 'Frame Selected', shortcut: 'NumPad .' },
      { label: 'Frame All', shortcut: 'Home' }
    ],
    Object: [
      { label: 'Add', submenu: true },
      { type: 'separator' },
      { label: 'Transform', submenu: true },
      { label: 'Apply', submenu: true },
      { type: 'separator' },
      { label: 'Parent', submenu: true },
      { label: 'Group', shortcut: 'Ctrl+G' },
      { label: 'Ungroup', shortcut: 'Ctrl+Shift+G' },
      { type: 'separator' },
      { label: 'Join', shortcut: 'Ctrl+J' },
      { label: 'Separate', submenu: true },
      { type: 'separator' },
      { label: 'Shade Smooth' },
      { label: 'Shade Flat' }
    ],
    Tools: [
      { label: 'Select', shortcut: 'W' },
      { label: 'Move', shortcut: 'G' },
      { label: 'Rotate', shortcut: 'R' },
      { label: 'Scale', shortcut: 'S' },
      { type: 'separator' },
      { label: 'Extrude', shortcut: 'E' },
      { label: 'Inset', shortcut: 'I' },
      { label: 'Bevel', shortcut: 'Ctrl+B' },
      { label: 'Loop Cut', shortcut: 'Ctrl+R' },
      { type: 'separator' },
      { label: 'Knife', shortcut: 'K' },
      { label: 'Bisect' },
      { type: 'separator' },
      { label: 'Annotate' },
      { label: 'Measure' }
    ],
    Window: [
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
      { type: 'separator' },
      { label: 'Console' },
      { label: 'Info Panel' }
    ],
    Help: [
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
  };

  const handleMenuClick = (menuName) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const handleMenuItemClick = (item) => {
    console.log('Menu item clicked:', item.label);
    setActiveMenu(null);
  };  return (
    <div className="h-10 flex items-center justify-between px-4" 
         style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)' }}>
      {/* Logo and Project Name */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">F</span>
          </div>
          <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>FramePeach</span>
        </div>
        
        <div className="w-px h-4" style={{ background: 'var(--border-subtle)' }}></div>
        
        <div className="flex items-center gap-1">
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Untitled Project</span>
          <ChevronDown size={12} style={{ color: 'var(--text-muted)' }} />
        </div>
      </div>{/* Menu Items */}
      <div className="flex items-center gap-2 ml-6 relative">        {Object.keys(menuItems).map(item => (
          <div key={item} className="relative">
            <div 
              className={`px-3 py-1 text-sm rounded cursor-pointer transition-all duration-150 font-medium`}
              style={{
                background: activeMenu === item ? 'var(--bg-tertiary)' : 'transparent',
                color: activeMenu === item ? 'var(--text-primary)' : 'var(--text-secondary)',
                borderRadius: 'var(--border-radius-sm)'
              }}
              onMouseEnter={(e) => {
                if (activeMenu !== item) {
                  e.target.style.color = 'var(--text-primary)';
                  e.target.style.background = 'var(--bg-tertiary)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeMenu !== item) {
                  e.target.style.color = 'var(--text-secondary)';
                  e.target.style.background = 'transparent';
                }
              }}
              onClick={() => handleMenuClick(item)}
            >
              {item}
            </div>
            
            {/* Dropdown Menu */}
            {activeMenu === item && (
              <>
                {/* Backdrop to close menu */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setActiveMenu(null)}
                />                  {/* Menu Dropdown */}
                <div className="absolute top-full left-0 mt-1 rounded-md shadow-lg min-w-48 z-20 backdrop-blur-md" 
                     style={{ 
                       background: 'var(--glass-bg)', 
                       border: '1px solid var(--glass-border)',
                       boxShadow: 'var(--shadow-menu)',
                       borderRadius: 'var(--border-radius-md)'
                     }}>
                  {menuItems[item].map((menuItem, index) => {
                    if (menuItem.type === 'separator') {
                      return (
                        <div key={index} className="h-px my-1 mx-2" style={{ background: 'var(--border-subtle)' }} />
                      );
                    }
                    
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between px-3 py-2 text-sm cursor-pointer transition-colors duration-150"
                        style={{ 
                          color: 'var(--text-secondary)',
                          borderRadius: 'var(--border-radius-sm)',
                          margin: '2px 4px'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'var(--bg-tertiary)';
                          e.target.style.color = 'var(--text-primary)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                          e.target.style.color = 'var(--text-secondary)';
                        }}
                        onClick={() => handleMenuItemClick(menuItem)}
                      >
                        <span className="flex items-center gap-2">
                          {menuItem.label}
                          {menuItem.submenu && (
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>▶</span>
                          )}
                        </span>
                        {menuItem.shortcut && (
                          <span className="text-xs ml-4 font-mono" style={{ color: 'var(--text-muted)' }}>
                            {menuItem.shortcut}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        ))}
      </div>      {/* Center - Breadcrumb */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-2 px-3 py-1 rounded-md" style={{ background: 'var(--bg-input)' }}>
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Scene</span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>/</span>
          <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Main Camera</span>
        </div>
      </div>

      {/* Right Side - Actions and Collaborators */}
      <div className="flex items-center gap-3">
        {/* Play Button */}
        <button className="btn primary" onClick={()=>{console.log('clicked'); window.open('/preview', '_blank')}}>
          <Play size={14} />
          Preview
        </button>

   

        <div className="w-px h-4" style={{ background: 'var(--border-subtle)' }}></div>        {/* Collaborators */}
        {/* <div className="flex items-center gap-2">
          <div className="flex -space-x-1">
            {collaborators.slice(0, 3).map(collab => (
              <div 
                key={collab.id} 
                className={`w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-2 flex items-center justify-center text-xs font-bold text-white relative ${
                  collab.status === 'active' ? 'ring-1 ring-green-400' : ''
                }`}
                style={{ borderColor: 'var(--bg-secondary)' }}
                title={`${collab.name} - ${collab.status}`}
              >
                {collab.avatar}
                {collab.status === 'active' && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 rounded-full" style={{ borderColor: 'var(--bg-secondary)' }}></div>
                )}
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => setShowCollabPanel(!showCollabPanel)}
            className="menu-item flex items-center gap-1"
            style={{ 
              color: 'var(--text-secondary)', 
              padding: 'var(--spacing-xs)',
              borderRadius: 'var(--border-radius-sm)'
            }}
          >
            <Users size={14} />
            {collaborators.length > 3 && (
              <span className="text-xs">+{collaborators.length - 3}</span>
            )}
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default TopMenuBar;
