function calculateBernoulli() {
  const pressure = parseFloat(document.getElementById("pressure").value);
  const density = parseFloat(document.getElementById("density").value);
  const velocity = parseFloat(document.getElementById("velocity").value);
  const height = parseFloat(document.getElementById("height").value);
  const g = 9.8;

  const resultBox = document.getElementById("resultBox");
  const resultElement = document.getElementById("result");

  if (isNaN(pressure) || isNaN(density) || isNaN(velocity) || isNaN(height)) {
    resultElement.textContent = "Please fill all fields";
    resultBox.classList.add("show");
    return;
  }

  const totalEnergy = pressure + (0.5 * density * velocity ** 2) + (density * g * height);
  resultElement.textContent = `${totalEnergy.toFixed(2)} Pa`;
  resultBox.classList.add("show");

  updateFlowVisual(velocity);
}

function updateFlowVisual(v) {
  const fluidPath = document.getElementById("fluidPath");

  const minWidth = 10;
  const maxWidth = 30;

  let newWidth = maxWidth - v * 1.5;
  if (newWidth < minWidth) newWidth = minWidth;

  fluidPath.style.strokeWidth = newWidth + "px";
}


