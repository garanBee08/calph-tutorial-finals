const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");
let DPR = window.devicePixelRatio || 1;
let W = 0, H = 0;

function resizeCanvas() {
  W = canvas.clientWidth;
  H = canvas.clientHeight;
  canvas.width = W * DPR;
  canvas.height = H * DPR;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  origin.x = W / 2;
  origin.y = H / 2;
  draw();
}
window.addEventListener("resize", resizeCanvas);

const origin = { x: 0, y: 0 };
let vectors = [], nextId = 1;
let pan = { x: 0, y: 0 }, zoom = 1, isPanning = false, startPan = { x: 0, y: 0 };
let mode = "add";
let draggingVector = null;

// Head-to-tail canvas
const headCanvas = document.getElementById("headTailCanvas");
const hctx = headCanvas.getContext("2d");
let hPan = { x: 0, y: 0 }, hZoom = 1, hIsPanning = false, hStartPan = { x: 0, y: 0 };

const magEl = document.getElementById("mag");
const angEl = document.getElementById("ang");
const xCompEl = document.getElementById("xComp");
const yCompEl = document.getElementById("yComp");
const colorEl = document.getElementById("color");
const addBtn = document.getElementById("add");
const clearBtn = document.getElementById("clear");
const vlist = document.getElementById("vlist");
const resultMagEl = document.getElementById("resultMag");
const resultAngEl = document.getElementById("resultAng");
const componentsEl = document.getElementById("components");

const inputType = document.getElementById("inputType");
const polarInputs = document.getElementById("polarInputs");
const cartesianInputs = document.getElementById("cartesianInputs");
inputType.onchange = () => {
  polarInputs.style.display = inputType.value === "polar" ? "block" : "none";
  cartesianInputs.style.display = inputType.value === "polar" ? "none" : "block";
};

// Tabs
const addTab = document.getElementById("addTab");
const subTab = document.getElementById("subTab");
const modeTitle = document.getElementById("modeTitle");

addTab.onclick = () => {
  mode = "add";
  addTab.classList.add("active");
  subTab.classList.remove("active");
  modeTitle.textContent = "Vector Addition Simulator";
  renderList();
  draw(); drawHeadToTail(); updateResultant();
};

subTab.onclick = () => {
  mode = "sub";
  subTab.classList.add("active");
  addTab.classList.remove("active");
  modeTitle.textContent = "Vector Subtraction Simulator";
  renderList();
  draw(); drawHeadToTail(); updateResultant();
};

// Conversion utilities
const degToRad = d => d * Math.PI / 180;
const radToDeg = r => r * 180 / Math.PI;
const polarToXY = (m,a) => ({ x: m*Math.cos(degToRad(a)), y: -m*Math.sin(degToRad(a)) });
const xyToPolar = (x,y) => {
  const mag = Math.hypot(x,y);
  let ang = radToDeg(Math.atan2(-y,x));
  if(ang<0) ang+=360;
  return { mag, ang };
};

// Add Vector
addBtn.onclick = () => {
  let x = 0, y = 0;
  if (inputType.value === "polar") {
    const mag = parseFloat(magEl.value)||0, ang = parseFloat(angEl.value)||0;
    const r = polarToXY(mag, ang);
    x = r.x; y = r.y;
  } else {
    x = parseFloat(xCompEl.value)||0;
    y = -parseFloat(yCompEl.value)||0; // invert Y for drawing
  }
  vectors.push({ id: nextId++, color: colorEl.value, x, y, type: inputType.value });
  renderList(); draw(); drawHeadToTail(); updateResultant();
};

// Clear all
clearBtn.onclick = () => {
  vectors = []; nextId = 1;
  pan = { x: 0, y: 0 }; zoom = 1;
  hPan = { x: 0, y: 0 }; hZoom = 1;
  renderList(); draw(); drawHeadToTail(); updateResultant();
};

