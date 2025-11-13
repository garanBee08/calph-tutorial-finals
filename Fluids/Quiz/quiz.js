// === ELEMENTS ===
const introCard = document.getElementById('intro-card');
const quizWrapper = document.getElementById('quiz-wrapper');
const resultWrapper = document.getElementById('result-wrapper');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const scoreText = document.getElementById('score-text');
const messageText = document.getElementById('message-text');
const restartBtn = document.getElementById('restart-btn');
const startBtn = document.getElementById('start-btn');

// === USERNAME ELEMENTS ===
let username = "";
let usernameCard;

// Create username input dynamically
window.addEventListener("DOMContentLoaded", () => {
  usernameCard = document.createElement("div");
  usernameCard.className = "quiz-wrapper";
  usernameCard.id = "username-card";
  usernameCard.innerHTML = `
    <div class="layer dark"></div>
    <div class="layer light"></div>
    <div class="quiz-container">
      <div class="username-box">
        <label class="username-label">Enter your username</label>
        <input type="text" id="username-input" placeholder="Your name" />
      </div>
      <button id="continue-btn" class="nav-btn">Continue</button>
    </div>
  `;
  document.body.appendChild(usernameCard);

  const continueBtn = usernameCard.querySelector("#continue-btn");
  const usernameInput = usernameCard.querySelector("#username-input");

  continueBtn.onclick = () => {
    const name = usernameInput.value.trim();
    if (name === "") {
      alert("Please enter your username first!");
      return;
    }
    username = name;
    usernameCard.style.display = "none";
    introCard.style.display = "flex";
  };
});
// === Questions ===
const quizData = [
  {
    question: "They exist as liquids or gasses and are distinguished through the inability to withstand shear or tangential tension at rest?",
    options: ["Solid", "Pressure", "Fluids", "Gravity"],
    answer: "Fluids"
  },
  {
    question: "What is the SI unit of pressure?",
    options: ["Pascal", "Joule", "Newton", "Bar"],
    answer: "Pascal"
  },
  {
    question: "A tank is filled with oil (𝜌=850kg/m³) to a depth of  1.50 m. What is the gauge pressure at the bottom? (𝑔=9.8 m/s²)",
    options: ["8,500 Pa", "9,800 Pa", "12,495 Pa", "14,700 Pa"],
    answer: "12,495 Pa"
  },
  {
    question: "Pressure is scalar quantity because it has magnitude but no _____",
    options: ["Density", "Velocity", "Direction", "Volume"],
    answer: "Direction"
  },
  {
    question: "Fluid pressure increases with ___?",
    options: ["Density", "Depth", "Velocity", "Volume"],
    answer: "Depth"
  },
  {
    question: "What is the pressure applied when the fluid at rest is a result of gravity?",
    options: ["Archimedes Principle", "Bernoulli Principle", "Fluids", "Hydrostatic Pressure"],
    answer: "Hydrostatic Pressure"
  },
  {
    question: "What principle states that any object that is submerged in a fluid (liquid or gas) experiences an upward buoyant force equal to the weight of the fluid displaced by that object?",
    options: ["Archimedes Principle", "Bernoulli Principle", "Continuity Principle", "Hydrostatic Pressure"],
    answer: "Archimedes Principle"
  },
  {
    question: "What is the CORRECT key concepts about Pressure",
    options: ["Pressure applied to an enclosed fluid is transmitted equally", "Upward force = weight of displaced fluid", 
        "Force per unit area.", "Resistance to flow."],
    answer: "Force per unit area."
  },
  {
    question: "The Buoyant force on an object is dependent on?",
    options: [" The object's density.", "The submerged volume of the object.", 
        "The mass of the object.", "The shape of the object."],
    answer: "The mass of the object."
  },
  {
    question: "The general formula for fluid pressure is?",
    options: ["P = F/A", "P = m/A", " P = F × A", "P = ρVg"],
    answer: "P = F/A"
  },
  {
    question: "The formula for the Continuity Principle is",
    options: ["A1 + A2 = V1 + V2", "A1V1 = A2V2", 
        "P1 + P2 = ρgh", "ρ1V1 = ρ2V2"],
    answer: "A1V1 = A2V2"
  },
  {
    question: "What does Archimedes Principle state about buoyancy",
    options: ["Downward force equals displaced fluid weight", "Upward force equals object weight", 
        "Upward force equals displaced fluid weight", "Downward force equals fluid density"],
    answer: "Upward force equals displaced fluid weight"
  },
  {
    question: "Who introduced the Bernoulli Principle?",
    options: ["Daniel Bernoulli", "Mark Bernoulli", "Luis Bernoulli", "Daniel Pascal"],
    answer: "Daniel Bernoulli"
  },
  {
    question: "At what depth in freshwater (𝜌=1000kg/m³) will the gauge pressure be equal to 19,600 Pa?",
    options: ["1.0 m", "1.5 m", "2.0 m", "3.0 m"],
    answer: "2.0 m"
  },
  {
    question: "Compared to solids, fluids _____",
    options: ["Have a defined shape", "Cannot change their volume", 
        "Take the shape of their container", "Are unable to move freely"],
    answer: "Take the shape of their container"
  },
  {
    question: "What does the formula A1V1= A2V2  represent?",
    options: ["Archimedes’ Principle", "Bernoulli’s Principle", 
        "Continuity Principle", "Law of Gravity"],
    answer: "Continuity Principle"
  },
  {
    question: "A bath tub is filled with water up to 2m height, find the pressure at the bottom of the tub. P = 1000 kg/m³, g + 9.8 m/s²",
    options: ["19,600 Pa", "9800 Pa", "98000 Pa", "1980 Pa"],
    answer: "19,600 Pa"
  },
  {
    question: "If the area of the first pipe is 4m² and the velocity is 2m/s,  find the velocity in the second pipe if its area is 2m².",
    options: ["2 m/s", "3 m/s", "5 m/s", "4 m/s"],
    answer: "4 m/s"
  },
  {
    question: "Calculate the resulting force, if the gym sand ball of radius 12cm is immersed in water?",
    options: ["7.1 N", "35.0 N", "100 N", "70.9 N"],
    answer: "70.9 N"
  },
  {
    question: "A candle has a density of 20g/cm³. What would be the mass of the candle if the volume is 10cm³?",
    options: ["20g", "50g", "100g", "200g"],
    answer: "200g"
  },
  {
    question: "A pump is used to send water through a hose, the diameter of which is 10 times that of the nozzle through which the water exits. If the nozzle is 1m higher than the pump, and the water flows through the hose 4.0 m/s , what is the gauge pressure of the water at the pump?",
    options: ["1.0 x 10⁴ Pa", "8.0 x 10⁵ Pa", "4.0 x 10⁵ Pa", "7.8 x 10⁴ Pa"],
    answer: "8.0 x 10⁵ Pa"
  },
  {
    question: "Which formula correctly represents hydrostatic pressure?",
    options: ["P = ρgh", "P = F × A", "P = mg", "P = h/ρg"],
    answer: "P = ρgh"
  },
  {
    question: "In the hydrostatic pressure equation, what does “ρ” represent?",
    options: ["Height of the fluid", "Pressure of the fluid", "Density of the fluid", "Weight of the fluid"],
    answer: "Density of the fluid"
  },
  {
    question: "A diver is swimming at a depth of 20 meters below the surface of the ocean. If the density of seawater is 1025 kg/m³, calculate the hydrostatic pressure acting on the diver due to the water alone. (Take 𝑔= 9.81 m/s²)",
    options: ["2.11×10⁴ Pa", "1.01×10 P⁵a", "2.01×10⁵ Pa", "3.01×10⁵ Pa"],
    answer: "2.01×10⁵ Pa"
  },
  {
    question: "If an object weighing 50N Displaces a volume of water with a weight of 10N, What is the buoyant force on the object?",
    options: ["60 N", "50 N", "40 N", "10 N"],
    answer: "10 N"
  },
  {
    question: "Hydrostatic pressure increases with ___?",
    options: ["Velocity", "Volume", "Density", "Depth"],
    answer: "Depth"
  },
  {
    question: "What year was introduced the bernoulli principle",
    options: ["1783", "1736", "1738", "1786"],
    answer: "1738"
  },
  {
    question: "Water flows through a horizontal pipe that narrows from a cross-sectional area of A1= 0.04 m² to A2= 0.01m². If the speed in the wider section is v1= 2 m/s, find the speed v2 in the narrower section.",
    options: ["4 m/s", "8 m/s", "6 m/s", "10 m/s"],
    answer: "8 m/s"
  },
  {
    question: "Water flows through a horizontal pipe that narrows from a diameter of 10 cm to 5 cm. If the speed of water in the wider section is 2 m/s, find the speed in the narrower section.",
    options: ["4 m/s", "8 m/s", "6 m.s", "10 m/s"],
    answer: "8 m/s"
  },
  {
    question: "A force of 200 N is applied on an area of 0.5 m². Find the pressure.",
    options: ["100 Pa", "300 Pa", "200 Pa", "400 Pa"],
    answer: "400 Pa"
  },
];

