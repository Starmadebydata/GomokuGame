import React from 'react';
import { Board as BoardType, Player } from '../types';

interface BoardProps {
  board: BoardType;
  onCellClick: (row: number, col: number) => void;
  disabled: boolean;
}

export function Board({ board, onCellClick, disabled }: BoardProps) {
  const renderIntersection = (row: number, col: number) => {
    const value = board[row][col];
    const isLastRow = row === board.length - 1;
    const isLastCol = col === board.length - 1;

    return (
      <div
        key={`${row}-${col}`}
        className="relative"
        style={{ width: '40px', height: '40px' }}
      >
        {/* Horizontal line */}
        {!isLastRow && (
          <div className="absolute left-1/2 top-1/2 w-[40px] h-[2px] bg-amber-800 transform -translate-y-1/2" />
        )}
        
        {/* Vertical line */}
        {!isLastCol && (
          <div className="absolute left-1/2 top-1/2 w-[2px] h-[40px] bg-amber-800 transform -translate-x-1/2" />
        )}

        {/* Intersection point */}
        <div
          className="absolute left-1/2 top-1/2 w-[8px] h-[8px] rounded-full bg-amber-800 transform -translate-x-1/2 -translate-y-1/2"
        />

        {/* Stone */}
        {value && (
          <div
            className={`absolute left-1/2 top-1/2 w-[36px] h-[36px] rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-default
              ${value === 'black' 
                ? 'bg-gradient-to-br from-gray-700 to-black shadow-lg ring-2 ring-gray-700'
                : 'bg-gradient-to-br from-gray-100 to-white shadow-lg ring-2 ring-gray-300'
              }
              transition-all duration-200 hover:scale-105`}
          />
        )}

        {/* Clickable area */}
        {!disabled && !value && (
          <button
            onClick={() => onCellClick(row, col)}
            className="absolute left-1/2 top-1/2 w-[20px] h-[20px] transform -translate-x-1/2 -translate-y-1/2 hover:bg-amber-200 hover:bg-opacity-50 rounded-full transition-colors"
          />
        )}
      </div>
    );
  };

  return (
    <div className="inline-block bg-[#FFCE9E] p-6 rounded-lg shadow-xl border-8 border-amber-800">
      <div 
        className="grid gap-0"
        style={{ 
          gridTemplateColumns: `repeat(${board.length}, 40px)`,
          gridTemplateRows: `repeat(${board.length}, 40px)`
        }}
      >
        {board.map((row, i) =>
          row.map((_, j) => renderIntersection(i, j))
        )}
      </div>
    </div>
  );
}