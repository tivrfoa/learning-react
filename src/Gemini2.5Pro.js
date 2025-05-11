import { useState } from 'react';
import "./Gemini2.5Pro.css";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

// This global board variable is problematic for React's rendering and state management.
// It's better to derive the board state from the `squares` array directly within the component
// or pass it down if multiple components need it in a more complex scenario.
// For this example, we'll adapt the logic but ideally, this would be refactored.
const boardLogic = {
  getBoard: (squares) => {
    const currentBoard = [];
    for (let r = 0; r < 3; r++) {
      currentBoard[r] = [];
      for (let c = 0; c < 3; c++) {
        currentBoard[r][c] = squares[r * 3 + c];
      }
    }
    return currentBoard;
  },
  checkDir: function (r, c, dr, dc, v, currentBoard) {
    for (let i = 0; i < 3; i++, r += dr, c += dc) {
      if (r < 0 || r >= 3 || c < 0 || c >= 3 || !currentBoard[r][c] || currentBoard[r][c] !== v) {
        return false;
      }
    }
    return true;
  }
};

const rowColumnMap = [];
for (let r = 0; r < 3; r++) {
  for (let c = 0; c < 3; c++) {
    rowColumnMap.push([r, c]);
  }
}

export default function Board() {
  const [winnerInfo, setWinnerInfo] = useState(null); // Stores { winner: 'X', line: [0,1,2], type: 'horizontal-0' }
  const [turn, setTurn] = useState('X');
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    if (squares[i] !== null || winnerInfo) return; // Prevent moves if square is taken or game over

    const v = turn;
    const nextSquares = squares.slice();
    nextSquares[i] = v;
    setSquares(nextSquares);

    const currentBoardState = boardLogic.getBoard(nextSquares); // Get current board from squares

    const [r, c] = rowColumnMap[i];
    let result = null;
    let lineDetails = null;

    // Check columns
    for (let col = 0; col < 3; col++) {
      if (boardLogic.checkDir(0, col, 1, 0, v, currentBoardState)) {
        result = v + ' won vertical';
        lineDetails = { type: 'vertical', line: [col, col + 3, col + 6], index: col };
        break;
      }
    }

    // Check rows
    if (!result) {
      for (let ro = 0; ro < 3; ro++) {
        if (boardLogic.checkDir(ro, 0, 0, 1, v, currentBoardState)) {
          result = v + ' won horizontal';
          lineDetails = { type: 'horizontal', line: [ro * 3, ro * 3 + 1, ro * 3 + 2], index: ro };
          break;
        }
      }
    }

    // Check main diagonal
    if (!result) {
      if (boardLogic.checkDir(0, 0, 1, 1, v, currentBoardState)) {
        result = v + ' won main diagonal';
        lineDetails = { type: 'diagonal-main', line: [0, 4, 8] };
      }
    }

    // Check opposite diagonal
    if (!result) {
      if (boardLogic.checkDir(0, 2, 1, -1, v, currentBoardState)) { // Corrected checkDir call for opposite diagonal
        result = v + ' won opposite diagonal';
        lineDetails = { type: 'diagonal-opposite', line: [2, 4, 6] };
      }
    }

    if (result) {
      setWinnerInfo({ winner: v, line: lineDetails.line, type: lineDetails.type, index: lineDetails.index });
    } else if (nextSquares.every(square => square !== null)) {
      setWinnerInfo({ winner: 'Draw', line: null, type: 'draw' });
      result = 'Draw';
    }

    if (!result) { // Only change turn if no winner and not a draw
        setTurn(turn === 'X' ? 'O' : 'X');
    }
  }

  // Function to calculate line style
  const getLineStyle = () => {
    if (!winnerInfo || !winnerInfo.line) return {};

    const { type, index } = winnerInfo;
    // Assuming square size is 100px and gap is 0 for simplicity here.
    // You'll need to adjust these based on your actual CSS for .square
    const squareSize = 100; // Match this with your .square CSS width/height
    const boardPadding = 5; // If your board has padding
    const lineThickness = 8;

    const commonStyle = {
      position: 'absolute',
      backgroundColor: 'red', // Line color
      height: `${lineThickness}px`,
      width: `${squareSize * 3 - 2 * boardPadding}px`, // Default for horizontal
      transformOrigin: 'top left',
      zIndex: 1,
    };

    switch (type) {
      case 'horizontal':
        return {
          ...commonStyle,
          top: `${squareSize * index + squareSize / 2 - lineThickness / 2 + boardPadding}px`,
          left: `${boardPadding}px`,
        };
      case 'vertical':
        return {
          ...commonStyle,
          width: `${lineThickness}px`,
          height: `${squareSize * 3 - 2 * boardPadding}px`,
          top: `${boardPadding}px`,
          left: `${squareSize * index + squareSize / 2 - lineThickness / 2 + boardPadding}px`,
        };
      case 'diagonal-main':
        return {
          ...commonStyle,
          width: `${Math.sqrt(2) * (squareSize * 3 - 2 * boardPadding - squareSize/3)}px`, // Adjusted length for diagonal
          top: `${boardPadding + squareSize/6}px`,
          left: `${boardPadding + squareSize/6}px`,
          transform: 'rotate(45deg)',
        };
      case 'diagonal-opposite':
        return {
          ...commonStyle,
          width: `${Math.sqrt(2) * (squareSize * 3 - 2 * boardPadding - squareSize/3)}px`,
          top: `${boardPadding + squareSize/6}px`,
          left: `${squareSize * 3 - boardPadding - squareSize/6}px`, // Adjusted left for opposite diagonal
          transform: 'rotate(135deg)',
          transformOrigin: 'top right',
        };
      default:
        return {};
    }
  };

  const status = winnerInfo ? (winnerInfo.winner === 'Draw' ? 'It\'s a Draw!' : `Winner: ${winnerInfo.winner}`) : `Next player: ${turn}`;

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-container"> {/* Added a container for relative positioning of the line */}
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
        {winnerInfo && winnerInfo.line && (
          <div className="winner-line" style={getLineStyle()}></div>
        )}
      </div>
      <button onClick={() => { // Reset button
          setSquares(Array(9).fill(null));
          setTurn('X');
          setWinnerInfo(null);
          // Reset the global board if you were to keep it, but it's better to remove its direct use.
      }}>Reset Game</button>
    </>
  );
}