import { Square, PieceSymbol, Color } from 'chess.js';
import * as THREE from 'three';

// File and rank mappings
export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
export const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'] as const;

// Square to board position mapping
export function squareToPosition(square: Square, isFlipped: boolean = false): [number, number] {
  const file = square.charCodeAt(0) - 97; // a=0, h=7
  const rank = parseInt(square[1]) - 1; // 1=0, 8=7
  
  if (isFlipped) {
    return [7 - file, 7 - rank];
  }
  
  return [file, rank];
}

// Board position to square
export function positionToSquare(x: number, z: number, isFlipped: boolean = false): Square {
  let file: number, rank: number;
  
  if (isFlipped) {
    file = 7 - Math.floor(x + 0.5);
    rank = 7 - Math.floor(z + 0.5);
  } else {
    file = Math.floor(x + 0.5);
    rank = Math.floor(z + 0.5);
  }
  
  if (file < 0 || file > 7 || rank < 0 || rank > 7) {
    throw new Error('Invalid position');
  }
  
  return `${FILES[file]}${RANKS[rank]}` as Square;
}

// Get square color
export function getSquareColor(square: Square): 'light' | 'dark' {
  const file = square.charCodeAt(0) - 97;
  const rank = parseInt(square[1]) - 1;
  return (file + rank) % 2 === 0 ? 'light' : 'dark';
}

// Piece display names
export const PIECE_NAMES: Record<PieceSymbol, string> = {
  p: 'Pawn',
  n: 'Knight',
  b: 'Bishop',
  r: 'Rook',
  q: 'Queen',
  k: 'King',
};

// Piece values for evaluation display
export const PIECE_VALUES: Record<PieceSymbol, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
};

// Convert centipawns to human-readable evaluation
export function formatEvaluation(cp: number): string {
  if (Math.abs(cp) > 1000) {
    // Mate score
    const mateIn = Math.ceil(Math.abs(cp) / 100);
    return cp > 0 ? `M${mateIn}` : `-M${mateIn}`;
  }
  
  const pawns = cp / 100;
  return pawns >= 0 ? `+${pawns.toFixed(1)}` : pawns.toFixed(1);
}

// Convert UCI move to/from notation
export function parseUciMove(uci: string): { from: Square; to: Square; promotion?: PieceSymbol } {
  const from = uci.slice(0, 2) as Square;
  const to = uci.slice(2, 4) as Square;
  const promotion = uci.length > 4 ? uci[4].toLowerCase() as PieceSymbol : undefined;
  
  return { from, to, promotion };
}

// Generate arrow geometry for candidate moves
export function createArrowGeometry(
  from: Square,
  to: Square,
  isFlipped: boolean = false
): { start: THREE.Vector3; end: THREE.Vector3; direction: THREE.Vector3 } {
  const [fromX, fromZ] = squareToPosition(from, isFlipped);
  const [toX, toZ] = squareToPosition(to, isFlipped);
  
  const start = new THREE.Vector3(fromX - 3.5, 0.1, fromZ - 3.5);
  const end = new THREE.Vector3(toX - 3.5, 0.1, toZ - 3.5);
  const direction = end.clone().sub(start).normalize();
  
  return { start, end, direction };
}

// Calculate evaluation bar percentage (0-100)
export function evaluationToPercentage(eval_: number): number {
  // Clamp evaluation to reasonable range and convert to percentage
  const maxEval = 10; // 10 pawns = 100%
  const clampedEval = Math.max(-maxEval, Math.min(maxEval, eval_));
  return 50 + (clampedEval / maxEval) * 50;
}

// Get piece color hex
export function getPieceColorHex(color: Color): string {
  return color === 'w' ? '#f5e6d3' : '#1a1a1a';
}

// Board square colors
export const LIGHT_SQUARE_COLOR = '#e8d5b8';
export const DARK_SQUARE_COLOR = '#b58863';
export const SELECTED_SQUARE_COLOR = '#f7ec5e';
export const LEGAL_MOVE_COLOR = '#4caf50';
export const LAST_MOVE_COLOR = '#cdd26a';
export const CHECK_COLOR = '#ff5252';

