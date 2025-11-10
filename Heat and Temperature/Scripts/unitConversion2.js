// Select necessary elements
const inputField = document.getElementById("celsiusInput");
const computeBtn = document.querySelector(".compute");
const resetBtn = document.querySelector(".reset");
const finalAnswer = document.querySelector(".finalAnswer");

// Function to convert Fahrenheit to Celsius
function fahrenheitToCelsius(f) {
  return ((f - 32) * 5 / 9).toFixed(2);
}

// Compute button click
computeBtn.addEventListener("click", () => {
  const fahrenheit = parseFloat(inputField.value);

  if (isNaN(fahrenheit)) {
    finalAnswer.textContent = "Please enter a valid number.";
    finalAnswer.style.color = "white";
    return;
  }

  const celsius = fahrenheitToCelsius(fahrenheit);
  finalAnswer.textContent = `${celsius} °C`;
  finalAnswer.style.color = "white";
});

// Reset button click
resetBtn.addEventListener("click", () => {
  inputField.value = "";
  finalAnswer.textContent = "—";
  finalAnswer.style.color = "white";
});
