import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

const board = [];
const rowColumnMap = [];
for (let r = 0; r < 3; r++) {
  board[r] = Array(3);
  for (let c = 0; c < 3; c++) {
    rowColumnMap.push([r, c]);
  }
}

function checkDir(r, c, dr, dc, v) {
  for (let i = 0; i < 3; i++, r += dr, c += dc) {
    if (!board[r][c] || board[r][c] !== v) return false;
  }
  return true;
}

export default function Board() {
  const [winner, setWinner] = useState(null);
  const [turn, setTurn] = useState('X');
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    // Prevent moves if there's a winner or square is filled
    if (winner || squares[i] !== null) return;

    const v = turn;
    const nextSquares = squares.slice();
    nextSquares[i] = v;
    setSquares(nextSquares);
    setTurn(turn === 'X' ? 'O' : 'X');

    // Update the board and check for a winner
    const [r, c] = rowColumnMap[i];
    board[r][c] = v;
    const result = (() => {
      if (checkDir(0, c, 1, 0, v)) {
        return { type: 'vertical', column: c, player: v };
      } else if (checkDir(r, 0, 0, 1, v)) {
        return { type: 'horizontal', row: r, player: v };
      } else if (checkDir(0, 0, 1, 1, v)) {
        return { type: 'diagonal', direction: 'main', player: v };
      } else if (checkDir(2, 0, -1, 1, v)) {
        return { type: 'diagonal', direction: 'opposite', player: v };
      } else {
        return null;
      }
    })();

    setWinner(result);
  }

  return (
    <div className="board-container">
      <div className="status">{winner ? `${winner.player} won` : ''}</div>
      <div className="board">
        {winner && (
          <svg className="win-line" width="100%" height="100%">
            {winner.type === 'horizontal' && (
              <line
                x1="0"
                y1={`${(winner.row + 0.5) * 33.33}%`}
                x2="100%"
                y2={`${(winner.row + 0.5) * 33.33}%`}
                stroke="red"
                strokeWidth="2"
              />
            )}
            {winner.type === 'vertical' && (
              <line
                x1={`${(winner.column + 0.5) * 33.33}%`}
                y1="0"
                x2={`${(winner.column + 0.5) * 33.33}%`}
                y2="100%"
                stroke="red"
                strokeWidth="2"
              />
            )}
            {winner.type === 'diagonal' && winner.direction === 'main' && (
              <line
                x1="0"
                y1="0"
                x2="100%"
                y2="100%"
                stroke="red"
                strokeWidth="2"
              />
            )}
            {winner.type === 'diagonal' && winner.direction === 'opposite' && (
              <line
                x1="0"
                y1="100%"
                x2="100%"
                y2="0"
                stroke="red"
                strokeWidth="2"
              />
            )}
          </svg>
        )}
        <div className="board-row">
          <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
          <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
          <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
        </div>
        <div className="board-row">
          <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
          <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
          <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
        </div>
        <div className="board-row">
          <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
          <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
          <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
        </div>
      </div>
    </div>
  );
}