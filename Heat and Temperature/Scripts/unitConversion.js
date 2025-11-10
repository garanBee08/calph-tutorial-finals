document.addEventListener("DOMContentLoaded", () => {
  // DOM elements based on your HTML
  const inputField = document.getElementById("celsiusInput");
  const computeBtn = document.querySelector(".compute");
  const resetBtn = document.querySelector(".reset");
  const answerField = document.querySelector(".finalAnswer");
  const inputName = document.querySelector(".inputName");
  const cToF = document.getElementById("special");
  const fToC = document.getElementById("special2");

  let mode = "CtoF"; // default mode

  // Change conversion mode
  cToF.addEventListener("click", (e) => {
    e.preventDefault();
    mode = "CtoF";
    inputName.textContent = "Degree Celsius";
    inputField.placeholder = "Enter temperature in °C";
    answerField.textContent = "—";
  });
  // Compute button
  computeBtn.addEventListener("click", () => {
    const value = parseFloat(inputField.value);

    if (isNaN(value)) {
      answerField.textContent = "Please enter a valid number.";
      return;
    }

    let result;
    if (mode === "CtoF") {
      result = (value * 9 / 5) + 32;
      answerField.textContent = `${result.toFixed(2)} °F`;
    }
  });

  // Reset button
  resetBtn.addEventListener("click", () => {
    inputField.value = "";
    answerField.textContent = "—";
  });
});
