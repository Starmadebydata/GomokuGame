import React from 'react';
import { CircuitBoard, Swords, Trophy } from 'lucide-react';
import { Difficulty, Player } from '../types';

interface GameControlsProps {
  onSelectColor: (color: Player) => void;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onRestart: () => void;
  gameStarted: boolean;
}

export function GameControls({
  onSelectColor,
  onSelectDifficulty,
  onRestart,
  gameStarted
}: GameControlsProps) {
  if (gameStarted) {
    return (
      <button
        onClick={onRestart}
        className="px-6 py-3 bg-gradient-to-br from-gray-800 to-black text-white rounded-lg shadow-lg hover:from-gray-700 hover:to-gray-900 transition-all duration-200 transform hover:scale-105"
      >
        Restart Game
      </button>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-center">Choose Your Stone Color</h2>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onSelectColor('black')}
            className="px-6 py-3 bg-gradient-to-br from-gray-800 to-black text-white rounded-lg shadow-lg hover:from-gray-700 hover:to-gray-900 transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
          >
            <div className="w-4 h-4 rounded-full bg-black border-2 border-white" />
            Play First (Black)
          </button>
          <button
            onClick={() => onSelectColor('white')}
            className="px-6 py-3 bg-gradient-to-br from-gray-100 to-white text-gray-800 rounded-lg shadow-lg hover:from-gray-50 hover:to-gray-100 transition-all duration-200 transform hover:scale-105 flex items-center gap-2 border-2 border-gray-200"
          >
            <div className="w-4 h-4 rounded-full bg-white border-2 border-gray-800" />
            Play Second (White)
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-center">Select AI Difficulty</h2>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onSelectDifficulty('medium')}
            className="px-6 py-3 bg-gradient-to-br from-green-600 to-green-700 text-white rounded-lg shadow-lg hover:from-green-500 hover:to-green-600 transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
          >
            <CircuitBoard size={16} />
            Medium
          </button>
          <button
            onClick={() => onSelectDifficulty('hard')}
            className="px-6 py-3 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg shadow-lg hover:from-orange-400 hover:to-orange-500 transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
          >
            <Swords size={16} />
            Hard
          </button>
          <button
            onClick={() => onSelectDifficulty('expert')}
            className="px-6 py-3 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-lg shadow-lg hover:from-red-500 hover:to-red-600 transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
          >
            <Trophy size={16} />
            Expert
          </button>
        </div>
      </div>
    </div>
  );
}