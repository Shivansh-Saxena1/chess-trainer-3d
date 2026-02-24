'use client';

import { useState } from 'react';
import { useGameStore, MoveHistoryItem } from '@/store/gameStore';
import { EvaluationBar } from './EvaluationBar';
import { formatEvaluation, PIECE_NAMES } from '@/lib/chessHelpers';
import {
  RotateCcw,
  FlipHorizontal,
  Undo2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Lightbulb,
  Settings,
  X,
  AlertTriangle,
  Crown,
  Target,
  Zap,
} from 'lucide-react';

// Move list item component
function MoveItem({
  move,
  index,
  isCurrent,
  onClick,
}: {
  move: MoveHistoryItem;
  index: number;
  isCurrent: boolean;
  onClick: () => void;
}) {
  const moveNumber = Math.floor(index / 2) + 1;
  const isWhiteMove = index % 2 === 0;
  
  return (
    <button
      onClick={onClick}
      className={`
        px-2 py-1 rounded text-sm font-mono transition-all duration-200
        ${isCurrent
          ? 'bg-blue-500/30 text-blue-300 ring-1 ring-blue-500'
          : 'hover:bg-gray-700/50 text-gray-300'
        }
        ${move.isBlunder ? 'bg-red-500/20 text-red-400 ring-1 ring-red-500/50' : ''}
      `}
    >
      {isWhiteMove && <span className="text-gray-500 mr-1">{moveNumber}.</span>}
      <span className={move.isBlunder ? 'text-red-400' : ''}>{move.san}</span>
      {move.evaluation !== undefined && (
        <span className="ml-1 text-[10px] opacity-60">
          {formatEvaluation(move.evaluation * 100)}
        </span>
      )}
    </button>
  );
}

