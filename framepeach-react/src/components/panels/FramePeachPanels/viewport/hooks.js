import { useState, useEffect, useCallback } from 'react';
import { 
  saveProject, 
  loadProject, 
  clearProject, 
  createAssetFromFile, 
  createObjectFromAsset 
} from './utils';

// Custom hook for viewport panel state management
export const useViewportState = () => {
  const [showGrid, setShowGrid] = useState(true);
  const [selectedTool, setSelectedTool] = useState('select');
  const [sceneObjects, setSceneObjects] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [activeViewport, setActiveViewport] = useState(0);
  const [viewportRenderModes, setViewportRenderModes] = useState({
    0: 'solid',
    1: 'solid',
    2: 'solid',
    3: 'solid'
  });
  const [mouseSpeed, setMouseSpeed] = useState(0.002);
  const [projectName, setProjectName] = useState('Untitled Project');
  const [isDragOver, setIsDragOver] = useState(false);

  // Save project function
  const handleSaveProject = useCallback(() => {
    const projectData = {
      projectName,
      sceneObjects,
      selectedObjectId: selectedObject?.id || null,
      showGrid,
      showStats,
      activeViewport,
      viewportRenderModes,
      mouseSpeed,
      savedAt: new Date().toISOString()
    };
    
    saveProject(projectData);
  }, [projectName, sceneObjects, selectedObject, showGrid, showStats, activeViewport, viewportRenderModes, mouseSpeed]);

  // Load project function
  const handleLoadProject = useCallback(() => {
    const projectData = loadProject();
    if (projectData) {
      setProjectName(projectData.projectName || 'Untitled Project');
      setSceneObjects(projectData.sceneObjects || []);
      setShowGrid(projectData.showGrid !== undefined ? projectData.showGrid : true);
      setShowStats(projectData.showStats || false);
      setActiveViewport(projectData.activeViewport || 0);
      setViewportRenderModes(projectData.viewportRenderModes || {
        0: 'solid', 1: 'solid', 2: 'solid', 3: 'solid'
      });
      setMouseSpeed(projectData.mouseSpeed || 0.002);
      
      // Dispatch scene update for HierarchyPanel
      setTimeout(() => {
        const sceneUpdateEvent = new CustomEvent("sceneUpdated", {
          detail: projectData.sceneObjects || []
        });
        window.dispatchEvent(sceneUpdateEvent);
      }, 100);
      
      // Restore selected object
      if (projectData.selectedObjectId && projectData.sceneObjects) {
        const selectedObj = projectData.sceneObjects.find(obj => obj.id === projectData.selectedObjectId);
        if (selectedObj) {
          setSelectedObject(selectedObj);
          setTimeout(() => {
            const selectionEvent = new CustomEvent("objectSelected", {
              detail: selectedObj
            });
            window.dispatchEvent(selectionEvent);
          }, 100);
        }
      }
      
      return true;
    }
    return false;
  }, []);

  // New project function
  const handleNewProject = useCallback(() => {
    setProjectName('Untitled Project');
    setSceneObjects([]);
    setSelectedObject(null);
    setShowGrid(true);
    setShowStats(false);
    setActiveViewport(0);
    setViewportRenderModes({ 0: 'solid', 1: 'solid', 2: 'solid', 3: 'solid' });
    setMouseSpeed(0.002);
    
    clearProject();
    
    // Dispatch events to sync all panels
    const sceneUpdateEvent = new CustomEvent("sceneUpdated", { detail: [] });
    window.dispatchEvent(sceneUpdateEvent);
    
    const selectionEvent = new CustomEvent("objectSelected", { detail: null });
    window.dispatchEvent(selectionEvent);
    
    const newProjectEvent = new CustomEvent("newProject", {
      detail: { projectName: 'Untitled Project' }
    });
    window.dispatchEvent(newProjectEvent);
  }, []);

  return {
    // State
    showGrid,
    selectedTool,
    sceneObjects,
    selectedObject,
    showStats,
    activeViewport,
    viewportRenderModes,
    mouseSpeed,
    projectName,
    isDragOver,
    
    // State setters
    setShowGrid,
    setSelectedTool,
    setSceneObjects,
    setSelectedObject,
    setShowStats,
    setActiveViewport,
    setViewportRenderModes,
    setMouseSpeed,
    setProjectName,
    setIsDragOver,
    
    // Project functions
    saveProject: handleSaveProject,
    loadProject: handleLoadProject,
    newProject: handleNewProject
  };
};

// Custom hook for drag and drop functionality
export const useDragAndDrop = (sceneObjects, setSceneObjects, setSelectedObject) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    // Check if this is an asset drop from AssetsPanel
    try {
      const assetData = e.dataTransfer.getData('application/framepeach-asset');
      if (assetData) {
        const asset = JSON.parse(assetData);
        const newObject = createObjectFromAsset(asset);

        setSceneObjects(prev => {
          const newSceneObjects = [...prev, newObject];
          const sceneUpdateEvent = new CustomEvent("sceneUpdated", {
            detail: newSceneObjects
          });
          window.dispatchEvent(sceneUpdateEvent);
          return newSceneObjects;
        });
        
        setSelectedObject(newObject);
        
        const selectionEvent = new CustomEvent("objectSelected", {
          detail: newObject
        });
        window.dispatchEvent(selectionEvent);
        
        return;
      }
    } catch (error) {
      // Not an asset drop, continue with file drop handling
    }
    
    // Handle file drops from outside the app
    if (e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      
      for (const file of files) {
        try {
          const newAsset = await createAssetFromFile(file);
          const newObject = createObjectFromAsset(newAsset);

          setSceneObjects(prev => [...prev, newObject]);
          setSelectedObject(newObject);

          // Save asset to local storage
          const savedAssets = localStorage.getItem('framepeach-user-assets');
          let userAssets = { models: [], textures: [], videos: [], materials: [], particles: [] };
          
          if (savedAssets) {
            try {
              userAssets = JSON.parse(savedAssets);
            } catch (error) {
              console.warn('Failed to parse saved assets');
            }
          }

          userAssets[newAsset.type].push(newAsset);
          localStorage.setItem('framepeach-user-assets', JSON.stringify(userAssets));

          // Dispatch events
          const selectionEvent = new CustomEvent("objectSelected", {
            detail: newObject
          });
          window.dispatchEvent(selectionEvent);

          const assetAddedEvent = new CustomEvent("assetAdded", {
            detail: { asset: newAsset, object: newObject }
          });
          window.dispatchEvent(assetAddedEvent);
        } catch (error) {
          console.error('Failed to process file:', error);
        }
      }
    }
  }, [setSceneObjects, setSelectedObject]);

  return {
    isDragOver,
    dragProps: {
      onDragEnter: handleDragEnter,
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop
    }
  };
};
