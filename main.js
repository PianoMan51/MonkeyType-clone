let typeTest = document.getElementById("type_test");
let timerElement = document.getElementById("timer");
let gameActive = false;
let settings_bar = document.getElementById("settings");
let scoreboard = JSON.parse(localStorage.getItem("scoreboard")) || [];
let settingButtons = document.querySelectorAll(".setting_buttons");
let keyListenerEnabled = true;
let startTime;
let wordLength = 5;
let timerInterval;
let correctChar;
let incorrectChar;

let testTime;
let currentIndex;

document.addEventListener("keypress", (event) => {
  if (event.keyCode === 32 && keyListenerEnabled) {
    if (!gameActive) {
      console.log("Start");
      startGame();
    }
  }
});

document.addEventListener("keydown", checkWords);

settingButtons.forEach((btn) => {
  btn.addEventListener("click", function () {
    if (btn.classList[1] == "type") {
      document.querySelectorAll(".type").forEach((b) => {
        b.classList.remove("active");
      });
      if (btn.classList[2] !== "active") {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    }
    if (btn.classList[1] == "time") {
      document.querySelectorAll(".time").forEach((b) => {
        b.classList.remove("active");
      });
      if (btn.classList[2] !== "active") {
        btn.classList.add("active");
        let newTime = btn.childNodes[1].getAttribute("value");
        if (gameActive) {
          timerElement.innerHTML = newTime;
        }
        testTime = newTime;
      } else {
        btn.classList.remove("active");
      }
    }
  });
});

function startGame() {
  gameActive = true;
  startTime = null;
  correctChar = 0;
  incorrectChar = 0;
  accuracy = 0;
  currentIndex = 0;
  clearInterval(timerInterval);
  document.getElementById("game_result").style.display = "none";
  fillWords();
}

function fillWords() {
  testTime = document
    .querySelector(".setting_buttons.time.active")
    .childNodes[1].getAttribute("value");
  timerElement.textContent = testTime;
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
    settings_bar.style.opacity = "0";

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
          incorrectChar++;
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
      let accuracy = (correctChar / (incorrectChar + correctChar)) * 100;
      typeTest.innerHTML = score + "wpm";
      document.getElementById("wpm").innerHTML = score;
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

      gameActive = false;
      settings_bar.style.opacity = "1";

      keyListenerEnabled = false;
      console.log("Wait two seconds");
      document.getElementById(
        "testType"
      ).innerHTML = `time ${testTime}<br> english`;
      document.getElementById("acc").innerHTML = `${Math.trunc(accuracy)}%`;
      document.getElementById("game_result").style.display = "flex";
      document.getElementById(
        "stat_characters"
      ).innerHTML = `${correctChar}/${incorrectChar}`;
      document.getElementById("stat_time").innerHTML = `${testTime}s`;
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
