// ---------------- WATER DEPTH VISUAL ---------------- //
const range = document.getElementById("waterRange");
const water = document.getElementById("waterLevel");

if (range && water) {
  range.addEventListener("input", () => {
    water.style.height = `${range.value}%`;
  });
}

function updateWaterLevel() {
  const h = parseFloat(document.getElementById("height").value);
  if (!isNaN(h) && h >= 0 && h <= 50) {
    water.style.height = `${Math.min(h * 3, 100)}%`;
  }
}

// ---------------- PRESSURE CALCULATOR ---------------- //
function calculatePressure() {
  const density = parseFloat(document.getElementById("density").value);
  const height = parseFloat(document.getElementById("height").value);
  const gravity = parseFloat(document.getElementById("gravity").value);

  const resultBox = document.getElementById("resultBox");
  const resultElement = document.getElementById("result");

  if (isNaN(density) || isNaN(height) || isNaN(gravity)) {
    resultElement.textContent = "Please fill all fields";
    resultElement.style.color = "#ff6b6b";
    resultBox?.classList.add("show");
    return;
  }

  const pressure = density * gravity * height;
  resultElement.textContent = `${pressure.toFixed(2)} Pa`;
  resultElement.style.color = "#2b6fecff";
  resultBox?.classList.add("show");

  // Update pressure bar visual based on pressure
  const indicator = document.getElementById("pressureIndicator");
  if (indicator) {
    indicator.style.height = `${Math.min(pressure / 2000, 100)}%`;
  }

  // Update water level visual too
  updateWaterLevel();
}

// ---------------- AUTO FORMULA TYPING ---------------- //
document.addEventListener("DOMContentLoaded", () => {
  const formulaDisplay = document.getElementById("typedFormula");
  const formula = "P = ρ × g × h";
  let i = 0;

  function typeFormula() {
    if (i < formula.length) {
      formulaDisplay.textContent += formula.charAt(i);
      i++;
      setTimeout(typeFormula, 100);
    } else {
      formulaDisplay.classList.add("typing");
    }
  }

  formulaDisplay.textContent = "";
  typeFormula();
});

// ---------------- BASIC FLUID PRESSURE FORMULA ---------------- //
document.addEventListener("DOMContentLoaded", () => {
  const formulaBasic = document.getElementById("typedFormulaBasic");
  const formulaTextBasic = "P = F / A";
  let j = 0;

  function typeBasicFormula() {
    if (j < formulaTextBasic.length) {
      formulaBasic.textContent += formulaTextBasic.charAt(j);
      j++;
      setTimeout(typeBasicFormula, 100);
    } else {
      formulaBasic.classList.add("typing");
    }
  }

  if (formulaBasic) {
    formulaBasic.textContent = "";
    typeBasicFormula();
  }
});

// ---------------- BASIC FLUID PRESSURE CALCULATOR ---------------- //
function calculateBasicPressure() {
  const force = parseFloat(document.getElementById("force").value);
  const area = parseFloat(document.getElementById("area").value);
  const resultBox = document.getElementById("resultBoxBasic");
  const resultElement = document.getElementById("resultBasic");

  if (isNaN(force) || isNaN(area) || area === 0) {
    resultElement.textContent = "Please enter valid numbers";
    resultElement.style.color = "#ff6b6b";
    resultBox.classList.add("show");
    return;
  }

  const pressure = force / area;
  resultElement.textContent = `${pressure.toFixed(2)} Pa`;
  resultElement.style.color = "#2b6fec";
  resultBox.classList.add("show");
}

// --- Interactive Model for Fluid Pressure ---
function updateInteractiveModel(pressure) {
  const piston = document.getElementById("piston");
  const fluid = document.getElementById("fluid");
  const label = document.getElementById("pressureLabel");

  // Normalize pressure for visualization (limit movement)
  let level = Math.min(Math.max(pressure / 200, 0.1), 1); // scaled 0.1–1.0
  let pistonMove = 20 + (1 - level) * 120; // piston height
  let fluidHeight = level * 100; // percentage of fluid fill

  // Update visuals
  piston.style.top = `${pistonMove}px`;
  fluid.style.height = `${fluidHeight}%`;
  label.textContent = `Pressure level: ${pressure.toFixed(2)} Pa`;

  // Color feedback
  if (pressure < 50) {
    fluid.style.background = "linear-gradient(180deg, #66ccff, #99ddff)";
  } else if (pressure < 200) {
    fluid.style.background = "linear-gradient(180deg, #3b8aff, #66ccff)";
  } else {
    fluid.style.background = "linear-gradient(180deg, #2b6fec, #0044cc)";
  }
}

// Modify calculator to trigger animation
function calculateBasicPressure() {
  const force = parseFloat(document.getElementById("force").value);
  const area = parseFloat(document.getElementById("area").value);
  const resultBox = document.getElementById("resultBoxBasic");
  const resultElement = document.getElementById("resultBasic");

  if (isNaN(force) || isNaN(area) || area === 0) {
    resultElement.textContent = "Please enter valid numbers";
    resultElement.style.color = "#ff6b6b";
    resultBox.classList.add("show");
    updateInteractiveModel(0);
    return;
  }

  const pressure = force / area;
  resultElement.textContent = `${pressure.toFixed(2)} Pa`;
  resultElement.style.color = "#2b6fec";
  resultBox.classList.add("show");

  // Update the model
  updateInteractiveModel(pressure);
}

