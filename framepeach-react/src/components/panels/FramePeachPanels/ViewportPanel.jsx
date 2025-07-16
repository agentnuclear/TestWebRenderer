import React, { useEffect } from 'react';
import Viewport from './viewport/Viewport';
import { SelectedObjectInfo, QuickControlsInfo, DragOverIndicator } from './viewport/UIComponents';
import { useViewportState, useDragAndDrop } from './viewport/hooks';
import { getViewportConfig, getLayoutClass, getSpanClass } from './viewport/utils';
import { sliderStyles } from './viewport/constants';

// Main ViewportPanel Component
const ViewportPanel = ({ 
  performanceMetrics,
  currentLayout = 'single',
  isMaximized = false,
  onLayoutChange,
  onToggleMaximize,
}) => {
  // Use custom hooks for state management
  const {
    showGrid,
    selectedTool,
    sceneObjects,
    selectedObject,
    showStats,
    activeViewport,
    viewportRenderModes,
    mouseSpeed,
    projectName,
    setShowGrid,
    setSelectedTool,
    setSceneObjects,
    setSelectedObject,
    setShowStats,
    setActiveViewport,
    setViewportRenderModes,
    setMouseSpeed,
    setProjectName,
    saveProject,
    loadProject,
    newProject
  } = useViewportState();

  // Use drag and drop hook
  const { isDragOver, dragProps } = useDragAndDrop(sceneObjects, setSceneObjects, setSelectedObject);

  // Inject custom slider styles
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = sliderStyles;
    document.head.appendChild(styleElement);
    return () => document.head.removeChild(styleElement);
  }, []);

  // Load project on component mount
  useEffect(() => {
    loadProject();
  }, [loadProject]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (sceneObjects.length > 0) {
      const autoSaveInterval = setInterval(() => {
        saveProject();
      }, 30000); // 30 seconds

      return () => clearInterval(autoSaveInterval);
    }
  }, [sceneObjects, selectedObject, showGrid, showStats, activeViewport, viewportRenderModes, mouseSpeed, projectName, saveProject]);

  // Save when scene objects change
  useEffect(() => {
    if (sceneObjects.length > 0) {
      const timeoutId = setTimeout(() => {
        saveProject();
      }, 1000); // Save 1 second after last change

      return () => clearTimeout(timeoutId);
    }
  }, [sceneObjects, selectedObject, saveProject]);

  // Get viewport configuration based on layout
  const viewportConfig = getViewportConfig(currentLayout, isMaximized, activeViewport);
  const displayViewports = isMaximized ? [viewportConfig[activeViewport]] : viewportConfig;

  // Add 3D object function
  const add3DObject = (objectType) => {
    const newObject = {
      id: Date.now(),
      type: objectType,
      position: { 
        x: (Math.random() - 0.5) * 10, 
        y: 0.5, 
        z: (Math.random() - 0.5) * 10 
      },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      name: `${objectType}_${sceneObjects.length + 1}`
    };
    setSceneObjects(prev => {
      const newSceneObjects = [...prev, newObject];
      // Dispatch scene update event for HierarchyPanel
      const sceneUpdateEvent = new CustomEvent("sceneUpdated", {
        detail: newSceneObjects
      });
      window.dispatchEvent(sceneUpdateEvent);
      return newSceneObjects;
    });
  };

  const selectObject = (object) => {
    setSelectedObject(object);
    // Dispatch selection event for PropertiesPanel to listen to
    const selectionEvent = new CustomEvent("objectSelected", {
      detail: object
    });
    window.dispatchEvent(selectionEvent);
  };

  const deleteSelectedObject = () => {
    if (selectedObject) {
      setSceneObjects(prev => {
        const newSceneObjects = prev.filter(obj => obj.id !== selectedObject.id);
        // Dispatch scene update event for HierarchyPanel
        const sceneUpdateEvent = new CustomEvent("sceneUpdated", {
          detail: newSceneObjects
        });
        window.dispatchEvent(sceneUpdateEvent);
        return newSceneObjects;
      });
      setSelectedObject(null);
    }
  };
  const handleGizmoTransform = (transformedObject) => {
    // Update the object in sceneObjects array immediately
    setSceneObjects(prev => prev.map(obj => 
      obj.id === transformedObject.id ? transformedObject : obj
    ));
    
    // Update selected object immediately for real-time feedback
    setSelectedObject(transformedObject);
    
    // Dispatch events for other panels
    const selectionEvent = new CustomEvent("objectSelected", {
      detail: transformedObject
    });
    window.dispatchEvent(selectionEvent);
    
    const sceneUpdateEvent = new CustomEvent("sceneUpdated", {
      detail: sceneObjects.map(obj => 
        obj.id === transformedObject.id ? transformedObject : obj
      )
    });
    window.dispatchEvent(sceneUpdateEvent);
  };

  // Event listeners for properties panel updates
  useEffect(() => {
    const handlePositionUpdate = (e) => {
      const { axis, value } = e.detail;
      if (!selectedObject) return;

      setSceneObjects(prevObjects => prevObjects.map(obj => 
        obj.id === selectedObject.id
          ? { 
              ...obj, 
              position: {
                ...obj.position,
                [axis]: value
              }
            }
          : obj
      ));

      setSelectedObject(prev => prev ? { 
        ...prev, 
        position: {
          ...prev.position,
          [axis]: value
        }
      } : null);
    };

    const handleMaterialUpdate = (e) => {
      const { objectId, property, value } = e.detail;
      
      console.log(objectId,property,value,"material");
      setSceneObjects(prevObjects => prevObjects.map(obj => {
        if (obj.id === objectId) {
          return {
            ...obj,
            material: {
              ...obj.material,
              properties: {
                ...obj.material?.properties,
                [property]: value
              }
            }
          };
        }
        return obj;
      }));
      
      // Update selected object too
      if (selectedObject && selectedObject.id === objectId) {
        setSelectedObject(prev => ({
          ...prev,
          material: {
            ...prev.material,
            properties: {
              ...prev.material?.properties,
              [property]: value
            }
          }
        }));
      }
    };

    const handleRotationUpdate = (e) => {
      const { axis, value } = e.detail;
      if (!selectedObject) return;

      setSceneObjects(prevObjects => prevObjects.map(obj => 
        obj.id === selectedObject.id
          ? { 
              ...obj, 
              rotation: {
                ...obj.rotation,
                [axis]: value
              }
            }
          : obj
      ));

      setSelectedObject(prev => prev ? { 
        ...prev, 
        rotation: {
          ...prev.rotation,
          [axis]: value
        }
      } : null);
    };
    
    const handleGizmoUpdate = (e) => {
      // Only handle if it's a gizmo update (has complete object)
      if (e.detail && e.detail.id && e.detail.position && e.detail.rotation && e.detail.scale) {
        handleGizmoTransform(e.detail);
      }
    };
    const handleScaleUpdate = (e) => {
      const { axis, value } = e.detail;
      if (!selectedObject) return;

      setSceneObjects(prevObjects => prevObjects.map(obj => 
        obj.id === selectedObject.id
          ? { 
              ...obj, 
              scale: {
                ...obj.scale,
                [axis]: value
              }
            }
          : obj
      ));

      setSelectedObject(prev => prev ? { 
        ...prev, 
        scale: {
          ...prev.scale,
          [axis]: value
        }
      } : null);
    };

    const handleDeleteRequest = (e) => {
      const { id } = e.detail;
      setSceneObjects(prev => {
        const newSceneObjects = prev.filter(obj => obj.id !== id);
        const sceneUpdateEvent = new CustomEvent("sceneUpdated", {
          detail: newSceneObjects
        });
        window.dispatchEvent(sceneUpdateEvent);
        return newSceneObjects;
      });
      setSelectedObject(null);
    };

    const handleDuplicateRequest = (e) => {
      const { object } = e.detail;
      const duplicatedObject = {
        ...object,
        id: Date.now(),
        name: `${object.name}_copy`,
        position: {
          x: object.position.x + 2,
          y: object.position.y,
          z: object.position.z + 2
        }
      };
      
      setSceneObjects(prev => {
        const newSceneObjects = [...prev, duplicatedObject];
        const sceneUpdateEvent = new CustomEvent("sceneUpdated", {
          detail: newSceneObjects
        });
        window.dispatchEvent(sceneUpdateEvent);
        return newSceneObjects;
      });
    };

    const handleHierarchySelection = (e) => {
      setSelectedObject(e.detail);
    };

    const handleAddObjectRequest = (e) => {
      add3DObject(e.detail.type);
    };

    // Add event listeners
    window.addEventListener("positionUpdated", handlePositionUpdate);
    window.addEventListener("rotationUpdated", handleRotationUpdate);
    window.addEventListener("scaleUpdated", handleScaleUpdate);
    window.addEventListener("deleteObjectRequested", handleDeleteRequest);
    window.addEventListener("duplicateObjectRequested", handleDuplicateRequest);
    window.addEventListener("hierarchyObjectSelected", handleHierarchySelection);
    window.addEventListener("addObjectRequested", handleAddObjectRequest);
    window.addEventListener("gizmoTransform", handleGizmoUpdate);
    window.addEventListener("materialUpdated", handleMaterialUpdate);

    return () => {
      window.removeEventListener("positionUpdated", handlePositionUpdate);
      window.removeEventListener("rotationUpdated", handleRotationUpdate);
      window.removeEventListener("scaleUpdated", handleScaleUpdate);
      window.removeEventListener("deleteObjectRequested", handleDeleteRequest);
      window.removeEventListener("duplicateObjectRequested", handleDuplicateRequest);
      window.removeEventListener("hierarchyObjectSelected", handleHierarchySelection);
      window.removeEventListener("addObjectRequested", handleAddObjectRequest);
      window.removeEventListener("gizmoTransform", handleGizmoUpdate);
      window.removeEventListener("materialUpdated", handleMaterialUpdate);


    };
  }, [selectedObject, add3DObject]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' && selectedObject) {
        deleteSelectedObject();
      }
      if (e.key === 'g') setSelectedTool('move');
      if (e.key === 'r') setSelectedTool('rotate');
      if (e.key === 's') setSelectedTool('scale');
      if (e.key === 'Escape') setSelectedObject(null);
      if (e.key === '1') add3DObject('cube');
      if (e.key === '2') add3DObject('sphere');
      if (e.key === '3') add3DObject('cylinder');
      if (e.key === '4') add3DObject('plane');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedObject, deleteSelectedObject, setSelectedTool, setSelectedObject, add3DObject]);

  return (
    <div className={`h-full relative bg-gray-900 ${isDragOver ? 'ring-4 ring-blue-500 ring-opacity-50' : ''}`} {...dragProps}>
      {/* Drag Over Indicator */}
      <DragOverIndicator isDragOver={isDragOver} />
      
      {/* Viewports Grid */}
      <div className={`absolute inset-0 grid ${getLayoutClass(currentLayout, isMaximized)}`}>
        {displayViewports.map((viewport, idx) => {
          const actualIndex = isMaximized ? activeViewport : viewport.index;
          return (
            <div key={viewport.index} className={getSpanClass(currentLayout, idx)}>
              <Viewport
                viewportType={viewport.type}
                sceneObjects={sceneObjects}
                selectedObject={selectedObject}
                onSelectObject={selectObject}
                showGrid={showGrid}
                showStats={showStats}
                isActive={activeViewport === actualIndex}
                onActivate={() => setActiveViewport(actualIndex)}
                renderMode={viewportRenderModes[actualIndex]}
                onRenderModeChange={(mode) => {
                  setViewportRenderModes(prev => ({
                    ...prev,
                    [actualIndex]: mode
                  }));
                }}
                mouseSpeed={mouseSpeed}
                onMouseSpeedChange={setMouseSpeed}
                onToggleGrid={() => setShowGrid(!showGrid)}
                onToggleStats={() => setShowStats(!showStats)}
                selectedTool={selectedTool} 
                onGizmoTransform={handleGizmoTransform} 
              />
            </div>
          );
        })}
      </div>

      {/* Selected Object Info
      <SelectedObjectInfo 
        selectedObject={selectedObject} 
        onDelete={deleteSelectedObject} 
      />

      {/* Quick Controls Instructions */}
     
    </div>
  );
};

export default ViewportPanel;