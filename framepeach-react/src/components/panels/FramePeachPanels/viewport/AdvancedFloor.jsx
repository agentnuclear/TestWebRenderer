import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';

// Enhanced Floor Component with UE5-style materials
const AdvancedFloor = ({ renderMode }) => {
  const floorRef = useRef();
  
  // Create UE5-style checker pattern texture
  const floorTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');
    
    const gridSize = 256;
    const lineWidth = 4;
    
    // Base color
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(0, 0, 2048, 2048);
    
    // Checker pattern
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        if ((x + y) % 2 === 0) {
          ctx.fillStyle = '#4a4a4a';
          ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
        }
      }
    }
    
    // Grid lines
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = lineWidth;
    for (let i = 0; i <= 8; i++) {
      ctx.beginPath();
      ctx.moveTo(i * gridSize, 0);
      ctx.lineTo(i * gridSize, 2048);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * gridSize);
      ctx.lineTo(2048, i * gridSize);
      ctx.stroke();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10);
    
    return texture;
  }, []);
  
  const floorMaterial = useMemo(() => {
    if (renderMode === 'wireframe') {
      return (
        <meshBasicMaterial 
          color="#00ffff" 
          wireframe={true}
        />
      );
    }
    
    if (renderMode === 'unlit') {
      return (
        <meshBasicMaterial 
          map={floorTexture}
        />
      );
    }
    
    return (
      // <meshStandardMaterial
      //   map={floorTexture}
      //   roughness={0.8}
      //   metalness={0.0}
      //   envMapIntensity={0.3}
      // />
      <meshStandardMaterial color="#555" />
    );
  }, [floorTexture, renderMode]);
  
  return (
    <mesh
    ref={floorRef}
    rotation={[-Math.PI / 2, 0, 0]}
    position={[0, -0.001, 0]} // slight offset to prevent shadow overlap
    receiveShadow
  >
    <planeGeometry args={[100, 100]} />
    {floorMaterial}
  </mesh>
  );
};

export default AdvancedFloor;
