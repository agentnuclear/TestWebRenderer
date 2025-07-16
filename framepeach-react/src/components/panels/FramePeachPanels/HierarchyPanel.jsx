import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, ChevronRight, Folder, FileText, Box, Package, 
  Eye, EyeOff, Lock, Unlock, Search, Plus, Circle, Square, Cylinder
} from 'lucide-react';

const HierarchyPanel = () => {
  const [sceneObjects, setSceneObjects] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(['scene', 'objects']);

  // Initial sync with existing project data on mount
  useEffect(() => {
    // Check if there's already saved project data and sync with it
    try {
      const savedData = localStorage.getItem('framepeach-project');
      if (savedData) {
        const projectData = JSON.parse(savedData);
        if (projectData.sceneObjects) {
          setSceneObjects(projectData.sceneObjects);
        }
        // If there's a selected object, set it
        if (projectData.selectedObjectId && projectData.sceneObjects) {
          const selectedObj = projectData.sceneObjects.find(obj => obj.id === projectData.selectedObjectId);
          if (selectedObj) {
            setSelectedObject(selectedObj);
          }
        }
      }
    } catch (error) {
      console.error('Error loading initial project data in HierarchyPanel:', error);
    }
  }, []);

  // Listen for scene updates from ViewportPanel
  useEffect(() => {
    const handleObjectSelected = (e) => {
      setSelectedObject(e.detail);
    };

    const handleSceneUpdate = (e) => {
      setSceneObjects(e.detail);
    };

    const handleProjectLoaded = (e) => {
      // When a project is loaded, sync with the restored data
      try {
        const savedData = localStorage.getItem('framepeach-project');
        if (savedData) {
          const projectData = JSON.parse(savedData);
          if (projectData.sceneObjects) {
            setSceneObjects(projectData.sceneObjects);
          }
        }
      } catch (error) {
        console.error('Error syncing project data in HierarchyPanel:', error);
      }
    };

    const handleNewProject = (e) => {
      // Clear hierarchy when new project is created
      setSceneObjects([]);
      setSelectedObject(null);
    };

    window.addEventListener("objectSelected", handleObjectSelected);
    window.addEventListener("sceneUpdated", handleSceneUpdate);
    window.addEventListener("projectLoaded", handleProjectLoaded);
    window.addEventListener("newProject", handleNewProject);

    return () => {
      window.removeEventListener("objectSelected", handleObjectSelected);
      window.removeEventListener("sceneUpdated", handleSceneUpdate);
      window.removeEventListener("projectLoaded", handleProjectLoaded);
      window.removeEventListener("newProject", handleNewProject);
    };
  }, []);

  // Fallback mechanism to request scene data if not received within 500ms
  useEffect(() => {
    const fallbackTimeout = setTimeout(() => {
      if (sceneObjects.length === 0) {
        // Request current scene state from ViewportPanel
        const requestEvent = new CustomEvent("requestSceneUpdate", {});
        window.dispatchEvent(requestEvent);
      }
    }, 500);

    return () => clearTimeout(fallbackTimeout);
  }, []);

  // Toggle object visibility
  const toggleObjectVisibility = (objectId) => {
    setSceneObjects(prevObjects => {
      const updatedObjects = prevObjects.map(obj => {
        if (obj.id === objectId) {
          const newVisible = obj.visible !== false ? false : true; // Default to true if undefined
          console.log(`Toggling visibility for ${obj.name || obj.type}: ${obj.visible !== false} -> ${newVisible}`);
          
          // Dispatch visibility update event for SceneObject
          const visibilityEvent = new CustomEvent('objectVisibilityUpdated', {
            detail: { objectId, visible: newVisible }
          });
          window.dispatchEvent(visibilityEvent);
          
          return { ...obj, visible: newVisible };
        }
        return obj;
      });
      
      // Update project data in localStorage
      try {
        const savedData = localStorage.getItem('framepeach-project');
        if (savedData) {
          const projectData = JSON.parse(savedData);
          projectData.sceneObjects = updatedObjects;
          localStorage.setItem('framepeach-project', JSON.stringify(projectData));
        }
      } catch (error) {
        console.error('Error saving visibility state:', error);
      }
      
      return updatedObjects;
    });
  };

  // Toggle object lock state
  const toggleObjectLock = (objectId) => {
    setSceneObjects(prevObjects => {
      const updatedObjects = prevObjects.map(obj => {
        if (obj.id === objectId) {
          const newLocked = !obj.locked;
          console.log(`Toggling lock for ${obj.name || obj.type}: ${obj.locked} -> ${newLocked}`);
          
          // Dispatch lock update event if needed
          const lockEvent = new CustomEvent('objectLockUpdated', {
            detail: { objectId, locked: newLocked }
          });
          window.dispatchEvent(lockEvent);
          
          return { ...obj, locked: newLocked };
        }
        return obj;
      });
      
      // Update project data in localStorage
      try {
        const savedData = localStorage.getItem('framepeach-project');
        if (savedData) {
          const projectData = JSON.parse(savedData);
          projectData.sceneObjects = updatedObjects;
          localStorage.setItem('framepeach-project', JSON.stringify(projectData));
        }
      } catch (error) {
        console.error('Error saving lock state:', error);
      }
      
      return updatedObjects;
    });
  };

  // Create hierarchy structure from scene objects
  const createHierarchy = () => {
    const hierarchy = [
      {
        id: 'scene',
        name: 'Scene',
        type: 'project',
        children: [
          {
            id: 'objects',
            name: 'Objects',
            type: 'folder',
            children: sceneObjects.map(obj => ({
              id: obj.id,
              name: obj.name || `${obj.type}_${obj.id}`,
              type: '3d-component',
              objectType: obj.type,
              object: obj,
              visible: obj.visible !== false, // Default to visible
              locked: obj.locked || false
            }))
          },
          {
            id: 'lights',
            name: 'Lights',
            type: 'folder',
            children: [
              {
                id: 'directional-light',
                name: 'Directional Light',
                type: 'light'
              },
              {
                id: 'hemisphere-light',
                name: 'Hemisphere Light',
                type: 'light'
              }
            ]
          },
          {
            id: 'environment',
            name: 'Environment',
            type: 'folder',
            children: [
              {
                id: 'floor',
                name: 'Floor',
                type: 'component'
              },
              {
                id: 'background',
                name: 'Background',
                type: 'component'
              }
            ]
          }
        ]
      }
    ];
    return hierarchy;
  };

  const toggleExpanded = (nodeId) => {
    setExpandedNodes(prev => 
      prev.includes(nodeId) 
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
    );
  };

  const selectObjectFromHierarchy = (node) => {
    if (node.object) {
      // Don't select locked objects
      if (node.locked) {
        console.log('Cannot select locked object:', node.name);
        return;
      }
      
      // Dispatch selection event for ViewportPanel to listen to
      const selectionEvent = new CustomEvent("hierarchyObjectSelected", {
        detail: node.object
      });
      window.dispatchEvent(selectionEvent);
      setSelectedObject(node.object);
    }
  };

  const getNodeIcon = (node) => {
    switch (node.type) {
      case 'project':
        return <Folder size={16} className="mr-2 text-yellow-400" />;
      case 'folder':
        return <Folder size={16} className="mr-2 text-blue-400" />;
      case 'component':
        return <Box size={16} className="mr-2 text-green-400" />;
      case 'light':
        return <div className="mr-2 text-orange-400">💡</div>;
      case '3d-component':
        switch (node.objectType) {
          case 'cube':
            return <Box size={16} className="mr-2 text-cyan-400" />;
          case 'sphere':
            return <Circle size={16} className="mr-2 text-cyan-400" />;
          case 'cylinder':
            return <Cylinder size={16} className="mr-2 text-cyan-400" />;
          case 'plane':
            return <Square size={16} className="mr-2 text-cyan-400" />;
          default:
            return <Box size={16} className="mr-2 text-cyan-400" />;
        }
      default:
        return <FileText size={16} className="mr-2 text-gray-400" />;
    }
  };

  // Hierarchy Node Renderer
  const renderHierarchyNode = (node, depth = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.includes(node.id);
    const isSelected = selectedObject?.id === node.id;
    const isVisible = node.visible !== false; // Default to visible
    const isLocked = node.locked || false;

    return (
      <div key={node.id}>
        <div 
          className={`flex items-center py-1 px-2 rounded cursor-pointer transition-all duration-150 ${
            isSelected ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'
          } ${!isVisible ? 'opacity-50' : ''} ${isLocked ? 'bg-gray-800' : ''}`}
          style={{ 
            paddingLeft: `${depth * 16 + 8}px`
          }}
          onClick={() => {
            if (node.object || node.type === '3d-component') {
              selectObjectFromHierarchy(node);
            }
          }}
        >
          {hasChildren && (
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                toggleExpanded(node.id); 
              }}
              className="mr-1 hover:text-white"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
          {!hasChildren && <div className="w-4 mr-1"></div>}
          
          {getNodeIcon(node)}
          
          <span className={`text-sm flex-1 ${!isVisible ? 'line-through' : ''}`}>
            {node.name}
          </span>
          
          {node.type === '3d-component' && (
            <div className="flex items-center space-x-1">
              <button 
                className={`p-0.5 transition-colors ${
                  isVisible 
                    ? 'text-gray-400 hover:text-white' 
                    : 'text-red-400 hover:text-red-300'
                }`}
                title={isVisible ? "Hide Object" : "Show Object"}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleObjectVisibility(node.object.id);
                }}
              >
                {isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
              </button>
              <button 
                className={`p-0.5 transition-colors ${
                  isLocked 
                    ? 'text-yellow-400 hover:text-yellow-300' 
                    : 'text-gray-400 hover:text-white'
                }`}
                title={isLocked ? "Unlock Object" : "Lock Object"}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleObjectLock(node.object.id);
                }}
              >
                {isLocked ? <Lock size={12} /> : <Unlock size={12} />}
              </button>
            </div>
          )}
        </div>
        
        {hasChildren && isExpanded && node.children.map(child => 
          renderHierarchyNode(child, depth + 1)
        )}
      </div>
    );
  };

  const hierarchy = createHierarchy();
  return (
    <div className="h-full flex flex-col bg-gray-900 text-gray-300">
      <div className="flex items-center justify-between mb-3 p-3 flex-shrink-0">
        <span className="font-semibold text-sm text-gray-100">Scene Hierarchy</span>
        <div className="flex space-x-1">
          <button className="p-1 rounded transition-colors duration-150 text-gray-400 hover:text-gray-100">
            <Search size={14} />
          </button>
          <button 
            className="p-1 rounded transition-colors duration-150 text-gray-400 hover:text-gray-100"
            onClick={() => {
              // Dispatch event to add new object
              const addObjectEvent = new CustomEvent("addObjectRequested", {
                detail: { type: 'cube' }
              });
              window.dispatchEvent(addObjectEvent);
            }}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        <div className="space-y-1">
          {hierarchy.map(node => renderHierarchyNode(node))}
        </div>
        
        {sceneObjects.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <Package size={24} className="mx-auto mb-2" />
            <p className="text-sm">No objects in scene</p>
            <p className="text-xs mt-1">Press 1-4 to add objects</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HierarchyPanel;