const QUOTES = [
  "Mastering vanilla JavaScript gives you complete control over the browser Document Object Model without relying on heavy frameworks.",
  "Clean code always looks like it was written by someone who cares deeply about clarity, structure, and maintainability.",
  "Every great web application starts with semantic markup, well-organized stylesheets, and predictable event-driven logic.",
  "Consistent daily practice builds muscle memory, allowing your fingers to translate thoughts into code effortlessly.",
  "Debugging is twice as hard as writing the code in the first place, so keep your functions small and focused."
];

const MAX_TIME = 60;
let timeLeft = MAX_TIME;
let timer = null;
let isTyping = false;
let mistakes = 0;

const quoteDisplay = document.getElementById("quote-display");
const quoteInput = document.getElementById("quote-input");
const timeDisplay = document.getElementById("time-display");
const mistakesDisplay = document.getElementById("mistakes-display");
const wpmDisplay = document.getElementById("wpm-display");
const accuracyDisplay = document.getElementById("accuracy-display");
const restartBtn = document.getElementById("restart-btn");
const modalRestartBtn = document.getElementById("modal-restart-btn");
const resultModal = document.getElementById("result-modal");
const finalSummary = document.getElementById("final-summary");

function loadRandomQuote() {
  const randomIndex = Math.floor(Math.random() * QUOTES.length);
  const selectedQuote = QUOTES[randomIndex];
  quoteDisplay.innerHTML = "";

  selectedQuote.split("").forEach((char, idx) => {
    const span = document.createElement("span");
    span.innerText = char;
    if (idx === 0) span.classList.add("active");
    quoteDisplay.appendChild(span);
  });
}

function updateMetrics() {
  const totalTyped = quoteInput.value.length;
  const timeElapsedInMinutes = (MAX_TIME - timeLeft) / 60;

  let netWpm = 0;
  if (timeElapsedInMinutes > 0) {
    netWpm = Math.round(((totalTyped - mistakes) / 5) / timeElapsedInMinutes);
  }
  if (netWpm < 0 || Number.isNaN(netWpm)) {
    netWpm = 0;
  }

  let accuracy = 100;
  if (totalTyped > 0) {
    const correctChars = Math.max(0, totalTyped - mistakes);
    accuracy = Math.round((correctChars / totalTyped) * 100);
  }

  mistakesDisplay.textContent = mistakes;
  wpmDisplay.textContent = netWpm;
  accuracyDisplay.textContent = `${accuracy}%`;
}

function finishGame() {
  clearInterval(timer);
  timer = null;
  quoteInput.disabled = true;
  updateMetrics();

  finalSummary.textContent = `You typed at ${wpmDisplay.textContent} WPM with ${accuracyDisplay.textContent} accuracy and ${mistakes} mistake(s).`;
  resultModal.classList.remove("hidden");
}

function updateTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    timeDisplay.textContent = `${timeLeft}s`;
    updateMetrics();
  } else {
    finishGame();
  }
}

function handleInput() {
  const spanArray = quoteDisplay.querySelectorAll("span");
  const userTyped = quoteInput.value;

  if (!isTyping && userTyped.length > 0) {
    isTyping = true;
    timer = setInterval(updateTimer, 1000);
  }

  mistakes = 0;

  spanArray.forEach((span, index) => {
    const char = userTyped[index];
    span.classList.remove("correct", "incorrect", "active");

    if (char == null) {
      if (index === userTyped.length) {
        span.classList.add("active");
      }
    } else if (char === span.innerText) {
      span.classList.add("correct");
    } else {
      span.classList.add("incorrect");
      mistakes++;
    }
  });

  updateMetrics();

  if (userTyped.length >= spanArray.length) {
    finishGame();
  }
}

function initGame() {
  clearInterval(timer);
  timer = null;
  timeLeft = MAX_TIME;
  isTyping = false;
  mistakes = 0;

  quoteInput.value = "";
  quoteInput.disabled = false;
  timeDisplay.textContent = `${MAX_TIME}s`;
  mistakesDisplay.textContent = "0";
  wpmDisplay.textContent = "0";
  accuracyDisplay.textContent = "100%";
  resultModal.classList.add("hidden");

  loadRandomQuote();
  quoteInput.focus();
}

quoteInput.addEventListener("input", handleInput);
restartBtn.addEventListener("click", initGame);
modalRestartBtn.addEventListener("click", initGame);

initGame();