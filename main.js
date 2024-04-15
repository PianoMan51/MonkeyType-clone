let typeTest = document.getElementById("type_test");
let timerElement = document.getElementById("timer");
let settingsBtns = document.querySelectorAll(".time");
let gameActive = false;
let scoreboard = JSON.parse(localStorage.getItem("scoreboard")) || [];
let keyListenerEnabled = true;
let startTime;
let wordLength = 5;
let timerInterval;
let correctChar;
let missedChar;

let testTime = 15;
let currentIndex;

document.addEventListener("keypress", (event) => {
  if (event.keyCode === 32 && keyListenerEnabled) {
    if (!gameActive) {
      console.log("Start");
      startGame();
    }
  }
});

settingsBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    settingsBtns.forEach((btn) => {
      btn.style.opacity = "0.1";
    });
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
  clearInterval(timerInterval);
  fillWords();
}

function fillWords() {
  timerElement.textContent = testTime + ":00";
  fetch("/words.json")
    .then((response) => response.json())
    .then((words) => {
      let wordCount = 0;
      typeTest.innerHTML = "";
      for (let i = 0; i < 30; i++) {
        let random = Math.floor(Math.random() * words.length);
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
    if (currentIndex == 0 && currentChar !== event.key) {
      return;
    } else {
      if (event.keyCode !== 8) {
        if (nextElement) {
          nextElement.classList.add("active_char");
        }

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
}

function updateTimer(startTime) {
  let timerInterval;

  timerInterval = setInterval(() => {
    let currentTime = new Date();
    let elapsedTime = (currentTime - startTime) / 1000;
    let remainingTime = testTime - elapsedTime;

    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      let score = ((correctChar / wordLength / testTime) * 60).toFixed(0);
      typeTest.innerHTML = score + "wpm";
      let now = new Date();

      let hours = now.getHours();
      let minutes = now.getMinutes();

      let game_score = {
        time: `${hours}:${minutes}`,
        score: score,
        testTime: testTime,
      };

      scoreboard.push(game_score);
      localStorage.setItem("scoreboard", JSON.stringify(scoreboard));

      updateScoreboard();
      gameActive = false;

      keyListenerEnabled = false;
      console.log("Wait two seconds");
      setTimeout(() => {
        keyListenerEnabled = true;
        console.log("Ready");
        timerElement.textContent = "Press space for restart";
      }, 1000);

      return;
    }

    timerElement.textContent = remainingTime.toFixed(2);
  }, 1);
}

function updateScoreboard() {
  let scoreboardUl = document.getElementById("scoreboard");
  scoreboardUl.innerHTML = ""; // Clear previous scoreboard

  scoreboard.forEach((score) => {
    const scoreItem = document.createElement("li");
    scoreItem.classList.add("gamescore");
    scoreItem.textContent = `${score.time} ${score.score} raw @${score.testTime}s`;
    scoreboardUl.appendChild(scoreItem);
  });
}

updateScoreboard();
