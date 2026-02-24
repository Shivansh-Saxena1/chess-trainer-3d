import { useCallback, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Square, PieceSymbol } from 'chess.js';
import { useStockfish } from './useStockfish';

export function useChessGame() {
  const {
    game,
    fen,
    turn,
    selectedSquare,
    legalMoves,
    hoveredSquare,
    moveHistory,
    currentMoveIndex,
    evaluation,
    bestMove,
    candidateMoves,
    isEngineThinking,
    isFlipped,
    showCandidateMoves,
    isGameOver,
    result,
    selectSquare,
    setHoveredSquare,
    makeMove,
    undoMove,
    resetGame,
    goToMove,
    flipBoard,
    toggleCandidateMoves,
    dismissBlunderAlert,
    showBlunderAlert,
    lastBlunderMessage,
    engineSkillLevel,
    setEngineSkillLevel,
  } = useGameStore();
  
  // Initialize Stockfish
  useStockfish();
  
  // Handle square click
  const handleSquareClick = useCallback((square: Square) => {
    if (isGameOver) return;
    selectSquare(square);
  }, [isGameOver, selectSquare]);
  
  // Handle piece move via drag
  const handlePieceMove = useCallback((from: Square, to: Square, promotion?: PieceSymbol) => {
    if (isGameOver) return false;
    return makeMove(from, to, promotion);
  }, [isGameOver, makeMove]);
  
  // Check if a square is selected
  const isSquareSelected = useCallback((square: Square) => {
    return selectedSquare === square;
  }, [selectedSquare]);
  
  // Check if a square is a legal move target
  const isLegalMoveTarget = useCallback((square: Square) => {
    return legalMoves.includes(square);
  }, [legalMoves]);
  
  // Check if a square is hovered
  const isSquareHovered = useCallback((square: Square) => {
    return hoveredSquare === square;
  }, [hoveredSquare]);
  
  // Check if a square is in check (for highlighting)
  const isSquareInCheck = useCallback((square: Square) => {
    if (!game.isCheck()) return false;
    const piece = game.get(square);
    return piece?.type === 'k' && piece.color === turn;
  }, [game, turn]);
  
  // Get the last move squares
  const getLastMoveSquares = useCallback((): { from: Square | null; to: Square | null } => {
    if (currentMoveIndex < 0) return { from: null, to: null };
    
    const history = game.history({ verbose: true });
    if (history.length === 0) return { from: null, to: null };
    
    const lastMove = history[history.length - 1];
    return { from: lastMove.from, to: lastMove.to };
  }, [currentMoveIndex, game]);
  
  // Get piece on a square
  const getPieceOnSquare = useCallback((square: Square) => {
    return game.get(square);
  }, [game]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Arrow keys for move navigation
      if (e.key === 'ArrowLeft') {
        goToMove(currentMoveIndex - 1);
      } else if (e.key === 'ArrowRight') {
        goToMove(currentMoveIndex + 1);
      } else if (e.key === 'ArrowUp') {
        goToMove(0);
      } else if (e.key === 'ArrowDown') {
        goToMove(moveHistory.length - 1);
      }
      
      // 'U' for undo
      if (e.key === 'u' || e.key === 'U') {
        undoMove();
      }
      
      // 'R' for reset
      if (e.key === 'r' && e.ctrlKey) {
        resetGame();
      }
      
      // 'F' for flip
      if (e.key === 'f' || e.key === 'F') {
        flipBoard();
      }
      
      // Escape to deselect
      if (e.key === 'Escape') {
        selectSquare(null);
        dismissBlunderAlert();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentMoveIndex, moveHistory.length, goToMove, undoMove, resetGame, flipBoard, selectSquare, dismissBlunderAlert]);
  
  return {
    // Game state
    game,
    fen,
    turn,
    isGameOver,
    result,
    
    // Selection state
    selectedSquare,
    legalMoves,
    hoveredSquare,
    
    // Move history
    moveHistory,
    currentMoveIndex,
    
    // Engine state
    evaluation,
    bestMove,
    candidateMoves,
    isEngineThinking,
    
    // UI state
    isFlipped,
    showCandidateMoves,
    showBlunderAlert,
    lastBlunderMessage,
    engineSkillLevel,
    
    // Actions
    handleSquareClick,
    handlePieceMove,
    setHoveredSquare,
    undoMove,
    resetGame,
    goToMove,
    flipBoard,
    toggleCandidateMoves,
    dismissBlunderAlert,
    setEngineSkillLevel,
    
    // Helpers
    isSquareSelected,
    isLegalMoveTarget,
    isSquareHovered,
    isSquareInCheck,
    getLastMoveSquares,
    getPieceOnSquare,
  };
}
