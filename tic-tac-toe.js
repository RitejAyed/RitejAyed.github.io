// Define global object to store references to all screen elements in the game
const screens = {
  intro: document.getElementById('intro-screen'),
  mode: document.getElementById('mode-screen'),
  game: document.getElementById('game-screen'),
  winner: document.getElementById('winner-screen')
};

// Cache frequently used DOM elements to improve performance
const cells = document.querySelectorAll('.board-cell');  // All game board cells
const opponentLabel = document.getElementById('opponent-label');  // Label showing opponent type
const winnerIcon = document.querySelector('.winner-icon');  // Icon showing winner (X/O)
const winnerText = document.querySelector('.winner-text');  // Text showing winner message
const winningLine = document.getElementById('winning-line');  // Line drawn through winning cells
let isVsComputer = true;  // Game mode flag - true for Player vs Computer, false for Player vs Player

// Configurations for drawing the winning line through matched cells
// Each config describes where and how to position the line for different win patterns
const winningConfigs = [
  { indices: [0, 1, 2], type: 'horizontal', top: '16.7%' },  // Top row
  { indices: [3, 4, 5], type: 'horizontal', top: '50%' },    // Middle row
  { indices: [6, 7, 8], type: 'horizontal', top: '83.3%' },  // Bottom row
  { indices: [0, 3, 6], type: 'vertical', left: '16.7%' },   // Left column
  { indices: [1, 4, 7], type: 'vertical', left: '50%' },     // Middle column
  { indices: [2, 5, 8], type: 'vertical', left: '83.3%' },   // Right column
  { indices: [0, 4, 8], type: 'diagonal-right' },            // Diagonal top-left to bottom-right
  { indices: [2, 4, 6], type: 'diagonal-left' }              // Diagonal top-right to bottom-left
];

/**
 * Changes the active screen to the specified one
 * @param {string} screenId - ID of the screen to show ('intro', 'mode', 'game', or 'winner')
 */
function showScreen(screenId) {
  // Hide all screens first by removing the 'active' class
  Object.values(screens).forEach(screen => {
    screen.classList.remove('active');
  });

  // Show the requested screen by adding the 'active' class
  screens[screenId].classList.add('active');
}

/**
 * Shows the mode selection screen
 */
function showModeScreen() {
  showScreen('mode');
}

/**
 * Initializes and starts the Tic-Tac-Toe game
 * Sets up the game board and game logic
 * @returns {Object} Game controller with exposed methods
 */