// 3D piece geometry helpers
export function createPawnGeometry(): THREE.BufferGeometry {
  const group = new THREE.Group();
  
  // Base
  const base = new THREE.CylinderGeometry(0.25, 0.3, 0.15, 16);
  
  // Body
  const body = new THREE.CylinderGeometry(0.15, 0.22, 0.35, 16);
  body.translate(0, 0.25, 0);
  
  // Head (sphere)
  const head = new THREE.SphereGeometry(0.18, 16, 16);
  head.translate(0, 0.55, 0);
  
  // Merge geometries
  const merged = mergeGeometries([base, body, head]);
  return merged;
}

export function createKnightGeometry(): THREE.BufferGeometry {
  const group = new THREE.Group();
  
  // Base
  const base = new THREE.CylinderGeometry(0.25, 0.3, 0.15, 16);
  
  // Body
  const body = new THREE.CylinderGeometry(0.12, 0.22, 0.3, 16);
  body.translate(0, 0.22, 0);
  
  // Neck
  const neck = new THREE.BoxGeometry(0.2, 0.35, 0.25);
  neck.translate(0, 0.55, 0.05);
  neck.rotateX(-0.3);
  
  // Head
  const head = new THREE.BoxGeometry(0.18, 0.25, 0.3);
  head.translate(0, 0.75, 0.15);
  head.rotateX(-0.3);
  
  // Mane
  const mane = new THREE.BoxGeometry(0.08, 0.3, 0.2);
  mane.translate(-0.08, 0.65, 0.1);
  
  const merged = mergeGeometries([base, body, neck, head, mane]);
  return merged;
}

export function createBishopGeometry(): THREE.BufferGeometry {
  const group = new THREE.Group();
  
  // Base
  const base = new THREE.CylinderGeometry(0.25, 0.3, 0.15, 16);
  
  // Body
  const body = new THREE.CylinderGeometry(0.1, 0.22, 0.5, 16);
  body.translate(0, 0.32, 0);
  
  // Mitre (cone with cut)
  const mitre = new THREE.ConeGeometry(0.15, 0.35, 16);
  mitre.translate(0, 0.75, 0);
  
  // Top
  const top = new THREE.SphereGeometry(0.06, 16, 16);
  top.translate(0, 0.95, 0);
  
  const merged = mergeGeometries([base, body, mitre, top]);
  return merged;
}

export function createRookGeometry(): THREE.BufferGeometry {
  const group = new THREE.Group();
  
  // Base
  const base = new THREE.CylinderGeometry(0.25, 0.3, 0.15, 16);
  
  // Body
  const body = new THREE.CylinderGeometry(0.18, 0.22, 0.35, 16);
  body.translate(0, 0.25, 0);
  
  // Tower
  const tower = new THREE.CylinderGeometry(0.2, 0.18, 0.25, 16);
  tower.translate(0, 0.55, 0);
  
  // Battlements
  const battlement = (angle: number) => {
    const b = new THREE.BoxGeometry(0.1, 0.15, 0.12);
    b.translate(
      Math.cos(angle) * 0.15,
      0.75,
      Math.sin(angle) * 0.15
    );
    return b;
  };
  
  const battlements = [0, Math.PI/2, Math.PI, Math.PI * 1.5].map(battlement);
  
  const merged = mergeGeometries([base, body, tower, ...battlements]);
  return merged;
}

export function createQueenGeometry(): THREE.BufferGeometry {
  const group = new THREE.Group();
  
  // Base
  const base = new THREE.CylinderGeometry(0.25, 0.3, 0.15, 16);
  
  // Body
  const body = new THREE.CylinderGeometry(0.08, 0.22, 0.45, 16);
  body.translate(0, 0.3, 0);
  
  // Crown base
  const crownBase = new THREE.CylinderGeometry(0.15, 0.1, 0.2, 16);
  crownBase.translate(0, 0.62, 0);
  
  // Crown points
  const point = (angle: number) => {
    const p = new THREE.ConeGeometry(0.04, 0.15, 8);
    p.translate(
      Math.cos(angle) * 0.1,
      0.8,
      Math.sin(angle) * 0.1
    );
    return p;
  };
  
  const points = [0, Math.PI/4, Math.PI/2, Math.PI*3/4, Math.PI, Math.PI*5/4, Math.PI*3/2, Math.PI*7/4].map(point);
  
  // Top ball
  const top = new THREE.SphereGeometry(0.05, 16, 16);
  top.translate(0, 0.88, 0);
  
  const merged = mergeGeometries([base, body, crownBase, ...points, top]);
  return merged;
}

