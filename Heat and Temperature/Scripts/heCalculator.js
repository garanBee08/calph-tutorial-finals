const massInput = document.querySelector(".initial-length");
const massUnit = document.querySelector(".initial-length-unit");

const tempInput = document.querySelector(".change-temp");
const tempUnit = document.querySelector(".change-temp-unit");

const cInput = document.querySelector(".cof-value");
const cUnit = document.querySelector(".cof-unit");

const answerField = document.querySelector(".finalAnswer");

const computeBtn = document.querySelector(".compute");
const resetBtn = document.querySelector(".reset");

computeBtn.addEventListener("click", () => {
    let m = parseFloat(massInput.value);
    let dT = parseFloat(tempInput.value);
    let c = parseFloat(cInput.value);

    if (isNaN(m) || isNaN(dT) || isNaN(c)) {
        answerField.textContent = "Please enter valid values.";
        return;
    }

    // MASS UNIT CONVERSION → to kg
    if (massUnit.value === "g") m = m / 1000;
    if (massUnit.value === "Mg") m = m * 1000;

    // ΔT CONVERSION → to °C or K
    if (tempUnit.value === "F") dT = dT * (5 / 9);

    // SPECIFIC HEAT CAPACITY CONVERSION → to J/(kg·K)
    if (cUnit.value === "JgK") c = c * 1000;
    if (cUnit.value === "JMgK") c = c / 1000;

    // CALCULATE HEAT ENERGY
    let q = m * c * dT;

    answerField.textContent = q.toFixed(4) + " J";
});

resetBtn.addEventListener("click", () => {
    massInput.value = "";
    tempInput.value = "";
    cInput.value = "";
    answerField.textContent = "—";
});
