import React, { useState, useEffect } from 'react';
import { Howl } from 'howler';
import { Board as BoardComponent } from './components/Board';
import { GameControls } from './components/GameControls';
import { createEmptyBoard, checkWinner, getAIMove } from './utils/gameLogic';
import { GameState, Player, Difficulty } from './types';

// Audio setup
const bgMusic = new Howl({
  src: ['https://assets.codepen.io/982762/koto.mp3'],
  loop: true,
  volume: 0.3,
});

const stoneSoundEffect = new Howl({
  src: ['https://assets.codepen.io/982762/stone_sound.mp3'],
  volume: 0.5,
});

function App() {
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    currentPlayer: 'black',
    status: 'playing',
    winner: null,
    difficulty: 'medium'
  });

  const [playerColor, setPlayerColor] = useState<Player | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (gameStarted && !isMuted) {
      bgMusic.play();
    }
    return () => {
      bgMusic.stop();
    };
  }, [gameStarted, isMuted]);

  useEffect(() => {
    if (gameStarted && gameState.currentPlayer !== playerColor && gameState.status === 'playing') {
      // AI's turn
      setTimeout(() => {
        const [row, col] = getAIMove(gameState.board, gameState.currentPlayer, gameState.difficulty);
        handleMove(row, col);
      }, 500);
    }
  }, [gameState.currentPlayer, gameStarted]);

  const handleMove = (row: number, col: number) => {
    if (gameState.status !== 'playing' || gameState.board[row][col]) return;

    const newBoard = gameState.board.map(row => [...row]);
    newBoard[row][col] = gameState.currentPlayer;

    if (!isMuted) {
      stoneSoundEffect.play();
    }

    const hasWon = checkWinner(newBoard, row, col);
    const newStatus = hasWon ? 'won' : 'playing';

    setGameState({
      ...gameState,
      board: newBoard,
      currentPlayer: gameState.currentPlayer === 'black' ? 'white' : 'black',
      status: newStatus,
      winner: hasWon ? gameState.currentPlayer : null,
    });
  };

  const handleSelectColor = (color: Player) => {
    setPlayerColor(color);
    setGameStarted(true);
  };

  const handleSelectDifficulty = (difficulty: Difficulty) => {
    setGameState(prev => ({ ...prev, difficulty }));
  };

  const handleRestart = () => {
    setGameState({
      board: createEmptyBoard(),
      currentPlayer: 'black',
      status: 'playing',
      winner: null,
      difficulty: gameState.difficulty
    });
    setPlayerColor(null);
    setGameStarted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex flex-col items-center justify-center p-8">
      <div className="absolute top-4 right-4">
        <button
          onClick={() => {
            setIsMuted(!isMuted);
            if (isMuted) {
              bgMusic.play();
            } else {
              bgMusic.pause();
            }
          }}
          className="px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
        >
          {isMuted ? '🔇 Unmute' : '🔊 Mute'}
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-8">Gomoku</h1>
      
      {gameState.status === 'won' && (
        <div className="mb-8 text-2xl font-bold text-green-600">
          {gameState.winner === playerColor ? 'Congratulations! You won!' : 'AI won!'}
        </div>
      )}

      <div className="mb-8">
        <BoardComponent
          board={gameState.board}
          onCellClick={handleMove}
          disabled={!gameStarted || gameState.status === 'won' || gameState.currentPlayer !== playerColor}
        />
      </div>

      <div className="mb-8">
        <GameControls
          onSelectColor={handleSelectColor}
          onSelectDifficulty={handleSelectDifficulty}
          onRestart={handleRestart}
          gameStarted={gameStarted}
        />
      </div>

      {gameStarted && gameState.status === 'playing' && (
        <div className="text-lg">
          {gameState.currentPlayer === playerColor ? 'Your turn' : 'AI is thinking...'}
        </div>
      )}
    </div>
  );
}

export default App;