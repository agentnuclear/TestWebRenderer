import React, { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

// Advanced HDR Environment Component
const AdvancedEnvironment = ({ renderMode }) => {
  const { scene, gl } = useThree();
  const [hdrTexture, setHdrTexture] = useState(null);
  const [hdrError, setHdrError] = useState(false);
  
  // Load HDR environment with proper error handling
  useEffect(() => {
    if (renderMode === 'wireframe') return;
    
    const loader = new RGBELoader();
    
    // Try to load the HDR texture
    loader.load(
      '/textures/kloppenheim_06_puresky_4k.hdr',
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        setHdrTexture(texture);
        setHdrError(false);
      },
      undefined,
      (error) => {
        console.warn('Failed to load HDR texture, using fallback environment:', error);
        setHdrError(true);
        setHdrTexture(null);
      }
    );
  }, [renderMode]);
  
  useEffect(() => {
    if (hdrTexture && renderMode !== 'wireframe') {
      scene.environment = hdrTexture;
      scene.background = hdrTexture;
      scene.backgroundIntensity = 1.0;
      scene.environmentIntensity = 1.0;
    } else {
      // Fallback to gradient background
      const bgTexture = new THREE.Color(renderMode === 'wireframe' ? 0x000000 : 0x111827);
      scene.background = bgTexture;
      scene.environment = null;
    }
  }, [hdrTexture, scene, renderMode]);
  
  // Fallback Sky component if HDR fails
  if (hdrError && renderMode !== 'wireframe') {
    return (
      <Sky
        distance={450000}
        sunPosition={[0, 1, 0]}
        inclination={0}
        azimuth={0.25}
      />
    );
  }
  
  return null;
};

export default AdvancedEnvironment;
