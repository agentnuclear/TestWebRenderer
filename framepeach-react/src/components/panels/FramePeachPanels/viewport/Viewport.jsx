import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stats } from '@react-three/drei';
import * as THREE from 'three';
import UnrealCameraControls from '../../../UnrealCameraControls';
import Scene from './Scene';
import { VIEWPORT_TYPES, RENDER_MODES, UE5_CONFIG } from './constants';
import { Grid3X3, ChevronDown } from 'lucide-react';

// Individual Viewport Component
const Viewport = ({ 
  viewportType, 
  sceneObjects, 
  selectedObject, 
  onSelectObject, 
  showGrid, 
  showStats,
  isActive,
  onActivate,
  renderMode,
  onRenderModeChange,
  mouseSpeed,
  onMouseSpeedChange,
  onToggleGrid,
  onToggleStats,
  selectedTool 
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const viewportConfig = VIEWPORT_TYPES[viewportType];
  
  return (
    <div 
      className={`relative w-full h-full border ${isActive ? 'border-blue-500' : 'border-gray-700'}`}
      onClick={onActivate}
    >
      {/* Viewport Header */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-2 z-10">
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <span className="font-medium">{viewportConfig.icon}</span>
          <span>{viewportConfig.name}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Mouse Speed Slider - only show for perspective viewport */}
          {viewportType === 'perspective' && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-400">Speed:</span>
              <input
                type="range"
                min="0.0005"
                max="0.01"
                step="0.0005"
                value={mouseSpeed}
                onChange={(e) => onMouseSpeedChange(parseFloat(e.target.value))}
                className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((mouseSpeed - 0.0005) / (0.01 - 0.0005)) * 100}%, #4b5563 ${((mouseSpeed - 0.0005) / (0.01 - 0.0005)) * 100}%, #4b5563 100%)`
                }}
              />
              <span className="text-xs text-gray-300 w-6">{(mouseSpeed * 1000).toFixed(0)}</span>
            </div>
          )}
          
          {/* Grid Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleGrid();
            }}
            className={`px-1 py-0.5 text-xs rounded transition-colors ${
              showGrid ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            title="Toggle Grid"
          >
            <Grid3X3 size={10} />
          </button>
          
          {/* Stats Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStats();
            }}
            className={`px-1 py-0.5 text-xs rounded transition-colors ${
              showStats ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            title="Toggle Stats"
          >
            📊
          </button>
        
          {/* Render Mode Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-300 hover:bg-gray-700 rounded transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(!showDropdown);
              }}
            >
              <span>{RENDER_MODES[renderMode].name}</span>
              <ChevronDown size={12} />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 top-full mt-1 bg-gray-800 border border-gray-700 rounded shadow-xl z-50">
                {Object.values(RENDER_MODES).map((mode) => (
                  <button
                    key={mode.id}
                    className={`block w-full px-3 py-2 text-xs text-left hover:bg-gray-700 transition-colors ${
                      renderMode === mode.id ? 'text-blue-400' : 'text-gray-300'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRenderModeChange(mode.id);
                      setShowDropdown(false);
                    }}
                  >
                    {mode.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Canvas */}
      <div className="absolute inset-0 top-8 bg-gray-900">
        <Canvas
          shadows={renderMode !== 'wireframe' && renderMode !== 'unlit'}
          camera={
            viewportType === 'perspective' 
              ? { position: [1, 1, 1], fov: viewportConfig.fov || 75 }
              : { 
                  position: viewportConfig.position || [0, 0, 10],
                  rotation: viewportConfig.rotation || [0, 0, 0],
                  near: 0.1,
                  far: 1000,
                  zoom: 1
                }
          }
          orthographic={viewportType !== 'perspective'}
          gl={{ 
            antialias: true, 
            alpha: true,
            preserveDrawingBuffer: true,
            powerPreference: "high-performance",
            logarithmicDepthBuffer: true
          }}
          onCreated={({ gl, camera, scene }) => {
            // Enhanced renderer setup
            gl.outputColorSpace = THREE.SRGBColorSpace;
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = UE5_CONFIG.exposure;
            gl.shadowMap.enabled = renderMode !== 'wireframe' && renderMode !== 'unlit';
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
            gl.physicallyCorrectLights = true;
            
            // Set clear color based on render mode
            if (renderMode === 'wireframe') {
              gl.setClearColor('#000000', 1);
            } else {
              gl.setClearColor('#111827', 1);
            }
            
            if (viewportConfig.rotation && camera) {
              camera.rotation.set(...viewportConfig.rotation);
            }
          }}
        >
          {showStats && <Stats />}
          
          {viewportType === 'perspective' && (
            <UnrealCameraControls 
              enabled={true}
              moveSpeed={mouseSpeed * 10}
              lookSpeed={0.002}
              panSpeed={0.01}
              zoomSpeed={0.1}
              selectedObject={selectedObject}
            />
          )}
          
          <Scene 
            sceneObjects={sceneObjects}
            selectedObject={selectedObject}
            onSelectObject={onSelectObject}
            showGrid={showGrid}
            renderMode={renderMode}
            selectedTool={selectedTool}
          />
        </Canvas>
      </div>
    </div>
  );
};

export default Viewport;