// VARIABLES
let currentQuestion = 0;
let score = 0;
let userAnswers = Array(quizData.length).fill(null);

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

startBtn.onclick = () => {
  // Shuffle the questions
  shuffle(quizData);

  // Shuffle the options inside each question
  quizData.forEach(q => shuffle(q.options));

  introCard.style.display = "none";
  quizWrapper.style.display = "flex";

  showQuestion();
  updateProgressBar();
};


// SHOW QUESTION
function showQuestion() {
  const q = quizData[currentQuestion];
  questionText.textContent = q.question;
  optionsContainer.innerHTML = "";

  q.options.forEach((optionText) => {
    const btn = document.createElement("button");
    btn.classList.add("option");
    btn.textContent = optionText;

    // Check if this option was previously selected
    if (userAnswers[currentQuestion] !== null) {
      btn.classList.add("disabled");
      if (optionText === quizData[currentQuestion].answer) btn.classList.add("correct");
      if (optionText === userAnswers[currentQuestion]) {
        if (userAnswers[currentQuestion] === quizData[currentQuestion].answer)
          btn.classList.add("correct");
        else btn.classList.add("wrong");
      }
    }

    btn.onclick = () => handleAnswer(optionText, btn);
    optionsContainer.appendChild(btn);
  });

  document.getElementById("current").textContent = currentQuestion + 1;
  document.getElementById("total").textContent = quizData.length;
  
  // Update progress bar
  updateProgressBar();
}

