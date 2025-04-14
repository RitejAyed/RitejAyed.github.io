// Get main screen elements
const screens = {
  intro: document.getElementById('intro-screen'),
  mode: document.getElementById('mode-screen'),
  game: document.getElementById('game-screen'),
  winner: document.getElementById('winner-screen')
};

const cells = document.querySelectorAll('.board-cell');
const opponentLabel = document.getElementById('opponent-label');
const winnerIcon = document.querySelector('.winner-icon');
const winnerText = document.querySelector('.winner-text');
const winningLine = document.getElementById('winning-line');
let isVsComputer = true;
// Store game controller reference to access reset functionality
let gameController = null;

// Show one screen and hide the others
function showScreen(screenId) {
  Object.values(screens).forEach(screen => screen.classList.remove('active'));
  screens[screenId].classList.add('active');
}

// Global reset function that can be called by buttons
function resetGame() {
  if (gameController) {
    gameController.resetGame();
  }
}

// Start the game
function startTicTacToe() {
  const board = document.querySelector(".board-container");
  board.style.display = "grid";
  board.style.gridTemplateColumns = "repeat(3, 1fr)";

  // Initialize game state
  let gameState = ["", "", "", "", "", "", "", "", ""];
  let currentPlayer = "O";
  let gameActive = true;
  
  // Clear the board
  cells.forEach(cell => cell.className = 'board-cell');
  winningLine.style.display = 'none';

  // Check if someone has won
  function checkWinner() {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (let i = 0; i < winPatterns.length; i++) {
      const [a, b, c] = winPatterns[i];
      if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
        return { winner: gameState[a], pattern: i };
      }
    }

    if (!gameState.includes("")) {
      return { winner: "draw" };
    }

    return null;
  }

  // Show winner and confetti
  function handleWin(result) {
    gameActive = false;

    if (result.winner === "draw") {
      winnerText.textContent = "DRAW!";
      winnerIcon.className = "winner-icon";
      // Show winner screen immediately for draws
      showScreen("winner");
    } else {
      // Show the winning line
      winningLine.style.display = "block";

      // Set position and rotation of the line
      const i = result.pattern;
      if (i < 3) { // Horizontal
        winningLine.style.width = "100%";
        winningLine.style.height = "4px";
        winningLine.style.top = i === 0 ? "16.7%" : i === 1 ? "50%" : "83.3%";
        winningLine.style.left = "0";
        winningLine.style.transform = "none";
      } else if (i < 6) { // Vertical
        winningLine.style.width = "4px";
        winningLine.style.height = "100%";
        winningLine.style.top = "0";
        winningLine.style.left = (i - 3) === 0 ? "16.7%" : (i - 3) === 1 ? "50%" : "83.3%";
        winningLine.style.transform = "none";
      } else { // Diagonal
        winningLine.style.width = "140%";
        winningLine.style.height = "4px";
        winningLine.style.top = "50%";
        winningLine.style.left = "-20%";
        winningLine.style.transform = i === 6 ? "rotate(45deg)" : "rotate(-45deg)";
      }

      // Show winner after short delay
      setTimeout(() => {
        const playerWin = result.winner === "O";
        winnerText.textContent = playerWin ? "PLAYER WINS!" : (isVsComputer ? "COMPUTER WINS!" : "PLAYER WINS!");
        winnerIcon.className = "winner-icon " + result.winner.toLowerCase();

        // Confetti animation
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {
          console.error("Confetti error:", e);
        }

        showScreen("winner");
      }, 1000);
    }
  }

  // Simple computer move (random)
  function computerMove() {
    if (!gameActive) return;

    const emptyCells = [];
    gameState.forEach((val, idx) => {
      if (val === "") emptyCells.push(idx);
    });

    if (emptyCells.length === 0) return;

    const randomIdx = Math.floor(Math.random() * emptyCells.length);
    gameState[emptyCells[randomIdx]] = currentPlayer;
    cells[emptyCells[randomIdx]].classList.add(currentPlayer.toLowerCase());

    const result = checkWinner();
    if (result) {
      handleWin(result);
    } else {
      currentPlayer = "O";
    }
  }

  // What happens when you click a cell
  function handleCellClick(idx) {
    if (!gameActive || gameState[idx] !== "" || (isVsComputer && currentPlayer === "X")) return;

    gameState[idx] = currentPlayer;
    cells[idx].classList.add(currentPlayer.toLowerCase());

    const result = checkWinner();
    if (result) {
      handleWin(result);
      return;
    }

    currentPlayer = currentPlayer === "O" ? "X" : "O";

    if (isVsComputer && currentPlayer === "X") {
      setTimeout(computerMove, 700);
    }
  }

  // Add click events to the cells
  cells.forEach((cell, index) => {
    cell.onclick = () => handleCellClick(index);
  });

  showScreen("game");

  // Store the controller object for external access
  gameController = {
    resetGame: function() {
      gameState = ["", "", "", "", "", "", "", "", ""];
      currentPlayer = "O";
      gameActive = true;
      cells.forEach(cell => cell.className = 'board-cell');
      winningLine.style.display = 'none';
    }
  };
}

// Set up event listeners when the page loads
document.addEventListener('DOMContentLoaded', function() {
  // Start button takes you to mode selection
  document.getElementById('start-button').addEventListener('click', function() {
    showScreen('mode');
  });
  
  // Play vs Computer mode
  document.getElementById('player-vs-computer').addEventListener('click', function() {
    isVsComputer = true;
    opponentLabel.textContent = "COMPUTER";
    startTicTacToe();
  });
  
  // Play vs Player mode
  document.getElementById('player-vs-player').addEventListener('click', function() {
    isVsComputer = false;
    opponentLabel.textContent = "PLAYER";
    startTicTacToe();
  });
  
  // Restart button resets the current game
  document.getElementById('restart-button').addEventListener('click', resetGame);
  
  // Menu button takes you back to mode selection
  document.getElementById('menu-return').addEventListener('click', function() {
    showScreen('mode');
  });
  
  // Play again button starts a new game with the same settings
  document.getElementById('play-again').addEventListener('click', startTicTacToe);
});