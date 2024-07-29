let words = [];
let guessedLetters = [];
let wrongLetters = [];
let remainingLetters = 0;
let remainingAttempts = 6;
let word = '';
let revealCount = 0; // Counter for reveal button clicks

fetch('words.json')
  .then(response => response.json())
  .then(data => {
    words = data.words;
  });

function initGame() {
  playSound('startSound'); // Play start sound when initializing the game
  word = words[Math.floor(Math.random() * words.length)];
  guessedLetters = [];
  wrongLetters = [];
  remainingLetters = word.length;
  remainingAttempts = 6;
  revealCount = 0; // Reset the counter on game initialization

  const wordContainer = document.getElementById('wordContainer');
  const lettersDiv = document.getElementById('letters');
  const wrongLettersDiv = document.getElementById('wrongLetters');
  const messageDiv = document.getElementById('message');
  const playButton = document.getElementById('playButton');
  const playAgainButton = document.getElementById('playAgainButton');
  const hangmanImage = document.getElementById('hangmanImage');
  const revealButton = document.getElementById('revealButton');

  hangmanImage.src = 'images/0.png';
  wordContainer.textContent = Array(word.length).fill('_').join(' ');
  lettersDiv.innerHTML = '';
  wrongLettersDiv.textContent = '';
  messageDiv.textContent = '';
  playButton.style.display = 'none';
  playAgainButton.style.display = 'none';
  revealButton.style.display = 'block';
  revealButton.disabled = false; // Enable the reveal button

  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  for (let char of alphabet) {
    const button = document.createElement('button');
    button.textContent = char;
    button.addEventListener('click', () => guessLetter(char));
    lettersDiv.appendChild(button);
  }

  playSound('playSound'); // Play the initial play sound
  setTimeout(() => playLoop('loopSound'), 5000); // Start playing the loop sound after 5 seconds
}

function guessLetter(letter) {
  if (guessedLetters.includes(letter) || wrongLetters.includes(letter)) {
    return;
  }

  guessedLetters.push(letter);
  const wordContainer = document.getElementById('wordContainer');
  const wrongLettersDiv = document.getElementById('wrongLetters');
  const hangmanImage = document.getElementById('hangmanImage');

  playRandomKeySound(); // Play random key sound

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

function revealLetter() {
  if (revealCount < 2) {
    const unrevealedLetters = word.split('').filter(letter => !guessedLetters.includes(letter));
    if (unrevealedLetters.length > 0) {
      const randomLetter = unrevealedLetters[Math.floor(Math.random() * unrevealedLetters.length)];
      guessLetter(randomLetter);
      revealCount++;
    }
    if (revealCount >= 2) {
      document.getElementById('revealButton').disabled = true; // Disable the reveal button after 2 uses
    }
  }
}

function checkGameStatus() {
  const messageDiv = document.getElementById('message');
  const playAgainButton = document.getElementById('playAgainButton');
  const revealButton = document.getElementById('revealButton');

  if (remainingLetters === 0) {
    messageDiv.textContent = 'You win! Click "Play Again" to restart.';
    disableButtons();
    playAgainButton.style.display = 'block';
    revealButton.style.display = 'none';
    stopLoop(); // Stop the loop sound
    playSound('correctSound'); // Play correct sound after winning
  } else if (remainingAttempts === 0) {
    messageDiv.textContent = `You lose! The word was "${word}". Click "Play Again" to restart.`;
    disableButtons();
    playAgainButton.style.display = 'block';
    revealButton.style.display = 'none';
    stopLoop(); // Stop the loop sound
    playSound('failSound'); // Play fail sound after losing
  }
}

function disableButtons() {
  const buttons = document.getElementById('letters').getElementsByTagName('button');
  for (let button of buttons) {
    button.disabled = true;
  }
  document.getElementById('revealButton').disabled = true; // Disable the reveal button
}

function playSound(soundId) {
  const sound = document.getElementById(soundId);
  if (sound) {
    sound.currentTime = 0;
    sound.play();
  }
}

function playLoop(soundId) {
  const sound = document.getElementById(soundId);
  if (sound) {
    sound.currentTime = 0;
    sound.play();
  }
}

function stopLoop() {
  const sound = document.getElementById('loopSound');
  if (sound) {
    sound.pause();
    sound.currentTime = 0;
  }
}

function playRandomKeySound() {
  const keySounds = ['keySound1', 'keySound2', 'keySound3', 'keySound4'];
  const randomSoundId = keySounds[Math.floor(Math.random() * keySounds.length)];
  playSound(randomSoundId);
}
