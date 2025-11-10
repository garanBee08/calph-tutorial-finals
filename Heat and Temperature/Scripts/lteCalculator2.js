function parseSci(value) {
    value = value.replace(/x10\^?/i, 'e').replace(/\*/g, '');
    return parseFloat(value);
}

document.querySelector('.compute').addEventListener('click', function () {

    let L = parseSci(document.querySelector('.initial-length').value);
    let unitL = document.querySelector('.initial-length-unit').value;

    let dT = parseSci(document.querySelector('.change-temp').value);
    let unitT = document.querySelector('.change-temp-unit').value;

    let dL = parseSci(document.querySelector('.change-length').value);
    let unitDL = document.querySelector('.change-length-unit').value;

    // Validate inputs
    if (isNaN(L) || isNaN(dT) || isNaN(dL)) {
        document.querySelector('.finalAnswer').textContent = "Invalid Input";
        return;
    }

    // ✅ Convert Length to meters
    if (unitL === "km") L *= 1000;
    if (unitL === "cm") L *= 0.01;

    // ✅ Convert ΔL to meters
    if (unitDL === "km") dL *= 1000;
    if (unitDL === "cm") dL *= 0.01;

    // ✅ Convert ΔT to Kelvin difference for correct α
    if (unitT === "C") {
        // Δ°C = ΔK, so no change needed
    } else if (unitT === "F") {
        // Δ°F → ΔK: ΔK = Δ°F × 5/9
        dT = dT * 5 / 9;
    } else if (unitT === "K") {
        // ΔK, no conversion needed
    }

    // ✅ α = ΔL / (L * ΔT) in K⁻¹
    let alpha = dL / (L * dT);

    // Always output in K^-1
    let unitAlpha = "K⁻¹";

    // ✅ Format answer (normal + scientific)
    let formatted;
    if (Math.abs(alpha) < 0.000001 || Math.abs(alpha) > 1) {
        let exp = alpha.toExponential(3);
        let parts = exp.split("e");
        formatted = `${parts[0]} × 10^${parseInt(parts[1])} ${unitAlpha}`;
    } else {
        formatted = alpha.toFixed(6) + " " + unitAlpha;
    }

    document.querySelector('.finalAnswer').textContent = formatted;
});

// ✅ Reset button
document.querySelector('.reset').addEventListener('click', function () {
    document.querySelector('.initial-length').value = "";
    document.querySelector('.change-temp').value = "";
    document.querySelector('.change-length').value = "";
    document.querySelector('.finalAnswer').textContent = "—";
});
