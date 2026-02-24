'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Square } from 'chess.js';
import { useChessGame } from '@/hooks/useChessGame';
import { squareToPosition } from '@/lib/chessHelpers';

// Legal move dot indicator
function LegalMoveDot({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Pulsing animation
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.2;
      meshRef.current.scale.setScalar(scale);
    }
  });
  
  return (
    <mesh ref={meshRef} position={position}>
      <cylinderGeometry args={[0.12, 0.12, 0.03, 16]} />
      <meshStandardMaterial
        color="#4caf50"
        transparent
        opacity={0.6}
        emissive="#4caf50"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

// Capture move ring indicator
function CaptureRing({ position }: { position: [number, number, number] }) {
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ringRef.current) {
      // Rotating animation
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
  });
  
  return (
    <group position={position}>
      {/* Outer ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.35, 0.42, 32]} />
        <meshStandardMaterial
          color="#f44336"
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Corner indicators */}
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          rotation={[0, 0, (i * Math.PI) / 2]}
          position={[
            Math.cos((i * Math.PI) / 2) * 0.35,
            Math.sin((i * Math.PI) / 2) * 0.35,
            0,
          ]}
        >
          <circleGeometry args={[0.05, 8]} />
          <meshStandardMaterial
            color="#f44336"
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

// Main move highlighter component
export function MoveHighlighter() {
  const {
    selectedSquare,
    legalMoves,
    getPieceOnSquare,
    isFlipped,
  } = useChessGame();
  
  // Calculate positions for legal moves
  const moveIndicators = useMemo(() => {
    if (!selectedSquare) return [];
    
    return legalMoves.map((targetSquare) => {
      const [x, z] = squareToPosition(targetSquare, isFlipped);
      const piece = getPieceOnSquare(targetSquare);
      
      return {
        square: targetSquare,
        position: [x - 3.5, 0.08, z - 3.5] as [number, number, number],
        isCapture: !!piece,
      };
    });
  }, [selectedSquare, legalMoves, isFlipped, getPieceOnSquare]);
  
  if (!selectedSquare) return null;
  
  return (
    <group>
      {moveIndicators.map(({ square, position, isCapture }) => (
        isCapture ? (
          <CaptureRing key={square} position={position} />
        ) : (
          <LegalMoveDot key={square} position={position} />
        )
      ))}
    </group>
  );
}
