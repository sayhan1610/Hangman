let words = [];
let guessedLetters = [];
let wrongLetters = [];
let remainingLetters = 0;
let remainingAttempts = 6;
let word = '';

fetch('words.json')
  .then(response => response.json())
  .then(data => {
    words = data.words;
  });

function initGame() {
  word = words[Math.floor(Math.random() * words.length)];
  guessedLetters = [];
  wrongLetters = [];
  remainingLetters = word.length;
  remainingAttempts = 6;

  const wordContainer = document.getElementById('wordContainer');
  const lettersDiv = document.getElementById('letters');
  const wrongLettersDiv = document.getElementById('wrongLetters');
  const messageDiv = document.getElementById('message');
  const playButton = document.getElementById('playButton');
  const playAgainButton = document.getElementById('playAgainButton');
  const hangmanImage = document.getElementById('hangmanImage');

  hangmanImage.src = 'images/0.png';
  wordContainer.textContent = Array(word.length).fill('_').join(' ');
  lettersDiv.innerHTML = '';
  wrongLettersDiv.textContent = '';
  messageDiv.textContent = '';
  playButton.style.display = 'none';
  playAgainButton.style.display = 'none';

  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  for (let char of alphabet) {
    const button = document.createElement('button');
    button.textContent = char;
    button.addEventListener('click', () => guessLetter(char));
    lettersDiv.appendChild(button);
  }
}

function guessLetter(letter) {
  if (guessedLetters.includes(letter) || wrongLetters.includes(letter)) {
    return;
  }

  guessedLetters.push(letter);
  const wordContainer = document.getElementById('wordContainer');
  const wrongLettersDiv = document.getElementById('wrongLetters');
  const messageDiv = document.getElementById('message');
  const hangmanImage = document.getElementById('hangmanImage');

  if (word.includes(letter)) {
    const wordDisplay = wordContainer.textContent.split(' ');
    for (let i = 0; i < word.length; i++) {
      if (word[i] === letter) {
        wordDisplay[i] = letter;
        remainingLetters--;
      }
    }
    wordContainer.textContent = wordDisplay.join(' ');
  } else {
    wrongLetters.push(letter);
    remainingAttempts--;
    wrongLettersDiv.textContent = `Wrong letters: ${wrongLetters.join(', ')}`;
    hangmanImage.src = `images/${6 - remainingAttempts}.png`;
  }

  checkGameStatus();
}

function checkGameStatus() {
  const messageDiv = document.getElementById('message');
  const playAgainButton = document.getElementById('playAgainButton');
  const lettersDiv = document.getElementById('letters');

  if (remainingLetters === 0) {
    messageDiv.textContent = 'You win! Click "Play Again" to restart.';
    disableButtons();
    playAgainButton.style.display = 'block';
  } else if (remainingAttempts === 0) {
    messageDiv.textContent = `You lose! The word was "${word}". Click "Play Again" to restart.`;
    disableButtons();
    playAgainButton.style.display = 'block';
  }
}

function disableButtons() {
  const buttons = document.getElementById('letters').getElementsByTagName('button');
  for (let button of buttons) {
    button.disabled = true;
  }
}
