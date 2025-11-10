function parseSci(value) {
    value = value.replace(/x10\^?/i, 'e').replace(/\*/g, '');
    return parseFloat(value);
}

document.querySelector('.compute').addEventListener('click', function () {

    let L = parseSci(document.querySelector('.initial-length').value);
    let unitL = document.querySelector('.initial-length-unit').value;

    let alpha = parseSci(document.querySelector('.coeff-expansion').value);
    let unitAlpha = document.querySelector('.coeff-expansion-unit').value;

    let dL = parseSci(document.querySelector('.change-length').value);
    let unitDL = document.querySelector('.change-length-unit').value;

    // Validate Inputs
    if (isNaN(L) || isNaN(alpha) || isNaN(dL)) {
        document.querySelector('.finalAnswer').textContent = "Invalid Input";
        return;
    }

    // ✅ Convert Length to meters
    if (unitL === "km") L *= 1000;
    if (unitL === "cm") L *= 0.01;

    // ✅ Convert Change in Length to meters
    if (unitDL === "km") dL *= 1000;
    if (unitDL === "cm") dL *= 0.01;

    // ✅ Solve for ΔT
    let dT = dL / (alpha * L);

    // ✅ Determine temperature unit to display
    let unitT;
    if (unitAlpha === "C") unitT = "°C";
    if (unitAlpha === "F") unitT = "°F";
    if (unitAlpha === "K") unitT = "K";

    // ✅ Format Answer (normal + scientific output)
    let formatted;
    if (Math.abs(dT) >= 1e6 || Math.abs(dT) <= 1e-6) {
        let exp = dT.toExponential(3);
        let parts = exp.split("e");
        formatted = `${parts[0]} × 10^${parseInt(parts[1])} ${unitT}`;
    } else {
        formatted = dT.toFixed(6) + " " + unitT;
    }

    document.querySelector('.finalAnswer').textContent = formatted;
});

// ✅ Reset button
document.querySelector('.reset').addEventListener('click', function () {
    document.querySelector('.initial-length').value = "";
    document.querySelector('.coeff-expansion').value = "";
    document.querySelector('.change-length').value = "";
    document.querySelector('.finalAnswer').textContent = "—";
});
