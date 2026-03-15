const rounds = [
  {
    promptImage: "ROMPIENDO MITOS-PREVIEW_page-0001.jpg",
    answerImage: "ROMPIENDO MITOS-PREVIEW_page-0002.jpg",
    correctAnswer: false,
    hotspots: {
      true: { left: 3.2, top: 48.5, width: 27.5, height: 31.5 },
      false: { left: 76.8, top: 48.2, width: 20.5, height: 31.8 }
    }
  },
  {
    promptImage: "ROMPIENDO MITOS-PREVIEW_page-0004.jpg",
    answerImage: "ROMPIENDO MITOS-PREVIEW_page-0003.jpg",
    correctAnswer: true,
    hotspots: {
      true: { left: 3.5, top: 48.4, width: 27.8, height: 32.2 },
      false: { left: 76.6, top: 48.2, width: 20.8, height: 31.9 }
    }
  }
];

const stage = document.querySelector("#stage");
const questionScreen = document.querySelector("#questionScreen");
const gameScreen = document.querySelector("#gameScreen");
const stageWelcome = document.querySelector("#stageWelcome");
const stageImage = document.querySelector("#stageImage");
const trueHotspot = document.querySelector("#trueHotspot");
const falseHotspot = document.querySelector("#falseHotspot");
const nextHotspot = document.querySelector("#nextHotspot");
const burst = document.querySelector("#burst");
const progressLabel = document.querySelector("#progressLabel");
const scoreLabel = document.querySelector("#scoreLabel");
const stageKicker = document.querySelector("#stageKicker");
const stageMarqueeTitle = document.querySelector("#stageMarqueeTitle");
const questionButtons = document.querySelectorAll(".question-card[data-round]");

let currentRound = null;
let score = 0;
let waitingNext = false;
const playedRounds = new Set();

function animateStageImage() {
  stageImage.classList.remove("is-animating");
  void stageImage.offsetWidth;
  stageImage.classList.add("is-animating");
}

function applyHotspotPosition(element, rect) {
  element.style.left = `${rect.left}%`;
  element.style.top = `${rect.top}%`;
  element.style.width = `${rect.width}%`;
  element.style.height = `${rect.height}%`;
}

function clearAnswerEffects() {
  burst.classList.add("hidden");
  burst.classList.remove("is-correct", "is-wrong");
}

function playAnswerEffects(isCorrect) {
  clearAnswerEffects();
  void burst.offsetWidth;
  burst.classList.remove("hidden");
  burst.classList.add(isCorrect ? "is-correct" : "is-wrong");

  window.setTimeout(() => {
    clearAnswerEffects();
  }, 850);
}

function updateQuestionButtons() {
  questionButtons.forEach((button) => {
    const roundIndex = Number(button.dataset.round);
    button.classList.toggle("is-played", playedRounds.has(roundIndex));
    button.classList.toggle("is-current", roundIndex === currentRound && !waitingNext);
  });
}

function updateHud() {
  progressLabel.textContent = currentRound === null
    ? "Elige una pregunta"
    : `Pregunta ${currentRound + 1}`;
  scoreLabel.textContent = `Puntaje: ${score}`;
}

function showQuestionScreen() {
  questionScreen.classList.remove("hidden");
  gameScreen.classList.add("hidden");
}

function showGameScreen() {
  questionScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
}

function showWelcome() {
  currentRound = null;
  waitingNext = false;
  clearAnswerEffects();
  showQuestionScreen();
  stageWelcome.classList.add("hidden");
  stageImage.classList.add("hidden");
  trueHotspot.classList.add("hidden");
  falseHotspot.classList.add("hidden");
  nextHotspot.classList.add("hidden");
  stageKicker.textContent = "Listo para jugar";
  stageMarqueeTitle.textContent = "Elige una pregunta";
  updateQuestionButtons();
  updateHud();
}

function startRound(roundIndex) {
  currentRound = roundIndex;
  waitingNext = false;
  showGameScreen();
  renderRound();
}

function renderRound() {
  const round = rounds[currentRound];

  stageWelcome.classList.add("hidden");
  stageImage.classList.remove("hidden");
  stageImage.src = round.promptImage;
  stageImage.alt = `Pregunta ${currentRound + 1} del juego Rompiendo Mitos`;
  animateStageImage();

  applyHotspotPosition(trueHotspot, round.hotspots.true);
  applyHotspotPosition(falseHotspot, round.hotspots.false);

  trueHotspot.disabled = false;
  falseHotspot.disabled = false;
  trueHotspot.classList.remove("hidden");
  falseHotspot.classList.remove("hidden");
  nextHotspot.classList.add("hidden");

  stageKicker.textContent = "Pregunta activa";
  stageMarqueeTitle.textContent = `Pregunta ${currentRound + 1}`;
  updateQuestionButtons();
  updateHud();
}

function showAnswer(selectedAnswer) {
  const round = rounds[currentRound];
  const isCorrect = selectedAnswer === round.correctAnswer;

  if (isCorrect) {
    score += 1;
  }

  playedRounds.add(currentRound);
  waitingNext = true;

  stageImage.src = round.answerImage;
  stageImage.alt = `Respuesta de la pregunta ${currentRound + 1}`;
  animateStageImage();

  trueHotspot.disabled = true;
  falseHotspot.disabled = true;
  trueHotspot.classList.add("hidden");
  falseHotspot.classList.add("hidden");
  nextHotspot.classList.remove("hidden");

  stageKicker.textContent = isCorrect ? "Respuesta correcta" : "Respuesta revisada";
  stageMarqueeTitle.textContent = "Toca la imagen para volver a elegir";
  playAnswerEffects(isCorrect);
  updateQuestionButtons();
  updateHud();
}

function handleAnswer(answer) {
  if (currentRound === null || waitingNext) {
    return;
  }

  showAnswer(answer);
}

function goNext() {
  if (!waitingNext) {
    return;
  }

  showWelcome();
}

trueHotspot.addEventListener("click", () => handleAnswer(true));
falseHotspot.addEventListener("click", () => handleAnswer(false));
nextHotspot.addEventListener("click", goNext);

questionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    startRound(Number(button.dataset.round));
  });
});

showWelcome();