import { create } from 'zustand';
import { Chess, Square, PieceSymbol, Color } from 'chess.js';

// Type definitions
export interface MoveHistoryItem {
  san: string;
  fen: string;
  evaluation?: number;
  isBlunder?: boolean;
  bestMove?: string;
}

export interface CandidateMove {
  from: string;
  to: string;
  evaluation: number;
  depth: number;
  san?: string;
}

export interface GameState {
  // Core game state
  game: Chess;
  fen: string;
  turn: Color;
  isGameOver: boolean;
  result: string | null;
  
  // Selection & interaction
  selectedSquare: Square | null;
  legalMoves: Square[];
  hoveredSquare: Square | null;
  
  // Move history
  moveHistory: MoveHistoryItem[];
  currentMoveIndex: number;
  
  // Engine state
  evaluation: number;
  bestMove: string | null;
  engineDepth: number;
  candidateMoves: CandidateMove[];
  isEngineThinking: boolean;
  engineSkillLevel: number;
  
  // UI state
  isFlipped: boolean;
  showCandidateMoves: boolean;
  showBlunderAlert: boolean;
  lastBlunderMessage: string | null;
  
  // Actions
  selectSquare: (square: Square | null) => void;
  setHoveredSquare: (square: Square | null) => void;
  makeMove: (from: Square, to: Square, promotion?: PieceSymbol) => boolean;
  undoMove: () => void;
  resetGame: () => void;
  goToMove: (index: number) => void;
  flipBoard: () => void;
  
  // Engine actions
  setEvaluation: (eval_: number, bestMove: string, depth: number) => void;
  setCandidateMoves: (moves: CandidateMove[]) => void;
  setEngineThinking: (thinking: boolean) => void;
  setEngineSkillLevel: (level: number) => void;
  toggleCandidateMoves: () => void;
  
  // Blunder detection
  checkForBlunder: (prevEval: number, newEval: number, moveSan: string) => void;
  dismissBlunderAlert: () => void;
}

