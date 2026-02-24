'use client';

import { useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';

export function CameraController() {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  const isFlipped = useGameStore((state) => state.isFlipped);
  
  // Smooth camera transition when board is flipped
  useFrame(() => {
    if (!controlsRef.current) return;
    
    // Target rotation based on flip state
    const targetAzimuthalAngle = isFlipped ? Math.PI : 0;
    
    // Smoothly interpolate
    const currentAngle = controlsRef.current.getAzimuthalAngle();
    const diff = targetAzimuthalAngle - currentAngle;
    
    // Normalize angle difference
    let normalizedDiff = diff;
    while (normalizedDiff > Math.PI) normalizedDiff -= Math.PI * 2;
    while (normalizedDiff < -Math.PI) normalizedDiff += Math.PI * 2;
    
    if (Math.abs(normalizedDiff) > 0.01) {
      controlsRef.current.setAzimuthalAngle(currentAngle + normalizedDiff * 0.05);
    }
  });
  
  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom={true}
      minDistance={5}
      maxDistance={20}
      minPolarAngle={Math.PI / 6}  // Limit vertical angle (can't go below board)
      maxPolarAngle={Math.PI / 2.2} // Limit vertical angle (can't go too high)
      dampingFactor={0.1}
      rotateSpeed={0.5}
      enableDamping
    />
  );
}

// Camera that follows the action
export function ActionCamera() {
  const { camera } = useThree();
  const lastMoveSquare = useGameStore((state) => state.selectedSquare);
  const baseY = useRef(8);
  
  useFrame((state) => {
    // Subtle camera movement following game state
    const time = state.clock.elapsedTime;
    
    // Gentle breathing animation
    const breathe = Math.sin(time * 0.5) * 0.1;
    const newY = 8 + breathe;
    
    // Only update if the difference is meaningful
    if (Math.abs(camera.position.y - newY) > 0.001) {
      camera.position.setY(newY);
    }
  });
  
  return null;
}

// Dynamic lighting that follows the action
export function DynamicLighting() {
  const lightRef = useRef<THREE.PointLight>(null);
  const selectedSquare = useGameStore((state) => state.selectedSquare);
  const isFlipped = useGameStore((state) => state.isFlipped);
  
  useFrame(() => {
    if (!lightRef.current || !selectedSquare) return;
    
    // Position light over selected square
    const file = selectedSquare.charCodeAt(0) - 97;
    const rank = parseInt(selectedSquare[1]) - 1;
    
    const x = isFlipped ? -(file - 3.5) : file - 3.5;
    const z = isFlipped ? -(rank - 3.5) : rank - 3.5;
    
    lightRef.current.position.x = THREE.MathUtils.lerp(lightRef.current.position.x, x, 0.1);
    lightRef.current.position.z = THREE.MathUtils.lerp(lightRef.current.position.z, z, 0.1);
  });
  
  if (!selectedSquare) return null;
  
  return (
    <pointLight
      ref={lightRef}
      position={[0, 3, 0]}
      intensity={0.5}
      color="#ffffff"
      distance={5}
    />
  );
}
