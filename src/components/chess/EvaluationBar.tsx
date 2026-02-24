'use client';

import { useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';
import { evaluationToPercentage, formatEvaluation } from '@/lib/chessHelpers';

export function EvaluationBar() {
  const evaluation = useGameStore((state) => state.evaluation);
  const isEngineThinking = useGameStore((state) => state.isEngineThinking);
  
  // Calculate bar percentage
  const percentage = useMemo(() => {
    return evaluationToPercentage(evaluation);
  }, [evaluation]);
  
  // Format evaluation for display
  const evalDisplay = useMemo(() => {
    if (Math.abs(evaluation) > 10) {
      // Mate score
      const mateIn = Math.round(1000 - Math.abs(evaluation));
      return evaluation > 0 ? `M${mateIn}` : `-M${mateIn}`;
    }
    const pawns = evaluation.toFixed(1);
    return evaluation >= 0 ? `+${pawns}` : pawns;
  }, [evaluation]);
  
  // Determine advantage text
  const advantageText = useMemo(() => {
    if (Math.abs(evaluation) < 0.3) return 'Equal';
    if (Math.abs(evaluation) < 1) return 'Slight advantage';
    if (Math.abs(evaluation) < 3) return 'Clear advantage';
    return 'Decisive advantage';
  }, [evaluation]);
  
  return (
    <div className="w-full flex flex-col gap-2">
      {/* Main evaluation bar */}
      <div className="relative h-8 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        {/* White portion */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-100 to-white transition-all duration-500 ease-out"
          style={{ height: `${percentage}%` }}
        />
        
        {/* Center line */}
        <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gray-600 -translate-y-1/2 z-10" />
        
        {/* Evaluation text overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <span className="text-sm font-bold text-gray-900 drop-shadow-lg">
            {isEngineThinking ? (
              <span className="flex items-center gap-1">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Analyzing...
              </span>
            ) : (
              evalDisplay
            )}
          </span>
        </div>
        
        {/* Advantage indicator */}
        <div className="absolute bottom-0.5 left-0 right-0 flex justify-center z-20">
          <span className="text-[10px] text-gray-700 font-medium">
            {evaluation > 0.3 ? '⬆ White' : evaluation < -0.3 ? '⬇ Black' : '≈'}
          </span>
        </div>
      </div>
      
      {/* Detailed evaluation info */}
      <div className="flex justify-between text-xs text-gray-400 px-1">
        <span>Black</span>
        <span className="text-gray-300 font-medium">{advantageText}</span>
        <span>White</span>
      </div>
    </div>
  );
}

// Mini evaluation bar for compact display
export function MiniEvaluationBar() {
  const evaluation = useGameStore((state) => state.evaluation);
  
  const percentage = useMemo(() => {
    return evaluationToPercentage(evaluation);
  }, [evaluation]);
  
  return (
    <div className="w-3 h-full bg-gray-800 rounded-full overflow-hidden relative">
      <div
        className="absolute bottom-0 left-0 right-0 bg-white transition-all duration-500"
        style={{ height: `${percentage}%` }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-0.5 bg-gray-600" />
      </div>
    </div>
  );
}