function startTicTacToe() {
  // Configure the game board grid layout
  const board = document.querySelector(".board-container");
  board.style.display = "grid";
  board.style.gridTemplateColumns = "repeat(3, 1fr)";  // Create 3x3 grid

  // Initialize the game state
  let gameState = ["", "", "", "", "", "", "", "", ""];  // Empty cells
  let currentPlayer = "O";  // Start with O (player) to match UI design
  let gameActive = true;  // Flag to track if game is ongoing

  // Clear any previous game state from the UI
  cells.forEach(cell => {
    cell.className = 'board-cell';  // Remove X or O classes
  });

  // Hide the winning line from any previous game
  winningLine.style.display = 'none';

  /**
   * Checks if there's a winner or draw based on current game state
   * @returns {Object|null} Winner info or null if game should continue
   */
  function checkWinner() {
    // All possible winning patterns (same as winningConfigs indices)
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
      [0, 4, 8], [2, 4, 6]              // Diagonals
    ];

    // Check each possible winning pattern
    for (let i = 0; i < winPatterns.length; i++) {
      const [a, b, c] = winPatterns[i];  // Destructure the indices to check
      // If all three cells have the same non-empty value, we have a winner
      if (gameState[a] && gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
        return {
          winner: gameState[a],  // Either "X" or "O"
          winConfig: winningConfigs[i]  // Configuration for drawing the winning line
        };
      }
    }

    // If no winner but board is full, it's a draw
    if (!gameState.includes("")) {
      return { winner: "draw" };
    }

    // Otherwise, game continues
    return null;
  }

  /**
   * Handles player's click on a cell
   * @param {HTMLElement} cell - The clicked cell
   */
  function handleCellClick(cell) {
    if (!gameActive) return;  // Ignore clicks if game is over

    const index = cell.getAttribute('data-index');  // Get cell position (0-8)

    // Ignore if cell is already filled
    if (gameState[index] !== '') return;

    // In computer mode, prevent clicking during computer's turn
    if (isVsComputer && currentPlayer === 'X') return;

    // Update game state and UI
    gameState[index] = currentPlayer;  // Mark the cell with current player's symbol
    cell.classList.add(currentPlayer.toLowerCase());  // Add the visual class (x or o)

    // Check if this move resulted in a win or draw
    const result = checkWinner();
    if (result) {
      handleGameEnd(result);  // Handle game over
      return;
    }

    // Switch turns
    currentPlayer = currentPlayer === 'O' ? 'X' : 'O';

    // If in computer mode and it's computer's turn, make computer move after delay
    if (isVsComputer && currentPlayer === 'X') {
      setTimeout(computerMove, 500);  // Half-second delay for better UX
    }
  }

  /**
   * Handles the computer's move in single player mode
   */
  function computerMove() {
    if (!gameActive) return;  // Safety check to prevent moves after game ends

    // Find all empty cells
    const emptyCells = [];
    gameState.forEach((value, index) => {
      if (value === '') {
        emptyCells.push(index);
      }
    });

    if (emptyCells.length === 0) return;  // No moves possible

    // Choose a random empty cell
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const cell = document.querySelector(`.board-cell[data-index="${randomIndex}"]`);

    // Update game state and UI for computer's move
    gameState[randomIndex] = currentPlayer;  // Mark with X (computer's symbol)
    cell.classList.add(currentPlayer.toLowerCase());  // Add visual class

    // Check if computer won
    const result = checkWinner();
    if (result) {
      handleGameEnd(result);
      return;
    }

    // Switch back to player
    currentPlayer = 'O';
  }

  /**
   * Displays the winning line on the board
   * @param {Object} config - Line configuration (type, position)
   */
  function showWinningLine(config) {
    winningLine.style.display = 'block';  // Make the line visible

    // Position and style the line based on which pattern won
    if (config.type === 'horizontal') {
      // Horizontal line across a row
      winningLine.style.width = '100%';
      winningLine.style.height = '4px';
      winningLine.style.top = config.top;
      winningLine.style.left = '0';
      winningLine.style.transform = 'none';
    } else if (config.type === 'vertical') {
      // Vertical line down a column
      winningLine.style.width = '4px';
      winningLine.style.height = '100%';
      winningLine.style.top = '0';
      winningLine.style.left = config.left;
      winningLine.style.transform = 'none';
    } else if (config.type === 'diagonal-right') {
      // Diagonal from top-left to bottom-right
      winningLine.style.width = '140%';  // Longer to reach corner to corner
      winningLine.style.height = '4px';
      winningLine.style.top = '50%';
      winningLine.style.left = '-20%';  // Offset to center the line
      winningLine.style.transform = 'rotate(45deg)';
    } else if (config.type === 'diagonal-left') {
      // Diagonal from top-right to bottom-left
      winningLine.style.width = '140%';  // Longer to reach corner to corner
      winningLine.style.height = '4px';
      winningLine.style.top = '50%';
      winningLine.style.left = '-20%';  // Offset to center the line
      winningLine.style.transform = 'rotate(-45deg)';
    }
  }

  /**
   * Handles the end of the game (win or draw)
   * @param {Object} result - Result information (winner, win configuration)
   */
  function handleGameEnd(result) {
    gameActive = false;  // Stop the game

    if (result.winner === 'draw') {
      // It's a draw
      showWinnerScreen('draw');
    } else {
      // Someone won, show the winning line
      showWinningLine(result.winConfig);
      // Show winner screen after a delay to let player see the winning line
      setTimeout(() => {
        showWinnerScreen(result.winner);
      }, 1000);
    }
  }

  /**
   * Shows the winner screen with appropriate message
   * @param {string} winner - 'X', 'O', or 'draw'
   */
  function showWinnerScreen(winner) {
    if (winner === 'draw') {
      // Show draw message
      winnerText.textContent = 'DRAW!';
      winnerIcon.className = 'winner-icon';  // No specific icon for draw
    } else {
      // Show winner message - adapt based on game mode
      winnerText.textContent = `${winner === 'O' ? 'PLAYER' : isVsComputer ? 'COMPUTER' : 'PLAYER 2'} WINS!`;
      winnerIcon.className = `winner-icon ${winner.toLowerCase()}`;  // Add x or o class to icon

      // Celebrate with confetti animation
      try {
        confetti({
          particleCount: 100,  // Number of confetti pieces
          spread: 70,          // How spread out the confetti is
          origin: { y: 0.6 }   // Start position (from top of screen)
        });
      } catch (e) {
        console.error('Confetti error:', e);  // Log error if confetti fails
      }
    }

    // Show the winner screen
    showScreen('winner');
  }

  // Add click event listeners to all cells on the board
  cells.forEach(cell => {
    cell.addEventListener('click', () => handleCellClick(cell));
  });

  // Show the game screen
  showScreen('game');

  // Return an object with methods that can be called from outside
  return {
    resetGame: function() {
      // Reset all game state variables
      gameState = ["", "", "", "", "", "", "", "", ""];
      currentPlayer = "O";  // Always start with player O
      gameActive = true;

      // Reset the UI
      cells.forEach(cell => {
        cell.className = 'board-cell';  // Remove X or O classes
      });

      // Hide winning line
      winningLine.style.display = 'none';
      
      // Show the game screen
      showScreen('game');
    }
  };
}

/**
 * Initialize the game and set up all event listeners
 */
function init() {
  let gameController;  // Will hold the game controller returned by startTicTacToe

  // Set up the start button to show the mode selection screen
  document.getElementById('start-button').addEventListener('click', showModeScreen);

  // Set up Player vs Computer mode button
  document.getElementById('player-vs-computer').addEventListener('click', () => {
    isVsComputer = true;  // Set game mode to vs computer
    opponentLabel.textContent = 'COMPUTER';  // Update label
    gameController = startTicTacToe();  // Start the game
  });

  // Set up Player vs Player mode button
  document.getElementById('player-vs-player').addEventListener('click', () => {
    isVsComputer = false;  // Set game mode to vs player
    opponentLabel.textContent = 'PLAYER 2';  // Update label
    gameController = startTicTacToe();  // Start the game
  });

  // Set up the play again button on winner screen
  document.getElementById('play-again').addEventListener('click', () => {
    if (gameController) gameController.resetGame();
  });

  // Set up the restart button during gameplay
  document.getElementById('restart-button').addEventListener('click', () => {
    if (gameController) gameController.resetGame();
  });

  // Set up the return to mode selection button
  document.getElementById('menu-return').addEventListener('click', () => {
    showModeScreen();
  });

  // Set up the main menu button to return to game selection
  document.getElementById('menu-button').addEventListener('click', () => {
    window.location.href = 'game.html';  // Go back to main games page
  });
}

// Initialize the game when the DOM is fully loaded
window.addEventListener('DOMContentLoaded', init);