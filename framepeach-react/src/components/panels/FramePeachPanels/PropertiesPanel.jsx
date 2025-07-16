import React, { useEffect } from 'react';

const PropertiesPanel = ({}) => {
  const [position, setPosition] = React.useState({ x: 0, y: 0, z: 0 });
  const [rotation, setRotation] = React.useState({ x: 0, y: 0, z: 0 });
  const [scale, setScale] = React.useState({ x: 1, y: 1, z: 1 });
  const [selectedObject, setSelectedObject] = React.useState(null);

  // Listen for object selection events from ViewportPanel and HierarchyPanel
  useEffect(() => {
    const handleObjectSelection = (e) => {
      const object = e.detail;
      setSelectedObject(object);
      
      if (object) {
        setPosition(object.position);
        setRotation(object.rotation);
        setScale(object.scale);
      } else {
        setPosition({ x: 0, y: 0, z: 0 });
        setRotation({ x: 0, y: 0, z: 0 });
        setScale({ x: 1, y: 1, z: 1 });
      }
    };

    const handleHierarchySelection = (e) => {
      const object = e.detail;
      setSelectedObject(object);
      
      if (object) {
        setPosition(object.position);
        setRotation(object.rotation);
        setScale(object.scale);
      } else {
        setPosition({ x: 0, y: 0, z: 0 });
        setRotation({ x: 0, y: 0, z: 0 });
        setScale({ x: 1, y: 1, z: 1 });
      }
    };

    const handleProjectLoaded = (e) => {
      // Reset to default state when project is loaded
      setSelectedObject(null);
      setPosition({ x: 0, y: 0, z: 0 });
      setRotation({ x: 0, y: 0, z: 0 });
      setScale({ x: 1, y: 1, z: 1 });
    };

    const handleNewProject = (e) => {
      // Reset to default state when new project is created
      setSelectedObject(null);
      setPosition({ x: 0, y: 0, z: 0 });
      setRotation({ x: 0, y: 0, z: 0 });
      setScale({ x: 1, y: 1, z: 1 });
    };

    window.addEventListener("objectSelected", handleObjectSelection);
    window.addEventListener("hierarchyObjectSelected", handleHierarchySelection);
    window.addEventListener("projectLoaded", handleProjectLoaded);
    window.addEventListener("newProject", handleNewProject);
    
    return () => {
      window.removeEventListener("objectSelected", handleObjectSelection);
      window.removeEventListener("hierarchyObjectSelected", handleHierarchySelection);
      window.removeEventListener("projectLoaded", handleProjectLoaded);
      window.removeEventListener("newProject", handleNewProject);
    };
  }, []);

  // Listen for scene updates to sync with project data changes
  useEffect(() => {
    const handleSceneUpdated = (e) => {
      const sceneObjects = e.detail;
      
      // If we have a selected object, find it in the updated scene and sync its data
      if (selectedObject) {
        const updatedObject = sceneObjects.find(obj => obj.id === selectedObject.id);
        if (updatedObject) {
          setSelectedObject(updatedObject);
          setPosition(updatedObject.position);
          setRotation(updatedObject.rotation);
          setScale(updatedObject.scale);
        } else {
          // Object was deleted, clear selection
          setSelectedObject(null);
          setPosition({ x: 0, y: 0, z: 0 });
          setRotation({ x: 0, y: 0, z: 0 });
          setScale({ x: 1, y: 1, z: 1 });
        }
      }
    };

    window.addEventListener("sceneUpdated", handleSceneUpdated);
    
    return () => {
      window.removeEventListener("sceneUpdated", handleSceneUpdated);
    };
  }, [selectedObject]);

  // Initial sync with project data on mount
  useEffect(() => {
    // Check if there's already saved project data and sync with it
    try {
      const savedData = localStorage.getItem('framepeach-project');
      if (savedData) {
        const projectData = JSON.parse(savedData);
        // If there's a selected object in the saved data, we'll let the objectSelected event handle it
        // The ViewportPanel will dispatch the selection event during its own load process
      }
    } catch (error) {
      console.error('Error checking saved project data:', error);
    }
  }, []);

  // Handle individual transform updates
  const handlePositionChange = (axis, value) => {
    if (!selectedObject) return;
    
    setPosition(prev => ({ ...prev, [axis]: value }));
    
    // Dispatch event for the specific axis immediately
    const customEvent = new CustomEvent("positionUpdated", {
      detail: { axis, value }
    });
    window.dispatchEvent(customEvent);
  };

  const handleRotationChange = (axis, value) => {
    if (!selectedObject) return;
    
    setRotation(prev => ({ ...prev, [axis]: value }));
    
    // Dispatch event for the specific axis immediately
    const customEvent = new CustomEvent("rotationUpdated", {
      detail: { axis, value }
    });
    window.dispatchEvent(customEvent);
  };

  const handleScaleChange = (axis, value) => {
    if (!selectedObject) return;
    
    setScale(prev => ({ ...prev, [axis]: value }));
    
    // Dispatch event for the specific axis immediately
    const customEvent = new CustomEvent("scaleUpdated", {
      detail: { axis, value }
    });
    window.dispatchEvent(customEvent);
  };

  const deleteSelectedObject = () => {
    if (!selectedObject) return;
    
    const deleteEvent = new CustomEvent("deleteObjectRequested", {
      detail: { id: selectedObject.id }
    });
    window.dispatchEvent(deleteEvent);
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-gray-300">
      <div className="p-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-100">Properties</h3>
          {selectedObject && (
            <button
              onClick={deleteSelectedObject}
              className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded bg-red-400/10 hover:bg-red-400/20 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
        
        {/* Show selected object info */}
        {selectedObject ? (
          <div className="text-sm font-medium text-gray-200 mb-3 p-2 bg-gray-800 rounded">
            <div className="flex items-center justify-between">
              <span>{selectedObject.name || `${selectedObject.type}_${selectedObject.id}`}</span>
              <span className="text-xs text-gray-400 capitalize">{selectedObject.type}</span>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-400 mb-3 p-2 bg-gray-800 rounded text-center">
            No object selected
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3">
        <div className="space-y-4">
          {/* Transform Properties */}
          <div>
            <h4 className="text-sm font-semibold mb-2 text-gray-100">Transform</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Position</label>
                <div className="grid grid-cols-3 gap-1">
                  <div className="relative">
                    <input 
                      type="number" 
                      step="0.1"
                      className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs w-full pr-4" 
                      placeholder="X" 
                      value={position.x.toFixed(1)}
                      disabled={!selectedObject}
                      onChange={(e) => handlePositionChange('x', Number(e.target.value))}
                    />
                    <span className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">X</span>
                  </div>
                  <div className="relative">
                    <input 
                      type="number" 
                      step="0.1"
                      className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs w-full pr-4" 
                      placeholder="Y" 
                      value={position.y.toFixed(1)}
                      disabled={!selectedObject}
                      onChange={(e) => handlePositionChange('y', Number(e.target.value))}
                    />
                    <span className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">Y</span>
                  </div>
                  <div className="relative">
                    <input 
                      type="number" 
                      step="0.1"
                      className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs w-full pr-4" 
                      placeholder="Z" 
                      value={position.z.toFixed(1)}
                      disabled={!selectedObject}
                      onChange={(e) => handlePositionChange('z', Number(e.target.value))}
                    />
                    <span className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">Z</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-xs text-gray-400 block mb-1">Rotation (degrees)</label>
                <div className="grid grid-cols-3 gap-1">
                  <div className="relative">
                    <input 
                      type="number" 
                      step="1"
                      className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs w-full pr-4" 
                      placeholder="X" 
                      value={rotation.x}
                      disabled={!selectedObject}
                      onChange={(e) => handleRotationChange('x', Number(e.target.value))}
                    />
                    <span className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">X</span>
                  </div>
                  <div className="relative">
                    <input 
                      type="number" 
                      step="1"
                      className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs w-full pr-4" 
                      placeholder="Y" 
                      value={rotation.y}
                      disabled={!selectedObject}
                      onChange={(e) => handleRotationChange('y', Number(e.target.value))}
                    />
                    <span className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">Y</span>
                  </div>
                  <div className="relative">
                    <input 
                      type="number" 
                      step="1"
                      className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs w-full pr-4" 
                      placeholder="Z" 
                      value={rotation.z}
                      disabled={!selectedObject}
                      onChange={(e) => handleRotationChange('z', Number(e.target.value))}
                    />
                    <span className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">Z</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-xs text-gray-400 block mb-1">Scale</label>
                <div className="grid grid-cols-3 gap-1">
                  <div className="relative">
                    <input 
                      type="number" 
                      step="0.1"
                      min="0.1"
                      className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs w-full pr-4" 
                      placeholder="X" 
                      value={scale.x.toFixed(1)}
                      disabled={!selectedObject}
                      onChange={(e) => handleScaleChange('x', Number(e.target.value))}
                    />
                    <span className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">X</span>
                  </div>
                  <div className="relative">
                    <input 
                      type="number" 
                      step="0.1"
                      min="0.1"
                      className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs w-full pr-4" 
                      placeholder="Y" 
                      value={scale.y.toFixed(1)}
                      disabled={!selectedObject}
                      onChange={(e) => handleScaleChange('y', Number(e.target.value))}
                    />
                    <span className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">Y</span>
                  </div>
                  <div className="relative">
                    <input 
                      type="number" 
                      step="0.1"
                      min="0.1"
                      className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs w-full pr-4" 
                      placeholder="Z" 
                      value={scale.z.toFixed(1)}
                      disabled={!selectedObject}
                      onChange={(e) => handleScaleChange('z', Number(e.target.value))}
                    />
                    <span className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">Z</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Properties */}
          {/* <div>
            <h4 className="text-sm font-semibold mb-2 text-gray-100">Appearance</h4>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Opacity</label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  defaultValue="100" 
                  className="w-full" 
                  disabled={!selectedObject}
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Visibility</label>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    className="mr-2" 
                    disabled={!selectedObject}
                  />
                  <span className="text-xs">Visible</span>
                </div>
              </div>
            </div>
          </div> */}

        {/* Object Actions */}
        {selectedObject && (
          <div>
            <h4 className="text-sm font-semibold mb-2 text-gray-100">Actions</h4>
            <div className="space-y-2">
              <button 
                className="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                onClick={() => {
                  // Reset transform
                  handlePositionChange('x', 0);
                  handlePositionChange('y', 0.5);
                  handlePositionChange('z', 0);
                  handleRotationChange('x', 0);
                  handleRotationChange('y', 0);
                  handleRotationChange('z', 0);
                  handleScaleChange('x', 1);
                  handleScaleChange('y', 1);
                  handleScaleChange('z', 1);
                }}
              >
                Reset Transform
              </button>
              <button 
                className="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                onClick={() => {
                  // Duplicate object
                  const duplicateEvent = new CustomEvent("duplicateObjectRequested", {
                    detail: { object: selectedObject }
                  });
                  window.dispatchEvent(duplicateEvent);
                }}
              >
                Duplicate Object
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;