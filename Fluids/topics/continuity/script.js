function calculateContinuity() {
  let A1 = parseFloat(document.getElementById("area1").value);
  let V1 = parseFloat(document.getElementById("velocity1").value);
  let A2 = parseFloat(document.getElementById("area2").value);

  if (!A1 || !V1 || !A2) {
    document.getElementById("result").textContent = "Incomplete Input";
    return;
  }

  let V2 = (A1 * V1) / A2;
  document.getElementById("result").textContent = V2.toFixed(2) + " m/s";

  updateFlowSpeed(V2);
}

function updateFlowSpeed(speed) {
  let container = document.getElementById("flow-arrows");
  container.innerHTML = ""; 

  let numArrows = 8;
  for (let i = 0; i < numArrows; i++) {
    let arrow = document.createElement("div");
    arrow.classList.add("arrow");
    arrow.textContent = "➤";
    arrow.style.animationDuration = (2 / speed) + "s"; 
    container.appendChild(arrow);
  }
}

// Show smooth result reveal
function calculateContinuity() {
  let A1 = parseFloat(document.getElementById("area1").value);
  let V1 = parseFloat(document.getElementById("velocity1").value);
  let A2 = parseFloat(document.getElementById("area2").value);
  const resultBox = document.getElementById("result-box");

  if (!A1 || !V1 || !A2) {
    document.getElementById("result").textContent = "Incomplete Input";
    resultBox.classList.add("show");
    return;
  }

  let V2 = (A1 * V1) / A2;
  document.getElementById("result").textContent = V2.toFixed(2) + " m/s";
  resultBox.classList.add("show");
  resultBox.style.animation = "fadeIn 0.5s ease";

  updateFlowSpeed(V2);
}

function updateFlowSpeed(speed) {
  let container = document.getElementById("flow-arrows");
  container.innerHTML = ""; 

  let numArrows = 8;
  for (let i = 0; i < numArrows; i++) {
    let arrow = document.createElement("div");
    arrow.classList.add("arrow");
    arrow.textContent = "➤";
    arrow.style.animationDuration = Math.max(0.5, (2 / speed)) + "s";
    container.appendChild(arrow);
  }
}

// Fade animation
const style = document.createElement("style");
style.innerHTML = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}`;
document.head.appendChild(style);
