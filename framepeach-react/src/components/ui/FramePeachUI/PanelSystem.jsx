import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GripVertical, X, Maximize2, Minimize2 } from 'lucide-react';

const Panel = ({ 
  title, 
  children, 
  onClose, 
  onMaximize,
  isMaximized = false,
  className = "",
  tabs = null,
  activeTab = null,
  onTabChange = null
}) => {
  return (
    <div className={`panel ${className}`}>
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <GripVertical size={12} className="text-gray-500" />
          <span>{title}</span>
        </div>
        <div className="flex items-center gap-1">
          {onMaximize && (
            <button
              onClick={onMaximize}
              className="w-5 h-5 flex items-center justify-center hover:bg-gray-600 rounded text-gray-400 hover:text-white"
            >
              {isMaximized ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="w-5 h-5 flex items-center justify-center hover:bg-red-600 rounded text-gray-400 hover:text-white"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>
      
      {tabs && (
        <div className="panel-tabs">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`panel-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange && onTabChange(tab.id)}
            >
              {tab.icon && <tab.icon size={14} />}
              {tab.label}
            </div>
          ))}
        </div>
      )}
      
      <div className="panel-content">
        {children}
      </div>
    </div>
  );
};

const Splitter = ({ 
  direction = 'horizontal', 
  onResize, 
  initialPosition = 50,
  minSize = 200,
  maxSize = null
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const splitterRef = useRef(null);

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;

    const container = splitterRef.current?.parentElement;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    let newPosition;

    if (direction === 'horizontal') {
      newPosition = ((e.clientX - rect.left) / rect.width) * 100;
    } else {
      newPosition = ((e.clientY - rect.top) / rect.height) * 100;
    }

    // Apply constraints
    const containerSize = direction === 'horizontal' ? rect.width : rect.height;
    const minPercent = (minSize / containerSize) * 100;
    const maxPercent = maxSize ? (maxSize / containerSize) * 100 : 95;

    newPosition = Math.max(minPercent, Math.min(maxPercent, newPosition));
    
    setPosition(newPosition);
    onResize && onResize(newPosition);
  }, [isDragging, direction, minSize, maxSize, onResize]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'default';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, direction]);

  return (
    <div
      ref={splitterRef}
      className={`splitter ${direction === 'horizontal' ? 'splitter-horizontal' : 'splitter-vertical'}`}
      onMouseDown={handleMouseDown}
      style={{
        left: direction === 'horizontal' ? `${position}%` : undefined,
        top: direction === 'vertical' ? `${position}%` : undefined,
      }}
    />
  );
};

const PanelLayout = ({ children, direction = 'horizontal', sizes = [50, 50] }) => {
  const [panelSizes, setPanelSizes] = useState(sizes);

  const handleResize = (index, newSize) => {
    const newSizes = [...panelSizes];
    const difference = newSize - newSizes[index];
    
    newSizes[index] = newSize;
    if (index < newSizes.length - 1) {
      newSizes[index + 1] = Math.max(5, newSizes[index + 1] - difference);
    }
    
    setPanelSizes(newSizes);
  };

  return (
    <div className={`flex ${direction === 'horizontal' ? 'flex-row' : 'flex-col'} h-full w-full relative`}>
      {React.Children.map(children, (child, index) => (
        <React.Fragment key={index}>
          <div 
            style={{
              [direction === 'horizontal' ? 'width' : 'height']: `${panelSizes[index]}%`,
              [direction === 'horizontal' ? 'height' : 'width']: '100%'
            }}
            className="relative"
          >
            {child}
          </div>
          {index < React.Children.count(children) - 1 && (
            <Splitter
              direction={direction}
              onResize={(newSize) => handleResize(index, newSize)}
              initialPosition={panelSizes[index]}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export { Panel, Splitter, PanelLayout };
