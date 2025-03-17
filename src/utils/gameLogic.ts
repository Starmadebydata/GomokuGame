import { Board, Player, Difficulty } from '../types';

export function createEmptyBoard(size: number = 15): Board {
  return Array(size).fill(null).map(() => Array(size).fill(null));
}

export function checkWinner(board: Board, row: number, col: number): boolean {
  const directions = [
    [1, 0],   // horizontal
    [0, 1],   // vertical
    [1, 1],   // diagonal
    [1, -1],  // anti-diagonal
  ];

  const player = board[row][col];
  if (!player) return false;

  return directions.some(([dx, dy]) => {
    let count = 1;
    
    // Check forward
    for (let i = 1; i < 5; i++) {
      const newRow = row + dx * i;
      const newCol = col + dy * i;
      if (!isValidPosition(newRow, newCol, board.length) || 
          board[newRow][newCol] !== player) break;
      count++;
    }

    // Check backward
    for (let i = 1; i < 5; i++) {
      const newRow = row - dx * i;
      const newCol = col - dy * i;
      if (!isValidPosition(newRow, newCol, board.length) || 
          board[newRow][newCol] !== player) break;
      count++;
    }

    return count >= 5;
  });
}

function isValidPosition(row: number, col: number, size: number): boolean {
  return row >= 0 && row < size && col >= 0 && col < size;
}

// 评估一个方向上的棋形
function evaluateDirection(board: Board, row: number, col: number, dx: number, dy: number, player: Player): number {
  let score = 0;
  let ownCount = 0;
  let emptyBefore = 0;
  let emptyAfter = 0;
  let blocked = 0;

  // 向前检查
  for (let i = 1; i <= 5; i++) {
    const newRow = row + dx * i;
    const newCol = col + dy * i;
    
    if (!isValidPosition(newRow, newCol, board.length)) {
      blocked++;
      break;
    }

    const cell = board[newRow][newCol];
    if (cell === player) {
      ownCount++;
    } else if (cell === null) {
      emptyAfter++;
      break;
    } else {
      blocked++;
      break;
    }
  }

  // 向后检查
  for (let i = 1; i <= 5; i++) {
    const newRow = row - dx * i;
    const newCol = col - dy * i;
    
    if (!isValidPosition(newRow, newCol, board.length)) {
      blocked++;
      break;
    }

    const cell = board[newRow][newCol];
    if (cell === player) {
      ownCount++;
    } else if (cell === null) {
      emptyBefore++;
      break;
    } else {
      blocked++;
      break;
    }
  }

  // 评分规则
  if (ownCount >= 4) return 10000;  // 连五或者活四
  if (ownCount === 3) {
    if (blocked === 0) return 1000;  // 活三
    if (blocked === 1) return 100;   // 眠三
  }
  if (ownCount === 2) {
    if (blocked === 0) return 100;   // 活二
    if (blocked === 1) return 10;    // 眠二
  }
  if (ownCount === 1) {
    if (blocked === 0) return 10;    // 活一
    if (blocked === 1) return 1;     // 眠一
  }

  return score;
}

// 评估位置分数
function evaluatePosition(board: Board, row: number, col: number, player: Player): number {
  const directions = [
    [1, 0],   // horizontal
    [0, 1],   // vertical
    [1, 1],   // diagonal
    [1, -1],  // anti-diagonal
  ];

  let score = 0;
  
  // 基础位置分数：越靠近棋盘中心越高
  const centerWeight = 1 - (Math.abs(row - 7) + Math.abs(col - 7)) / 14;
  score += centerWeight * 10;

  // 方向评估
  for (const [dx, dy] of directions) {
    score += evaluateDirection(board, row, col, dx, dy, player);
  }

  // 检查是否能形成威胁
  const opponent = player === 'black' ? 'white' : 'black';
  for (const [dx, dy] of directions) {
    // 如果这个位置能阻止对手连五，加分
    const opponentScore = evaluateDirection(board, row, col, dx, dy, opponent);
    if (opponentScore >= 1000) {
      score += opponentScore * 0.8; // 防守权重为80%
    }
  }

  return score;
}

function findBestMove(board: Board, player: Player, depth: number): [number, number, number] {
  const size = board.length;
  let bestScore = -Infinity;
  let bestRow = -1;
  let bestCol = -1;

  // 获取所有可能的移动
  const moves: [number, number][] = [];
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (!board[i][j] && hasNeighbor(board, i, j)) {
        moves.push([i, j]);
      }
    }
  }

  // 如果是空棋盘，直接下在天元
  if (moves.length === 0 || (moves.length === size * size)) {
    return [7, 7, 0];
  }

  // 评估每个可能的移动
  for (const [row, col] of moves) {
    board[row][col] = player;
    const score = evaluatePosition(board, row, col, player);
    board[row][col] = null;

    if (score > bestScore) {
      bestScore = score;
      bestRow = row;
      bestCol = col;
    }
  }

  return [bestRow, bestCol, bestScore];
}

// 检查是否有相邻的棋子
function hasNeighbor(board: Board, row: number, col: number): boolean {
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];

  for (const [dx, dy] of directions) {
    const newRow = row + dx;
    const newCol = col + dy;
    if (
      isValidPosition(newRow, newCol, board.length) &&
      board[newRow][newCol] !== null
    ) {
      return true;
    }
  }

  return false;
}

export function getAIMove(board: Board, player: Player, difficulty: Difficulty): [number, number] {
  const opponent = player === 'black' ? 'white' : 'black';
  let depth: number;

  // 根据难度设置搜索深度和策略
  switch (difficulty) {
    case 'expert':
      depth = 4;
      break;
    case 'hard':
      depth = 3;
      break;
    default: // medium
      depth = 2;
      const [row, col] = findBestMove(board, player, depth);
      return [row, col];
  }

  // Hard 和 Expert 难度使用 Minimax
  const [row, col] = minimax(
    board,
    depth,
    -Infinity,
    Infinity,
    true,
    player,
    opponent
  );

  return [row, col];
}

// Minimax with Alpha-Beta pruning (用于 Hard 和 Expert 难度)
function minimax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  player: Player,
  opponent: Player
): [number, number, number] {
  if (depth === 0) {
    return [-1, -1, 0];
  }

  const size = board.length;
  const moves: [number, number][] = [];
  
  // 获取所有可能的移动
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (!board[i][j] && hasNeighbor(board, i, j)) {
        moves.push([i, j]);
      }
    }
  }

  if (moves.length === 0) {
    return [size >> 1, size >> 1, 0];
  }

  let bestRow = moves[0][0];
  let bestCol = moves[0][1];
  let bestScore = isMaximizing ? -Infinity : Infinity;

  for (const [row, col] of moves) {
    board[row][col] = isMaximizing ? player : opponent;
    
    const currentScore = evaluatePosition(board, row, col, isMaximizing ? player : opponent);
    
    if (currentScore >= 10000) {
      board[row][col] = null;
      return [row, col, currentScore];
    }

    const [, , score] = minimax(
      board,
      depth - 1,
      alpha,
      beta,
      !isMaximizing,
      player,
      opponent
    );

    board[row][col] = null;

    if (isMaximizing) {
      if (currentScore + score > bestScore) {
        bestScore = currentScore + score;
        bestRow = row;
        bestCol = col;
      }
      alpha = Math.max(alpha, bestScore);
    } else {
      if (currentScore + score < bestScore) {
        bestScore = currentScore + score;
        bestRow = row;
        bestCol = col;
      }
      beta = Math.min(beta, bestScore);
    }

    if (beta <= alpha) {
      break;
    }
  }

  return [bestRow, bestCol, bestScore];
}