// Blunder alert component
function BlunderAlert({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-bounce">
      <div className="bg-red-500/90 backdrop-blur-sm text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 ring-2 ring-red-400">
        <AlertTriangle className="w-5 h-5" />
        <span className="font-medium">{message}</span>
        <button
          onClick={onDismiss}
          className="ml-2 hover:bg-red-600 rounded p-1 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Engine info panel
function EngineInfo() {
  const evaluation = useGameStore((state) => state.evaluation);
  const bestMove = useGameStore((state) => state.bestMove);
  const engineDepth = useGameStore((state) => state.engineDepth);
  const isEngineThinking = useGameStore((state) => state.isEngineThinking);
  const engineSkillLevel = useGameStore((state) => state.engineSkillLevel);
  const setEngineSkillLevel = useGameStore((state) => state.setEngineSkillLevel);
  
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 border border-gray-700/50">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-4 h-4 text-yellow-400" />
        <span className="text-sm font-medium text-gray-200">Engine Analysis</span>
        {isEngineThinking && (
          <span className="ml-auto flex items-center gap-1 text-xs text-yellow-400">
            <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Thinking...
          </span>
        )}
      </div>
      
      {/* Skill level slider */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Skill Level</span>
          <span>{engineSkillLevel}/20</span>
        </div>
        <input
          type="range"
          min="0"
          max="20"
          value={engineSkillLevel}
          onChange={(e) => setEngineSkillLevel(parseInt(e.target.value))}
          className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>
      
      {/* Engine stats */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-gray-900/50 rounded p-2">
          <div className="text-gray-500">Depth</div>
          <div className="text-gray-200 font-mono">{engineDepth || '-'}</div>
        </div>
        <div className="bg-gray-900/50 rounded p-2">
          <div className="text-gray-500">Eval</div>
          <div className="text-gray-200 font-mono">
            {evaluation >= 0 ? '+' : ''}{evaluation.toFixed(2)}
          </div>
        </div>
      </div>
      
      {/* Best move */}
      {bestMove && (
        <div className="mt-2 bg-green-500/10 border border-green-500/30 rounded p-2">
          <div className="flex items-center gap-2">
            <Target className="w-3 h-3 text-green-400" />
            <span className="text-xs text-green-400">Best:</span>
            <span className="text-sm font-mono text-green-300">{bestMove}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Main game UI component
export function GameUI() {
  const moveHistory = useGameStore((state) => state.moveHistory);
  const currentMoveIndex = useGameStore((state) => state.currentMoveIndex);
  const isGameOver = useGameStore((state) => state.isGameOver);
  const result = useGameStore((state) => state.result);
  const showCandidateMoves = useGameStore((state) => state.showCandidateMoves);
  const showBlunderAlert = useGameStore((state) => state.showBlunderAlert);
  const lastBlunderMessage = useGameStore((state) => state.lastBlunderMessage);
  
  const undoMove = useGameStore((state) => state.undoMove);
  const resetGame = useGameStore((state) => state.resetGame);
  const flipBoard = useGameStore((state) => state.flipBoard);
  const goToMove = useGameStore((state) => state.goToMove);
  const toggleCandidateMoves = useGameStore((state) => state.toggleCandidateMoves);
  const dismissBlunderAlert = useGameStore((state) => state.dismissBlunderAlert);
  
  const [showSettings, setShowSettings] = useState(false);
  
  return (
    <>
      {/* Blunder alert */}
      {showBlunderAlert && lastBlunderMessage && (
        <BlunderAlert message={lastBlunderMessage} onDismiss={dismissBlunderAlert} />
      )}
      
      {/* Game over overlay */}
      {isGameOver && result && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-gray-800/95 rounded-xl p-6 shadow-2xl border border-gray-700 text-center">
            <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-white mb-2">Game Over</h2>
            <p className="text-gray-300 mb-4">{result}</p>
            <button
              onClick={resetGame}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
            >
              New Game
            </button>
          </div>
        </div>
      )}
      
      {/* Main UI panel */}
      <div className="fixed right-4 top-4 bottom-4 w-72 flex flex-col gap-4 z-30">
        {/* Glassmorphism container */}
        <div className="flex-1 bg-gray-900/80 backdrop-blur-md rounded-xl border border-gray-700/50 shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-700/50">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-lg font-bold text-white">Chess Trainer</h1>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-1.5 hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            {/* Evaluation bar */}
            <EvaluationBar />
          </div>
          
          {/* Engine info */}
          <div className="p-4 border-b border-gray-700/50">
            <EngineInfo />
          </div>
          
          {/* Move list */}
          <div className="flex-1 p-4 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium text-gray-300">Moves</h2>
              <span className="text-xs text-gray-500">{moveHistory.length} moves</span>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
              {moveHistory.length === 0 ? (
                <div className="text-center text-gray-500 text-sm py-8">
                  Make your first move to start analysis
                </div>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {moveHistory.map((move, index) => (
                    <MoveItem
                      key={index}
                      move={move}
                      index={index}
                      isCurrent={index === currentMoveIndex}
                      onClick={() => goToMove(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Navigation controls */}
          <div className="p-4 border-t border-gray-700/50">
            <div className="flex justify-center gap-1 mb-3">
              <button
                onClick={() => goToMove(-1)}
                className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                title="Go to start"
              >
                <ChevronsLeft className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={() => goToMove(currentMoveIndex - 1)}
                className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                title="Previous move"
              >
                <ChevronLeft className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={() => goToMove(currentMoveIndex + 1)}
                className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                title="Next move"
              >
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={() => goToMove(moveHistory.length - 1)}
                className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                title="Go to end"
              >
                <ChevronsRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={undoMove}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors text-sm text-gray-300"
              >
                <Undo2 className="w-4 h-4" />
                Undo
              </button>
              <button
                onClick={resetGame}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors text-sm text-gray-300"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
              <button
                onClick={flipBoard}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors text-sm text-gray-300"
              >
                <FlipHorizontal className="w-4 h-4" />
                Flip
              </button>
              <button
                onClick={toggleCandidateMoves}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                  showCandidateMoves
                    ? 'bg-blue-500/30 text-blue-300 ring-1 ring-blue-500/50'
                    : 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-300'
                }`}
              >
                <Lightbulb className="w-4 h-4" />
                Hints
              </button>
            </div>
          </div>
        </div>
        
        {/* Keyboard shortcuts hint */}
        <div className="text-xs text-gray-500 text-center">
          <span className="opacity-50">← → Navigate • U Undo • F Flip • R Reset</span>
        </div>
      </div>
      
      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </>
  );
}
