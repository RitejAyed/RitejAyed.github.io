const gridContainer = document.querySelector(".grid-container"); // Selects the grid container where all the cards will be placed
let cards = []; // Declares an empty array to hold card data
let firstCard, secondCard; // Stores the first and second card clicked
let lockBoard = false; // Lock the board temporarily to prevent clicking during animations
let score = 0; // Score counter
let missedMoves = 0; // Miss counter
let timerInterval; // Used to store the interval ID for the timer
let seconds = 0;
let minutes = 0;
let timerStarted = false;
let matchedPairs = 0; // Counter for how many pairs the user has found
const totalPairs = 9; // Nombre total de paires dans le jeu

// Display initial score and missed moves on the screen
document.querySelector(".score").textContent = score;
document.querySelector(".missed").textContent = missedMoves;

// Define the card data - each card has an image path and a name
const testData = [
  {"image": "./assets/beige.png", "name": "Beige"},
  {"image": "./assets/red.png", "name": "Red"},
  {"image": "./assets/ponpon.png", "name": "Ponpon"},
  {"image": "./assets/Wrose.png", "name": "Wrose"},
  {"image": "./assets/Prose.png", "name": "Prose"},
  {"image": "./assets/orange.png", "name": "Orange"},
  {"image": "./assets/purple.png", "name": "Purple"},
  {"image": "./assets/blue.png", "name": "Blue"},
  {"image": "./assets/yellow.png", "name": "Yellow"}
];

// Double the cards array to create pairs (spread operator creates a copy of the array)
cards = [...testData, ...testData];

// Randomize the order of cards
shuffleCards();

// Create the card elements in the DOM
generateCards();

/**
 * Shuffles the cards array using the Fisher-Yates algorithm
 * This creates a random order of cards each time the game is played
 */
function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    // Pick a remaining element randomly
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    
    // Swap the current element with the randomly selected one
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

/**
 * Creates DOM elements for each card and adds them to the grid container
 * Also attaches the click event listener to each card
 */
function generateCards() {
  for (let card of cards) {
    // Create a new div element for each card
    const cardElement = document.createElement("div");
    // Add the 'card' CSS class
    cardElement.classList.add("card");
    // Store the card name as a data attribute for matching logic
    cardElement.setAttribute("data-name", card.name);
    // Create the HTML structure with front (image) and back (hidden) sides
    cardElement.innerHTML = `
      <div class="font">
        <img class="font-image" src="${card.image}" />
      </div>
      <div class="back"></div>
    `;
    // Add the card to the grid container
    gridContainer.appendChild(cardElement);
    // Attach click event handler to flip the card when clicked
    cardElement.addEventListener("click", flipCard);
  }
}

/**
 * Starts the game timer if it's not already running
 */
function startTimer() {
  if (!timerStarted) {
    timerStarted = true;
    // Update the timer display every second (1000ms)
    timerInterval = setInterval(updateTimer, 1000);
  }
}

/**
 * Stops the timer by clearing the interval
 */
function stopTimer() {
  clearInterval(timerInterval);
  timerStarted = false;
}

/**
 * Updates the timer display every second
 * Increments seconds and minutes as needed
 */
function updateTimer() {
  seconds++;
  // When seconds reach 60, increment minutes and reset seconds
  if (seconds === 60) {
    seconds = 0;
    minutes++;
  }
  
  // Update the timer display with leading zeros if needed
  const timerElement = document.querySelector(".timer");
  timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Resets the timer to 00:00 and stops it
 */
function resetTimer() {
  stopTimer();
  seconds = 0;
  minutes = 0;
  document.querySelector(".timer").textContent = "00:00";
}

/**
 * Handles card flip when a card is clicked
 */
function flipCard() {
  // If the board is locked, don't allow any card flips
  if (lockBoard) return;
  // Prevent clicking the same card twice
  if (this === firstCard) return;
  
  // Start the timer on the first card click of the game
  if (!timerStarted) {
    startTimer();
  }

  // Add the 'flipped' class to show the card's front face
  this.classList.add("flipped");

  // If this is the first card flipped in the current turn
  if (!firstCard) {
    firstCard = this;
    return;
  }

  // If this is the second card flipped in the current turn
  secondCard = this;
  // Increment the move counter
  score++;
  // Update the displayed score
  document.querySelector(".score").textContent = score;
  // Lock the board to prevent additional flips while checking for a match
  lockBoard = true;

  // Check if the two flipped cards match
  checkForMatch();
}

/**
 * Checks if the two flipped cards match and handles the result
 */
function checkForMatch() {
  // Compare the data-name attributes of both cards
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  if (isMatch) {
    // If they match, disable clicking on those cards and keep them flipped
    disableCards();
    // Increment the matched pairs counter
    matchedPairs++;
    
    // Check if all pairs have been found (game over)
    if (matchedPairs === totalPairs) {
      stopTimer();
      // Show the results screen
      showResults();
    }
  } else {
    // If they don't match, increment missed moves counter
    missedMoves++;
    // Update the displayed missed moves count
    document.querySelector(".missed").textContent = missedMoves;
    // Flip the cards back over after a delay
    unflipCards();
  }
}

/**
 * Displays the final results screen with game statistics
 */
function showResults() {
  // Populate the results with final score, time, and missed moves
  document.getElementById('final-score').textContent = score;
  document.getElementById('final-time').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  document.getElementById('final-missed').textContent = missedMoves;
  
  // Hide the game section and show the results section
  document.querySelector('.game-section').style.display = 'none';
  document.querySelector('.results-section').style.display = 'block';
  document.querySelector('.game-wrapper').style.display = 'none';
}

/**
 * Resets the game to play again after seeing results
 */
function playAgain() {
  // Hide results section and show game section again
  document.querySelector('.results-section').style.display = 'none';
  document.querySelector('.game-section').style.display = 'block';
  document.querySelector('.game-wrapper').style.display = 'block';
  
  // Reset the game state
  restart();
}

/**
 * Removes event listeners from matched cards to prevent further clicks
 */
function disableCards() {
  // Remove the click event listener from both matched cards
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  // Reset the board for the next turn
  resetBoard();
}

/**
 * Flips mismatched cards back over after a delay
 */
function unflipCards() {
  setTimeout(() => {
    // Remove the 'flipped' class to turn the cards back over
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    // Reset the board for the next turn
    resetBoard();
  }, 1000); // Wait 1 second before flipping back
}

/**
 * Resets the board state for the next turn
 */
function resetBoard() {
  // Clear the first and second card references
  firstCard = null;
  secondCard = null;
  // Unlock the board so new cards can be flipped
  lockBoard = false;
}

/**
 * Completely restarts the game with fresh state
 */
function restart() {
  // Reset board variables
  resetBoard();
  // Shuffle cards into a new order
  shuffleCards();
  // Reset all counters
  score = 0;
  missedMoves = 0;
  matchedPairs = 0;
  // Update displayed counters
  document.querySelector(".score").textContent = score;
  document.querySelector(".missed").textContent = missedMoves;
  // Reset the timer
  resetTimer();
  // Clear and recreate all card elements
  gridContainer.innerHTML = "";
  generateCards();
}