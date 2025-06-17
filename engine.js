const state = {
  view: {
    squares: document.querySelectorAll('.square'),
    enemy: document.querySelector('.enemy'),
    timeLeft: document.querySelector('#time-left'),
    score: document.querySelector('#score'),
  },
  values: {
    gameVelocity: 1000,
    hitPosition: 0,
    result: 0,  
    currentTime: 60,
  },
  actions: {
    timerID: setInterval(randomSquare, 1000),
    countDonwTimerID: setInterval(countDonw, 1000),
  },
  audio: {
    backgroundMusic: new Audio('../src/audios/background_music.mp3'),
    gameOverMusic: new Audio('../src/audios/game_over.mp3') 
  }
};

function countDonw(){
  state.values.currentTime--;
  state.view.timeLeft.textContent = state.values.currentTime;

  if(state.values.currentTime < 0){

    state.audio.backgroundMusic.pause();
    state.audio.backgroundMusic.currentTime = 0;

    state.audio.gameOverMusic.volume = 0.5;
    state.audio.gameOverMusic.play();

    clearInterval(state.actions.timerID);
    clearInterval(state.actions.countDonwTimerID);
    document.getElementById("final-score").textContent = `Sua pontuação: ${state.values.result}`;
    document.getElementById("game-over-screen").style.display = "flex";
    let bestScore = localStorage.getItem('bestScore') || 0;

    // Comparar e salvar o novo melhor score
    if (state.values.result > bestScore) {
      localStorage.setItem('bestScore', state.values.result);
      bestScore = state.values.result; // atualizar na variável
      alert(`🏆 Novo Recorde! Seu score foi ${state.values.result}`);
    } else {
      alert(`Game Over! Seu score foi ${state.values.result}. Recorde: ${bestScore}`);
    }
  }
}
state.audio.backgroundMusic.volume = 0.2;
state.audio.backgroundMusic.loop = true;

function playSound(AudioName){
  let audio = new Audio(`../src/audios/${AudioName}.m4a`);
  audio.volume = 0.2;
  audio.play();
}

function randomSquare() {
  state.view.squares.forEach((square) => {
    square.classList.remove("enemy");
  });

  let randomNumber = Math.floor(Math.random() * 9);
  let randomSquare = state.view.squares[randomNumber];
  randomSquare.classList.add("enemy");
  state.values.hitPosition = randomSquare.id;
}

function addListenHitBox() {
  state.view.squares.forEach((square) => {
    square.addEventListener('mousedown', () => {
      if(square.id == state.values.hitPosition){
      state.values.result++;
      state.view.score.textContent = state.values.result;
      state.values.hitPosition = null;
      playSound('hit');
      }
    });
  });
}

function createGameOverScreen() {
  const gameOverScreen = document.createElement("div");
  gameOverScreen.id = "game-over-screen";
  gameOverScreen.style = `
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background-image: url("../images/wall.png");
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
    display: none;
  `;

  const gameOverBox = document.createElement("div");
  gameOverBox.id = "game-over-box";
  gameOverBox.style = `
    background-color: white;
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 0 10px black;
  `;

  const title = document.createElement("h1");
  title.textContent = "Game Over";

  const scoreText = document.createElement("p");
  scoreText.id = "final-score";
  scoreText.textContent = "Sua pontuação: ${state.values.result}";

  const button = document.createElement("button");
  button.id = "restart-button";
  button.textContent = "Recomeçar";
  button.style = `
    margin-top: 1rem;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
  `;

  button.addEventListener("click", () => {
    location.reload();
  });

  gameOverBox.appendChild(title);
  gameOverBox.appendChild(scoreText);
  gameOverBox.appendChild(button);
  gameOverScreen.appendChild(gameOverBox);
  document.body.appendChild(gameOverScreen);
}

function init() {
  addListenHitBox();
  state.audio.backgroundMusic.play();
  createGameOverScreen();
}

init();

