// Select all the needed elements
const inputField = document.getElementById("celsiusInput");
const computeBtn = document.querySelector(".compute");
const resetBtn = document.querySelector(".reset");
const finalAnswer = document.querySelector(".finalAnswer");

// Kelvin to Celsius formula: °C = K - 273.15
function kelvinToCelsius(kelvin) {
  return (kelvin - 273.15).toFixed(2);
}

// Compute button functionality
computeBtn.addEventListener("click", () => {
  const kelvin = parseFloat(inputField.value);

  if (isNaN(kelvin)) {
    finalAnswer.textContent = "Please enter a valid number.";
    finalAnswer.style.color = "white";
    return;
  }

  const celsius = kelvinToCelsius(kelvin);
  finalAnswer.textContent = `${celsius} °C`;
  finalAnswer.style.color = "white";
});

// Reset button functionality
resetBtn.addEventListener("click", () => {
  inputField.value = "";
  finalAnswer.textContent = "—";
  finalAnswer.style.color = "white";
});
