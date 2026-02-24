'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Square } from 'chess.js';
import { useChessGame } from '@/hooks/useChessGame';
import { ChessPiece } from './ChessPiece';
import { MoveHighlighter } from './MoveHighlighter';
import { CandidateMoves } from './CandidateMoves';
import {
  squareToPosition,
  getSquareColor,
  LIGHT_SQUARE_COLOR,
  DARK_SQUARE_COLOR,
  SELECTED_SQUARE_COLOR,
  LAST_MOVE_COLOR,
  CHECK_COLOR,
} from '@/lib/chessHelpers';

// Individual square component
function BoardSquare({
  square,
  position,
  isLight,
  isSelected,
  isLegalTarget,
  isLastMoveFrom,
  isLastMoveTo,
  isCheck,
  onClick,
}: {
  square: Square;
  position: [number, number, number];
  isLight: boolean;
  isSelected: boolean;
  isLegalTarget: boolean;
  isLastMoveFrom: boolean;
  isLastMoveTo: boolean;
  isCheck: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Determine color
  const baseColor = isLight ? LIGHT_SQUARE_COLOR : DARK_SQUARE_COLOR;
  
  let color = baseColor;
  if (isCheck) {
    color = CHECK_COLOR;
  } else if (isSelected) {
    color = SELECTED_SQUARE_COLOR;
  } else if (isLastMoveFrom || isLastMoveTo) {
    color = LAST_MOVE_COLOR;
  }
  
  // Hover animation
  const [hovered, setHovered] = useState(false);
  
  useFrame(() => {
    if (meshRef.current) {
      // Subtle lift on hover
      const targetY = hovered ? 0.02 : 0;
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        targetY,
        0.1
      );
    }
  });
  
  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
      receiveShadow
    >
      <boxGeometry args={[0.95, 0.1, 0.95]} />
      <meshStandardMaterial
        color={color}
        roughness={0.4}
        metalness={0.1}
      />
      {/* Legal move indicator */}
      {isLegalTarget && (
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.02, 16]} />
          <meshStandardMaterial
            color="#4caf50"
            transparent
            opacity={0.7}
          />
        </mesh>
      )}
    </mesh>
  );
}

// Board frame/border
function BoardFrame() {
  return (
    <group>
      {/* Outer frame */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[8.5, 0.15, 8.5]} />
        <meshStandardMaterial color="#4a3728" roughness={0.3} metalness={0.2} />
      </mesh>
      
      {/* Inner trim */}
      <mesh position={[0, -0.02, 0]} receiveShadow>
        <boxGeometry args={[8.1, 0.03, 8.1]} />
        <meshStandardMaterial color="#3d2914" roughness={0.5} />
      </mesh>
    </group>
  );
}

// File and rank labels
function BoardLabels({ isFlipped }: { isFlipped: boolean }) {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];
  
  const fileLabels = isFlipped ? [...files].reverse() : files;
  const rankLabels = isFlipped ? [...ranks].reverse() : ranks;
  
  return (
    <group>
      {/* File labels (a-h) */}
      {fileLabels.map((file, i) => (
        <group key={file} position={[i - 3.5, 0.1, 4.3]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.4, 0.4]} />
            <meshBasicMaterial color="#d4a574" transparent opacity={0.9} />
          </mesh>
        </group>
      ))}
      
      {/* Rank labels (1-8) */}
      {rankLabels.map((rank, i) => (
        <group key={rank} position={[-4.3, 0.1, i - 3.5]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.4, 0.4]} />
            <meshBasicMaterial color="#d4a574" transparent opacity={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Main chess board component
export function ChessBoard() {
  const {
    fen,
    turn,
    isFlipped,
    selectedSquare,
    legalMoves,
    handleSquareClick,
    isSquareSelected,
    isLegalMoveTarget,
    isSquareInCheck,
    getLastMoveSquares,
    getPieceOnSquare,
    showCandidateMoves,
  } = useChessGame();
  
  const lastMoveSquares = getLastMoveSquares();
  
  // Generate all 64 squares
  const squares = useMemo(() => {
    const result: { square: Square; position: [number, number, number]; isLight: boolean }[] = [];
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];
    
    for (let rankIndex = 0; rankIndex < 8; rankIndex++) {
      for (let fileIndex = 0; fileIndex < 8; fileIndex++) {
        const file = files[fileIndex];
        const rank = ranks[rankIndex];
        const square = `${file}${rank}` as Square;
        
        const [x, z] = squareToPosition(square, isFlipped);
        const isLight = (fileIndex + rankIndex) % 2 === 0;
        
        result.push({
          square,
          position: [x - 3.5, 0, z - 3.5],
          isLight,
        });
      }
    }
    
    return result;
  }, [isFlipped]);
  
  // Parse FEN to get piece positions
  const pieces = useMemo(() => {
    const result: { square: Square; type: string; color: 'w' | 'b' }[] = [];
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    
    const fenParts = fen.split(' ')[0];
    const rows = fenParts.split('/');
    
    rows.forEach((row, rankIndex) => {
      let fileIndex = 0;
      const rank = 8 - rankIndex;
      
      for (const char of row) {
        if (/\d/.test(char)) {
          fileIndex += parseInt(char);
        } else {
          const file = files[fileIndex];
          const color = char === char.toUpperCase() ? 'w' : 'b';
          const type = char.toLowerCase();
          
          result.push({
            square: `${file}${rank}` as Square,
            type,
            color,
          });
          
          fileIndex++;
        }
      }
    });
    
    return result;
  }, [fen]);
  
  return (
    <group>
      {/* Board frame */}
      <BoardFrame />
      
      {/* Individual squares */}
      {squares.map(({ square, position, isLight }) => (
        <BoardSquare
          key={square}
          square={square}
          position={position}
          isLight={isLight}
          isSelected={isSquareSelected(square)}
          isLegalTarget={isLegalMoveTarget(square)}
          isLastMoveFrom={lastMoveSquares.from === square}
          isLastMoveTo={lastMoveSquares.to === square}
          isCheck={isSquareInCheck(square)}
          onClick={() => handleSquareClick(square)}
        />
      ))}
      
      {/* Chess pieces */}
      {pieces.map((piece) => (
        <ChessPiece
          key={piece.square}
          square={piece.square as Square}
          type={piece.type as 'p' | 'n' | 'b' | 'r' | 'q' | 'k'}
          color={piece.color}
          isFlipped={isFlipped}
          isSelected={isSquareSelected(piece.square as Square)}
        />
      ))}
      
      {/* Move highlights */}
      <MoveHighlighter />
      
      {/* Candidate moves visualization */}
      {showCandidateMoves && <CandidateMoves />}
      
      {/* Board labels */}
      <BoardLabels isFlipped={isFlipped} />
    </group>
  );
}

// We need to import useState
import { useState } from 'react';
