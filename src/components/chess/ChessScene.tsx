'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, Stars, Float } from '@react-three/drei';
import { ChessBoard } from './ChessBoard';
import { CameraController, DynamicLighting } from './CameraController';
import { GameUI } from './GameUI';

// Loading component
function Loader() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin" />
        <span className="text-gray-400">Loading 3D Chess...</span>
      </div>
    </div>
  );
}

// Particle background
function ParticleBackground() {
  return (
    <Stars
      radius={50}
      depth={50}
      count={1000}
      factor={4}
      saturation={0}
      fade
      speed={0.5}
    />
  );
}

// Main 3D scene
function Scene() {
  return (
    <>
      {/* Environment and lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[-5, 5, -5]} intensity={0.3} color="#ffe4c4" />
      
      {/* Dynamic lighting for selected pieces */}
      <DynamicLighting />
      
      {/* Environment map for reflections */}
      <Environment preset="city" />
      
      {/* Particle background */}
      <ParticleBackground />
      
      {/* Chess board */}
      <ChessBoard />
      
      {/* Contact shadows for grounding */}
      <ContactShadows
        position={[0, -0.15, 0]}
        opacity={0.4}
        scale={15}
        blur={2}
        far={4}
      />
      
      {/* Camera controls */}
      <CameraController />
    </>
  );
}

// Main exported component
export function ChessScene() {
  return (
    <div className="relative w-full h-screen bg-gray-950">
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 8, 6], fov: 45 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      
      {/* UI overlay */}
      <GameUI />
    </div>
  );
}
