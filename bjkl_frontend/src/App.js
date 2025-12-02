import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * Ocean Professional Theme — palette
 * primary:   #2563EB (blue)
 * secondary: #F59E0B (amber)
 * error:     #EF4444 (red)
 * background:#f9fafb
 * surface:   #ffffff
 * text:      #111827
 */

// --- Square Component ---
function Square({ value, onClick, highlight }) {
  return (
    <button
      className={`ttt-square${highlight ? ' highlight' : ''}`}
      onClick={onClick}
      aria-label={value ? `Cell: ${value}` : "Empty cell"}
      tabIndex="0"
      type="button"
      style={{}}
    >
      {value}
    </button>
  );
}

// --- Board Component ---
function Board({ squares, onSquareClick, winningLine }) {
  function renderSquare(i) {
    const isHighlight = winningLine && winningLine.includes(i);
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => onSquareClick(i)}
        highlight={isHighlight}
      />
    );
  }

  return (
    <div className="ttt-board" role="grid">
      {[0, 1, 2].map(row => (
        <div className="ttt-board-row" role="row" key={row}>
          {[0, 1, 2].map(col => renderSquare(row * 3 + col))}
        </div>
      ))}
    </div>
  );
}

// --- GameStatus Component ---
function GameStatus({ winner, draw, xIsNext }) {
  if (winner)
    return (
      <div className="ttt-status ttt-status--winner">
        Winner: <span>{winner}</span> 🎉
      </div>
    );
  if (draw)
    return (
      <div className="ttt-status ttt-status--draw">
        It's a draw! 🤝
      </div>
    );
  return (
    <div className="ttt-status">
      Next player: <span>{xIsNext ? "X" : "O"}</span>
    </div>
  );
}

// --- History/Time Travel Component ---
function MoveHistory({ history, stepNumber, jumpTo }) {
  return (
    <ol className="ttt-history">
      {history.map((_step, move) => (
        <li key={move}>
          <button
            className={`ttt-history-btn${move === stepNumber ? ' active' : ''}`}
            onClick={() => jumpTo(move)}
            type="button"
          >
            {move === 0 ? 'Go to game start' : `Go to move #${move}`}
          </button>
        </li>
      ))}
    </ol>
  );
}

// --- Winner calculation utility ---
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8],   // cols
    [0,4,8], [2,4,6],            // diags
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line };
    }
  }
  return null;
}

// --- Main Game Component ---
function TicTacToeGame() {
  const [history, setHistory] = useState([
    Array(9).fill(null)
  ]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);

  const currentSquares = history[stepNumber];
  const winnerObj = calculateWinner(currentSquares);
  const draw =
    !winnerObj &&
    currentSquares.every(square => square !== null);

  useEffect(() => {
    // Always X starts on first move after reset
    if (stepNumber === 0) setXIsNext(true);
  }, [stepNumber]);

  function handleClick(i) {
    const historyUpToStep = history.slice(0, stepNumber + 1);
    const current = historyUpToStep[historyUpToStep.length - 1];
    if (winnerObj || current[i]) return;

    const squares = current.slice();
    squares[i] = xIsNext ? "X" : "O";
    setHistory(historyUpToStep.concat([squares]));
    setStepNumber(historyUpToStep.length);
    setXIsNext(prev => !prev);
  }

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setStepNumber(0);
    setXIsNext(true);
  }

  function jumpTo(move) {
    setStepNumber(move);
    setXIsNext(move % 2 === 0);
  }

  return (
    <div className="ttt-container">
      <header className="ttt-header">
        <h1 className="ttt-title">
          <span role="img" aria-label="Wave">🌊</span>{' '}
          Tic-Tac-Toe
        </h1>
        <p className="ttt-description">
          Enjoy a game of Tic-Tac-Toe with a modern Ocean Professional theme.
        </p>
      </header>
      <main className="ttt-main">
        <section className="ttt-game">
          <GameStatus
            winner={winnerObj?.winner}
            draw={draw}
            xIsNext={xIsNext}
          />
          <Board
            squares={currentSquares}
            onSquareClick={i => handleClick(i)}
            winningLine={winnerObj ? winnerObj.line : null}
          />
          <button
            className="ttt-reset"
            onClick={resetGame}
            aria-label="Reset Game"
            type="button"
          >
            Reset Game
          </button>
        </section>
        <aside className="ttt-history-panel">
          <h2 className="ttt-history-title">Move History</h2>
          <MoveHistory
            history={history}
            stepNumber={stepNumber}
            jumpTo={jumpTo}
          />
        </aside>
      </main>
      <footer className="ttt-footer">
        <span>
          Ocean Professional theme —{' '}
          <span className="ttt-footer-highlight">#2563EB</span>,{' '}
          <span className="ttt-footer-amber">#F59E0B</span>
        </span>
      </footer>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  // Keep theme toggle for consistency with project starter
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="App">
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
      <TicTacToeGame />
    </div>
  );
}

export default App;
