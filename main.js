let typeTest = document.getElementById("type_test");
let timerElement = document.getElementById("timer");
let gameActive = false;
let settings_bar = document.getElementById("settings");
let settingButtons = document.querySelectorAll(".setting_buttons");
let keyListenerEnabled = true;
let language_button = document.getElementById("test_language");
let startTime;
let wordLength = 5;
let timerInterval;
let correctChar;
let incorrectChar;
let currentCategory = "time";
let testTime;
let currentIndex;

document.addEventListener("keypress", (event) => {
  if (event.keyCode === 32 && keyListenerEnabled) {
    if (!gameActive) {
      startGame();
    }
  }
});

language_button.addEventListener("click", () => {
  if (language_button.innerText == "english") {
    language_button.innerHTML =
      '<i class="fa-solid fa-earth-americas fa-xl"></i>danish';
  } else {
    language_button.innerHTML =
      '<i class="fa-solid fa-earth-americas fa-xl"></i>english';
  }
  if (gameActive) {
    fillWords();
  }
});

document.addEventListener("keydown", checkWords);

settingButtons.forEach((btn) => {
  let wordCounts = [25, 50, 75, 100];
  let times = [5, 15, 30, 60];
  btn.addEventListener("click", function () {
    if (btn.classList[1] == "type") {
      document.querySelectorAll(".type").forEach((b) => {
        b.classList.remove("active");
      });
      if (btn.classList[2] !== "active") {
        btn.classList.add("active");
        currentCategory = btn.innerText;
        if (btn.innerText == "words") {
          document
            .querySelectorAll(".setting_buttons.time")
            .forEach((val, index) => {
              val.querySelector("span").innerHTML = wordCounts[index];
            });
        }
        if (btn.innerText == "time") {
          document
            .querySelectorAll(".setting_buttons.time")
            .forEach((val, index) => {
              val.querySelector("span").innerHTML = times[index];
            });
        }
        if (gameActive) {
          fillWords();
        }
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
        let newTime = btn.childNodes[1].innerHTML;
        if (gameActive) {
          timerElement.innerHTML = newTime;
          fillWords();
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
  testTime = document.querySelector(".setting_buttons.time.active")
    .childNodes[1].innerHTML;
  timerElement.textContent = testTime;
  fetch(`/data?category=${language_button.innerText}`)
    .then((response) => response.json())
    .then((words) => {
      typeTest.innerHTML = "";
      if (currentCategory == "time") {
        for (let i = 0; i < 30; i++) {
          let random = Math.floor(Math.random() * words.length);
          for (let j = 0; j < words[random].length; j++) {
            let char = document.createElement("span");
            char.innerHTML = words[random][j];
            typeTest.append(char);
          }
          let char = document.createElement("span");
          char.innerHTML = " ";
          typeTest.append(char);
        }
        typeTest.children[0].classList.add("active_char");
      }
      if (currentCategory == "words") {
        for (let i = 0; i < testTime; i++) {
          let random = Math.floor(Math.random() * words.length);
          for (let j = 0; j < words[random].length; j++) {
            let char = document.createElement("span");
            char.innerHTML = words[random][j];
            typeTest.append(char);
          }
          let char = document.createElement("span");
          char.innerHTML = " ";
          typeTest.append(char);
        }
        typeTest.children[0].classList.add("active_char");
      }
    });
}

function checkWords(event) {
  let currentChar = typeTest.innerText[currentIndex];
  let nextElement = typeTest.children[currentIndex + 1];
  let currentElement = typeTest.children[currentIndex];
  let previousElement = typeTest.children[currentIndex - 1];

  if (gameActive) {
    settings_bar.style.opacity = "0";
    language_button.style.opacity = "0";

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
        if (currentCategory == "time") {
          typeTest.innerHTML = "";
          fillWords();
          currentIndex = 0;
        }
      }
    }
  }
}

function updateTimer(startTime) {
  let timerInterval;

  if (currentCategory == "time") {
    timerInterval = setInterval(() => {
      let currentTime = new Date();
      let elapsedTime = (currentTime - startTime) / 1000;
      let remainingTime = testTime - elapsedTime;

      if (remainingTime <= 0) {
        clearInterval(timerInterval);

        gameActive = false;
        keyListenerEnabled = false;

        gameDone();

        setTimeout(() => {
          keyListenerEnabled = true;
          timerElement.textContent = "Press space for restart";
        }, 1200);

        return;
      }
      timerElement.textContent = remainingTime.toFixed(2);
    }, 1);
  }

  if (currentCategory == "words") {
    timerInterval = setInterval(() => {
      let currentTime = new Date();

      let elapsedTime = (currentTime - startTime) / 1000;
      timerElement.textContent = elapsedTime.toFixed(2);

      if (currentIndex == typeTest.innerText.length) {
        clearInterval(timerInterval);

        gameActive = false;
        keyListenerEnabled = false;
        gameDone();

        setTimeout(() => {
          keyListenerEnabled = true;
          timerElement.textContent = "Press space for restart";
        }, 1200);
      }
    }, 1);
  }
}

function gameDone() {
  let accElement = document.getElementById("acc");
  let testTypeElement = document.getElementById("testType");
  let wpmElement = document.getElementById("wpm");
  let statCharactersElement = document.getElementById("stat_characters");
  let statTimeElement = document.getElementById("stat_time");
  let gameResultElement = document.getElementById("game_result");
  let wpm;
  let accuracy = ((correctChar / (incorrectChar + correctChar)) * 100).toFixed(
    0
  );

  if (currentCategory == "time") {
    wpm = ((correctChar / wordLength / testTime) * 60).toFixed(0);
  }
  if (currentCategory == "words") {
    wpm = ((testTime / timerElement.textContent) * 60).toFixed(0);
  }

  let score = {
    wpm: wpm,
    category: currentCategory,
    language: language_button.innerText,
    time: testTime,
    correctChar: correctChar,
    incorrectChar: incorrectChar,
    accuracy: accuracy,
  };

  fetch("/postScore", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(score),
  })
    .then((response) => {
      if (response.ok) {
        console.log("Score posted successfully");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  createScoreElement();

  typeTest.innerHTML = `${wpm}wpm`;
  wpmElement.innerHTML = wpm;
  testTypeElement.innerHTML = `${currentCategory} ${testTime}s<br>${language_button.innerText}`;
  accElement.innerHTML = `${accuracy}%`;
  statCharactersElement.innerHTML = `${correctChar}/${incorrectChar}`;
  statTimeElement.innerHTML =
    currentCategory === "time"
      ? `${testTime}s`
      : `${timerElement.textContent}s`;

  settings_bar.style.opacity = "1";
  language_button.style.opacity = "1";
  gameResultElement.style.display = "flex";
}

function createScoreElement() {
  let all_results = document.getElementById("all_results");

  fetch("getScores")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((score) => {
        let list_score = document.createElement("li");
        list_score.innerHTML = `${score.wpm}, ${score.category},${score.language},${score.time},${score.accuracy}`;
        all_results.append(list_score);
      });
    });
}
