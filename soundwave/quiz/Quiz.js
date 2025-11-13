// DOM refs
const startBtn = document.getElementById('startBtn');
const nameInput = document.getElementById('username');
const startCard = document.querySelector('.start-card');
const quizCard = document.querySelector('.quiz-card');
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressText = document.getElementById('progressText');
const giveUpBtn = document.getElementById('giveUpBtn');

// State
let userName = '';
let currentIndex = 0;
let score = 0;
const TOTAL = 30;
const userAnswers = new Array(TOTAL).fill(null); // store chosen index or null

// Questions (30) - exactly as provided
const questions = [
  { q: "It is the maximum displacement of a wave from its equilibrium position; it indicates the energy of the wave.", options:["Wavelength","Frequency","Amplitude","Period"], answer:2 },
  { q: "The distance between two consecutive crests or troughs of a wave.", options:["Wavelength","Frequency","Amplitude","Period"], answer:0 },
  { q: "The time required for one complete cycle of a wave.", options:["Amplitude","Frequency","Wavelength","Period"], answer:3 },
  { q: "Waves that do not require a medium to travel and can move through a vacuum.", options:["Mechanical waves","Sound waves","Transverse waves","Electromagnetic waves"], answer:3 },
  { q: "Which wave property determines the energy carried by a wave?", options:["Wavelength","Frequency","Amplitude","Period"], answer:2 },
  { q: "Which type of wave requires a medium to propagate?", options:["Light wave","Radio wave","Mechanical wave","Electromagnetic wave"], answer:2 },
  { q: "What type of wave has particles moving perpendicular to the direction of wave travel?", options:["Longitudinal wave","Transverse wave","Electromagnetic wave","Standing wave"], answer:1 },
  { q: "Which formula is used to calculate wave speed?", options:["v = fλ","v = √(T/μ)","v = λ/T","v = 1/(fT)"], answer:0 },
  { q: "A wave has a frequency of 5 Hz and a wavelength of 2 m. What is the wave speed?", options:["2.5 m/s","7 m/s","10 m/s","12 m/s"], answer:2 },
  { q: "A sound wave has a frequency of 250 Hz. What is its period (T)?", options:["0.0004 s","0.004 s","0.04 s","4 s"], answer:1 },
  { q: "A string has a tension of 100 N, a mass of 0.05 kg, and a length of 2 m. What is the wave speed?", options:["25.0 m/s","50.0 m/s","63.25 m/s","75.0 m/s"], answer:2 },
  { q: "A water wave travels at 12 m/s with a wavelength of 3 m. Find its frequency.", options:["2 Hz","3 Hz","4 Hz","6 Hz"], answer:2 },
  { q: "Which formula is used to calculate wave speed on a string?", options:["v = fλ","v = √(T/μ)","v = λ/T","v = 1/(fT)"], answer:1 },
  { q: "The unit of frequency is:", options:["m/s","N","Hz","J"], answer:2 },
  { q: "The higher the frequency of a wave, the ______ its wavelength.", options:["Longer","Shorter","Unchanged","Stronger"], answer:1 },
  { q: "It is the apparent change in frequency or pitch of a sound due to the relative motion between the source and the observer.", options:["Reverberation","Doppler Effect","Resonance","Reflection"], answer:1 },
  { q: "The reflection of sound that returns after some time delay.", options:["Reverberation","Echo","Doppler Effect","Pitch"], answer:1 },
  { q: "This term refers to the lowest frequency of vibration produced by a vibrating body.", options:["Harmonic frequency","Overtone","Fundamental frequency","Pitch"], answer:2 },
  { q: "It is the property of sound that allows us to distinguish two sounds of the same pitch and loudness.", options:["Loudness","Timbre (Quality)","Frequency","Intensity"], answer:1 },
  { q: "Which of the following cannot transmit sound?", options:["Air","Water","Steel","Vacuum"], answer:3 },
  { q: "Which type of sound wave has a frequency below 20 Hz?", options:["Audible waves","Infrasonic waves","Ultrasonic waves","Supersonic waves"], answer:1 },
  { q: "The unit of loudness or intensity level of sound is:", options:["Watt","Hertz","Decibel","Joule"], answer:2 },
  { q: "Which characteristic of sound depends on its frequency?", options:["Loudness","Quality","Pitch","Intensity"], answer:2 },
  { q: "A speaker produces a sound power of 90 W. What is the sound intensity at a distance of 15 m?", options:["0.0318 W/m²","0.041 W/m²","0.052 W/m²","0.064 W/m²"], answer:0 },
  { q: "Find the speed of sound in air at 30°C using ( V = 331.45 + 0.6T ).", options:["341.45 m/s","349.45 m/s","351.45 m/s","355.45 m/s"], answer:1 },
  { q: "A car horn emits a sound at 700 Hz while moving toward a stationary listener at 30 m/s. If the speed of sound is 343 m/s, what frequency does the observer hear?", options:["730 Hz","750 Hz","762 Hz","770 Hz"], answer:2 },
  { q: "If the same car moves away from the listener, what frequency does the observer hear?", options:["680 Hz","640 Hz","620 Hz","590 Hz"], answer:0 },
  { q: "Which of the following describes how sound intensity changes as distance increases?", options:["Increases","Decreases","Stays the same","Doubles"], answer:1 },
  { q: "The range of human hearing is approximately:", options:["0–10 Hz","20–20,000 Hz","200–200,000 Hz","2–2,000 Hz"], answer:1 },
  { q: "What type of wave is a sound wave?", options:["Transverse","Longitudinal","Electromagnetic","Standing"], answer:1 }
];