// Draw Grid
function drawGrid() {
  ctx.clearRect(0,0,W,H);
  const step = 25 * zoom;
  ctx.lineWidth = 1;
  for(let x=(origin.x+pan.x*zoom)%step; x<=W; x+=step){
    ctx.strokeStyle="rgba(255,255,255,0.05)";
    ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke();
  }
  for(let y=(origin.y+pan.y*zoom)%step; y<=H; y+=step){
    ctx.strokeStyle="rgba(255,255,255,0.05)";
    ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke();
  }
  ctx.strokeStyle="rgba(255,255,255,0.2)";
  ctx.beginPath();
  ctx.moveTo(0,origin.y+pan.y*zoom); ctx.lineTo(W,origin.y+pan.y*zoom);
  ctx.moveTo(origin.x+pan.x*zoom,0); ctx.lineTo(origin.x+pan.x*zoom,H);
  ctx.stroke();
}

// Draw Arrow
function drawArrow(x1,y1,x2,y2,color,label){
  ctx.save(); ctx.strokeStyle=color; ctx.fillStyle=color; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
  const angle=Math.atan2(y2-y1,x2-x1), hl=10;
  ctx.beginPath();
  ctx.moveTo(x2,y2);
  ctx.lineTo(x2-hl*Math.cos(angle-Math.PI/6),y2-hl*Math.sin(angle-Math.PI/6));
  ctx.lineTo(x2-hl*Math.cos(angle+Math.PI/6),y2-hl*Math.sin(angle+Math.PI/6));
  ctx.closePath(); ctx.fill();
  if(label){ ctx.font="12px Poppins"; ctx.fillStyle="#e6f6ff"; ctx.fillText(label,(x1+x2)/2+8,(y1+y2)/2-8); }
  ctx.restore();
}

// Draw Vectors
function draw(){
  drawGrid();
  vectors.forEach((v,i)=>{
    const sign=(mode==="sub"&&i>0)?-1:1;
    const x1=origin.x+pan.x*zoom, y1=origin.y+pan.y*zoom;
    const x2=x1+v.x*zoom*sign, y2=y1+v.y*zoom*sign;
    drawArrow(x1,y1,x2,y2,v.color,`v${v.id}`);
    v.tip = {x: x2, y: y2};
  });

  if(vectors.length){
    let sx=0, sy=0;
    if(mode==="add") vectors.forEach(v=>{ sx+=v.x; sy+=v.y; });
    else { sx=vectors[0].x; sy=vectors[0].y; for(let i=1;i<vectors.length;i++){ sx-=vectors[i].x; sy-=vectors[i].y; } }
    drawArrow(origin.x+pan.x*zoom, origin.y+pan.y*zoom, origin.x+pan.x*zoom+sx*zoom, origin.y+pan.y*zoom+sy*zoom, "#ffd166", "R");
  }
}

// Render List
function renderList() {
  vlist.innerHTML = "";
  vectors.forEach(v => {
    const pol = xyToPolar(v.x, v.y);
    const el = document.createElement("div");
    el.className = "vec-item";

    if (v.type === "polar") {
      el.innerHTML = `
        <div class="vec" style="flex:1;>
          <div class="vec-info">
            <span class="color-dot" style="background:${v.color}"></span>
            <strong>v${v.id}</strong>
          </div>
          <div class="vec-inputs">
            <label>m</label>
            <input class="vec-mag" value="${pol.mag.toFixed(2)}">
            <label>θ</label>
            <input class="vec-ang" value="${pol.ang.toFixed(2)}">°
          </div>
          <button class="del-vector">✕</button>
        </div>
        
      `;

      const magInput = el.querySelector(".vec-mag");
      const angInput = el.querySelector(".vec-ang");
      magInput.onchange = () => {
        const mag = parseFloat(magInput.value) || 0;
        const ang = parseFloat(angInput.value) || 0;
        const r = polarToXY(mag, ang);
        v.x = r.x;
        v.y = r.y;
        draw(); drawHeadToTail(); updateResultant();
      };
      angInput.onchange = () => {
        const mag = parseFloat(magInput.value) || 0;
        const ang = parseFloat(angInput.value) || 0;
        const r = polarToXY(mag, ang);
        v.x = r.x;
        v.y = r.y;
        draw(); drawHeadToTail(); updateResultant();
      };

    } else {
      el.innerHTML = `
        <div class="vec" style="flex:1;>
          <div class="vec-info">
            <span class="color-dot" style="background:${v.color}"></span>
            <strong>v${v.id}</strong>
          </div>
          <div class="vec-inputs">
            <label>x</label>
            <input class="vec-x" value="${v.x.toFixed(2)}">
            <label>y</label>
            <input class="vec-y" value="${(-v.y).toFixed(2)}">
          </div>
          <button class="del-vector">✕</button>
        </div>
      `;

      const xInput = el.querySelector(".vec-x");
      const yInput = el.querySelector(".vec-y");
      xInput.onchange = () => {
        v.x = parseFloat(xInput.value) || 0;
        draw(); drawHeadToTail(); updateResultant();
      };
      yInput.onchange = () => {
        v.y = -(parseFloat(yInput.value) || 0);
        draw(); drawHeadToTail(); updateResultant();
      };
    }

    el.querySelector(".del-vector").onclick = () => {
      vectors = vectors.filter(a => a.id !== v.id);
      if (vectors.length === 0) nextId = 1;
      renderList();
      draw(); drawHeadToTail(); updateResultant();
    };

    vlist.appendChild(el);
  });
  updateResultant();
}


