# Viewport Panel Module

This directory contains the modularized ViewportPanel component, broken down into smaller, reusable components and utilities.

## Structure

```
viewport/
├── index.js                    # Main exports
├── constants.js                # Configuration constants and styles
├── utils.js                    # Utility functions
├── hooks.js                    # Custom React hooks
├── Viewport.jsx               # Individual viewport component
├── Scene.jsx                  # 3D scene component
├── SceneObject.jsx            # 3D object component
├── GLBModel.jsx               # GLB model loader component
├── AdvancedEnvironment.jsx    # HDR environment component
├── AdvancedLighting.jsx       # Lighting setup component
├── AdvancedFloor.jsx          # Floor component
├── PostProcessingEffects.jsx  # Post-processing effects
└── UIComponents.jsx           # UI overlay components
```

## Components

### Core Components

- **ViewportPanel**: Main container component that orchestrates all viewports
- **Viewport**: Individual viewport with camera controls and render settings
- **Scene**: 3D scene container with lighting, environment, and objects
- **SceneObject**: Individual 3D objects with materials and interactions

### Specialized Components

- **GLBModel**: Handles loading and rendering of GLB/GLTF models
- **AdvancedEnvironment**: HDR environment mapping with fallbacks
- **AdvancedLighting**: UE5-style lighting setup
- **AdvancedFloor**: Procedural floor with checker pattern
- **PostProcessingEffects**: Real-time post-processing effects

### UI Components

- **SelectedObjectInfo**: Shows selected object properties
- **QuickControlsInfo**: Displays keyboard shortcuts and controls
- **DragOverIndicator**: Visual feedback for drag and drop

## Hooks

### useViewportState
Manages all viewport panel state including:
- Scene objects
- Selected object
- Viewport settings
- Project management (save/load/new)

### useDragAndDrop
Handles drag and drop functionality for:
- Asset drops from panels
- File drops from system
- Asset creation and scene integration

## Constants

- **UE5_CONFIG**: Unreal Engine 5 style rendering configuration
- **RENDER_MODES**: Available rendering modes (Lit, Wireframe, Unlit)
- **VIEWPORT_TYPES**: Viewport camera configurations
- **sliderStyles**: CSS styles for custom sliders

## Utilities

- **saveProject/loadProject**: Project persistence
- **createAssetFromFile**: Convert files to assets
- **createObjectFromAsset**: Create 3D objects from assets
- **getViewportConfig**: Layout configuration helpers
- **getLayoutClass/getSpanClass**: CSS grid helpers

## Usage

```jsx
import ViewportPanel from './viewport/ViewportPanel';
// or
import { ViewportPanel, useViewportState } from './viewport';

// Use the main component
<ViewportPanel 
  currentLayout="quad"
  isMaximized={false}
  onLayoutChange={handleLayoutChange}
  onToggleMaximize={handleToggleMaximize}
/>

// Or use individual components
import { Viewport, Scene } from './viewport';
```

## Features

- **Modular Architecture**: Each component has a single responsibility
- **Reusable Hooks**: State management extracted into custom hooks
- **Type Safety**: Consistent interfaces between components
- **Performance**: Optimized rendering and updates
- **Extensible**: Easy to add new features or modify existing ones

## Benefits of Modularization

1. **Maintainability**: Smaller, focused components are easier to understand and modify
2. **Reusability**: Components can be reused in different contexts
3. **Testing**: Individual components can be tested in isolation
4. **Performance**: Better tree shaking and code splitting opportunities
5. **Collaboration**: Multiple developers can work on different components simultaneously
6. **Type Safety**: Better TypeScript support and IntelliSense
7. **Debugging**: Easier to isolate and fix issues in specific components