// create four option buttons (matching layout)
function createOptionButtons() {
  optionsContainer.innerHTML = '';
  for (let i = 0; i < 4; i++) {
    const b = document.createElement('button');
    b.className = 'option-btn';
    b.type = 'button';
    b.dataset.idx = i;
    b.addEventListener('click', onOptionClick);
    optionsContainer.appendChild(b);
  }
}

// update UI to show current question and restore any previous selection
function renderQuestion(index, animate = true) {
  const q = questions[index];
  // animate fade
  const questionEl = document.getElementById('questionText');
  const opts = optionsContainer.querySelectorAll('.option-btn');

  if (animate) {
    // fade out, then update content, then fade in
    questionEl.classList.add('fade-out');
    optionsContainer.classList.add('fade-out');
    setTimeout(() => {
      // update content
      questionEl.textContent = q.q;
      opts.forEach((btn, i) => {
        btn.classList.remove('correct','wrong');
        btn.disabled = false;
        btn.textContent = (String.fromCharCode(65 + i)) + '.  ' + q.options[i];
      });

      // restore previous answer if any
      const prev = userAnswers[index];
      if (prev !== null && prev !== undefined) {
        // mark selected and correct/wrong styles
        const correctIdx = q.answer;
        if (prev === correctIdx) {
          opts[prev].classList.add('correct');
        } else {
          opts[prev].classList.add('wrong');
          opts[correctIdx].classList.add('correct');
        }
        // disable options (can't change after selection)
        opts.forEach(b => b.disabled = true);
      }
      // update progress
      progressText.textContent = `${index + 1}/${questions.length}`;

      // update Next button state - disable if question not answered
      nextBtn.disabled = (prev === null || prev === undefined);

      // fade in
      questionEl.classList.remove('fade-out');
      optionsContainer.classList.remove('fade-out');
      questionEl.classList.add('fade-in');
      optionsContainer.classList.add('fade-in');

      // remove fade-in after transition
      setTimeout(() => {
        questionEl.classList.remove('fade-in');
        optionsContainer.classList.remove('fade-in');
      }, 320);
    }, 260);
  } else {
    // no animation version (initial show)
    questionEl.textContent = q.q;
    const opts = optionsContainer.querySelectorAll('.option-btn');
    opts.forEach((btn, i) => {
      btn.classList.remove('correct','wrong');
      btn.disabled = false;
      btn.textContent = (String.fromCharCode(65 + i)) + '.  ' + q.options[i];
    });
    const prev = userAnswers[index];
    if (prev !== null && prev !== undefined) {
      const correctIdx = q.answer;
      if (prev === correctIdx) opts[prev].classList.add('correct');
      else { opts[prev].classList.add('wrong'); opts[correctIdx].classList.add('correct'); }
      opts.forEach(b => b.disabled = true);
    }
    progressText.textContent = `${index + 1}/${questions.length}`;
    
    // update Next button state - disable if question not answered
    nextBtn.disabled = (prev === null || prev === undefined);
  }

  // update prev button enabled state
  prevBtn.disabled = index === 0;
}