// Helper to calculate relative evaluation (positive = white advantage)
const getRelativeEvaluation = (game: Chess, evalScore: number): number => {
  return game.turn() === 'w' ? evalScore : -evalScore;
};

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  game: new Chess(),
  fen: new Chess().fen(),
  turn: 'w',
  isGameOver: false,
  result: null,
  
  selectedSquare: null,
  legalMoves: [],
  hoveredSquare: null,
  
  moveHistory: [],
  currentMoveIndex: -1,
  
  evaluation: 0,
  bestMove: null,
  engineDepth: 0,
  candidateMoves: [],
  isEngineThinking: false,
  engineSkillLevel: 10,
  
  isFlipped: false,
  showCandidateMoves: true,
  showBlunderAlert: false,
  lastBlunderMessage: null,
  
  // Select a square and calculate legal moves
  selectSquare: (square) => {
    const { game, selectedSquare } = get();
    
    if (!square) {
      set({ selectedSquare: null, legalMoves: [] });
      return;
    }
    
    // If clicking the same square, deselect
    if (selectedSquare === square) {
      set({ selectedSquare: null, legalMoves: [] });
      return;
    }
    
    // If a piece is already selected, try to move
    if (selectedSquare) {
      const moves = game.moves({ square: selectedSquare, verbose: true });
      const targetMove = moves.find(m => m.to === square);
      
      if (targetMove) {
        // Handle promotion - default to queen
        const promotion = targetMove.promotion ? 'q' as PieceSymbol : undefined;
        get().makeMove(selectedSquare, square, promotion);
        return;
      }
    }
    
    // Try to select a new piece
    const piece = game.get(square);
    if (piece) {
      const moves = game.moves({ square, verbose: true });
      const legalSquares = moves.map(m => m.to as Square);
      set({ selectedSquare: square, legalMoves: legalSquares });
    } else {
      set({ selectedSquare: null, legalMoves: [] });
    }
  },
  
  setHoveredSquare: (square) => set({ hoveredSquare: square }),
  
  // Make a move
  makeMove: (from, to, promotion) => {
    const { game, moveHistory, currentMoveIndex, evaluation } = get();
    const prevEval = evaluation;
    
    try {
      const move = game.move({ from, to, promotion });
      
      if (move) {
        // Truncate history if we're not at the end
        const newHistory = moveHistory.slice(0, currentMoveIndex + 1);
        
        const historyItem: MoveHistoryItem = {
          san: move.san,
          fen: game.fen(),
          evaluation: undefined,
          isBlunder: false,
        };
        
        set({
          fen: game.fen(),
          turn: game.turn(),
          selectedSquare: null,
          legalMoves: [],
          moveHistory: [...newHistory, historyItem],
          currentMoveIndex: newHistory.length,
          isGameOver: game.isGameOver(),
          result: game.isGameOver() ? 
            (game.isCheckmate() ? `Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins` : 'Draw') 
            : null,
        });
        
        // Schedule blunder check (will be called after engine updates evaluation)
        if (prevEval !== undefined) {
          // Store the previous evaluation for blunder detection
          // The actual check happens when engine returns new evaluation
        }
        
        return true;
      }
    } catch (e) {
      // Invalid move
      console.log('Invalid move:', e);
    }
    
    return false;
  },
  
  undoMove: () => {
    const { game, moveHistory, currentMoveIndex } = get();
    
    if (currentMoveIndex >= 0) {
      game.undo();
      const newHistory = moveHistory.slice(0, currentMoveIndex);
      
      set({
        fen: game.fen(),
        turn: game.turn(),
        moveHistory: newHistory,
        currentMoveIndex: newHistory.length - 1,
        isGameOver: game.isGameOver(),
        result: null,
        selectedSquare: null,
        legalMoves: [],
      });
    }
  },
  
  resetGame: () => {
    const newGame = new Chess();
    set({
      game: newGame,
      fen: newGame.fen(),
      turn: 'w',
      isGameOver: false,
      result: null,
      selectedSquare: null,
      legalMoves: [],
      moveHistory: [],
      currentMoveIndex: -1,
      evaluation: 0,
      bestMove: null,
      engineDepth: 0,
      candidateMoves: [],
      showBlunderAlert: false,
      lastBlunderMessage: null,
    });
  },
  
  goToMove: (index) => {
    const { moveHistory } = get();
    
    if (index >= -1 && index < moveHistory.length) {
      // Reset to start and replay moves
      const newGame = new Chess();
      for (let i = 0; i <= index; i++) {
        newGame.move(moveHistory[i].san);
      }
      
      set({
        game: newGame,
        fen: newGame.fen(),
        turn: newGame.turn(),
        currentMoveIndex: index,
        isGameOver: newGame.isGameOver(),
        result: newGame.isGameOver() ? 
          (newGame.isCheckmate() ? `Checkmate! ${newGame.turn() === 'w' ? 'Black' : 'White'} wins` : 'Draw') 
          : null,
        selectedSquare: null,
        legalMoves: [],
      });
    }
  },
  
  flipBoard: () => set((state) => ({ isFlipped: !state.isFlipped })),
  
  // Engine actions
  setEvaluation: (eval_, bestMove, depth) => {
    const { moveHistory, currentMoveIndex, evaluation: prevEval, game } = get();
    
    // Check for blunder
    const blunderThreshold = 1.5;
    const evalDrop = prevEval - eval_;
    
    // Determine if this was a blunder (significant evaluation drop for the side that just moved)
    const isBlunder = Math.abs(evalDrop) > blunderThreshold && currentMoveIndex >= 0;
    
    if (isBlunder && moveHistory.length > 0) {
      const lastMove = moveHistory[currentMoveIndex];
      if (lastMove) {
        lastMove.isBlunder = true;
      }
      
      const side = game.turn() === 'w' ? 'White' : 'Black';
      const message = `${side} made a blunder! Evaluation dropped by ${Math.abs(evalDrop).toFixed(1)} points.`;
      
      set({
        evaluation: eval_,
        bestMove,
        engineDepth: depth,
        showBlunderAlert: true,
        lastBlunderMessage: message,
        moveHistory: [...moveHistory],
      });
    } else {
      // Update evaluation for current position
      if (currentMoveIndex >= 0 && moveHistory[currentMoveIndex]) {
        moveHistory[currentMoveIndex].evaluation = eval_;
      }
      
      set({
        evaluation: eval_,
        bestMove,
        engineDepth: depth,
        moveHistory: [...moveHistory],
      });
    }
  },
  
  setCandidateMoves: (moves) => set({ candidateMoves: moves }),
  setEngineThinking: (thinking) => set({ isEngineThinking: thinking }),
  setEngineSkillLevel: (level) => set({ engineSkillLevel: level }),
  toggleCandidateMoves: () => set((state) => ({ showCandidateMoves: !state.showCandidateMoves })),
  
  checkForBlunder: (prevEval, newEval, moveSan) => {
    const threshold = 1.5;
    const drop = prevEval - newEval;
    
    if (Math.abs(drop) > threshold) {
      set({
        showBlunderAlert: true,
        lastBlunderMessage: `Blunder detected! "${moveSan}" lost ${Math.abs(drop).toFixed(1)} points.`,
      });
    }
  },
  
  dismissBlunderAlert: () => set({ showBlunderAlert: false, lastBlunderMessage: null }),
}));
