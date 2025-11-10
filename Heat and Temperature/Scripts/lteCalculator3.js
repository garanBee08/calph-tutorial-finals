function parseSci(value) {
    value = value.replace(/x10\^?/i, 'e').replace(/\*/g, '');
    return parseFloat(value);
}

document.querySelector('.compute').addEventListener('click', function () {

    let alpha = parseSci(document.querySelector('.coef-exp').value);
    let dT = parseSci(document.querySelector('.change-temp').value);
    let dL = parseSci(document.querySelector('.change-length').value);

    let unitDL = document.querySelector('.change-length-unit').value;

    if (isNaN(alpha) || isNaN(dT) || isNaN(dL)) {
        document.querySelector('.finalAnswer').textContent = "Invalid Input";
        return;
    }

    // ✅ Convert ΔL to meters only (DO NOT convert anything else)
    if (unitDL === "km") dL *= 1000;
    if (unitDL === "cm") dL *= 0.01;

    // ✅ Compute using user’s own temperature & alpha units (NO conversion)
    let L = dL / (alpha * dT);

    // ✅ Formatting Answer
    let formatted;
    if (Math.abs(L) < 0.000001 || Math.abs(L) > 1000000) {
        let exp = L.toExponential(3);
        let parts = exp.split("e");
        formatted = `${parts[0]} × 10^${parseInt(parts[1])} m`;
    } else {
        formatted = L.toFixed(6) + " m";
    }

    document.querySelector('.finalAnswer').textContent = formatted;
});

document.querySelector('.reset').addEventListener('click', function () {
    document.querySelector('.coef-exp').value = "";
    document.querySelector('.change-temp').value = "";
    document.querySelector('.change-length').value = "";
    document.querySelector('.finalAnswer').textContent = "—";
});