// option click handler
function onOptionClick(e) {
  const btn = e.currentTarget;
  const chosen = Number(btn.dataset.idx);
  const q = questions[currentIndex];
  const correctIdx = q.answer;
  const opts = optionsContainer.querySelectorAll('.option-btn');

  // if already answered, ignore
  if (userAnswers[currentIndex] !== null) return;

  // record answer
  userAnswers[currentIndex] = chosen;

  // visual feedback
  if (chosen === correctIdx) {
    btn.classList.add('correct');
    score++;
  } else {
    btn.classList.add('wrong');
    opts[correctIdx].classList.add('correct');
  }

  // disable all options for this question
  opts.forEach(b => b.disabled = true);
  
  // enable Next button since answer has been selected
  nextBtn.disabled = false;
}

// NEXT / PREV handlers
nextBtn.addEventListener('click', () => {
  // require at least moving forward even if unanswered (we allow skipping)
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderQuestion(currentIndex, true);
  } else {
    // finished — show result card
    showResult();
  }
});

prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion(currentIndex, true);
  }
});

// Give Up button handler: end quiz and show results
giveUpBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to give up? Your current progress will be saved.')) {
    showResult();
  }
});

// Start button handler: slide start card back and show quiz card
startBtn.addEventListener('click', () => {
  const name = nameInput.value.trim();
  if (!name) {
    alert('Please enter your name to start.');
    return;
  }
  userName = name;
  // init options and first question
  createOptionButtons();
  currentIndex = 0;
  score = 0;
  userAnswers.fill(null);

  // animate: slide back start card then show quiz
  startCard.classList.add('slide-back');
  setTimeout(() => {
    quizCard.classList.add('active');
    renderQuestion(currentIndex, false); // show first without fade out
  }, 420);
});

// Add a global top-right "Leaderboard" button
const leaderboardTopBtn = document.createElement('button');
leaderboardTopBtn.type = 'button';
leaderboardTopBtn.className = 'leaderboard-top-btn';
leaderboardTopBtn.id = 'leaderboardTopBtn';
leaderboardTopBtn.textContent = 'Leaderboard';
leaderboardTopBtn.addEventListener('click', () => {
  // ensure quiz card is in view state, then render leaderboard
  quizCard.classList.add('active');
  renderLeaderboard();
});
document.body.appendChild(leaderboardTopBtn);

// show final result using same card style (replace inner content)
function showResult() {
  // Save score to database
  if (userName && userName.trim()) {
    saveScore(userName.trim(), score, questions.length);
  }
  
  // build result layout inside quiz-card, preserving card styling
  quizCard.classList.remove('active'); // quick fade out
  setTimeout(() => {
    // clear card and inject result inner HTML
    quizCard.innerHTML = `
      <div class="result-inner">
        <h2>Well done${userName ? ', ' + sanitize(userName) : ''}!</h2>
        <p>Your Score</p>
        <div class="big-score" style="font-size:48px; font-weight:700; color: #e8ffdf;">${score} / ${questions.length}</div>
        <p style="font-size:14px; color:#cfe9ff;">You answered ${score} out of ${questions.length} correctly.</p>
        <div style="display:flex;gap:12px;margin-top:12px;flex-wrap:wrap;justify-content:center;">
          <button id="restartBtn" class="control-btn">Restart</button>
          <button id="reviewBtn" class="control-btn">Review Answers</button>
          <button id="leaderboardBtn" class="control-btn">Leaderboard</button>
        </div>
      </div>
    `;
    // show card again
    quizCard.classList.add('active');

    // attach restart handler
    document.getElementById('restartBtn').addEventListener('click', () => location.reload());

    // review answers: show a scrollable review list inside the card
    document.getElementById('reviewBtn').addEventListener('click', () => renderReview());

    // leaderboard button: show leaderboard
    document.getElementById('leaderboardBtn').addEventListener('click', () => renderLeaderboard());
  }, 320);
}

