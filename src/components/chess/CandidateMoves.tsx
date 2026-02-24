'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore, CandidateMove } from '@/store/gameStore';
import { squareToPosition } from '@/lib/chessHelpers';

// Arrow colors based on move quality
const ARROW_COLORS = {
  best: '#4caf50',      // Green for best move
  good: '#2196f3',      // Blue for good moves
  interesting: '#ff9800', // Orange for interesting moves
};

// Single arrow component
function MoveArrow({
  from,
  to,
  evaluation,
  rank,
}: {
  from: string;
  to: string;
  evaluation: number;
  rank: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const isFlipped = useGameStore((state) => state.isFlipped);
  
  // Calculate positions
  const { startPos, endPos, direction, length, color } = useMemo(() => {
    const [fromX, fromZ] = squareToPosition(from as any, isFlipped);
    const [toX, toZ] = squareToPosition(to as any, isFlipped);
    
    const start = new THREE.Vector3(fromX - 3.5, 0.12, fromZ - 3.5);
    const end = new THREE.Vector3(toX - 3.5, 0.12, toZ - 3.5);
    const dir = end.clone().sub(start);
    const len = dir.length() - 0.3; // Account for arrow head
    dir.normalize();
    
    // Color based on rank
    let arrowColor: string;
    if (rank === 1) {
      arrowColor = ARROW_COLORS.best;
    } else if (evaluation > 0) {
      arrowColor = ARROW_COLORS.good;
    } else {
      arrowColor = ARROW_COLORS.interesting;
    }
    
    return {
      startPos: start,
      endPos: end,
      direction: dir,
      length: len,
      color: arrowColor,
    };
  }, [from, to, isFlipped, evaluation, rank]);
  
  // Arrow opacity animation
  useFrame((state) => {
    if (groupRef.current) {
      const pulse = 0.6 + Math.sin(state.clock.elapsedTime * 2 + rank) * 0.2;
      groupRef.current.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.opacity = pulse;
        }
      });
    }
  });
  
  // Calculate arrow head position and rotation
  const arrowHeadPosition = useMemo(() => {
    return endPos.clone();
  }, [endPos]);
  
  const arrowRotation = useMemo(() => {
    const angle = Math.atan2(direction.x, direction.z);
    return new THREE.Euler(0, angle, 0);
  }, [direction]);
  
  // Arrow shaft position (from start to middle of arrow)
  const shaftPosition = useMemo(() => {
    return startPos.clone().add(direction.clone().multiplyScalar(length / 2));
  }, [startPos, direction, length]);
  
  return (
    <group ref={groupRef}>
      {/* Arrow shaft */}
      <mesh
        position={shaftPosition}
        rotation={new THREE.Euler(Math.PI / 2, arrowRotation.y, 0)}
      >
        <cylinderGeometry args={[0.04, 0.04, length, 8]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.7}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Arrow head */}
      <mesh
        position={arrowHeadPosition}
        rotation={new THREE.Euler(Math.PI / 2, arrowRotation.y, 0)}
      >
        <coneGeometry args={[0.12, 0.25, 8]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.7}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}

// Main candidate moves visualization component
export function CandidateMoves() {
  const candidateMoves = useGameStore((state) => state.candidateMoves);
  const isEngineThinking = useGameStore((state) => state.isEngineThinking);
  
  // Limit to top 3 moves
  const topMoves = useMemo(() => {
    return candidateMoves.slice(0, 3);
  }, [candidateMoves]);
  
  // Don't render if engine is thinking or no moves
  if (isEngineThinking || topMoves.length === 0) {
    return null;
  }
  
  return (
    <group>
      {topMoves.map((move, index) => (
        <MoveArrow
          key={`${move.from}-${move.to}`}
          from={move.from}
          to={move.to}
          evaluation={move.evaluation}
          rank={index + 1}
        />
      ))}
    </group>
  );
}
