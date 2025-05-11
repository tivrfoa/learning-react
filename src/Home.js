import { useState } from 'react';
import { Link } from 'react-router-dom';

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

function Board({ xIsNext, squares, onPlay }) {
  const [winner, setWinner] = useState(null);
  // The handleClick function creates a copy of the squares array (nextSquares) with the JavaScript slice() Array method. 
  function handleClick(i) {
    if (squares[i] !== null) return;
    const v = xIsNext ? 'X' : 'O';
    const nextSquares = squares.slice();
    nextSquares[i] = v;
    
    onPlay(nextSquares);
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
        <ul>
            <li><Link to="/grok3">Go to Grok3</Link></li>
            <li><Link to="/gemeni2.5Pro">Go to Gemini 2.5 Pro</Link></li>
        </ul>
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

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }

  const moves = history.map((squares, move) => {
    console.debug(squares);
    console.debug(move);
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
