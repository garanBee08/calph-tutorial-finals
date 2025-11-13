const conversionData = {
  area: {
    name: 'Area',
    units: {
      'm²': 1,
      'km²': 1000000,
      'cm²': 0.0001,
      'mm²': 0.000001,
      'hectare': 10000,
      'ft²': 0.092903,
      'in²': 0.00064516,
      'yd²': 0.836127,
      'acre': 4046.86,
      'mile²': 2589988.11
    },
    formulas: [
      { title: '1 km² = 1,000,000 m²', desc: 'Square kilometer to square meter' },
      { title: '1 hectare = 10,000 m²', desc: 'Hectare to square meter' },
      { title: '1 acre = 4,046.86 m²', desc: 'Acre to square meter' }
    ]
  },
  volume: {
    name: 'Volume',
    units: {
      'm³': 1,
      'L': 0.001,
      'mL': 0.000001,
      'cm³': 0.000001,
      'ft³': 0.0283168,
      'in³': 0.0000163871,
      'gal (US)': 0.00378541,
      'gal (UK)': 0.00454609,
      'qt': 0.000946353,
      'pt': 0.000473176
    },
    formulas: [
      { title: '1 m³ = 1,000 L', desc: 'Cubic meter to liter' },
      { title: '1 L = 1,000 mL', desc: 'Liter to milliliter' },
      { title: '1 gal (US) = 3.78541 L', desc: 'US gallon to liter' }
    ]
  },
  speed: {
    name: 'Speed/Velocity',
    units: {
      'm/s': 1,
      'km/h': 0.277778,
      'mph': 0.44704,
      'ft/s': 0.3048,
      'knot': 0.514444
    },
    formulas: [
      { title: '1 km/h = 0.278 m/s', desc: 'Kilometers per hour to meters per second' },
      { title: '1 mph = 0.447 m/s', desc: 'Miles per hour to meters per second' },
      { title: '1 knot = 0.514 m/s', desc: 'Knot to meters per second' }
    ]
  },
  acceleration: {
    name: 'Acceleration',
    units: {
      'm/s²': 1,
      'ft/s²': 0.3048,
      'g': 9.80665,
      'km/h/s': 0.277778
    },
    formulas: [
      { title: '1 g = 9.807 m/s²', desc: 'Standard gravity' },
      { title: 'a = Δv / Δt', desc: 'Acceleration equals change in velocity over time' },
      { title: '1 ft/s² = 0.3048 m/s²', desc: 'Feet per second squared to m/s²' }
    ]
  },
  force: {
    name: 'Force',
    units: {
      'N': 1,
      'kN': 1000,
      'dyne': 0.00001,
      'lbf': 4.44822,
      'kgf': 9.80665
    },
    formulas: [
      { title: 'F = ma', desc: 'Force equals mass times acceleration' },
      { title: '1 kN = 1,000 N', desc: 'Kilonewton to newton' },
      { title: '1 lbf = 4.448 N', desc: 'Pound-force to newton' }
    ]
  },
  pressure: {
    name: 'Pressure',
    units: {
      'Pa': 1,
      'kPa': 1000,
      'MPa': 1000000,
      'bar': 100000,
      'atm': 101325,
      'psi': 6894.76,
      'mmHg': 133.322,
      'torr': 133.322
    },
    formulas: [
      { title: 'P = F / A', desc: 'Pressure equals force per unit area' },
      { title: '1 atm = 101,325 Pa', desc: 'Atmosphere to pascal' },
      { title: '1 bar = 100,000 Pa', desc: 'Bar to pascal' }
    ]
  },
  energy: {
    name: 'Energy/Work/Heat',
    units: {
      'J': 1,
      'kJ': 1000,
      'MJ': 1000000,
      'cal': 4.184,
      'kcal': 4184,
      'Wh': 3600,
      'kWh': 3600000,
      'eV': 1.60218e-19,
      'BTU': 1055.06
    },
    formulas: [
      { title: 'E = W = Fd', desc: 'Energy equals work equals force times distance' },
      { title: '1 kWh = 3,600,000 J', desc: 'Kilowatt-hour to joule' },
      { title: '1 cal = 4.184 J', desc: 'Calorie to joule' }
    ]
  },
  power: {
    name: 'Power',
    units: {
      'W': 1,
      'kW': 1000,
      'MW': 1000000,
      'hp': 745.7,
      'BTU/h': 0.293071
    },
    formulas: [
      { title: 'P = E / t', desc: 'Power equals energy per unit time' },
      { title: '1 hp = 745.7 W', desc: 'Horsepower to watt' },
      { title: '1 kW = 1,000 W', desc: 'Kilowatt to watt' }
    ]
  },
  charge: {
    name: 'Electric Charge',
    units: {
      'C': 1,
      'mC': 0.001,
      'μC': 0.000001,
      'nC': 1e-9,
      'Ah': 3600,
      'mAh': 3.6
    },
    formulas: [
      { title: 'Q = It', desc: 'Charge equals current times time' },
      { title: '1 C = 1 A·s', desc: 'Coulomb equals ampere-second' },
      { title: '1 Ah = 3,600 C', desc: 'Ampere-hour to coulomb' }
    ]
  },
  potential: {
    name: 'Electric Potential',
    units: {
      'V': 1,
      'kV': 1000,
      'mV': 0.001,
      'μV': 0.000001
    },
    formulas: [
      { title: 'V = W / Q', desc: 'Voltage equals work per unit charge' },
      { title: '1 kV = 1,000 V', desc: 'Kilovolt to volt' },
      { title: 'V = IR', desc: 'Ohm\'s law: Voltage equals current times resistance' }
    ]
  },
  resistance: {
    name: 'Electric Resistance',
    units: {
      'Ω': 1,
      'kΩ': 1000,
      'MΩ': 1000000,
      'mΩ': 0.001
    },
    formulas: [
      { title: 'R = V / I', desc: 'Resistance equals voltage divided by current' },
      { title: '1 kΩ = 1,000 Ω', desc: 'Kiloohm to ohm' },
      { title: 'R = ρL / A', desc: 'Resistance based on resistivity and geometry' }
    ]
  },
  frequency: {
    name: 'Frequency',
    units: {
      'Hz': 1,
      'kHz': 1000,
      'MHz': 1000000,
      'GHz': 1000000000,
      'rpm': 1/60
    },
    formulas: [
      { title: 'f = 1 / T', desc: 'Frequency equals inverse of period' },
      { title: '1 kHz = 1,000 Hz', desc: 'Kilohertz to hertz' },
      { title: '1 rpm = 1/60 Hz', desc: 'Revolutions per minute to hertz' }
    ]
  }
};

