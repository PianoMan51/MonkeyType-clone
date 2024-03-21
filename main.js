let type_test = document.getElementById("type_test");
let timerElement = document.getElementById("timer");
let game_active = false;
let startTime;
let timerInterval;

fillWords();

document.addEventListener("keypress", (event) => {
  if (game_active == false) {
    if (event.keyCode === 32) {
      game_active = true;
      startTime = new Date();
      checkWords(startTime);
      document.querySelector("#press_start").style.opacity = "0.3";
      document.querySelector("#timer").style.opacity = "1";
      updateTimer();
    }
  }
});

function fillWords() {
  fetch("/words.json")
    .then((response) => response.json())
    .then((words) => {
      for (let i = 0; i < 10; i++) {
        let random = Math.floor(Math.random() * 979);
        for (let j = 0; j < words[random].length; j++) {
          let char = document.createElement("span");
          char.innerHTML = words[random][j];
          type_test.append(char);
        }
        let char = document.createElement("span");
        char.innerHTML = " ";
        type_test.append(char);
      }
      type_test.children[0].classList.add("active_char");
    });
}

function checkWords() {
  let current_char = 0;
  type_test.children[0].classList.add("active_char");
  document.addEventListener("keydown", (event) => {
    if (event.key === type_test.innerText[current_char]) {
      type_test.children[current_char + 1].classList.add("active_char");
      type_test.children[current_char].style.color = "rgba(236, 240, 241, 1)";
      type_test.children[current_char].classList.remove("active_char");
      current_char++;
    } else {
      type_test.children[current_char].style.color = "#e74c3c";
    }
    if (current_char == type_test.children.length - 1) {
      type_test.innerHTML = "";
      fillWords();
      current_char = 0;
    }
  });
}

function updateTimer() {
  let totalTime = 30;
  timerInterval = setInterval(() => {
    let currentTime = new Date();
    let elapsedTime = (currentTime - startTime) / 1000;
    let remainingTime = totalTime - elapsedTime;
    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      timerElement.textContent = "0.00";
      return;
    }
    timerElement.textContent = `${remainingTime.toFixed(2)}`;
  }, 1);
}
