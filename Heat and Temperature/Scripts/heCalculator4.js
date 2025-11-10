// ===== Select elements =====
const heatInput = document.querySelector(".initial-length");
const heatUnit = document.querySelector(".initial-length-unit");

const massInput = document.querySelector(".change-temp");
const massUnit = document.querySelector(".change-temp-unit");

const cofInput = document.querySelector(".cof-value");
const cofUnit = document.querySelector(".cof-unit");

const finalAnswer = document.querySelector(".finalAnswer");

const computeBtn = document.querySelector(".compute");
const resetBtn = document.querySelector(".reset");

// ===== Unit conversion functions =====
function convertHeatToJ(value, unit) {
    value = parseFloat(value);
    if (isNaN(value)) return 0;
    switch(unit) {
        case 'm': return value;            // J
        case 'km': return value * 1000;    // kJ → J
        case 'cm': return value * 4.184;   // cal → J
        default: return value;
    }
}

function convertMassToKg(value, unit) {
    value = parseFloat(value);
    if (isNaN(value)) return 0;
    switch(unit) {
        case 'C': return value;           // kg
        case 'F': return value / 1000;    // g → kg
        case 'K': return value * 1000;    // Mg → kg
        default: return value;
    }
}

function convertCofToJperKgK(value, unit) {
    value = parseFloat(value);
    if (isNaN(value)) return 0;
    switch(unit) {
        case 'Cinv': return value;         // J/(kg·K)
        case 'Kinv': return value * 1000;  // J/(g·K) → J/(kg·K)
        case 'Finv': return value / 1000;  // J/(Mg·K) → J/(kg·K)
        default: return value;
    }
}

// ===== Compute ΔT =====
computeBtn.addEventListener("click", () => {
    const Q = convertHeatToJ(heatInput.value, heatUnit.value);
    const m = convertMassToKg(massInput.value, massUnit.value);
    const c = convertCofToJperKgK(cofInput.value, cofUnit.value);

    if (!Q || !m || !c) {
        finalAnswer.textContent = "Please enter valid numbers!";
        return;
    }

    const deltaT = Q / (m * c);
    finalAnswer.textContent = deltaT.toFixed(4) + " °C";
});

// ===== Reset function =====
resetBtn.addEventListener("click", () => {
    heatInput.value = "";
    massInput.value = "";
    cofInput.value = "";
    heatUnit.value = "m";
    massUnit.value = "C";
    cofUnit.value = "Cinv";
    finalAnswer.textContent = "—";
});
