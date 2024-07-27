// Fetch the words from the words.json file
fetch('words.json')
  .then(response => response.json())
  .then(data => {
    const words = data.words;
    startGame(words);
  });

function startGame(words) {
  const word = words[Math.floor(Math.random() * words.length)];
  const wordContainer = document.getElementById('wordContainer');
  const lettersDiv = document.getElementById('letters');
  const wrongLettersDiv = document.getElementById('wrongLetters');
  const messageDiv = document.getElementById('message');

  let guessedLetters = [];
  let wrongLetters = [];
  let remainingLetters = word.length;
  let remainingAttempts = 6; // You can adjust the number of attempts

  // Create display for the word
  const wordDisplay = Array(word.length).fill('_');
  wordContainer.textContent = wordDisplay.join(' ');

  // Create letter buttons
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  for (let char of alphabet) {
    const button = document.createElement('button');
    button.textContent = char;
    button.addEventListener('click', () => guessLetter(char));
    lettersDiv.appendChild(button);
  }

  function guessLetter(letter) {
    if (guessedLetters.includes(letter) || wrongLetters.includes(letter)) {
      return;
    }

    guessedLetters.push(letter);

    if (word.includes(letter)) {
      // Update word display
      for (let i = 0; i < word.length; i++) {
        if (word[i] === letter) {
          wordDisplay[i] = letter;
          remainingLetters--;
        }
      }
      wordContainer.textContent = wordDisplay.join(' ');
    } else {
      // Add to wrong letters and reduce attempts
      wrongLetters.push(letter);
      remainingAttempts--;
      wrongLettersDiv.textContent = `Wrong letters: ${wrongLetters.join(', ')}`;
    }

    // Check game status
    if (remainingLetters === 0) {
      messageDiv.textContent = 'You win! Reload the page to play again.';
      disableButtons();
    } else if (remainingAttempts === 0) {
      messageDiv.textContent = `You lose! The word was "${word}".`;
      disableButtons();
    }
  }

  function disableButtons() {
    const buttons = lettersDiv.getElementsByTagName('button');
    for (let button of buttons) {
      button.disabled = true;
    }
  }
}
