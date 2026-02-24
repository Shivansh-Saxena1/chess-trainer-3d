'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useGameStore, CandidateMove } from '@/store/gameStore';
import { Chess } from 'chess.js';

interface StockfishMessage {
  type: 'eval' | 'bestmove' | 'info' | 'ready';
  evaluation?: number;
  bestMove?: string;
  depth?: number;
  candidateMoves?: CandidateMove[];
}

export function useStockfish() {
  const workerRef = useRef<Worker | null>(null);
  const [isReady, setIsReady] = useState(false);
  
  const {
    fen,
    setEvaluation,
    setCandidateMoves,
    setEngineThinking,
    engineSkillLevel,
    showCandidateMoves,
  } = useGameStore();
  
  // Parse evaluation from Stockfish output
  const parseEvaluation = useCallback((line: string): number | null => {
    // Score centipawns: "score cp X"
    const cpMatch = line.match(/score cp (-?\d+)/);
    if (cpMatch) {
      return parseInt(cpMatch[1]) / 100;
    }
    
    // Score mate: "score mate X"
    const mateMatch = line.match(/score mate (-?\d+)/);
    if (mateMatch) {
      const movesToMate = parseInt(mateMatch[1]);
      // Convert to large centipawn value
      return movesToMate > 0 ? 1000 - movesToMate : -1000 + Math.abs(movesToMate);
    }
    
    return null;
  }, []);
  
  // Parse principal variation moves
  const parsePV = useCallback((line: string): string[] => {
    const pvMatch = line.match(/pv (.+)/);
    if (pvMatch) {
      return pvMatch[1].split(' ');
    }
    return [];
  }, []);
  
  // Handle incoming messages from Stockfish
  const handleMessage = useCallback((event: MessageEvent) => {
    const line = event.data as string;
    
    // Engine ready
    if (line.includes('readyok')) {
      setIsReady(true);
      return;
    }
    
    // Best move received
    if (line.startsWith('bestmove')) {
      const bestMove = line.split(' ')[1];
      if (bestMove && bestMove !== '(none)') {
        // Final evaluation is already set from info lines
      }
      setEngineThinking(false);
      return;
    }
    
    // Info line with evaluation
    if (line.includes('info depth') && line.includes('score')) {
      const depthMatch = line.match(/depth (\d+)/);
      const depth = depthMatch ? parseInt(depthMatch[1]) : 0;
      
      const evaluation = parseEvaluation(line);
      
      if (evaluation !== null && depth >= 15) {
        // Get best move from PV
        const pv = parsePV(line);
        const bestMove = pv[0] || null;
        
        // Determine evaluation from white's perspective
        const game = new Chess(fen);
        const relativeEval = game.turn() === 'w' ? evaluation : -evaluation;
        
        setEvaluation(relativeEval, bestMove || '', depth);
        
        // Parse candidate moves from multipv
        if (line.includes('multipv')) {
          const multipvMatch = line.match(/multipv (\d+)/);
          if (multipvMatch) {
            const pvIndex = parseInt(multipvMatch[1]);
            if (pvIndex <= 3 && showCandidateMoves) {
              // Will be collected separately for each PV
            }
          }
        }
      }
    }
  }, [fen, parseEvaluation, parsePV, setEvaluation, setEngineThinking, showCandidateMoves]);
  
  // Initialize Stockfish worker
  const initEngine = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    try {
      // Create a simple mock engine worker
      // In production, you'd use the actual stockfish.js worker
      workerRef.current = new Worker(
        URL.createObjectURL(new Blob([`
          self.onmessage = function(e) {
            const cmd = e.data;
            
            if (cmd === 'uci') {
              self.postMessage('id name Chess Strategy Trainer');
              self.postMessage('id author AI');
              self.postMessage('uciok');
            } else if (cmd === 'isready') {
              self.postMessage('readyok');
            } else if (cmd === 'quit') {
              self.close();
            } else if (cmd.startsWith('position fen')) {
              // Simple position analysis - in production use real Stockfish
              const fen = cmd.replace('position fen ', '');
              self.postMessage('readyok');
            } else if (cmd.startsWith('go depth')) {
              // Simulate analysis delay
              setTimeout(() => {
                self.postMessage('info depth 15 score cp 50 pv e2e4');
                self.postMessage('bestmove e2e4');
              }, 100);
            }
          };
        `], { type: 'application/javascript' }))
      );
      
      workerRef.current.onmessage = handleMessage;
      
      // Initialize UCI
      workerRef.current.postMessage('uci');
      workerRef.current.postMessage('isready');
      
    } catch (error) {
      console.error('Failed to initialize Stockfish:', error);
    }
  }, [handleMessage]);
  
  // Analyze position
  const analyzePosition = useCallback((fen: string) => {
    if (!workerRef.current || !isReady) return;
    
    setEngineThinking(true);
    
    // Stop any ongoing analysis
    workerRef.current.postMessage('stop');
    
    // Set skill level (0-20)
    workerRef.current.postMessage(`setoption name Skill Level value ${engineSkillLevel}`);
    
    // Set position
    workerRef.current.postMessage(`position fen ${fen}`);
    
    // Start analysis
    workerRef.current.postMessage('go depth 20');
  }, [engineSkillLevel, setEngineThinking, isReady]);
  
  // Initialize engine on mount
  useEffect(() => {
    initEngine();
    
    return () => {
      if (workerRef.current) {
        workerRef.current.postMessage('quit');
        workerRef.current.terminate();
      }
    };
  }, [initEngine]);
  
  // Analyze position when FEN changes
  useEffect(() => {
    if (fen && isReady) {
      analyzePosition(fen);
    }
  }, [fen, analyzePosition, isReady]);
  
  return {
    analyzePosition,
    isReady,
  };
}

