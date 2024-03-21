let type_test = document.getElementById("type_test");
let game_active = false;
let scoreCount = document.getElementById("score");
let missCount = document.getElementById("miss");

fillWords();

document.addEventListener("keypress", (event) => {
  if (game_active == false) {
    if (event.keyCode === 32) {
      game_active = !game_active;
      checkWords();
    }
  }
});

function fillWords() {
  fetch("/words.json")
    .then((response) => response.json())
    .then((words) => {
      for (let i = 0; i < 5; i++) {
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
    });
}

function checkWords() {
  let score = 0;
  let miss = 0;
  let current_char = 0;

  document.addEventListener("keydown", (event) => {
    if (event.key === type_test.innerText[current_char]) {
      type_test.children[current_char + 1].classList.add("active_char");
      type_test.children[current_char].style.color = "rgba(236, 240, 241, 1)";
      type_test.children[current_char].classList.remove("active_char");
      current_char++;
      score++;
      scoreCount.innerHTML = score;
    } else {
      type_test.children[current_char].style.color = "#e74c3c";
      miss++;
      missCount.innerHTML = miss;
    }
    console.log(current_char, type_test.children.length);
    if (current_char == type_test.children.length - 1) {
      type_test.innerHTML = "";
      fillWords();
      current_char = 0;
    }
  });
}