// ✅ Always updates resultant for both modes
function updateResultant() {
  let sx = 0, sy = 0;
  if (mode === "add") {
    vectors.forEach(v => { sx += v.x; sy += v.y; });
  } else if (vectors.length > 0) {
    sx = vectors[0].x; sy = vectors[0].y;
    for (let i = 1; i < vectors.length; i++) {
      sx -= vectors[i].x;
      sy -= vectors[i].y;
    }
  }
  const r = xyToPolar(sx, sy);
  resultMagEl.textContent = `Magnitude: ${r.mag.toFixed(2)}`;
  resultAngEl.textContent = `Angle: ${r.ang.toFixed(2)}°`;
  componentsEl.textContent = `x: ${sx.toFixed(2)}, y: ${(-sy).toFixed(2)}`;
}

// Head-to-tail visualization
function drawHeadToTail() {
  const W = headCanvas.clientWidth, H = headCanvas.clientHeight;
  headCanvas.width = W * DPR; headCanvas.height = H * DPR;
  hctx.setTransform(DPR * hZoom, 0, 0, DPR * hZoom, hPan.x * DPR, hPan.y * DPR);
  hctx.clearRect(-W, -H, 2 * W, 2 * H);
  const ox = W / 2, oy = H / 2;
  let x = ox, y = oy;
  hctx.lineWidth = 3;

  vectors.forEach((v, i) => {
    const sign = (mode === "sub" && i > 0) ? -1 : 1;
    const nx = x + v.x * sign;
    const ny = y + v.y * sign;
    hctx.strokeStyle = v.color;
    hctx.fillStyle = v.color;
    hctx.beginPath(); hctx.moveTo(x, y); hctx.lineTo(nx, ny); hctx.stroke();
    const angle = Math.atan2(ny - y, nx - x);
    hctx.beginPath();
    hctx.moveTo(nx, ny);
    hctx.lineTo(nx - 10 * Math.cos(angle - Math.PI/6), ny - 10 * Math.sin(angle - Math.PI/6));
    hctx.lineTo(nx - 10 * Math.cos(angle + Math.PI/6), ny - 10 * Math.sin(angle + Math.PI/6));
    hctx.closePath(); hctx.fill();
    x = nx; y = ny;
  });

  // Draw resultant
  if (vectors.length) {
    let sx=0, sy=0;
    if (mode==="add") vectors.forEach(v=>{ sx+=v.x; sy+=v.y; });
    else { sx=vectors[0].x; sy=vectors[0].y; for(let i=1;i<vectors.length;i++){ sx-=vectors[i].x; sy-=vectors[i].y; } }
    hctx.strokeStyle="#ffd166"; hctx.fillStyle="#ffd166";
    hctx.beginPath(); hctx.moveTo(ox,oy); hctx.lineTo(ox+sx,oy+sy); hctx.stroke();
    const angle=Math.atan2(sy,sx);
    hctx.beginPath();
    hctx.moveTo(ox+sx,oy+sy);
    hctx.lineTo(ox+sx-10*Math.cos(angle-Math.PI/6),oy+sy-10*Math.sin(angle-Math.PI/6));
    hctx.lineTo(ox+sx-10*Math.cos(angle+Math.PI/6),oy+sy-10*Math.sin(angle+Math.PI/6));
    hctx.closePath(); hctx.fill();
  }
}

