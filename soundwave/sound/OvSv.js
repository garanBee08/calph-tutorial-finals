const startBtn = document.getElementById("startBtn");
const car = document.getElementById("car");
const people = document.getElementById("people");
const reloadBtn = document.getElementById("reloadBtn");
const arrowLeft = document.getElementById("arrow-left");
const arrowRight = document.getElementById("arrow-right");
const arrowLeft1 = document.getElementById("arrow-left1");
const arrowRight1 = document.getElementById("arrow-right1");

const MOVEMENT_DURATION = 5000;
const OBSERVER_HOME_RIGHT = "10%";
const OBSERVER_TARGET_RIGHT = "36%";
const OBSERVER_TRANSITION = "right 5s linear";
const CAR_HOME_LEFT = "10%";
const CAR_HOME_RIGHT = "38%";
const CAR_TARGET_NEAR_HOUSE = "38%";

let poweredOn = false;
let isMoving = false;

const setObserverFacing = (direction) => {
  if (direction === "left") {
    people.classList.add("face-left");
  } else {
    people.classList.remove("face-left");
  }
};

// Power on simulation
startBtn.addEventListener("click", () => {
  poweredOn = true;
  startBtn.textContent = "Simulation Ready!";
  startBtn.style.background = "linear-gradient(135deg, #4dabf7, #5e6cff)";
  startBtn.disabled = true;
});

reloadBtn.addEventListener("click", () => {
  window.location.reload();
});

// Movement triggers for the source (car)
car.addEventListener("click", () => {
  if (poweredOn && !isMoving) moveSource("right");
});
arrowRight1.addEventListener("click", () => {
  if (poweredOn && !isMoving) moveSource("right");
});
arrowLeft.addEventListener("click", () => {
  if (poweredOn && !isMoving) moveSource("left");
});

// Movement triggers for the observer (person)
people.addEventListener("click", () => {
  if (poweredOn && !isMoving) moveObserver("left");
});
arrowLeft1.addEventListener("click", () => {
  if (poweredOn && !isMoving) moveObserver("left");
});
arrowRight.addEventListener("click", () => {
  if (poweredOn && !isMoving) moveObserver("right");
});

// Car (source) animation
function moveSource(direction) {
  isMoving = true;

  const startLeft = direction === "right" ? CAR_HOME_LEFT : CAR_HOME_RIGHT;
  const endLeft = CAR_TARGET_NEAR_HOUSE;

  car.style.transition = "none";
  car.style.left = startLeft;
  setObserverFacing(direction === "right" ? "right" : "left");

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      car.style.transition = "left 5s linear";
      car.style.left = endLeft;
      setTimeout(() => {
        setObserverFacing(direction === "right" ? "left" : "right");
      }, MOVEMENT_DURATION - 250);
    });
  });

  playDopplerSound(direction);
  setTimeout(() => {
    isMoving = false;
  }, MOVEMENT_DURATION + 100);
}

// Person (observer) animation
function moveObserver(direction) {
  isMoving = true;

  const startRight =
    direction === "left" ? OBSERVER_HOME_RIGHT : OBSERVER_TARGET_RIGHT;
  const endRight =
    direction === "left" ? OBSERVER_TARGET_RIGHT : OBSERVER_HOME_RIGHT;

  people.style.transition = "none";
  people.style.right = startRight;
  setObserverFacing(direction);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      people.style.transition = OBSERVER_TRANSITION;
      people.style.right = endRight;
      setTimeout(() => {
        setObserverFacing(direction === "left" ? "right" : "left");
      }, MOVEMENT_DURATION - 250);
    });
  });

  playDopplerSound(direction);
  setTimeout(() => {
    isMoving = false;
  }, MOVEMENT_DURATION + 100);
}

// Doppler sound effect
function playDopplerSound(direction) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = "sine";
  oscillator.connect(gain);
  gain.connect(ctx.destination);

  const baseFreq = 440; // A4
  const duration = 5;
  const steps = 50;
  let step = 0;

  oscillator.start();

  const interval = setInterval(() => {
    const t = step / steps;
    let factor;

    if (direction === "right") {
      factor = Math.cos(t * Math.PI);
    } else {
      factor = -Math.cos(t * Math.PI);
    }

    const freq = baseFreq + factor * 150;
    oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

    step++;
    if (step > steps) {
      clearInterval(interval);
      oscillator.stop();
    }
  }, (duration / steps) * 1000);
}
