let typeTest = document.getElementById("type_test");
let timerElement = document.getElementById("timer");
let settingsBtns = document.querySelectorAll(".time");
let scoreboard = document.getElementById("scoreboard");
let pressStart = document.querySelector("#press_start");
let gameActive = false;
let gameCount = 0;
let startTime;
let timerInterval;
let correctChar = 0;
let testTime = 30;
let currentIndex = 0;

fillWords();

document.addEventListener("keypress", (event) => {
  if (event.keyCode === 32) {
    if (!gameActive) {
      startGame();
      if ((scoreboard.style.display = "block")) {
        scoreboard.style.display = "none";
      }
    }
  }
});

settingsBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    settingsBtns.forEach((btn) => {
      btn.style.opacity = "0.1";
    });
    testTime = btn.innerHTML.substring(0, 2);
    timerElement.textContent = testTime + ":00";
    btn.style.opacity = "1";
  });
});

document.addEventListener("keydown", checkWords);

function startGame() {
  gameActive = true;
  startTime = null;
  correctChar = 0;
  currentIndex = 0;
  gameCount++;
  clearInterval(timerInterval);
  fillWords();
  pressStart.style.opacity = "0";
  document.querySelector("#timer").style.opacity = "1";
  typeTest.classList.remove("blur");
  document.getElementById("settings").style.display = "none";
}

function fillWords() {
  timerElement.textContent = testTime + ":00";
  fetch("/words.json")
    .then((response) => response.json())
    .then((words) => {
      let wordCount = 0;
      typeTest.innerHTML = "";
      for (let i = 0; i < 20; i++) {
        let random = Math.floor(Math.random() * 979);
        for (let j = 0; j < words[random].length; j++) {
          let char = document.createElement("span");
          char.innerHTML = words[random][j];
          typeTest.append(char);
          wordCount++;
        }
        let char = document.createElement("span");
        char.innerHTML = " ";
        typeTest.append(char);
      }
      typeTest.children[0].classList.add("active_char");
    });
}

function checkWords(event) {
  let currentChar = typeTest.innerText[currentIndex];
  let nextElement = typeTest.children[currentIndex + 1];
  let currentElement = typeTest.children[currentIndex];
  let previousElement = typeTest.children[currentIndex - 1];

  if (gameActive) {
    if (!startTime && event.key == typeTest.innerText[0]) {
      startTime = new Date();
      updateTimer(startTime);
    }
    if (nextElement) {
      nextElement.classList.add("active_char");
    }
    if (event.keyCode !== 8) {
      if (event.key === currentChar) {
        currentElement.style.color = "var(--white)";
        correctChar++;
      } else {
        currentElement.style.color = "var(--red)";
      }
      currentElement.classList.remove("active_char");
      currentIndex++;
    } else {
      if (currentIndex > 0) {
        currentElement.classList.remove("active_char");
        nextElement.classList.remove("active_char");
        previousElement.classList.add("active_char");
        previousElement.style.color = "var(--opaguewhite)";
        currentIndex--;
      }
    }
    if (nextElement == null) {
      typeTest.innerHTML = "";
      fillWords();
      currentIndex = 0;
    }
  }
}

function updateTimer(startTime) {
  timerInterval = setInterval(() => {
    let currentTime = new Date();
    let elapsedTime = (currentTime - startTime) / 1000;
    let remainingTime = testTime - elapsedTime;
    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      let score = ((correctChar / testTime) * 60).toFixed(0);
      let game_score = document.createElement("li");
      game_score.setAttribute("class", "gamescore");
      typeTest.innerHTML = score + "chars/m";
      game_score.innerHTML =
        "#" +
        gameCount +
        " " +
        new Date().getHours() +
        ":" +
        new Date().getMinutes() +
        " - " +
        score;
      scoreboard.append(game_score);
      pressStart.innerHTML = "Press space to restart";
      pressStart.style.opacity = "1";
      gameActive = false;
      scoreboard.style.display = "block";
      return;
    }
    timerElement.textContent = remainingTime.toFixed(2);
  }, 1);
}