let currentCategory = 'area';
let history = [];

const categorySelect = document.getElementById('categorySelect');
const fromUnit = document.getElementById('fromUnit');
const toUnit = document.getElementById('toUnit');
const inputValue = document.getElementById('inputValue');
const outputValue = document.getElementById('outputValue');
const convertBtn = document.getElementById('convertBtn');
const swapBtn = document.getElementById('swapBtn');
const formulaList = document.getElementById('formulaList');
const historyList = document.getElementById('historyList');
const clearHistory = document.getElementById('clearHistory');

document.addEventListener('DOMContentLoaded', () => {
  updateUnits();
  updateFormulas();
  
  categorySelect.addEventListener('change', (e) => {
    currentCategory = e.target.value;
    updateUnits();
    updateFormulas();
    clearInputs();
  });
  
  inputValue.addEventListener('input', performConversionPreview);
  fromUnit.addEventListener('change', performConversionPreview);
  toUnit.addEventListener('change', performConversionPreview);
  convertBtn.addEventListener('click', performConversionWithHistory);
  
  inputValue.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performConversionWithHistory();
    }
  });
  
  swapBtn.addEventListener('click', () => {
    const tempUnit = fromUnit.value;
    fromUnit.value = toUnit.value;
    toUnit.value = tempUnit;
    performConversionPreview();
  });
  
  clearHistory.addEventListener('click', () => {
    history = [];
    updateHistoryDisplay();
  });
});

function updateUnits() {
  const category = conversionData[currentCategory];
  const units = Object.keys(category.units);
  
  fromUnit.innerHTML = '';
  toUnit.innerHTML = '';
  
  units.forEach(unit => {
    const option1 = document.createElement('option');
    option1.value = unit;
    option1.textContent = unit;
    fromUnit.appendChild(option1);
    
    const option2 = document.createElement('option');
    option2.value = unit;
    option2.textContent = unit;
    toUnit.appendChild(option2);
  });
  
  if (units.length > 1) {
    toUnit.selectedIndex = 1;
  }
}

function updateFormulas() {
  const category = conversionData[currentCategory];
  
  formulaList.innerHTML = '';
  
  category.formulas.forEach(formula => {
    const item = document.createElement('div');
    item.className = 'formula-item';
    item.innerHTML = `
      <p class="formula-title">${formula.title}</p>
      <p class="formula-desc">${formula.desc}</p>
    `;
    formulaList.appendChild(item);
  });
}

function performConversionPreview() {
  const value = parseFloat(inputValue.value);
  
  if (isNaN(value) || value === '') {
    outputValue.value = '';
    return;
  }
  
  const category = conversionData[currentCategory];
  const fromFactor = category.units[fromUnit.value];
  const toFactor = category.units[toUnit.value];
  
  const baseValue = value * fromFactor;
  const result = baseValue / toFactor;
  
  outputValue.value = result.toExponential(6);
  
  if (Math.abs(result) >= 0.01 && Math.abs(result) < 1000000) {
    outputValue.value = result.toFixed(6).replace(/\.?0+$/, '');
  }
}

function performConversionWithHistory() {
  const value = parseFloat(inputValue.value);
  
  if (isNaN(value) || value === '') {
    return;
  }
  
  const category = conversionData[currentCategory];
  const fromFactor = category.units[fromUnit.value];
  const toFactor = category.units[toUnit.value];
  
  const baseValue = value * fromFactor;
  const result = baseValue / toFactor;
  
  outputValue.value = result.toExponential(6);
  
  if (Math.abs(result) >= 0.01 && Math.abs(result) < 1000000) {
    outputValue.value = result.toFixed(6).replace(/\.?0+$/, '');
  }
  
  addToHistory(value, fromUnit.value, result, toUnit.value);
}

function addToHistory(fromVal, fromU, toVal, toU) {
  const historyItem = {
    from: `${fromVal} ${fromU}`,
    to: `${toVal} ${toU}`,
    category: conversionData[currentCategory].name,
    timestamp: new Date().toLocaleTimeString()
  };
  
  history.unshift(historyItem);
  if (history.length > 10) {
    history.pop();
  }
  
  updateHistoryDisplay();
}

function updateHistoryDisplay() {
  if (history.length === 0) {
    historyList.innerHTML = '<p class="no-history">No conversions yet</p>';
    return;
  }
  
  historyList.innerHTML = '';
  
  history.forEach(item => {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.innerHTML = `
      <strong>${item.from}</strong> → <strong>${item.to}</strong>
      <br><small style="opacity: 0.7;">${item.category} • ${item.timestamp}</small>
    `;
    historyList.appendChild(div);
  });
}

function clearInputs() {
  inputValue.value = '';
  outputValue.value = '';
}