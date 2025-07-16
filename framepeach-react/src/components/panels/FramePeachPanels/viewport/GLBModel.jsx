import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// GLB Model Component with error handling
const GLBModel = ({ modelUrl, isSelected, renderMode, ...props }) => {
  const [model, setModel] = useState(null);
  const [error, setError] = useState(false);
  const modelRef = useRef();

  // Helper function to convert data URL to blob URL
  const dataURLToBlob = (dataURL) => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  // Load GLB model with proper error handling
  useEffect(() => {
    if (!modelUrl) return;

    // Handle null or error URLs
    if (modelUrl === null || !modelUrl) {
      setError(true);
      setModel(null);
      return;
    }

    const loader = new GLTFLoader();
    
    // Convert data URL to blob URL if necessary
    let urlToLoad = modelUrl;
    if (modelUrl.startsWith('data:')) {
      try {
        const blob = dataURLToBlob(modelUrl);
        urlToLoad = URL.createObjectURL(blob);
      } catch (err) {
        console.warn('Failed to convert data URL to blob:', err);
        setError(true);
        return;
      }
    }
    
    loader.load(
      urlToLoad,
      (gltf) => {
        setModel(gltf.scene.clone());
        setError(false);
        
        // Clean up blob URL if we created one
        if (urlToLoad !== modelUrl) {
          URL.revokeObjectURL(urlToLoad);
        }
      },
      undefined,
      (error) => {
        console.warn('Failed to load GLB model:', error);
        setError(true);
        setModel(null);
        
        // Clean up blob URL if we created one
        if (urlToLoad !== modelUrl) {
          URL.revokeObjectURL(urlToLoad);
        }
      }
    );
  }, [modelUrl]);

  useEffect(() => {
    if (modelRef.current && model) {
      // Apply selection styling
      modelRef.current.traverse((child) => {
        if (child.isMesh) {
          const originalMaterial = child.material;
          
          if (renderMode === 'wireframe') {
            child.material = new THREE.MeshBasicMaterial({
              color: isSelected ? '#00ffff' : '#ffffff',
              wireframe: true
            });
          } else if (renderMode === 'unlit') {
            child.material = new THREE.MeshBasicMaterial({
              color: isSelected ? '#ffff00' : originalMaterial.color || '#ffffff',
              map: originalMaterial.map || null
            });
          } else {
            // Keep original material but add selection glow
            if (isSelected) {
              child.material = originalMaterial.clone();
              child.material.emissive = new THREE.Color('#0066ff');
              child.material.emissiveIntensity = 0.3;
            }
          }
          
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [isSelected, renderMode, model]);

  // Render fallback if model failed to load
  if (error || !model) {
    return (
      <mesh {...props}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color={error ? '#ff6b6b' : '#666666'} 
          transparent 
          opacity={0.5} 
        />
      </mesh>
    );
  }

  return (
    <primitive 
      ref={modelRef} 
      object={model} 
      {...props}
    />
  );
};

export default GLBModel;
