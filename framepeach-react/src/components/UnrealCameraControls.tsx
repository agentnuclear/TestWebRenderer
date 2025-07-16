// UnrealCameraControls.tsx
import { useEffect, useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface UnrealCameraControlsProps {
    enabled?: boolean;
    moveSpeed?: number;
    lookSpeed?: number;
    panSpeed?: number;
    zoomSpeed?: number;
    selectedObject?: any; // Add selectedObject prop
}

export const UnrealCameraControls: React.FC<UnrealCameraControlsProps> = ({
    enabled = true,
    moveSpeed = 0.001,
    lookSpeed = 0.002,
    panSpeed = 0.001,
    zoomSpeed = 0.001,
    selectedObject = null // Default to null
}) => {
    const { camera, gl } = useThree();
    const domElement = gl.domElement;
    
    // Camera rotation state
    const yaw = useRef(0);
    const pitch = useRef(0);
    
    // Input state
    const keys = useRef<{ [key: string]: boolean }>({});
    const mouseButtons = useRef({ LEFT: false, MIDDLE: false, RIGHT: false });
    const mousePosition = useRef(new THREE.Vector2());
    const mouseDelta = useRef(new THREE.Vector2());
    
    // Movement velocity for WASD
    const velocity = useRef(new THREE.Vector3());
    const dampingFactor = 0.85;
    
    // Dynamic mouse speed state
    const currentLookSpeed = useRef(lookSpeed);
    
    // Smooth transition state for F key
    const isTransitioning = useRef(false);
    const transitionStart = useRef(new THREE.Vector3());
    const transitionTarget = useRef(new THREE.Vector3());
    const transitionProgress = useRef(0);
    const transitionDuration = 1.0;
    
    // Initialize rotation from camera
    const updateRotationFromCamera = () => {
        const euler = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ');
        yaw.current = euler.y;
        pitch.current = euler.x;
    };
    
    // Mouse event handlers
    const onMouseDown = (event: MouseEvent) => {
        if (!enabled) return;
        event.preventDefault();
        
        if (event.button === 0) mouseButtons.current.LEFT = true;
        if (event.button === 1) mouseButtons.current.MIDDLE = true;
        if (event.button === 2) mouseButtons.current.RIGHT = true;
        
        mousePosition.current.set(event.clientX, event.clientY);
        mouseDelta.current.set(0, 0);
    };
    
    const onMouseMove = (event: MouseEvent) => {
        if (!enabled || isTransitioning.current) return;
        
        const newPosition = new THREE.Vector2(event.clientX, event.clientY);
        mouseDelta.current.subVectors(newPosition, mousePosition.current);
        mousePosition.current.copy(newPosition);
        
        if (mouseButtons.current.MIDDLE) {
            // MMB: Pan left/right/up/down
            handlePan();
        } else if (mouseButtons.current.RIGHT) {
            // RMB: Look around
            handleLook();
        }
    };
    
    const onMouseUp = (event: MouseEvent) => {
        if (!enabled) return;
        
        if (event.button === 0) mouseButtons.current.LEFT = false;
        if (event.button === 1) mouseButtons.current.MIDDLE = false;
        if (event.button === 2) mouseButtons.current.RIGHT = false;
    };
    
    const onWheel = (event: WheelEvent) => {
        if (!enabled || isTransitioning.current) return;
        event.preventDefault();
        
        // Right-click + scroll: Adjust mouse look speed
        if (mouseButtons.current.RIGHT) {
            const speedMultiplier = event.deltaY > 0 ? 0.9 : 1.1;
            currentLookSpeed.current *= speedMultiplier;
            currentLookSpeed.current = Math.max(0.0001, Math.min(0.01, currentLookSpeed.current));
            return;
        }
        
        // Scroll wheel: Move forward/backward
        const direction = new THREE.Vector3(0, 0, 1);
        direction.applyQuaternion(camera.quaternion);
        
        const zoomAmount = event.deltaY > 0 ? 2 : -2;
        const moveDistance = zoomAmount * zoomSpeed * 10;
        
        camera.position.add(direction.multiplyScalar(moveDistance));
    };
    
    // Also listen for object selection events as fallback
    useEffect(() => {
        const handleObjectSelection = (e) => {
            // console.log("Camera controls received objectSelected event:", e.detail);
            // Store the selected object from the event
            selectedObjectRef.current = e.detail;
        };

        window.addEventListener('objectSelected', handleObjectSelection);
        
        return () => {
            window.removeEventListener('objectSelected', handleObjectSelection);
        };
    }, []);

    // Use a ref to store selected object for immediate access
    const selectedObjectRef = useRef(selectedObject);
    
    // Update ref when prop changes
    useEffect(() => {
        selectedObjectRef.current = selectedObject;
        // console.log("Camera controls selectedObject updated:", selectedObject);
    }, [selectedObject]);

    const onKeyDown = (event: KeyboardEvent) => {
        if (!enabled) return;
        keys.current[event.code] = true;
        
        if (event.code === 'KeyF') {
            // Check both prop and ref for selected object
            const currentSelectedObject = selectedObject || selectedObjectRef.current;
            
            if (currentSelectedObject && currentSelectedObject.position) {
                console.log("F pressed - focusing on selected object:", currentSelectedObject.position);
                focusOnSelectedObject(currentSelectedObject);
            } else {
                console.log("F pressed - no object selected, ignoring");
                // console.log("selectedObject prop:", selectedObject);
                // console.log("selectedObject ref:", selectedObjectRef.current);
            }
        }
    };
    
    const onKeyUp = (event: KeyboardEvent) => {
        if (!enabled) return;
        keys.current[event.code] = false;
    };
    
    const onContextMenu = (event: Event) => {
        event.preventDefault();
    };
    
    // Movement handlers
    const handlePan = () => {
        const right = new THREE.Vector3(1, 0, 0);
        const up = new THREE.Vector3(0, 1, 0);
        
        right.applyQuaternion(camera.quaternion);
        up.applyQuaternion(camera.quaternion);
        
        const distance = camera.position.length();
        const panScale = Math.max(distance * 0.001, 0.01) * panSpeed;
        
        const panVector = new THREE.Vector3();
        panVector.add(right.multiplyScalar(-mouseDelta.current.x * panScale));
        panVector.add(up.multiplyScalar(mouseDelta.current.y * panScale));
        
        camera.position.add(panVector);
    };
    
    const handleLook = () => {
        yaw.current -= mouseDelta.current.x * currentLookSpeed.current;
        pitch.current -= mouseDelta.current.y * currentLookSpeed.current;
        
        pitch.current = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch.current));
        
        updateCameraRotation();
    };
    
    const handleWASDMovement = () => {
        if (!mouseButtons.current.RIGHT || isTransitioning.current) return;
        
        const direction = new THREE.Vector3();
        const forward = new THREE.Vector3();
        const right = new THREE.Vector3();
        const up = new THREE.Vector3(0, 1, 0);
        
        camera.getWorldDirection(forward);
        right.crossVectors(forward, up).normalize();
        
        let speed = moveSpeed * 0.1;
        if (keys.current['ShiftLeft'] || keys.current['ShiftRight']) speed *= 3;
        if (keys.current['ControlLeft'] || keys.current['ControlRight']) speed *= 0.3;
        
        if (keys.current['KeyW']) direction.add(forward.clone().multiplyScalar(speed));
        if (keys.current['KeyS']) direction.add(forward.clone().multiplyScalar(-speed));
        if (keys.current['KeyA']) direction.add(right.clone().multiplyScalar(-speed));
        if (keys.current['KeyD']) direction.add(right.clone().multiplyScalar(speed));
        if (keys.current['KeyQ']) direction.add(up.clone().multiplyScalar(-speed));
        if (keys.current['KeyE']) direction.add(up.clone().multiplyScalar(speed));
        
        velocity.current.add(direction);
        velocity.current.multiplyScalar(dampingFactor);
        
        camera.position.add(velocity.current);
    };
    
    const updateCameraRotation = () => {
        const euler = new THREE.Euler(pitch.current, yaw.current, 0, 'YXZ');
        camera.quaternion.setFromEuler(euler);
    };
    
    // Focus on selected object only
    const focusOnSelectedObject = (objectToFocus = null) => {
        const targetObject = objectToFocus || selectedObject || selectedObjectRef.current;
        
        if (!targetObject || !targetObject.position) {
            console.log("No object selected or object has no position");
            console.log("Target object:", targetObject);
            return;
        }

        const { x, y, z } = targetObject.position;
        console.log(`Focusing camera on selected object at: (${x}, ${y}, ${z})`);
        
        isTransitioning.current = true;
        transitionProgress.current = 0;
        
        transitionStart.current.copy(camera.position);
        
        // Calculate ideal viewing position relative to target
        const idealDistance = 5;
        const idealPitch = -Math.PI / 6; // 30 degrees down
        const idealYaw = Math.PI / 4;    // 45 degrees around
        
        // Calculate offset from target position
        const offsetX = idealDistance * Math.sin(idealPitch + Math.PI / 2) * Math.cos(idealYaw);
        const offsetY = idealDistance * Math.cos(idealPitch + Math.PI / 2);
        const offsetZ = idealDistance * Math.sin(idealPitch + Math.PI / 2) * Math.sin(idealYaw);
        
        // Set target camera position (target position + offset)
        transitionTarget.current.set(
            x + offsetX,
            y + offsetY,
            z + offsetZ
        );
        
        // Store the target position for lookAt during transition
        (transitionTarget.current as any).lookAt = new THREE.Vector3(x, y, z);
        
        yaw.current = idealYaw;
        pitch.current = idealPitch;
        
        console.log("Camera will move to:", transitionTarget.current);
        console.log("Camera will look at:", x, y, z);
    };
    
    // Handle smooth transition
    const handleTransition = (deltaTime: number) => {
        if (!isTransitioning.current) return;
        
        transitionProgress.current += deltaTime / transitionDuration;
        
        if (transitionProgress.current >= 1.0) {
            transitionProgress.current = 1.0;
            isTransitioning.current = false;
            
            camera.position.copy(transitionTarget.current);
            
            // Look at the target position (object or origin)
            const lookAtTarget = (transitionTarget.current as any).lookAt || new THREE.Vector3(0, 0, 0);
            camera.lookAt(lookAtTarget);
            updateRotationFromCamera();
            
            console.log("Transition complete. Camera at:", camera.position);
            console.log("Looking at:", lookAtTarget);
        } else {
            const t = transitionProgress.current;
            const eased = 1 - Math.pow(1 - t, 3);
            
            camera.position.lerpVectors(transitionStart.current, transitionTarget.current, eased);
            
            // Look at the target position during transition
            const lookAtTarget = (transitionTarget.current as any).lookAt || new THREE.Vector3(0, 0, 0);
            camera.lookAt(lookAtTarget);
        }
    };
    
    // Setup event listeners
    useEffect(() => {
        if (!enabled) return;
        
        updateRotationFromCamera();
        currentLookSpeed.current = lookSpeed;
        
        domElement.addEventListener('contextmenu', onContextMenu);
        domElement.addEventListener('mousedown', onMouseDown);
        domElement.addEventListener('mousemove', onMouseMove);
        domElement.addEventListener('mouseup', onMouseUp);
        domElement.addEventListener('wheel', onWheel, { passive: false });
        
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
        
        return () => {
            domElement.removeEventListener('contextmenu', onContextMenu);
            domElement.removeEventListener('mousedown', onMouseDown);
            domElement.removeEventListener('mousemove', onMouseMove);
            domElement.removeEventListener('mouseup', onMouseUp);
            domElement.removeEventListener('wheel', onWheel);
            
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
        };
    }, [enabled, domElement, moveSpeed, lookSpeed, panSpeed, zoomSpeed]);
    
    // Animation frame update
    useFrame((state, deltaTime) => {
        if (!enabled) return;
        
        handleTransition(deltaTime);
        
        if (isTransitioning.current) return;
        
        handleWASDMovement();
    });
    
    return null;
};

export default UnrealCameraControls;