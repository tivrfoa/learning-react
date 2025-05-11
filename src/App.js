import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

const board = [];
const rowColumnMap = Array();
for (let r = 0; r < 3; r++) {
  board[r] = Array(3);
  for (let c = 0; c < 3; c++) {
    rowColumnMap.push([r, c]);
  }
}
console.log(rowColumnMap);

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
  // The handleClick function creates a copy of the squares array (nextSquares) with the JavaScript slice() Array method. 
  function handleClick(i) {
    if (squares[i] !== null) return;
    const v = turn;
    const nextSquares = squares.slice();
    nextSquares[i] = v;
    if (turn === 'X') setTurn('O'); else setTurn('X');
    setSquares(nextSquares);
    // check winner
    const [r, c] = rowColumnMap[i];
    board[r][c] = v;
    let result = (() => {
      if (checkDir(0, c, 1, 0, v)) {
        return v + ' won vertical';
      } else if (checkDir(r, 0, 0, 1, v)) {
        return v + ' won horizontal';
      } else if (checkDir(0, 0, 1, 1, v)) {
        return v + ' won main diagonal';
      } else if (checkDir(2, 0, -1, 1, v)) {
        return v + ' won opposite diagonal';
      } else {
        return null;
      }
    })();

    setWinner(result);
  }

  return (
    <>
      <div className="status">{winner}</div>
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
    </>
  );
};
