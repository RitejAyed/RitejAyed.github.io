// Game variables
let wins = 0; // Tracks the number of player wins
let draws = 0; // Tracks the number of ties
let losses = 0; // Tracks the number of player losses
let isAnimating = false; // To prevent multiple clicks during animations

// Image paths for hand choices
const rockImage = 'rock.png'; // Path to the rock image file
const paperImage = 'paper.png'; // Path to the paper image file
const scissorsImage = 'scissors.png'; // Path to the scissors image file

// Get image path based on choice
function getHandImage(choice) { // Function that returns the appropriate image path based on the choice
    switch (choice) { // Checks the value of choice parameter
        case 'rock': return rockImage; // If choice is 'rock', return the rock image path
        case 'paper': return paperImage; // If choice is 'paper', return the paper image path
        case 'scissors': return scissorsImage; // If choice is 'scissors', return the scissors image path
        default: return rockImage; // If choice is anything else, return rock image as default
    }
}

// Update stats display
function updateStats() { // Function to update the statistics display
    document.getElementById('wins').textContent = wins; // Updates the wins counter in the HTML
    document.getElementById('draws').textContent = draws; // Updates the draws counter in the HTML
    document.getElementById('losses').textContent = losses; // Updates the losses counter in the HTML
    localStorage.setItem('rpsStats', JSON.stringify({ wins, draws, losses })); // Saves the stats to localStorage 
}

// Main game function
function play(playerChoice) { // Main function that handles a round of the game
    if (isAnimating) return; // If animation is in progress, ignore the click
    
    isAnimating = true; // Set animation to true to prevent multiple clicks
    const choices = ['rock', 'paper', 'scissors']; // Array of possible choices
    const computerChoice = choices[Math.floor(Math.random() * 3)]; // Randomly select computer's choice
    const playerHand = document.getElementById('player-hand'); // Get the player hand element
    const computerHand = document.getElementById('computer-hand'); // Get the computer hand element
    const resultText = document.getElementById('result'); // Get the result text element

    // Reset animations
    playerHand.classList.remove('rock-paper-scissors'); // Remove animation class from player hand
    computerHand.classList.remove('rock-paper-scissors'); // Remove animation class from computer hand
    resultText.classList.remove('result-animation'); // Remove animation class from result text

    // Set both hands to display rock image during the animation
    playerHand.innerHTML = `<img src="${rockImage}" alt="Rock">`; // Set player hand to rock initially
    computerHand.innerHTML = `<img src="${rockImage}" alt="Rock">`; // Set computer hand to rock initially

    // Force reflow
    void playerHand.offsetWidth; // Ensure animation restarts properly
    void computerHand.offsetWidth; // Ensure animation restarts properly

    // Add animation class
    playerHand.classList.add('rock-paper-scissors'); // Add animation class to player hand
    computerHand.classList.add('rock-paper-scissors'); // Add animation class to computer hand

    resultText.textContent = "ROCK..."; // Show "ROCK..." text
    
    setTimeout(() => { // First animation step
        resultText.textContent = "PAPER..."; // Change text to "PAPER..."
        
        setTimeout(() => { // Second animation step
            resultText.textContent = "SCISSORS..."; // Change text to "SCISSORS..."
            
            setTimeout(() => { // Third animation step
                // Remove animation class
                playerHand.classList.remove('rock-paper-scissors'); // Remove animation from player hand
                computerHand.classList.remove('rock-paper-scissors'); // Remove animation from computer hand

                // Show final choices
                playerHand.innerHTML = `<img src="${getHandImage(playerChoice)}" alt="${playerChoice}">`; // Show player's actual choice
                computerHand.innerHTML = `<img src="${getHandImage(computerChoice)}" alt="${computerChoice}">`; // Show computer's choice

                // Determine result
                let result = ''; // Variable to store the result message
                
                if (playerChoice === computerChoice) { // If choices are the same
                    result = "IT'S A TIE!"; // It's a tie
                    draws++; // Increment draws counter
                } else if ( // Check winning conditions for player
                    (playerChoice === 'rock' && computerChoice === 'scissors') || // Rock beats scissors
                    (playerChoice === 'paper' && computerChoice === 'rock') || // Paper beats rock
                    (playerChoice === 'scissors' && computerChoice === 'paper') // Scissors beats paper
                ) {
                    result = "YOU WIN!"; // Player wins
                    wins++; // Increment wins counter
                } else { // If not a tie or win, then it's a loss
                    result = "YOU LOSE!"; // Player loses
                    losses++; // Increment losses counter
                }
                
                resultText.textContent = result; // Display the result message
                updateStats(); // Update the statistics
                resultText.classList.add('result-animation'); // Add animation to result text
                
                setTimeout(() => { // Final timeout to remove result animation and reset game state
                    resultText.classList.remove('result-animation'); // Remove result animation
                    isAnimating = false; // Reset animation flag to allow new plays
                }, 500); // After 500ms
            }, 500); // After 500ms
        }, 500); // After 500ms
    }, 500); // After 500ms
}

// Load saved stats from localStorage
function loadStats() { // Function to load saved statistics
    const savedStats = localStorage.getItem('rpsStats'); // Get stats from localStorage
    
    if (savedStats) { // If there are saved stats
        const stats = JSON.parse(savedStats); // Parse the JSON string
        wins = parseInt(stats.wins) || 0; // Get wins or default to 0
        draws = parseInt(stats.draws) || 0; // Get draws or default to 0
        losses = parseInt(stats.losses) || 0; // Get losses or default to 0
        updateStats(); // Update the displayed stats
    }
}

// Initialize the game
document.addEventListener('DOMContentLoaded', () => { // When the doc structure is fully loaded
    loadStats(); // Load saved statistics
    
    // Set hands to rock image at start
    document.getElementById('player-hand').innerHTML = `<img src="${rockImage}" alt="Rock">`; // Initialize player hand as rock
    document.getElementById('computer-hand').innerHTML = `<img src="${rockImage}" alt="Rock">`; // Initialize computer hand as rock
    
    document.getElementById('reset-btn').addEventListener('click', function () { // Add click event to reset button
        wins = 0; // Reset wins to 0
        draws = 0; // Reset draws to 0
        losses = 0; // Reset losses to 0
        updateStats(); // Update the displayed stats
    });
});

// Initial update of stats
updateStats(); // Update stats display on page load