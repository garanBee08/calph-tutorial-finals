// ===== Select elements =====
const heatInput = document.querySelector(".initial-length");
const heatUnit = document.querySelector(".initial-length-unit");

const tempInput = document.querySelector(".change-temp");
const tempUnit = document.querySelector(".change-temp-unit");

const massInput = document.querySelector(".cof-value");
const massUnit = document.querySelector(".cof-unit");

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

function convertDeltaTToC(deltaT, unit) {
    deltaT = parseFloat(deltaT);
    if (isNaN(deltaT)) return 0;
    switch(unit) {
        case 'C': return deltaT;           // ΔT in °C
        case 'F': return deltaT * 5/9;     // Δ°F → Δ°C
        case 'K': return deltaT;           // ΔT in K = Δ°C
        default: return deltaT;
    }
}

function convertMassToKg(value, unit) {
    value = parseFloat(value);
    if (isNaN(value)) return 0;
    switch(unit) {
        case 'Cinv': return value;         // kg
        case 'Kinv': return value / 1000;  // g → kg
        case 'Finv': return value * 1000;  // Mg → kg
        default: return value;
    }
}

// ===== Compute Specific Heat Capacity =====
computeBtn.addEventListener("click", () => {
    const Q = convertHeatToJ(heatInput.value, heatUnit.value);
    const deltaT = convertDeltaTToC(tempInput.value, tempUnit.value);
    const m = convertMassToKg(massInput.value, massUnit.value);

    if (!Q || !m || !deltaT) {
        finalAnswer.textContent = "Please enter valid numbers!";
        return;
    }

    const c = Q / (m * deltaT);
    finalAnswer.textContent = c.toFixed(4) + " J/(kg·K)";
});

// ===== Reset function =====
resetBtn.addEventListener("click", () => {
    heatInput.value = "";
    tempInput.value = "";
    massInput.value = "";
    heatUnit.value = "m";
    tempUnit.value = "C";
    massUnit.value = "Cinv";
    finalAnswer.textContent = "—";
});