export function createKingGeometry(): THREE.BufferGeometry {
  const group = new THREE.Group();
  
  // Base
  const base = new THREE.CylinderGeometry(0.25, 0.3, 0.15, 16);
  
  // Body
  const body = new THREE.CylinderGeometry(0.1, 0.22, 0.45, 16);
  body.translate(0, 0.3, 0);
  
  // Head
  const head = new THREE.CylinderGeometry(0.15, 0.1, 0.2, 16);
  head.translate(0, 0.62, 0);
  
  // Cross vertical
  const crossV = new THREE.BoxGeometry(0.06, 0.25, 0.06);
  crossV.translate(0, 0.85, 0);
  
  // Cross horizontal
  const crossH = new THREE.BoxGeometry(0.18, 0.06, 0.06);
  crossH.translate(0, 0.9, 0);
  
  const merged = mergeGeometries([base, body, head, crossV, crossH]);
  return merged;
}

// Helper to merge geometries
function mergeGeometries(geometries: THREE.BufferGeometry[]): THREE.BufferGeometry {
  // Simple merge by computing bounding box and using BufferGeometryUtils approach
  const merged = new THREE.BufferGeometry();
  
  let totalVertices = 0;
  let totalIndices = 0;
  
  for (const geo of geometries) {
    totalVertices += geo.attributes.position.count;
    if (geo.index) {
      totalIndices += geo.index.count;
    }
  }
  
  const positions = new Float32Array(totalVertices * 3);
  const normals = new Float32Array(totalVertices * 3);
  const indices: number[] = [];
  
  let vertexOffset = 0;
  let indexOffset = 0;
  
  for (const geo of geometries) {
    const posAttr = geo.attributes.position;
    const normAttr = geo.attributes.normal;
    
    for (let i = 0; i < posAttr.count; i++) {
      positions[(vertexOffset + i) * 3] = posAttr.getX(i);
      positions[(vertexOffset + i) * 3 + 1] = posAttr.getY(i);
      positions[(vertexOffset + i) * 3 + 2] = posAttr.getZ(i);
      
      if (normAttr) {
        normals[(vertexOffset + i) * 3] = normAttr.getX(i);
        normals[(vertexOffset + i) * 3 + 1] = normAttr.getY(i);
        normals[(vertexOffset + i) * 3 + 2] = normAttr.getZ(i);
      }
    }
    
    if (geo.index) {
      for (let i = 0; i < geo.index.count; i++) {
        indices.push(geo.index.getX(i) + vertexOffset);
      }
    }
    
    vertexOffset += posAttr.count;
  }
  
  merged.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  merged.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  if (indices.length > 0) {
    merged.setIndex(indices);
  }
  
  merged.computeVertexNormals();
  return merged;
}

// Get geometry for piece type
export function getPieceGeometry(type: PieceSymbol): THREE.BufferGeometry {
  switch (type) {
    case 'p': return createPawnGeometry();
    case 'n': return createKnightGeometry();
    case 'b': return createBishopGeometry();
    case 'r': return createRookGeometry();
    case 'q': return createQueenGeometry();
    case 'k': return createKingGeometry();
    default: return new THREE.BoxGeometry(0.3, 0.3, 0.3);
  }
}

// Interpolate position for smooth animation
export function lerpPosition(
  start: THREE.Vector3,
  end: THREE.Vector3,
  t: number
): THREE.Vector3 {
  return start.clone().lerp(end, t);
}

// Ease in-out function for animations
export function easeInOutCubic(t: number): number {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Jump arc for piece movement
export function calculateJumpHeight(distance: number): number {
  // Higher arc for longer moves
  return Math.min(0.8, distance * 0.15);
}
