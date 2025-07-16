// Project management utilities
export const saveProject = (projectData) => {
  localStorage.setItem('framepeach-project', JSON.stringify(projectData));
  localStorage.setItem('framepeach-project-autosave', JSON.stringify(projectData));
  
  // Dispatch save event for UI feedback
  const saveEvent = new CustomEvent("projectSaved", {
    detail: { projectName: projectData.projectName, savedAt: projectData.savedAt }
  });
  window.dispatchEvent(saveEvent);
};

export const loadProject = () => {
  try {
    const savedData = localStorage.getItem('framepeach-project');
    if (savedData) {
      return JSON.parse(savedData);
    }
  } catch (error) {
    console.error('Error loading project:', error);
  }
  return null;
};

export const clearProject = () => {
  localStorage.removeItem('framepeach-project');
  localStorage.removeItem('framepeach-project-autosave');
};

// Asset handling utilities
export const createAssetFromFile = (file) => {
  return new Promise((resolve, reject) => {
    // Determine asset type from file
    let assetType = 'models';
    if (file.type.startsWith('image/')) {
      assetType = 'textures';
    } else if (file.type.startsWith('video/')) {
      assetType = 'videos';
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const newAsset = {
        id: Date.now() + Math.random(),
        name: file.name.split('.')[0],
        fileName: file.name,
        type: assetType,
        url: event.target.result,
        size: file.size,
        format: file.name.split('.').pop().toLowerCase(),
        uploadDate: new Date().toISOString(),
        thumbnail: assetType === 'textures' ? event.target.result : null
      };
      resolve(newAsset);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const createObjectFromAsset = (asset) => {
  return {
    id: Date.now() + Math.random(),
    type: asset.type === 'models' ? 'imported_model' : 
          asset.type === 'materials' ? 'cube' : 
          asset.type === 'textures' ? 'plane' : 'cube',
    position: { 
      x: (Math.random() - 0.5) * 10, 
      y: 0.5, 
      z: (Math.random() - 0.5) * 10 
    },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    name: asset.name,
    asset: asset,
    material: asset.type === 'materials' ? asset : null,
    texture: asset.type === 'textures' ? asset : null,
    modelUrl: asset.type === 'models' ? asset.url : null,
    fileName: asset.fileName || asset.name
  };
};

// Layout utilities
export const getViewportConfig = (currentLayout, isMaximized, activeViewport) => {
  const configs = {
    single: [{ type: 'perspective', index: 0 }],
    vertical: [
      { type: 'perspective', index: 0 },
      { type: 'right', index: 1 }
    ],
    horizontal: [
      { type: 'perspective', index: 0 },
      { type: 'front', index: 1 }
    ],
    quad: [
      { type: 'perspective', index: 0 },
      { type: 'top', index: 1 },
      { type: 'front', index: 2 },
      { type: 'right', index: 3 }
    ],
    triple_left: [
      { type: 'perspective', index: 0 },
      { type: 'top', index: 1 },
      { type: 'front', index: 2 }
    ],
    triple_right: [
      { type: 'top', index: 0 },
      { type: 'perspective', index: 1 },
      { type: 'front', index: 2 }
    ],
    triple_top: [
      { type: 'perspective', index: 0 },
      { type: 'front', index: 1 },
      { type: 'right', index: 2 }
    ],
    triple_bottom: [
      { type: 'top', index: 0 },
      { type: 'front', index: 1 },
      { type: 'perspective', index: 2 }
    ]
  };
  
  const viewportConfig = configs[currentLayout] || configs.single;
  return isMaximized ? [viewportConfig[activeViewport]] : viewportConfig;
};

export const getLayoutClass = (currentLayout, isMaximized) => {
  if (isMaximized) return 'grid-cols-1 grid-rows-1';
  
  const classes = {
    single: 'grid-cols-1 grid-rows-1',
    vertical: 'grid-cols-2 grid-rows-1',
    horizontal: 'grid-cols-1 grid-rows-2',
    quad: 'grid-cols-2 grid-rows-2',
    triple_left: 'grid-cols-2 grid-rows-2',
    triple_right: 'grid-cols-2 grid-rows-2',
    triple_top: 'grid-cols-2 grid-rows-2',
    triple_bottom: 'grid-cols-2 grid-rows-2'
  };
  
  return classes[currentLayout] || classes.single;
};

export const getSpanClass = (currentLayout, index) => {
  if (currentLayout === 'triple_left' && index === 0) return 'row-span-2';
  if (currentLayout === 'triple_right' && index === 1) return 'row-span-2';
  if (currentLayout === 'triple_top' && index === 0) return 'col-span-2';
  if (currentLayout === 'triple_bottom' && index === 2) return 'col-span-2';
  return '';
};
