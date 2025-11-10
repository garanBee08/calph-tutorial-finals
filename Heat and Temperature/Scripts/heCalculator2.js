// ===== Select elements =====
const heatInput = document.querySelector(".initial-length");
const heatUnit = document.querySelector(".initial-length-unit");

const tempInput = document.querySelector(".change-temp");
const tempUnit = document.querySelector(".change-temp-unit");

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
        case 'm': return value;        // J
        case 'km': return value * 1000; // kJ to J
        case 'cm': return value * 4.184; // cal to J
        default: return value;
    }
}

function convertTempToK(value, unit) {
    value = parseFloat(value);
    if (isNaN(value)) return 0;
    switch(unit) {
        case 'C': return value + 273.15;
        case 'F': return (value - 32) * 5/9 + 273.15;
        case 'K': return value;
        default: return value;
    }
}

function convertCofToJperKgK(value, unit) {
    value = parseFloat(value);
    if (isNaN(value)) return 0;
    switch(unit) {
        case 'Cinv': return value;          // J/(kg·K)
        case 'Kinv': return value * 1000;   // J/(g·K) -> J/(kg·K)
        case 'Finv': return value / 1000;   // J/(Mg·K) -> J/(kg·K)
        default: return value;
    }
}

// ===== Compute function =====
computeBtn.addEventListener("click", () => {
    const Q = convertHeatToJ(heatInput.value, heatUnit.value);
    const deltaT = convertTempToK(tempInput.value, tempUnit.value) - 273.15; // ΔT in °C
    const c = convertCofToJperKgK(cofInput.value, cofUnit.value);

    if (!Q || !c || !deltaT) {
        finalAnswer.textContent = "Please enter valid numbers!";
        return;
    }

    const m = Q / (c * deltaT);
    finalAnswer.textContent = m.toFixed(4) + " kg";
});

// ===== Reset function =====
resetBtn.addEventListener("click", () => {
    heatInput.value = "";
    tempInput.value = "";
    cofInput.value = "";
    heatUnit.value = "m";
    tempUnit.value = "C";
    cofUnit.value = "Cinv";
    finalAnswer.textContent = "—";
});
