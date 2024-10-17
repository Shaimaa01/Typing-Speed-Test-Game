/*
  Advices
  - Always Check The Console
  - Take Your Time To Name The Identifiers
  - DRY

  Steps To Create The Project
  [01] Create HTML Markup
  [02] Add Styling And Separate From Logic
  [03] Create The App Logic
  ---- [01] Add Levels
  ---- [02] Show Level And Seconds
  ---- [03] Add Array Of Words
  ---- [04] ِAdd Start Game Button
  ---- [05] Generate Upcoming Words
  ---- [06] Disable Copy Word And Paste Event + Focus On Input
  ---- [07] Start Play Function
  ---- [08] Start The Time And Count Score
  ---- [09] Add The Error And Success Messages
  [04] Your Trainings To Add Features
  ---- [01] Save Score To Local Storage With Date
  ---- [02] Choose Levels From Select Box
  ---- [03] Break The Logic To More Functions
  ---- [04] Choose Array Of Words For Every Level
  ---- [05] Write Game Instruction With Dynamic Values
  ---- [06] Add 3 Seconds For The First Word
*/

// Array Of Words
const easyWords = ["NaN", "null", "DOM"];
const normalWords = ["class", "arrow", "loop"];
const hardWords = ["constructor", "destructuring", "undefined"];

// Setting Levels
const lvls = { Easy: 5, Normal: 3, Hard: 2 };

// Default Level
let defaultLevelName = "Normal";
let defaultLevelSeconds = lvls[defaultLevelName];
let words = normalWords;
let selectedLevel = defaultLevelName;
let levelChanged = false;
let firstWordBonusApplied = false;

// Catch Selectors
let startButton = document.querySelector(".start");
let lvlNameSpan = document.querySelector(".message .lvl");
let secondsSpan = document.querySelector(".message .seconds");
let theWord = document.querySelector(".the-word");
let upcomingWords = document.querySelector(".upcoming-words");
let input = document.querySelector(".input");
let timeLeftSpan = document.querySelector(".time span");
let scoreGot = document.querySelector(".score .got");
let scorTotal = document.querySelector(".score .total");
let finishMessage = document.querySelector(".finish");
let levels = document.getElementById("levels");

// Load Data from LocalStorage
getDataFromLocalStorage();

// Set Initial Values
lvlNameSpan.innerHTML = defaultLevelName;
secondsSpan.innerHTML = defaultLevelSeconds;
timeLeftSpan.innerHTML = defaultLevelSeconds;
scorTotal.innerHTML = words.length;

// Disable Paste Event
input.onpaste = () => false;

// Level Selection Logic
levels.addEventListener("change", function () {
  selectedLevel = this.value;
  levelChanged = true;
  words =
    selectedLevel === "Easy"
      ? easyWords
      : selectedLevel === "Hard"
      ? hardWords
      : normalWords;

  lvlNameSpan.innerHTML = selectedLevel;
  secondsSpan.innerHTML = lvls[selectedLevel];
  timeLeftSpan.innerHTML = lvls[selectedLevel];
});

// Start Game
startButton.onclick = function () {
  this.remove();
  input.focus();
  scoreGot.innerHTML = 0;
  selectedLevel = defaultLevelName;
  // Clear old messages when the game starts
  clearFinishMessage();
  genWords();
  updateInstructions();
};

function genWords() {
  let randomWord = words.splice(Math.floor(Math.random() * words.length), 1)[0];
  theWord.innerHTML = randomWord;
  upcomingWords.innerHTML = words.map((w) => `<div>${w}</div>`).join("");

  if (!firstWordBonusApplied) {
    timeLeftSpan.innerHTML = +timeLeftSpan.innerHTML + 3;
    firstWordBonusApplied = true;
  }
  startPlay();
}

function startPlay() {
  resetTime();
  let start = setInterval(() => {
    timeLeftSpan.innerHTML--;
    if (timeLeftSpan.innerHTML === "0") {
      clearInterval(start);
      if (theWord.innerHTML.toLowerCase() === input.value.toLowerCase()) {
        input.value = "";
        scoreGot.innerHTML++;
        addDataToLocalStorage();
        words.length > 0 ? genWords() : showResult("Congratz", "good");
      } else {
        showResult("Game Over", "bad");
      }
    }
  }, 1000);
}

function resetTime() {
  timeLeftSpan.innerHTML = levelChanged
    ? lvls[selectedLevel]
    : defaultLevelSeconds;
}

function updateInstructions() {
  document.getElementById("gameInstructions").innerHTML = `
    Welcome to the Word Typing Game!
    - Level: ${selectedLevel}
    - Time Left: ${timeLeftSpan.innerHTML} seconds
    - Score: ${scoreGot.innerHTML} out of ${scorTotal.innerHTML}
    - Type the word shown and hit Enter to score points.
  `;
}

function showResult(message, className) {
  let span = document.createElement("span");
  span.className = className;
  span.textContent = message;
  finishMessage.appendChild(span);
  upcomingWords.remove();
  addDataToLocalStorage();
}

function addDataToLocalStorage() {
  localStorage.setItem("score", scoreGot.innerHTML);
  localStorage.setItem("level", lvlNameSpan.innerHTML);
  localStorage.setItem("finishMessage", finishMessage.innerHTML);
}

function getDataFromLocalStorage() {
  scoreGot.innerHTML = localStorage.getItem("score") || 0;
  selectedLevel = localStorage.getItem("level") || defaultLevelName;
  lvlNameSpan.innerHTML = selectedLevel;
  finishMessage.innerHTML = localStorage.getItem("finishMessage") || "";
}

function clearFinishMessage() {
  finishMessage.innerHTML = ""; // Clear any old message
}

updateInstructions() 