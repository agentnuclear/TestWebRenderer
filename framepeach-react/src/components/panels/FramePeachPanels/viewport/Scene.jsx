import React, { Suspense, useEffect, useRef, useState, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Grid, TransformControls, OrbitControls } from '@react-three/drei';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import AdvancedEnvironment from './AdvancedEnvironment';
import PostProcessingEffects from './PostProcessingEffects';
import AdvancedLighting from './AdvancedLighting';
import AdvancedFloor from './AdvancedFloor';
import SceneObject from './SceneObject';
import { UE5_CONFIG } from './constants';

// Component to wrap SceneObject with proper transform and naming
const SceneObjectWithTransform = ({ object, isSelected, onSelect, renderMode }) => {
  const groupRef = useRef();
  
  // Update the group transform when object changes
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(
        object.position.x,
        object.position.y,
        object.position.z
      );
      groupRef.current.rotation.set(
        object.rotation.x,
        object.rotation.y,
        object.rotation.z
      );
      groupRef.current.scale.set(
        object.scale.x,
        object.scale.y,
        object.scale.z
      );
    }
  }, [object.position, object.rotation, object.scale]);
  
  return (
    <group 
      ref={groupRef}
      name={`object-${object.id}`}
      userData={{ objectId: object.id }}
      position={[object.position.x, object.position.y, object.position.z]}
      rotation={[object.rotation.x, object.rotation.y, object.rotation.z]}
      scale={[object.scale.x, object.scale.y, object.scale.z]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(object.id);
      }}
    >
      <SceneObject
        object={object}
        isSelected={isSelected}
        onSelect={onSelect}
        renderMode={renderMode}
      />
    </group>
  );
};

// Custom hook for managing transform controls
const useTransformControls = (selectedObject, onObjectUpdate) => {
  const [mode, setMode] = useState('translate');
  const [space, setSpace] = useState('world');
  const [enabled, setEnabled] = useState(true);
  const transformRef = useRef();
  
  const handleChange = useCallback(() => {
    if (transformRef.current && selectedObject) {
      const object = transformRef.current.object;
      if (object) {
        const updatedObject = {
          ...selectedObject,
          position: { 
            x: object.position.x, 
            y: object.position.y, 
            z: object.position.z 
          },
          rotation: { 
            x: object.rotation.x, 
            y: object.rotation.y, 
            z: object.rotation.z 
          },
          scale: { 
            x: object.scale.x, 
            y: object.scale.y, 
            z: object.scale.z 
          }
        };
        
        onObjectUpdate(updatedObject);
      }
    }
  }, [selectedObject, onObjectUpdate]);

  return {
    mode,
    setMode,
    space,
    setSpace,
    enabled,
    setEnabled,
    transformRef,
    handleChange
  };
};

// Enhanced Scene Component with @react-three/drei TransformControls
const Scene = ({ 
  sceneObjects, 
  selectedObject, 
  onSelectObject, 
  showGrid, 
  renderMode, 
  selectedTool = 'move'
}) => {
  const { scene, camera, gl } = useThree();
  const orbitControlsRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  
  // Scene setup effect
  useEffect(() => {
    // Configure scene properties
    scene.fog = renderMode !== 'wireframe' ? 
      new THREE.FogExp2(UE5_CONFIG.fogInscatteringColor, UE5_CONFIG.fogDensity * 0.005) : null;
  }, [scene, renderMode]);

  // Handle gizmo object updates
  const handleObjectUpdate = useCallback((updatedObject) => {
    const gizmoEvent = new CustomEvent("gizmoTransform", {
      detail: updatedObject
    });
    window.dispatchEvent(gizmoEvent);
  }, []);

  // Transform controls hook
  const {
    mode,
    setMode,
    space,
    setSpace,
    enabled,
    setEnabled,
    transformRef,
    handleChange
  } = useTransformControls(selectedObject, handleObjectUpdate);

  // Update transform mode when selectedTool changes
  useEffect(() => {
    switch(selectedTool) {
      case 'move':
        setMode('translate');
        break;
      case 'rotate':
        setMode('rotate');
        break;
      case 'scale':
        setMode('scale');
        break;
      default:
        setMode('translate');
    }
  }, [selectedTool, setMode]);

  // Handle dragging state changes
  const handleDraggingChanged = useCallback((dragging) => {
    setIsDragging(dragging);
    
    // Enable/disable orbit controls based on dragging state
    if (orbitControlsRef.current) {
      orbitControlsRef.current.enabled = !dragging;
    }
  }, []);

  return (
    <Suspense fallback={null}>
      {/* HDR Environment */}
      <AdvancedEnvironment renderMode={renderMode} />
      
      {/* Post Processing Effects */}
      <PostProcessingEffects renderMode={renderMode} />
      
      {/* Advanced Lighting */}
      <AdvancedLighting renderMode={renderMode} />
      
      {/* Enhanced Floor */}
      <AdvancedFloor renderMode={renderMode} />

      {/* Contact Shadows */}
      <ContactShadows
        position={[0, 0.01, 0]}
        scale={100}
       opacity={0.4}
       blur={1.5}
       far={50}
       //color="#000000"
       //frames={1}

      />
      
      {/* Grid Helper */}
      {showGrid && (
        <Grid 
          args={[50, 50]} 
          cellColor={renderMode === 'wireframe' ? '#00ffff' : '#374151'} 
          sectionColor={renderMode === 'wireframe' ? '#00ffff' : '#4b5563'} 
          infiniteGrid 
          fadeDistance={100} 
          fadeStrength={1} 
        />
      )}
      
      {/* 3D Objects with userData for identification */}
      {sceneObjects.map((obj) => (
        <SceneObjectWithTransform
          key={obj.id}
          object={obj}
          isSelected={selectedObject?.id === obj.id}
          onSelect={onSelectObject}
          renderMode={renderMode}
        />
      ))}
      
      {/* @react-three/drei TransformControls - Clean version */}
      {selectedObject && (
        <TransformControls
          ref={transformRef}
          object={scene.getObjectByName(`object-${selectedObject.id}`)}
          mode={mode}
          size={1.0}
          showX={true}
          showY={true}
          showZ={true}
          space="world"
          enabled={enabled}
          onObjectChange={handleChange}
          onDraggingChanged={handleDraggingChanged}
        />
      )}
      
      {/* Orbit Controls
      <OrbitControls
        ref={orbitControlsRef}
        enabled={!isDragging}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        dampingFactor={0.05}
        screenSpacePanning={false}
        minDistance={1}
        maxDistance={1000}
        maxPolarAngle={Math.PI}
      /> */}
      
      {/* Background plane for deselection */}
      <mesh 
        position={[0, 0, -50]} 
        rotation={[0, 0, 0]} 
        scale={[1000, 1000, 1]} 
        onClick={(e) => {
          e.stopPropagation();
          onSelectObject(null);
        }}
        visible={false}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </Suspense>
  );
};

export default Scene;