// HANDLE ANSWER
function handleAnswer(selectedOption, btn) {
  if (userAnswers[currentQuestion] !== null) return;
  userAnswers[currentQuestion] = selectedOption;

  const correctAnswer = quizData[currentQuestion].answer;
  const optionButtons = optionsContainer.querySelectorAll(".option");

  optionButtons.forEach((button) => {
    button.classList.add("disabled");
    if (button.textContent === correctAnswer) button.classList.add("correct");
    else if (button.textContent === selectedOption && selectedOption !== correctAnswer)
      button.classList.add("wrong");
    
  });

  if (selectedOption === correctAnswer) score++;
}

// NEXT BUTTON
nextBtn.onclick = () => {
  if (currentQuestion < quizData.length - 1) {
    currentQuestion++;
    showQuestion();
  } else {
    showResults();
  }
};

// PREVIOUS BUTTON
prevBtn.onclick = () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    showQuestion();
  }
};

// SHOW RESULTS
function showResults() {
  quizWrapper.style.display = "none";
  resultWrapper.style.display = "flex";
  scoreText.textContent = `${username}, your score is: ${score} / ${quizData.length}`;
  
  if (score === quizData.length)
    messageText.textContent = "Excellent! Perfect score!";
  else if (score >= quizData.length / 2)
    messageText.textContent = "Good job! You passed!";
  else messageText.textContent = "Keep practicing!";

  // Save score to Supabase
  saveScoreToLeaderboard();
}