// render review of answers (keeps same card)
function renderReview() {
  quizCard.classList.remove('active');
  setTimeout(() => {
    // build review HTML
    const wrap = document.createElement('div');
    wrap.style.padding = '18px';
    wrap.style.width = '100%';
    wrap.style.height = '100%';
    wrap.style.overflowY = 'auto';
    wrap.style.boxSizing = 'border-box';

    const title = document.createElement('h3');
    title.innerText = 'Review Answers';
    title.style.color = '#fff';
    title.style.marginBottom = '12px';
    wrap.appendChild(title);

    questions.forEach((it, i) => {
      const qBlock = document.createElement('div');
      qBlock.style.marginBottom = '12px';
      qBlock.style.padding = '10px';
      qBlock.style.borderRadius = '8px';
      qBlock.style.background = 'rgba(255,255,255,0.02)';
      qBlock.style.border = '1px solid rgba(255,255,255,0.03)';

      const qh = document.createElement('div');
      qh.innerText = `Q${i+1}. ${it.q}`;
      qh.style.color = '#e8f0ff';
      qh.style.fontWeight = '600';
      qh.style.marginBottom = '8px';
      qBlock.appendChild(qh);

      it.options.forEach((opt, j) => {
        const li = document.createElement('div');
        li.style.padding = '8px';
        li.style.borderRadius = '6px';
        li.style.marginBottom = '6px';
        li.style.fontSize = '14px';
        if (j === it.answer) {
          li.style.background = 'linear-gradient(90deg,#2bdc8a,#00c17a)';
          li.style.color = '#022213';
          li.style.fontWeight = '700';
        } else if (userAnswers[i] === j) {
          // user chose incorrect option
          li.style.background = 'rgba(255,80,80,0.12)';
          li.style.color = '#ffdfe0';
        } else {
          li.style.background = 'rgba(255,255,255,0.02)';
          li.style.color = '#dfeeff';
        }
        li.innerText = `${String.fromCharCode(65 + j)}. ${opt}`;
        qBlock.appendChild(li);
      });

      wrap.appendChild(qBlock);
    });

    // back buttons
    const backWrap = document.createElement('div');
    backWrap.style.display = 'flex';
    backWrap.style.gap = '12px';
    backWrap.style.justifyContent = 'center';
    backWrap.style.marginTop = '20px';
    backWrap.style.flexWrap = 'wrap';

    const backToResultBtn = document.createElement('button');
    backToResultBtn.className = 'control-btn';
    backToResultBtn.innerText = 'Back to Result';
    backToResultBtn.addEventListener('click', () => showResult());
    backWrap.appendChild(backToResultBtn);

    const backToStartBtn = document.createElement('button');
    backToStartBtn.className = 'control-btn';
    backToStartBtn.innerText = 'Back to Start';
    backToStartBtn.addEventListener('click', () => location.reload());
    backWrap.appendChild(backToStartBtn);

    wrap.appendChild(backWrap);

    quizCard.innerHTML = ''; // clear
    quizCard.appendChild(wrap);
    quizCard.classList.add('active');
  }, 260);
}

