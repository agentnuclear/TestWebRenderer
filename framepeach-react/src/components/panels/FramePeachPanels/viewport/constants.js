import * as THREE from 'three';

// UE5-style configuration
export const UE5_CONFIG = {
  exposure: 1.0,
  whitePoint: 1.0,
  shadowBias: -0.00025,
  shadowNormalBias: 0.5,
  shadowRadius: 2.5,
  fogDensity: 0.02,
  fogHeight: 0.0,
  fogHeightFalloff: 0.2,
  fogInscatteringColor: new THREE.Color(0.447, 0.639, 1.0),
  autoExposureEnabled: true,
  exposureCompensation: 1.0,
  minBrightness: 0.03,
  maxBrightness: 2.0
};

// Viewport render modes
export const RENDER_MODES = {
  solid: { id: 'solid', name: 'Lit', wireframe: false },
  wireframe: { id: 'wireframe', name: 'Wireframe', wireframe: true },
  unlit: { id: 'unlit', name: 'Unlit', wireframe: false }
};

// Viewport types
export const VIEWPORT_TYPES = {
  perspective: { id: 'perspective', name: 'Perspective', icon: '◯', fov: 75 },
  top: { id: 'top', name: 'Top', icon: '▢', position: [0, 50, 0], rotation: [-Math.PI / 2, 0, 0] },
  front: { id: 'front', name: 'Front', icon: '▢', position: [0, 0, 50] },
  right: { id: 'right', name: 'Right', icon: '▢', position: [50, 0, 0], rotation: [0, Math.PI / 2, 0] }
};

// Custom slider styles
export const sliderStyles = `
  .slider::-webkit-slider-thumb {
    appearance: none;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: 2px solid #1f2937;
    box-shadow: 0 0 0 1px #374151;
  }

  .slider::-webkit-slider-thumb:hover {
    background: #2563eb;
    box-shadow: 0 0 0 2px #374151, 0 0 8px rgba(59, 130, 246, 0.3);
  }

  .slider::-moz-range-thumb {
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: 2px solid #1f2937;
    box-shadow: 0 0 0 1px #374151;
  }

  .slider::-moz-range-thumb:hover {
    background: #2563eb;
    box-shadow: 0 0 0 2px #374151, 0 0 8px rgba(59, 130, 246, 0.3);
  }

  .slider::-webkit-slider-track {
    height: 4px;
    cursor: pointer;
    border-radius: 2px;
  }

  .slider::-moz-range-track {
    height: 4px;
    cursor: pointer;
    border-radius: 2px;
    background: #4b5563;
  }
`;
