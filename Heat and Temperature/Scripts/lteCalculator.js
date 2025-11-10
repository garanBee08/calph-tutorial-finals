function parseSci(value) {
    value = value.replace(/x10\^?/i, 'e').replace(/\*/g, '');
    return parseFloat(value);
}

document.querySelector('.compute').addEventListener('click', function() {

    let L = parseSci(document.querySelector('.initial-length').value);
    let unitL = document.querySelector('.initial-length-unit').value;

    let dT = parseSci(document.querySelector('.change-temp').value);
    let alpha = parseSci(document.querySelector('.cof-value').value);

    if (isNaN(L) || isNaN(dT) || isNaN(alpha)) {
        document.querySelector('.finalAnswer').textContent = "Invalid Input";
        return;
    }

    // ✅ Convert Length to meters only (cm, km → m)
    if (unitL === "km") L *= 1000;
    if (unitL === "cm") L *= 0.01;

    // ✅ NO temperature conversions
    // ✅ NO coefficient conversions

    // ✅ ΔL = α × L × ΔT
    let result = alpha * L * dT;

    // ✅ Format output
    let formatted;
    if (Math.abs(result) < 0.001 || Math.abs(result) >= 1000) {
        let exp = result.toExponential(3);
        let parts = exp.split("e");
        formatted = `${parts[0]} × 10^${parseInt(parts[1])} m`;
    } else {
        formatted = result.toFixed(6) + " m";
    }

    document.querySelector('.finalAnswer').textContent = formatted;
});

document.querySelector('.reset').addEventListener('click', function () {
    document.querySelector('.initial-length').value = "";
    document.querySelector('.change-temp').value = "";
    document.querySelector('.cof-value').value = "";
    document.querySelector('.finalAnswer').textContent = "—";
});