// sanitize small string for display (simple)
function sanitize(s) {
  return String(s).replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ========== LEADERBOARD DATABASE FUNCTIONS ==========
// Database key for localStorage
const LEADERBOARD_KEY = 'quizLeaderboard';

// Save user score to database
function saveScore(username, score, total) {
  try {
    const leaderboard = getLeaderboard();
    const newEntry = {
      username: sanitize(username),
      score: score,
      total: total,
      percentage: Math.round((score / total) * 100),
      date: new Date().toISOString()
    };
    leaderboard.push(newEntry);
    // Sort by score (descending), then by percentage, then by date (newest first)
    leaderboard.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.percentage !== a.percentage) return b.percentage - a.percentage;
      return new Date(b.date) - new Date(a.date);
    });
    // Keep top 50 entries
    const topEntries = leaderboard.slice(0, 50);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(topEntries));
  } catch (e) {
    console.error('Error saving score:', e);
  }
}

// Get leaderboard from database
function getLeaderboard() {
  try {
    const stored = localStorage.getItem(LEADERBOARD_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Error reading leaderboard:', e);
    return [];
  }
}

// Clear leaderboard (optional utility)
function clearLeaderboard() {
  localStorage.removeItem(LEADERBOARD_KEY);
}

// ========== LEADERBOARD UI ==========
// Render leaderboard view
function renderLeaderboard() {
  quizCard.classList.remove('active');
  setTimeout(() => {
    const leaderboard = getLeaderboard();
    const wrap = document.createElement('div');
    wrap.className = 'leaderboard-inner';
    wrap.style.padding = '20px';
    wrap.style.width = '100%';
    wrap.style.height = '100%';
    wrap.style.overflowY = 'auto';
    wrap.style.boxSizing = 'border-box';
    wrap.style.display = 'flex';
    wrap.style.flexDirection = 'column';
    wrap.style.alignItems = 'center';

    const title = document.createElement('h2');
    title.innerText = '🏆 Leaderboard';
    title.style.color = '#fff';
    title.style.marginBottom = '20px';
    title.style.fontSize = '36px';
    title.style.background = 'linear-gradient(135deg, #caceff, #6f3cff, #b05eff)';
    title.style.backgroundClip = 'text';
    title.style.webkitBackgroundClip = 'text';
    title.style.webkitTextFillColor = 'transparent';
    wrap.appendChild(title);

    if (leaderboard.length === 0) {
      const emptyMsg = document.createElement('p');
      emptyMsg.innerText = 'No scores yet. Be the first!';
      emptyMsg.style.color = '#cfe9ff';
      emptyMsg.style.fontSize = '18px';
      emptyMsg.style.marginTop = '40px';
      wrap.appendChild(emptyMsg);
    } else {
      const tableWrap = document.createElement('div');
      tableWrap.style.width = '100%';
      tableWrap.style.maxWidth = '700px';

      // Header row
      const headerRow = document.createElement('div');
      headerRow.style.display = 'grid';
      headerRow.style.gridTemplateColumns = '60px 1fr 100px 100px';
      headerRow.style.gap = '10px';
      headerRow.style.marginBottom = '12px';
      headerRow.style.padding = '0 10px';

      const headers = ['Rank', 'Username', 'Score', 'Percentage'];
      headers.forEach((text, idx) => {
        const header = document.createElement('div');
        header.innerText = text;
        header.style.color = '#b05eff';
        header.style.fontWeight = '700';
        header.style.fontSize = '14px';
        header.style.textAlign = idx === 0 ? 'center' : idx === 1 ? 'left' : 'center';
        headerRow.appendChild(header);
      });
      tableWrap.appendChild(headerRow);

      // Leaderboard entries
      leaderboard.forEach((entry, index) => {
        const row = document.createElement('div');
        row.style.display = 'grid';
        row.style.gridTemplateColumns = '60px 1fr 100px 100px';
        row.style.gap = '10px';
        row.style.padding = '12px 10px';
        row.style.marginBottom = '8px';
        row.style.borderRadius = '8px';
        row.style.background = index < 3 
          ? 'rgba(110, 60, 255, 0.15)' 
          : 'rgba(255, 255, 255, 0.03)';
        row.style.border = index < 3 
          ? '1px solid rgba(176, 94, 255, 0.4)' 
          : '1px solid rgba(255, 255, 255, 0.05)';
        row.style.transition = 'all 0.3s ease';

        // Rank
        const rankCell = document.createElement('div');
        rankCell.style.textAlign = 'center';
        rankCell.style.fontWeight = '700';
        rankCell.style.fontSize = '18px';
        if (index === 0) {
          rankCell.innerText = '🥇';
          rankCell.style.fontSize = '24px';
        } else if (index === 1) {
          rankCell.innerText = '🥈';
          rankCell.style.fontSize = '24px';
        } else if (index === 2) {
          rankCell.innerText = '🥉';
          rankCell.style.fontSize = '24px';
        } else {
          rankCell.innerText = (index + 1).toString();
          rankCell.style.color = '#dfe8ff';
        }
        row.appendChild(rankCell);

        // Username
        const userCell = document.createElement('div');
        userCell.innerText = entry.username || 'Anonymous';
        userCell.style.color = '#ffffff';
        userCell.style.fontWeight = index < 3 ? '700' : '500';
        userCell.style.fontSize = '16px';
        userCell.style.textAlign = 'left';
        userCell.style.overflow = 'hidden';
        userCell.style.textOverflow = 'ellipsis';
        userCell.style.whiteSpace = 'nowrap';
        row.appendChild(userCell);

        // Score
        const scoreCell = document.createElement('div');
        scoreCell.innerText = `${entry.score}/${entry.total}`;
        scoreCell.style.color = '#e8ffdf';
        scoreCell.style.fontWeight = '600';
        scoreCell.style.fontSize = '16px';
        scoreCell.style.textAlign = 'center';
        row.appendChild(scoreCell);

        // Percentage
        const percCell = document.createElement('div');
        percCell.innerText = `${entry.percentage}%`;
        percCell.style.color = entry.percentage >= 80 ? '#3cd67e' : entry.percentage >= 60 ? '#ffd93d' : '#ff6b6b';
        percCell.style.fontWeight = '600';
        percCell.style.fontSize = '16px';
        percCell.style.textAlign = 'center';
        row.appendChild(percCell);

        row.addEventListener('mouseenter', () => {
          row.style.background = index < 3 
            ? 'rgba(110, 60, 255, 0.25)' 
            : 'rgba(255, 255, 255, 0.08)';
          row.style.transform = 'scale(1.02)';
        });
        row.addEventListener('mouseleave', () => {
          row.style.background = index < 3 
            ? 'rgba(110, 60, 255, 0.15)' 
            : 'rgba(255, 255, 255, 0.03)';
          row.style.transform = 'scale(1)';
        });

        tableWrap.appendChild(row);
      });

      wrap.appendChild(tableWrap);
    }

    // Buttons
    const btnWrap = document.createElement('div');
    btnWrap.style.display = 'flex';
    btnWrap.style.gap = '12px';
    btnWrap.style.marginTop = '20px';
    btnWrap.style.flexWrap = 'wrap';
    btnWrap.style.justifyContent = 'center';

    const backToStartBtn = document.createElement('button');
    backToStartBtn.className = 'control-btn';
    backToStartBtn.innerText = 'Back to Start';
    backToStartBtn.addEventListener('click', () => location.reload());
    btnWrap.appendChild(backToStartBtn);

    const backToResultBtn = document.createElement('button');
    backToResultBtn.className = 'control-btn';
    backToResultBtn.innerText = 'Back to Result';
    backToResultBtn.addEventListener('click', () => showResult());
    btnWrap.appendChild(backToResultBtn);

    wrap.appendChild(btnWrap);

    quizCard.innerHTML = '';
    quizCard.appendChild(wrap);
    quizCard.classList.add('active');
  }, 260);
}

// Improve responsiveness: re-render leaderboard on resize when visible
let resizeTimer = null;
window.addEventListener('resize', () => {
  if (!quizCard) return;
  const isLeaderboardVisible = !!quizCard.querySelector('.leaderboard-inner');
  if (!isLeaderboardVisible) return;
  if (resizeTimer) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    renderLeaderboard();
  }, 150);
});