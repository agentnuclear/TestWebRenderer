import React from 'react';
import * as THREE from 'three';
import { UE5_CONFIG } from './constants';

// Enhanced Lighting Setup
const AdvancedLighting = ({ renderMode }) => {
  if (renderMode === 'wireframe' || renderMode === 'unlit') {
    return (
      <ambientLight intensity={0.8} />
    );
  }
  
  return (
    <>
      {/* Sky Light - indirect lighting */}
      <hemisphereLight 
        skyColor={new THREE.Color(0.5, 0.7, 1.0)}
        groundColor={new THREE.Color(0.4, 0.3, 0.2)}
        intensity={0.3}
      />
      
      {/* Sun - Directional Light */}
      <directionalLight
        position={[70, 50, 20]}
        intensity={3.0}
        color="#fff4e6"
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-camera-near={0.1}
        shadow-camera-far={200}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-bias={UE5_CONFIG.shadowBias}
        shadow-normalBias={UE5_CONFIG.shadowNormalBias}
        shadow-radius={UE5_CONFIG.shadowRadius}
      />
      
      {/* Fill lights */}
      <pointLight position={[-10, 10, 10]} intensity={0.5} color="#ffd4a3" />
      <pointLight position={[10, -5, -10]} intensity={0.3} color="#a3c9ff" />
    </>
  );
};

export default AdvancedLighting;
