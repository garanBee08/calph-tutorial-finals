const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');

let amplitude = 50;
let frequency = 2;
let speed = 1;
let time = 0;

// Resize canvas to fit container
function resizeCanvas() {
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Draw wave
function drawWave() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, '#8391DA');
  gradient.addColorStop(1, '#0D1D7A');
  ctx.lineWidth = 3;
  ctx.strokeStyle = gradient;
  ctx.shadowBlur = 15;
  ctx.shadowColor = '#8391DA';

  ctx.beginPath();
  for (let x = 0; x < canvas.width; x++) {
    // Normalize large values so wave stays visible
    const scale = Math.min(amplitude, canvas.height / 2 - 10);
    const safeFreq = Math.min(frequency, 500);
    const y1 = scale * Math.sin((x * safeFreq * 0.02) + time);
    const y2 = (scale / 2) * Math.sin((x * safeFreq * 0.04) - time * 1.5);
    const y = canvas.height / 2 + (y1 + y2) / 1.5;

    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  time += 0.03 * Math.min(speed, 100);
  requestAnimationFrame(drawWave);
}
drawWave();

// Utility to bind range + input fields safely
function bindRangeAndInput(rangeId, inputId, callback) {
  const range = document.getElementById(rangeId);
  const input = document.getElementById(inputId);

  function updateValue(value) {
    const safeVal = Math.max(1, Math.min(500, value || 1));
    range.value = safeVal;
    input.value = safeVal;
    callback(safeVal);
  }

  range.addEventListener('input', () => updateValue(parseFloat(range.value)));
  input.addEventListener('input', () => updateValue(parseFloat(input.value)));
}

// Bind sliders properly
bindRangeAndInput('amplitudeSlider', 'amplitudeInput', v => amplitude = v);
bindRangeAndInput('frequencySlider', 'frequencyInput', v => frequency = v);
bindRangeAndInput('speedSlider', 'speedInput', v => speed = v);