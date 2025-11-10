// Select elements
const inputField = document.getElementById("celsiusInput");
const computeBtn = document.querySelector(".compute");
const resetBtn = document.querySelector(".reset");
const finalAnswer = document.querySelector(".finalAnswer");

// Celsius to Kelvin formula: K = C + 273.15
function celsiusToKelvin(celsius) {
  return (celsius + 273.15).toFixed(2);
}

// Compute button functionality
computeBtn.addEventListener("click", () => {
  const celsius = parseFloat(inputField.value);

  if (isNaN(celsius)) {
    finalAnswer.textContent = "Please enter a valid number.";
    finalAnswer.style.color = "white";
    return;
  }

  const kelvin = celsiusToKelvin(celsius);
  finalAnswer.textContent = `${kelvin} K`;
  finalAnswer.style.color = "white";
});

// Reset button functionality
resetBtn.addEventListener("click", () => {
  inputField.value = "";
  finalAnswer.textContent = "—";
  finalAnswer.style.color = "white";
});
