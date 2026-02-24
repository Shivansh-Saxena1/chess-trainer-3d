'use client';

import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Square, PieceSymbol, Color } from 'chess.js';
import { squareToPosition, getPieceGeometry, easeInOutCubic, calculateJumpHeight } from '@/lib/chessHelpers';

interface ChessPieceProps {
  square: Square;
  type: PieceSymbol;
  color: Color;
  isFlipped: boolean;
  isSelected: boolean;
}

// Material configurations for pieces
const WHITE_PIECE_MATERIAL = {
  color: '#f5e6d3',
  roughness: 0.3,
  metalness: 0.1,
};

const BLACK_PIECE_MATERIAL = {
  color: '#2d2d2d',
  roughness: 0.4,
  metalness: 0.2,
};

export function ChessPiece({ square, type, color, isFlipped, isSelected }: ChessPieceProps) {
  const meshRef = useRef<THREE.Group>(null);
  
  // Animation state using refs to avoid re-renders
  const isAnimating = useRef(false);
  const currentSquare = useRef(square);
  const previousPosition = useRef(new THREE.Vector3());
  const animationProgress = useRef(1);
  
  // Track if position changed (use a key to force re-render if needed)
  const [positionKey, setPositionKey] = useState(0);
  
  // Target position based on current square
  const targetPosition = useMemo(() => {
    const [x, z] = squareToPosition(square, isFlipped);
    return new THREE.Vector3(x - 3.5, 0.15, z - 3.5);
  }, [square, isFlipped]);
  
  // Initialize position on mount or when positionKey changes
  const initialPosition = useMemo(() => {
    const [x, z] = squareToPosition(square, isFlipped);
    return new THREE.Vector3(x - 3.5, 0.15, z - 3.5);
  }, [positionKey, square, isFlipped]);
  
  // Animation loop
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Check if square changed (trigger animation)
    if (square !== currentSquare.current) {
      previousPosition.current.copy(meshRef.current.position);
      animationProgress.current = 0;
      isAnimating.current = true;
      currentSquare.current = square;
    }
    
    // Move animation
    if (animationProgress.current < 1) {
      animationProgress.current = Math.min(1, animationProgress.current + delta * 3);
      const t = easeInOutCubic(animationProgress.current);
      
      // Calculate jump height
      const distance = previousPosition.current.distanceTo(targetPosition);
      const jumpHeight = calculateJumpHeight(distance);
      
      // Interpolate position
      meshRef.current.position.lerpVectors(previousPosition.current, targetPosition, t);
      
      // Add arc
      const arc = Math.sin(t * Math.PI) * jumpHeight;
      meshRef.current.position.y = 0.15 + arc;
      
      // Rotation during move
      meshRef.current.rotation.y = t * Math.PI * 2;
      
      if (animationProgress.current >= 1) {
        isAnimating.current = false;
        meshRef.current.rotation.y = 0;
      }
    }
    
    // Selection animation (floating)
    if (isSelected && !isAnimating.current) {
      const time = state.clock.elapsedTime;
      meshRef.current.position.y = 0.15 + Math.sin(time * 3) * 0.05;
    }
    
    // Return to rest position
    if (!isSelected && !isAnimating.current) {
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        0.15,
        0.1
      );
    }
  });
  
  // Get piece geometry
  const geometry = useMemo(() => getPieceGeometry(type), [type]);
  
  // Material based on color
  const materialProps = color === 'w' ? WHITE_PIECE_MATERIAL : BLACK_PIECE_MATERIAL;
  
  return (
    <group
      ref={meshRef}
      position={initialPosition}
      scale={isSelected ? 1.1 : 1}
    >
      {/* Main piece mesh */}
      <mesh
        geometry={geometry}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial {...materialProps} />
      </mesh>
      
      {/* Selection glow effect */}
      {isSelected && (
        <mesh scale={1.15}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial
            color="#f7ec5e"
            transparent
            opacity={0.2}
          />
        </mesh>
      )}
      
      {/* Piece base (for stability) */}
      <mesh position={[0, -0.07, 0]}>
        <cylinderGeometry args={[0.28, 0.32, 0.02, 16]} />
        <meshStandardMaterial
          color={color === 'w' ? '#d4c4b0' : '#1a1a1a'}
          roughness={0.5}
        />
      </mesh>
    </group>
  );
}

// King piece with special crown
export function KingPiece({ square, color, isFlipped, isSelected }: Omit<ChessPieceProps, 'type'>) {
  return (
    <ChessPiece
      square={square}
      type="k"
      color={color}
      isFlipped={isFlipped}
      isSelected={isSelected}
    />
  );
}

// Queen piece
export function QueenPiece({ square, color, isFlipped, isSelected }: Omit<ChessPieceProps, 'type'>) {
  return (
    <ChessPiece
      square={square}
      type="q"
      color={color}
      isFlipped={isFlipped}
      isSelected={isSelected}
    />
  );
}
