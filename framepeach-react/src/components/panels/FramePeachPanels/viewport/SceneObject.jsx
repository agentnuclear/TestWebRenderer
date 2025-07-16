import React, { useRef, Suspense, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import GLBModel from './GLBModel';

// Enhanced 3D Object Components with UE5-style materials and real-time updates
const SceneObject = ({ object, isSelected, onSelect, renderMode }) => {
  const meshRef = useRef();
  const materialRef = useRef();
  const [materialProperties, setMaterialProperties] = useState(object.material?.properties || {});
  const [textures, setTextures] = useState({});
  const [isVisible, setIsVisible] = useState(object.visible !== false); // Default to visible
  
  // Listen for material updates
  useEffect(() => {
    const handleMaterialUpdate = (event) => {
      const { objectId, property, value } = event.detail;
      
      // Only update if this is our object
      if (objectId === object.id) {
        console.log('Updating material property:', property, value);
        
        setMaterialProperties(prev => ({
          ...prev,
          [property]: value
        }));
        
        // Handle texture maps
        if (property.endsWith('Map')) {
          setTextures(prev => ({
            ...prev,
            [property]: value
          }));
        }
      }
    };

    window.addEventListener('materialUpdated', handleMaterialUpdate);
    
    return () => {
      window.removeEventListener('materialUpdated', handleMaterialUpdate);
    };
  }, [object.id]);

  // Listen for visibility updates
  useEffect(() => {
    const handleVisibilityUpdate = (event) => {
      const { objectId, visible } = event.detail;
      
      // Only update if this is our object
      if (objectId === object.id) {
        console.log('Updating object visibility:', objectId, visible);
        setIsVisible(visible);
        
        // Update the object's visibility property
        object.visible = visible;
      }
    };

    window.addEventListener('objectVisibilityUpdated', handleVisibilityUpdate);
    
    return () => {
      window.removeEventListener('objectVisibilityUpdated', handleVisibilityUpdate);
    };
  }, [object.id]);

  // Handle immediate texture removal
  useEffect(() => {
    if (materialRef.current) {
      Object.entries(textures).forEach(([key, textureAsset]) => {
        if (textureAsset === null) {
          // Immediately remove texture from material
          const materialProperty = key.replace('Map', '');
          
          if (materialProperty === 'texture') {
            materialRef.current.map = null;
          } else if (materialProperty === 'alpha') {
            materialRef.current.alphaMap = null;
            // Reset transparency if no explicit transparent setting
            if (materialProperties.transparent === undefined) {
              materialRef.current.transparent = false;
            }
          } else if (materialProperty === 'normal') {
            materialRef.current.normalMap = null;
            materialRef.current.normalScale.setScalar(1);
          } else if (materialProperty === 'roughness') {
            materialRef.current.roughnessMap = null;
          } else if (materialProperty === 'metalness') {
            materialRef.current.metalnessMap = null;
          } else if (materialProperty === 'ao') {
            materialRef.current.aoMap = null;
            materialRef.current.aoMapIntensity = 1;
          } else if (materialProperty === 'displacement') {
            materialRef.current.displacementMap = null;
            materialRef.current.displacementScale = 0;
          } else if (materialProperty === 'emission') {
            materialRef.current.emissiveMap = null;
          } else if (materialProperty === 'environment') {
            materialRef.current.envMap = null;
          }
          
          materialRef.current.needsUpdate = true;
        }
      });
    }
  }, [textures, materialProperties.transparent]);

  // Load textures when they change
  useEffect(() => {
    const loadTextures = async () => {
      const loader = new THREE.TextureLoader();
      const loadedTextures = {};
      
      for (const [key, assetData] of Object.entries(textures)) {
        if (assetData && assetData.url) {
          try {
            let texture;
            
            // Handle video textures differently
            if (assetData.type === 'videos' && assetData.url.startsWith('data:video/')) {
              // Create video element for video textures
              const video = document.createElement('video');
              video.src = assetData.url;
              video.crossOrigin = 'anonymous';
              video.loop = true;
              video.muted = true;
              video.playsInline = true;
              
              // Wait for video to load
              await new Promise((resolve, reject) => {
                video.addEventListener('loadeddata', resolve);
                video.addEventListener('error', reject);
                video.load();
              });
              
              // Start playing the video
              await video.play().catch(console.warn);
              
              // Create video texture
              texture = new THREE.VideoTexture(video);
              texture.minFilter = THREE.LinearFilter;
              texture.magFilter = THREE.LinearFilter;
              texture.format = THREE.RGBAFormat;
            } else {
              // Handle regular image textures
              texture = await new Promise((resolve, reject) => {
                loader.load(
                  assetData.url,
                  resolve,
                  undefined,
                  reject
                );
              });
            }
            
            // Configure texture
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.flipY = false;
            
            loadedTextures[key] = texture;
          } catch (error) {
            console.warn(`Failed to load texture ${key}:`, error);
          }
        }
      }
      
      // Apply textures to material if it exists
      if (materialRef.current) {
        // First, clear any existing textures that were removed
        Object.keys(textures).forEach(key => {
          if (textures[key] === null) {
            const materialProperty = key.replace('Map', '');
            if (materialProperty === 'texture') {
              materialRef.current.map = null;
            } else if (materialProperty === 'alpha') {
              materialRef.current.alphaMap = null;
            } else if (materialProperty === 'normal') {
              materialRef.current.normalMap = null;
            } else if (materialProperty === 'roughness') {
              materialRef.current.roughnessMap = null;
            } else if (materialProperty === 'metalness') {
              materialRef.current.metalnessMap = null;
            } else if (materialProperty === 'ao') {
              materialRef.current.aoMap = null;
            } else if (materialProperty === 'displacement') {
              materialRef.current.displacementMap = null;
            } else if (materialProperty === 'emission') {
              materialRef.current.emissiveMap = null;
            } else if (materialProperty === 'environment') {
              materialRef.current.envMap = null;
            }
          }
        });
        
        // Then apply new textures
        Object.entries(loadedTextures).forEach(([key, texture]) => {
          const materialProperty = key.replace('Map', '');
          if (materialProperty === 'texture') {
            materialRef.current.map = texture;
          } else if (materialProperty === 'alpha') {
            materialRef.current.alphaMap = texture;
            materialRef.current.transparent = true;
          } else if (materialProperty === 'normal') {
            materialRef.current.normalMap = texture;
          } else if (materialProperty === 'roughness') {
            materialRef.current.roughnessMap = texture;
          } else if (materialProperty === 'metalness') {
            materialRef.current.metalnessMap = texture;
          } else if (materialProperty === 'ao') {
            materialRef.current.aoMap = texture;
          } else if (materialProperty === 'displacement') {
            materialRef.current.displacementMap = texture;
          } else if (materialProperty === 'emission') {
            materialRef.current.emissiveMap = texture;
          } else if (materialProperty === 'environment') {
            materialRef.current.envMap = texture;
          }
        });
        
        materialRef.current.needsUpdate = true;
      }
    };
    
    if (Object.keys(textures).length > 0) {
      loadTextures();
    }
  }, [textures]);

  // Update material properties in real-time
  useEffect(() => {
    if (materialRef.current) {
      const material = materialRef.current;
      
      // Apply all current material properties
      if (materialProperties.color) {
        material.color.setHex(materialProperties.color.replace('#', '0x'));
      }
      
      if (materialProperties.opacity !== undefined) {
        material.opacity = materialProperties.opacity / 100;
      }
      
      if (materialProperties.transparent !== undefined) {
        material.transparent = materialProperties.transparent;
      }
      
      if (materialProperties.metalness !== undefined) {
        material.metalness = materialProperties.metalness / 100;
      }
      
      if (materialProperties.roughness !== undefined) {
        material.roughness = materialProperties.roughness / 100;
      }
      
      if (materialProperties.emissionColor) {
        material.emissive.setHex(materialProperties.emissionColor.replace('#', '0x'));
      }
      
      if (materialProperties.emissionIntensity !== undefined) {
        material.emissiveIntensity = materialProperties.emissionIntensity / 100;
      }
      
      // Handle legacy 'intensity' property for backward compatibility
      if (materialProperties.intensity !== undefined && materialProperties.emissionIntensity === undefined) {
        material.emissiveIntensity = materialProperties.intensity / 100;
      }
      
      if (materialProperties.side) {
        material.side = getSideConstant(materialProperties.side);
      }
      
      if (materialProperties.flatShading !== undefined) {
        material.flatShading = materialProperties.flatShading;
      }
      
      if (materialProperties.alphaTest !== undefined) {
        material.alphaTest = materialProperties.alphaTest / 100;
      }
      
      // Handle ambient/AO intensity
      if (materialProperties.ambient !== undefined && material.aoMap) {
        material.aoMapIntensity = materialProperties.ambient / 100;
      } else if (materialProperties.ambient !== undefined) {
        // If no AO map, ambient could affect overall brightness
        // You can implement this as needed for your material system
        console.log('Ambient value without AO map:', materialProperties.ambient);
      }
      
      // Handle other intensity values
      if (materialProperties.intensity !== undefined) {
        // This could be emissive intensity or environment intensity
        if (material.emissiveMap) {
          material.emissiveIntensity = materialProperties.intensity / 100;
        } else if (material.envMap) {
          material.envMapIntensity = materialProperties.intensity / 100;
        }
      }
      
      if (materialProperties.environment !== undefined && material.envMap) {
        material.envMapIntensity = materialProperties.environment / 100;
      }
      
      // Handle texture map removals - set to null when removed
      Object.entries(materialProperties).forEach(([key, value]) => {
        if (key.endsWith('Map')) {
          const materialProperty = key.replace('Map', '');
          if (value === null) {
            // Texture was removed - set material property to null
            if (materialProperty === 'texture') {
              material.map = null;
            } else if (materialProperty === 'alpha') {
              material.alphaMap = null;
              // Reset transparency if alpha map is removed and not explicitly set
              if (materialProperties.transparent === undefined) {
                material.transparent = false;
              }
            } else if (materialProperty === 'normal') {
              material.normalMap = null;
              material.normalScale.setScalar(1); // Reset normal scale
            } else if (materialProperty === 'roughness') {
              material.roughnessMap = null;
            } else if (materialProperty === 'metalness') {
              material.metalnessMap = null;
            } else if (materialProperty === 'ao') {
              material.aoMap = null;
              material.aoMapIntensity = 1; // Reset AO intensity
            } else if (materialProperty === 'displacement') {
              material.displacementMap = null;
              material.displacementScale = 0; // Reset displacement scale
            } else if (materialProperty === 'emission') {
              material.emissiveMap = null;
            } else if (materialProperty === 'environment') {
              material.envMap = null;
            }
          }
        }
      });
      
      // Apply texture intensity/strength values
      if (materialProperties.map !== undefined && material.map) {
        // You could implement texture intensity here if needed
      }
      
      if (materialProperties.normal !== undefined && material.normalMap) {
        material.normalScale.setScalar(materialProperties.normal / 100);
      }
      
      if (materialProperties.aoIntensity !== undefined && material.aoMap) {
        material.aoMapIntensity = materialProperties.aoIntensity / 100;
      }
      
      if (materialProperties.displacement !== undefined && material.displacementMap) {
        material.displacementScale = materialProperties.displacement;
      }
      
      material.needsUpdate = true;
    }
  }, [materialProperties]);
  
  useFrame((state) => {
    // Animation logic if needed
  });

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect(object);
  };

  const getGeometry = () => {
    switch (object.type) {
      case 'cube':
        return <boxGeometry args={[1, 1, 1]} />;
      case 'sphere':
        return <sphereGeometry args={[0.5, 32, 32]} />;
      case 'cylinder':
        return <cylinderGeometry args={[0.5, 0.5, 1, 32]} />;
      case 'plane':
        return <planeGeometry args={[1, 1]} />;
      case 'imported_model':
        return <boxGeometry args={[1, 1, 1]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  // Enhanced materials that use real-time materialProperties
  const getMaterial = () => {
    console.log('Rendering material with properties:', materialProperties);

    // Use material properties if they exist, otherwise use defaults
    const opacity = materialProperties.opacity !== undefined ? materialProperties.opacity / 100 : 0.8;
    const transparent = materialProperties.transparent !== undefined ? materialProperties.transparent : false;
    const color = materialProperties.color || getDefaultColor(object.type);
    const metalness = materialProperties.metalness !== undefined ? materialProperties.metalness / 100 : getDefaultMetalness(object.type);
    const roughness = materialProperties.roughness !== undefined ? materialProperties.roughness / 100 : getDefaultRoughness(object.type);
    const side = getSideConstant(materialProperties.side || 'FRONT');
    const flatShading = materialProperties.flatShading || false;
    const alphaTest = materialProperties.alphaTest !== undefined ? materialProperties.alphaTest / 100 : 0;
    
    // Emission properties
    const emissiveColor = materialProperties.emissionColor || '#000000';
    const emissiveIntensity = materialProperties.emissionIntensity !== undefined ? materialProperties.emissionIntensity / 100 : 0;
    
    if (renderMode === 'wireframe') {
      return (
        <meshBasicMaterial 
          ref={materialRef}
          color={isSelected ? '#00ffff' : color}
          wireframe={true}
          transparent={transparent}
          opacity={opacity}
        />
      );
    }
    
    if (renderMode === 'unlit') {
      return (
        <meshBasicMaterial 
          ref={materialRef}
          color={color}
          transparent={transparent}
          opacity={opacity}
          side={side}
          alphaTest={alphaTest}
        />
      );
    }

    // Determine material type based on materialType property
    const materialType = materialProperties.materialType || 'LIT';
    
    if (materialType === 'UNLIT') {
      return (
        <meshBasicMaterial 
          ref={materialRef}
          color={color}
          transparent={transparent}
          opacity={opacity}
          side={side}
          alphaTest={alphaTest}
        />
      );
    }
    
    if (materialType === 'PHONG') {
      return (
        <meshPhongMaterial 
          ref={materialRef}
          color={color}
          transparent={transparent}
          opacity={opacity}
          side={side}
          flatShading={flatShading}
          alphaTest={alphaTest}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      );
    }

    // Enhanced material selection based on object type and high fidelity settings
    const highFidelity = materialProperties.highFidelity || false;
    
    if (highFidelity) {
      // Use MeshPhysicalMaterial for high fidelity features
      return (
        <meshPhysicalMaterial 
          ref={materialRef}
          color={isSelected ? '#ffffff' : color}
          transparent={transparent}
          opacity={opacity}
          roughness={isSelected ? 0.05 : roughness}
          metalness={metalness}
          envMapIntensity={1.5}
          emissive={isSelected ? color : emissiveColor}
          emissiveIntensity={isSelected ? 0.1 : emissiveIntensity}
          side={side}
          flatShading={flatShading}
          alphaTest={alphaTest}
          // High fidelity properties
          clearcoat={materialProperties.clearCoat !== undefined ? materialProperties.clearCoat / 100 : 0}
          clearcoatRoughness={materialProperties.clearCoatRoughness !== undefined ? materialProperties.clearCoatRoughness / 100 : 0}
          transmission={materialProperties.transmission !== undefined ? materialProperties.transmission / 100 : 0}
          ior={materialProperties.refraction || 1.5}
          thickness={1}
          attenuationDistance={materialProperties.attenuationDistance || 0}
          attenuationColor={materialProperties.attenuationColor || '#ffffff'}
          iridescence={materialProperties.iridescence !== undefined ? materialProperties.iridescence / 100 : 0}
          sheen={materialProperties.sheen !== undefined ? materialProperties.sheen / 100 : 0}
          sheenRoughness={materialProperties.sheenRoughness !== undefined ? materialProperties.sheenRoughness / 100 : 0}
          sheenColor={materialProperties.sheenColor || '#ffffff'}
          specularIntensity={materialProperties.specularIntensity !== undefined ? materialProperties.specularIntensity / 100 : 1}
          specularColor={materialProperties.specularColor || '#ffffff'}
        />
      );
    }
    
    // Different material types based on object type and properties
    if (object.type === 'sphere') {
      // Chrome/Metal material
      return (
        <meshStandardMaterial 
          ref={materialRef}
          color={isSelected ? '#ffffff' : color}
          transparent={transparent}
          opacity={opacity}
          roughness={isSelected ? 0.05 : roughness}
          metalness={metalness}
          envMapIntensity={1.5}
          emissive={isSelected ? color : emissiveColor}
          emissiveIntensity={isSelected ? 0.1 : emissiveIntensity}
          side={side}
          flatShading={flatShading}
          alphaTest={alphaTest}
        />
      );
    }
    
    if (object.type === 'cylinder') {
      // Plastic material
      return (
        <meshStandardMaterial 
          ref={materialRef}
          color={color}
          transparent={transparent}
          opacity={opacity}
          roughness={roughness}
          metalness={metalness}
          emissive={isSelected ? color : emissiveColor}
          emissiveIntensity={isSelected ? 0.15 : emissiveIntensity}
          side={side}
          flatShading={flatShading}
          alphaTest={alphaTest}
        />
      );
    }
    
    // Default standard material
    return (
      <meshStandardMaterial 
        ref={materialRef}
        color={color}
        transparent={transparent}
        opacity={opacity}
        roughness={roughness}
        metalness={metalness}
        envMapIntensity={1.0}
        emissive={isSelected ? color : emissiveColor}
        emissiveIntensity={isSelected ? 0.2 : emissiveIntensity}
        side={side}
        flatShading={flatShading}
        alphaTest={alphaTest}
      />
    );
  };

  // Helper functions
  const getDefaultColor = (type) => {
    switch (type) {
      case 'cube': return '#3b82f6';
      case 'sphere': return '#22c55e';
      case 'cylinder': return '#ef4444';
      case 'imported_model': return '#a855f7';
      default: return '#a855f7';
    }
  };

  const getDefaultMetalness = (type) => {
    switch (type) {
      case 'sphere': return 0.9;
      case 'cylinder': return 0.0;
      default: return 0.1;
    }
  };

  const getDefaultRoughness = (type) => {
    switch (type) {
      case 'sphere': return 0.1;
      case 'cylinder': return 0.3;
      default: return 0.4;
    }
  };

  const getSideConstant = (sideString) => {
    switch (sideString) {
      case 'FRONT': return THREE.FrontSide;
      case 'BACK': return THREE.BackSide;
      case 'DOUBLE': return THREE.DoubleSide;
      default: return THREE.FrontSide;
    }
  };

  // For imported models, render the GLB directly
  if (object.type === 'imported_model' && object.modelUrl) {
    return (
      <group
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
        }}
        visible={isVisible} // Apply visibility state to imported models too
      >
        <Suspense fallback={
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#4a90e2" transparent opacity={0.5} />
          </mesh>
        }>
          <GLBModel 
            modelUrl={object.modelUrl}
            isSelected={isSelected}
            renderMode={renderMode}
            materialProperties={materialProperties}
          />
        </Suspense>
      </group>
    );
  }

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
      scale={[1, 1, 1]}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
      castShadow
      receiveShadow
      visible={isVisible} // Apply visibility state
      userData={{ id: object.id }} // Important: Set userData.id for material system
    >
      {getGeometry()}
      {getMaterial()}
    </mesh>
  );
};

export default SceneObject;