// === Interactions ===
canvas.addEventListener("mousedown", e => {
  const mx = e.offsetX, my = e.offsetY;
  const tol = 10;
  for (let v of vectors) {
    if (Math.hypot(mx - v.tip.x, my - v.tip.y) < tol) {
      draggingVector = v;
      canvas.style.cursor = "crosshair";
      return;
    }
  }
  isPanning = true;
  startPan = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  canvas.style.cursor = "grabbing";
});

window.addEventListener("mouseup", () => {
  isPanning = false;
  draggingVector = null;
  hIsPanning = false;
  canvas.style.cursor = "grab";
  headCanvas.style.cursor = "grab";
});

window.addEventListener("mousemove", e => {
  const mx = e.offsetX, my = e.offsetY;
  const tol = 10;
  const tooltip = document.getElementById("tooltip");
  let foundVector = null;

  // Check if hovering over any vector tip
  for (let v of vectors) {
    if (Math.hypot(mx - v.tip?.x, my - v.tip?.y) < tol) {
      foundVector = v;
      break;
    }
  }

  if (foundVector && !isPanning && !draggingVector) {
    // --- Tooltip content ---
    const pol = xyToPolar(foundVector.x, foundVector.y);
    const xVal = foundVector.x.toFixed(2);
    const yVal = (-foundVector.y).toFixed(2);
    tooltip.innerHTML = `
      <strong style="color:${foundVector.color}">v${foundVector.id}</strong><br>
      m = ${pol.mag.toFixed(2)}<br>
      θ = ${pol.ang.toFixed(1)}°<br>
      x = ${xVal}, y = ${yVal}
    `;
    tooltip.style.display = "block";
    tooltip.style.left = (e.clientX + 12) + "px";
    tooltip.style.top = (e.clientY + 12) + "px";
    canvas.style.cursor = "crosshair";
  } else {
    tooltip.style.display = "none";
    if (isPanning) {
      pan.x = (e.clientX - startPan.x);
      pan.y = (e.clientY - startPan.y);
      draw();
    } else if (draggingVector) {
      const x1 = origin.x + pan.x * zoom;
      const y1 = origin.y + pan.y * zoom;
      const dx = (e.offsetX - x1) / zoom;
      const dy = (e.offsetY - y1) / zoom;
      const isSubMode = mode === "sub" && vectors.indexOf(draggingVector) > 0;
      draggingVector.x = isSubMode ? -dx : dx;
      draggingVector.y = isSubMode ? -dy : dy;
      draw(); drawHeadToTail(); renderList(); updateResultant();
    } else if (hIsPanning) {
      hPan.x = e.clientX - hStartPan.x;
      hPan.y = e.clientY - hStartPan.y;
      drawHeadToTail();
    } else {
      canvas.style.cursor = "grab";
    }
  }
});


canvas.addEventListener("wheel", e => {
  e.preventDefault();
  const zoomAmount = -e.deltaY * 0.001;
  zoom *= (1 + zoomAmount);
  zoom = Math.min(Math.max(zoom, 0.2), 3);
  draw();
});

// Head-to-tail pan & zoom
headCanvas.addEventListener("mousedown", e => {
  hIsPanning = true;
  hStartPan = { x: e.clientX - hPan.x, y: e.clientY - hPan.y };
  headCanvas.style.cursor = "grabbing";
});

headCanvas.addEventListener("wheel", e => {
  e.preventDefault();
  const zoomAmount = -e.deltaY * 0.001;
  hZoom *= (1 + zoomAmount);
  hZoom = Math.min(Math.max(hZoom, 0.2), 3);
  drawHeadToTail();
});

resizeCanvas();
renderList();
drawHeadToTail();
updateResultant();