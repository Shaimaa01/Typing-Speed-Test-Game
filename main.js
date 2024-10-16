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
const lvls = {
  Easy: 5,
  Normal: 3,
  Hard: 2,
};

// Default Level
let defaultLevelName = "Normal"; // change Level From Here
let defaultLevelSeconds = lvls[defaultLevelName];
let words = normalWords; // default array
let selectedLevel = defaultLevelName;
let levelChanged = false; // Track if the level was changed
let firstWordBonusApplied = false; // Track if bonus is applied

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

// Setting Level Name + Seconds + Score
lvlNameSpan.innerHTML = defaultLevelName;
secondsSpan.innerHTML = defaultLevelSeconds;
timeLeftSpan.innerHTML = defaultLevelSeconds;
scorTotal.innerHTML = words.length;

// Disable Paste Event
input.onpaste = function () {
  return false;
};

// select level
levels.addEventListener("change", function () {
  selectedLevel = this.value;
  levelChanged = true; // Mark level as changed
  if (selectedLevel == "Easy") {
    //select array
    words = easyWords;
  } else if (selectedLevel == "Normal") {
    words = normalWords;
  } else if (selectedLevel == "Hard") {
    words = hardWords;
  }
  // reset level name in page
  lvlNameSpan.innerHTML = selectedLevel;
  // reset seconds in page
  secondsSpan.innerHTML = lvls[selectedLevel];
  // reset time left in page
  timeLeftSpan.innerHTML = lvls[selectedLevel];
   // instruction update
   updateInstructions()
});

// Start Game
startButton.onclick = function () {
  this.remove();
  input.focus();
  // Generate Word Function
  genWords();
  // instruction update
  updateInstructions()
};

function genWords() {
  // Get Random Word Form Array
  let randomWord = words[Math.floor(Math.random() * words.length)];
  // Get Word Index
  let wordIndex = words.indexOf(randomWord);
  // Remove Word From Array
  words.splice(wordIndex, 1);
  // show The Random Word
  theWord.innerHTML = randomWord;
  // Empty Upcoming Words
  upcomingWords.innerHTML = " ";
  // Generate UpcomingWords
  for (let i = 0; i < words.length; i++) {
    // Create Div Element
    let div = document.createElement("div");
    let txt = document.createTextNode(words[i]);
    div.appendChild(txt);
    upcomingWords.appendChild(div);
  }

  // Call Start Play Function
  startPlay();
}

function startPlay() {
  resetTime();
  let start = setInterval(() => {
    timeLeftSpan.innerHTML--;
    if (timeLeftSpan.innerHTML === "0") {
      // Stop Timer
      clearInterval(start);
      // compare Words
      if (theWord.innerHTML.toLowerCase() === input.value.toLowerCase()) {
        // Empty Input field
        input.value = "";
        // Increase Score
        scoreGot.innerHTML++;
        if (words.length > 0) {
          // Call Generate Word Funcion
          genWords();
        } else {
          let span = document.createElement("span");
          span.className = "good";
          let spanText = document.createTextNode("Congratz");
          span.appendChild(spanText);
          finishMessage.appendChild(span);
          // Remove Upcoming Words Box
          upcomingWords.remove();
        }
      } else {
        let span = document.createElement("span");
        span.className = "bad";
        let spanText = document.createTextNode("Game Over");
        span.appendChild(spanText);
        finishMessage.appendChild(span);
      }
    }
  }, 1000);
 
}

// Function to reset time for each word

function resetTime() {
  if (levelChanged) {
    timeLeftSpan.innerHTML = lvls[selectedLevel]; // Use selected level's time
  } else {
    timeLeftSpan.innerHTML = defaultLevelSeconds; // Use default level's time
  }
  // add 3second to the first word
  if (
    !firstWordBonusApplied &&
    theWord.innerHTML !== upcomingWords.firstElementChild.textContent
  ) {
    timeLeftSpan.innerHTML = parseInt(timeLeftSpan.innerHTML) + 3;
    firstWordBonusApplied = true;
  }
}

// game insturction 
function updateInstructions() {
  const instructions = `
    Welcome to the Word Typing Game!
    - Level: ${selectedLevel}
    - Time Left: ${timeLeftSpan.innerHTML} seconds
    - Score: ${scoreGot.innerHTML} out of ${scorTotal.innerHTML}
    - Type the word shown and hit Enter to score points.
    - If you get it right, you’ll get more time for the next word!
  `;
  document.getElementById("gameInstructions").innerHTML = instructions;
}

updateInstructions()