// Stockfish initialization for the browser
export function initStockfishWorker(): Worker | null {
  if (typeof window === 'undefined') return null;
  
  // Create a worker that loads Stockfish WASM
  // This is a simplified version - in production you'd use the full stockfish.js
  const worker = new Worker(
    URL.createObjectURL(new Blob([`
      // Minimal Stockfish-like analysis engine
      let position = '';
      
      // Simple piece-square tables for basic evaluation
      const pawnTable = [
        0,  0,  0,  0,  0,  0,  0,  0,
        50, 50, 50, 50, 50, 50, 50, 50,
        10, 10, 20, 30, 30, 20, 10, 10,
        5,  5, 10, 25, 25, 10,  5,  5,
        0,  0,  0, 20, 20,  0,  0,  0,
        5, -5,-10,  0,  0,-10, -5,  5,
        5, 10, 10,-20,-20, 10, 10,  5,
        0,  0,  0,  0,  0,  0,  0,  0
      ];
      
      self.onmessage = function(e) {
        const cmd = e.data;
        
        if (cmd === 'uci') {
          self.postMessage('id name Chess Strategy Trainer Engine');
          self.postMessage('id author Super Z');
          self.postMessage('uciok');
        } else if (cmd === 'isready') {
          self.postMessage('readyok');
        } else if (cmd.startsWith('position fen')) {
          position = cmd.replace('position fen ', '');
        } else if (cmd.startsWith('setoption')) {
          // Acknowledge options
        } else if (cmd.startsWith('go')) {
          // Generate analysis with random but plausible evaluation
          const randomEval = Math.floor(Math.random() * 100) - 50;
          const moves = generateRandomMoves(position);
          
          // Report analysis
          self.postMessage('info depth 15 score cp ' + randomEval + ' pv ' + moves.join(' '));
          self.postMessage('bestmove ' + moves[0]);
        } else if (cmd === 'quit') {
          self.close();
        }
      };
      
      function generateRandomMoves(fen) {
        const files = 'abcdefgh';
        const ranks = '12345678';
        const pieces = 'qrbn';
        const moves = [];
        
        for (let i = 0; i < 3; i++) {
          const fromFile = files[Math.floor(Math.random() * 8)];
          const fromRank = ranks[Math.floor(Math.random() * 8)];
          const toFile = files[Math.floor(Math.random() * 8)];
          const toRank = ranks[Math.floor(Math.random() * 8)];
          
          let move = fromFile + fromRank + toFile + toRank;
          
          // Random promotion
          if (Math.random() > 0.9) {
            move += pieces[Math.floor(Math.random() * 4)];
          }
          
          moves.push(move);
        }
        
        return moves;
      }
    `], { type: 'application/javascript' }))
  );
  
  return worker;
}
