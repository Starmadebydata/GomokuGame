export type Player = 'black' | 'white';
export type CellState = Player | null;
export type Board = CellState[][];
export type GameStatus = 'playing' | 'won' | 'draw';
export type Difficulty = 'medium' | 'hard' | 'expert';

export interface GameState {
  board: Board;
  currentPlayer: Player;
  status: GameStatus;
  winner: Player | null;
  difficulty: Difficulty;
}