function play(playerChoice) {
  const choices = ['rock', 'paper', 'scissors'];
  const emojis = {
    rock: '✊',
    paper: '✋',
    scissors: '✌'
  };

  const computerChoice = choices[Math.floor(Math.random() * 3)];
  const playerHand = document.getElementById('player-hand');
  const computerHand = document.getElementById('computer-hand');
  const resultText = document.getElementById('result');

  // Animation reset
  playerHand.classList.remove('animate');
  computerHand.classList.remove('animate');

  // Set to ❓ and animate
  playerHand.textContent = '❓';
  computerHand.textContent = '❓';

  setTimeout(() => {
    playerHand.classList.add('animate');
    computerHand.classList.add('animate');
  }, 50);

// Delay to reveal
  setTimeout(() => {
    playerHand.textContent = emojis[playerChoice];
    computerHand.textContent = emojis[computerChoice];

    let result = '';
    if (playerChoice === computerChoice) {
      result = "It's a tie ! 😐";
    } else if (
      (playerChoice === 'rock' && computerChoice === 'scissors') ||
      (playerChoice === 'paper' && computerChoice === 'rock') ||
      (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
      result = "You won ! 🎉";
    } else {
      result = "You lost... 😢";
    }

    resultText.textContent = result;
  }, 700);
}