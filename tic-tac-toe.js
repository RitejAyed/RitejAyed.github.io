// Récupérer les éléments DOM principaux
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

// Passer d'un écran à l'autre
function showScreen(screenId) {
  Object.values(screens).forEach(screen => screen.classList.remove('active'));
  screens[screenId].classList.add('active');
}

// Fonction de démarrage du jeu - basée sur le modèle du professeur
function startTicTacToe() {
  // Configurer le plateau comme demandé par le professeur
  const board = document.querySelector(".board-container");
  board.style.display = "grid";
  board.style.gridTemplateColumns = "repeat(3, 1fr)";

  // État du jeu comme demandé par le professeur
  let gameState = ["", "", "", "", "", "", "", "", ""];
  let currentPlayer = "O";  // Le joueur commence (O)
  let gameActive = true;
  
  // Nettoyer le plateau
  cells.forEach(cell => cell.className = 'board-cell');
  winningLine.style.display = 'none';

  // Vérifier s'il y a un gagnant - suivant la méthode du professeur
  function checkWinner() {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    // Parcourir tous les patterns gagnants
    for (let i = 0; i < winPatterns.length; i++) {
      const [a, b, c] = winPatterns[i];
      if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
        return { winner: gameState[a], pattern: i };
      }
    }

    // Match nul?
    if (!gameState.includes("")) {
      return { winner: "draw" };
    }

    return null;
  }

  // Montrer qui a gagné
  function handleWin(result) {
    gameActive = false;

    if (result.winner === "draw") {
      winnerText.textContent = "DRAW!";
      winnerIcon.className = "winner-icon";
    } else {
      // Dessiner la ligne gagnante
      winningLine.style.display = "block";
      
      // Configurer la ligne selon le pattern gagnant
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
      
      // Afficher le gagnant après un délai
      setTimeout(() => {
        const playerWin = result.winner === "O";
        winnerText.textContent = playerWin ? "PLAYER WINS!" : (isVsComputer ? "COMPUTER WINS!" : "PLAYER WINS!");
        winnerIcon.className = "winner-icon " + result.winner.toLowerCase();
        
        // Effet de confetti
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

  // Tour de l'ordinateur (très simple)
  function computerMove() {
    if (!gameActive) return;
    
    // Trouver les cases vides
    const emptyCells = [];
    gameState.forEach((val, idx) => {
      if (val === "") emptyCells.push(idx);
    });
    
    if (emptyCells.length === 0) return;
    
    // Jouer au hasard
    const randomIdx = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    gameState[randomIdx] = currentPlayer;
    cells[randomIdx].classList.add(currentPlayer.toLowerCase());
    
    // Vérifier s'il y a un gagnant
    const result = checkWinner();
    if (result) {
      handleWin(result);
    } else {
      currentPlayer = "O";
    }
  }

  // Gérer les clics sur les cellules
  function handleCellClick(idx) {
    if (!gameActive || gameState[idx] !== "" || (isVsComputer && currentPlayer === "X")) return;
    
    // Jouer le coup
    gameState[idx] = currentPlayer;
    cells[idx].classList.add(currentPlayer.toLowerCase());
    
    // Vérifier s'il y a un gagnant
    const result = checkWinner();
    if (result) {
      handleWin(result);
      return;
    }
    
    // Changer de joueur
    currentPlayer = currentPlayer === "O" ? "X" : "O";
    
    // Tour de l'ordinateur?
    if (isVsComputer && currentPlayer === "X") {
      setTimeout(computerMove, 700);
    }
  }
  
  // Associer les événements de clic
  cells.forEach((cell, index) => {
    cell.onclick = () => handleCellClick(index);
  });
  
  showScreen("game");
  
  // Pour réinitialiser le jeu
  return {
    resetGame: function() {
      gameState = ["", "", "", "", "", "", "", "", ""];
      currentPlayer = "O";
      gameActive = true;
      cells.forEach(cell => cell.className = "board-cell");
      winningLine.style.display = "none";
      showScreen("game");
    }
  };
}

// Initialisation principale
window.addEventListener("DOMContentLoaded", function() {
  let game;
  
  // Configuration des boutons
  document.getElementById("start-button").onclick = () => showScreen("mode");
  
  document.getElementById("player-vs-computer").onclick = () => {
    isVsComputer = true;
    opponentLabel.textContent = "COMPUTER";
    game = startTicTacToe();
  };
  
  document.getElementById("player-vs-player").onclick = () => {
    isVsComputer = false;
    opponentLabel.textContent = "PLAYER";
    game = startTicTacToe();
  };
  
  document.getElementById("play-again").onclick = () => game && game.resetGame();
  document.getElementById("restart-button").onclick = () => game && game.resetGame();
  
  document.getElementById("menu-return").onclick = () => showScreen("mode");
  document.getElementById("menu-button").onclick = () => window.location.href = "game.html";
});