// GENERATE UUID FROM USERNAME
// Creates a deterministic UUID v5 from username
function generateUUIDFromUsername(username) {
  // Simple UUID v4-like generation from username hash
  // This creates a consistent UUID for the same username
  const namespace = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'; // Standard namespace UUID
  const hash = username.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  
  // Generate UUID v4 format
  const hex = Math.abs(hash).toString(16).padStart(32, '0');
  return [
    hex.substring(0, 8),
    hex.substring(8, 12),
    '4' + hex.substring(13, 16), // Version 4
    ((parseInt(hex[16], 16) & 0x3) | 0x8).toString(16) + hex.substring(17, 20), // Variant
    hex.substring(20, 32)
  ].join('-');
}

// SAVE SCORE TO LEADERBOARD
async function saveScoreToLeaderboard() {
  const scoreEntry = {
    username: username,
    score: score,
    total: quizData.length,
    date: new Date().toISOString(),
    percentage: Math.round((score / quizData.length) * 100)
  };

  try {
    // Check if user is authenticated with Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    let userId;
    
    if (user && !authError) {
      // User is authenticated - use their actual Supabase Auth user_id
      userId = user.id;
      console.log('User is authenticated:', user.email || user.id);
    } else {
      // User is not authenticated - cannot save score
      console.warn('User not authenticated. Score will not be saved.');
      console.warn('Note: User must be logged in to save scores to Supabase.');
      return;
    }
    
    // Store username mapping in localStorage (user_id -> username)
    const usernameMap = JSON.parse(localStorage.getItem('usernameMap') || '{}');
    usernameMap[userId] = username;
    localStorage.setItem('usernameMap', JSON.stringify(usernameMap));
    
    // Submit to Supabase using fluids_leaderboard table
    const { data, error } = await supabase
      .from('fluids_leaderboard')
      .insert([
        {
          user_id: userId,
          score: scoreEntry.score,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('Error saving score to Supabase:', error);
      console.error('Error details:', error.message);
    } else {
      console.log('Score saved to Supabase successfully!');
      console.log('Saved data:', data);
      console.log('User ID:', userId);
      console.log('Username:', username);
      console.log('Score:', scoreEntry.score);
    }
  } catch (err) {
    console.error('Error connecting to Supabase:', err);
  }
}

// PROGRESS BAR 
function updateProgressBar() {
  const progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    const progress = ((currentQuestion + 1) / quizData.length) * 100;
    progressBar.style.width = `${progress}%`;
  }
}

// RESTART QUIZ
restartBtn.onclick = () => {
  resultWrapper.style.display = "none";
  introCard.style.display = "flex";
  score = 0;
  currentQuestion = 0;
  userAnswers = Array(quizData.length).fill(null);
};

// REVIEW QUIZ
const reviewBtn = document.getElementById("review-btn");
const reviewWrapper = document.getElementById("review-wrapper");
const reviewContent = document.getElementById("review-content");
const backToResultBtn = document.getElementById("back-to-result-btn");

reviewBtn.onclick = () => {
  resultWrapper.style.display = "none";
  reviewWrapper.style.display = "flex";
  generateReview();
};

function generateReview() {
  reviewContent.innerHTML = "";

  quizData.forEach((q, index) => {
    const userAnswer = userAnswers[index];
    const correctAnswer = q.answer;

    const isCorrect = userAnswer === correctAnswer;
    
    const div = document.createElement("div");
    div.classList.add("review-item");

    div.innerHTML = `
      <p><strong>Q${index + 1}:</strong> ${q.question}</p>
      <p>Your Answer: <span class="${isCorrect ? "correct-text" : "wrong-text"}">${userAnswer ?? "No answer"}</span></p>
      <p>Correct Answer: <span class="correct-text">${correctAnswer}</span></p>
    `;

    reviewContent.appendChild(div);
  });
}

backToResultBtn.onclick = () => {
  reviewWrapper.style.display = "none";
  resultWrapper.style.display = "flex";
};
// Go to Leaderboard
const leaderboardBtn = document.getElementById("leaderboard-btn");
leaderboardBtn.onclick = () => {
  window.location.href = "../Leanderboard/leaderboard.html";
};
