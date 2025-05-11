import { useState } from 'react';
import './board.css'; // assume you have CSS for board and overlay

function Square({ value, onSquareClick, highlight }) {
  return (
    <button
      className={`square ${highlight ? 'highlight' : ''}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

// map between flat index and row/col
const rowColumnMap = [];
for (let r = 0; r < 3; r++) {
  for (let c = 0; c < 3; c++) {
    rowColumnMap.push([r, c]);
  }
}

function calculateWinner(squares) {
  const lines = [
    { coords: [0,1,2], type: 'horizontal', index: 0 },
    { coords: [3,4,5], type: 'horizontal', index: 1 },
    { coords: [6,7,8], type: 'horizontal', index: 2 },
    { coords: [0,3,6], type: 'vertical', index: 0 },
    { coords: [1,4,7], type: 'vertical', index: 1 },
    { coords: [2,5,8], type: 'vertical', index: 2 },
    { coords: [0,4,8], type: 'diag-main' },
    { coords: [2,4,6], type: 'diag-opp' }
  ];

  for (let line of lines) {
    const [a, b, c] = line.coords;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { player: squares[a], line };
    }
  }
  return null;
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState('X');
  const [winnerInfo, setWinnerInfo] = useState(null);

  function handleClick(i) {
    if (squares[i] || winnerInfo) return;
    const next = squares.slice();
    next[i] = turn;
    const nextTurn = turn === 'X' ? 'O' : 'X';
    setTurn(nextTurn);
    setSquares(next);

    const win = calculateWinner(next);
    if (win) {
      setWinnerInfo(win);
    }
  }

  const size = 300; // px, match your CSS .board size
  const cellSize = size / 3;

  const renderLine = () => {
    if (!winnerInfo) return null;
    const { type, index } = winnerInfo.line;
    switch (type) {
      case 'horizontal':
        // y always at (index + 0.5) / 3  → e.g. 1st row: (0+.5)/3=16.7%
        return (
          <line
            x1="0%"        y1={`${(index + 0.5) * 33.333}%`}
            x2="100%"      y2={`${(index + 0.5) * 33.333}%`}
          />
        );
      case 'vertical':
        return (
          <line
            x1={`${(index + 0.5) * 33.333}%`}  y1="0%"
            x2={`${(index + 0.5) * 33.333}%`}  y2="100%"
          />
        );
      case 'diag-main':
        // top-left to bottom-right
        return <line x1="0%" y1="0%" x2="100%" y2="100%" />;
      case 'diag-opp':
        // bottom-left to top-right
        return <line x1="0%" y1="100%" x2="100%" y2="0%" />;
      default:
        return null;
    }
  };

  return (
    <div
      className="board-container"
      style={{ position: 'relative', width: 300, height: 300 }}
    >
      <svg
        className="line-overlay"
        width="100%"        height="100%"
        viewBox="0 0 100 100"
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      >
        {renderLine()}
      </svg>

      <div className="board">
        {squares.map((val, idx) => {
          const highlight =
            winnerInfo && winnerInfo.line.coords.includes(idx);
          return (
            <Square
              key={idx}
              value={val}
              highlight={highlight}
              onSquareClick={() => handleClick(idx)}
            />
          );
        })}
      </div>

      <div className="status">
        {winnerInfo ? `${winnerInfo.player} wins!` : `Next: ${turn}`}
      </div>
    </div>
  );
}
